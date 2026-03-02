import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Admin mutation: create or replace an assignment for a spot in the
// current period. Enforces one spot per user per period.
export const assign = mutation({
  args: {
    spotId: v.id("spots"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const callerId = await getAuthUserId(ctx);
    if (!callerId)
      throw new ConvexError("Not authenticated.");
    const caller = await ctx.db.get(callerId);
    if (caller?.role !== "admin") {
      throw new ConvexError("Not authorized.");
    }
    const currentPeriod = await ctx.db
      .query("periods")
      .withIndex("by_phase", q => q.eq("phase", "current"))
      .first();
    if (!currentPeriod) {
      throw new ConvexError("No current period exists.");
    }
    // Remove any existing assignment for this spot in this period
    const existingSpotAssignment = await ctx.db
      .query("assignments")
      .withIndex("by_spot_and_period", q =>
        q.eq("spotId", args.spotId).eq("periodId", currentPeriod._id))
      .first();
    if (existingSpotAssignment) {
      await ctx.db.delete(existingSpotAssignment._id);
    }
    // Remove any existing assignment for this user in this period
    const existingUserAssignment = await ctx.db
      .query("assignments")
      .withIndex("by_user_and_period", q =>
        q.eq("userId", args.userId).eq("periodId", currentPeriod._id))
      .first();
    if (existingUserAssignment) {
      await ctx.db.delete(existingUserAssignment._id);
    }
    return ctx.db.insert("assignments", {
      periodId: currentPeriod._id,
      spotId: args.spotId,
      userId: args.userId,
    });
  },
});

// Returns the calling resident's building name plus their spot
// assignments for the current and previous periods.
export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId)
      return null;
    const user = await ctx.db.get(userId);
    if (!user)
      return null;
    const building = await ctx.db.get(user.buildingId);
    const currentPeriod = await ctx.db
      .query("periods")
      .withIndex("by_phase", q => q.eq("phase", "current"))
      .first();
    const previousPeriod = await ctx.db
      .query("periods")
      .withIndex("by_phase", q => q.eq("phase", "previous"))
      .first();
    const getCurrentAssignment = async () => {
      if (!currentPeriod)
        return null;
      const a = await ctx.db
        .query("assignments")
        .withIndex("by_user_and_period", q =>
          q
            .eq("userId", userId)
            .eq("periodId", currentPeriod._id))
        .first();
      if (!a)
        return null;
      return ctx.db.get(a.spotId);
    };
    const getPreviousAssignment = async () => {
      if (!previousPeriod)
        return null;
      const a = await ctx.db
        .query("assignments")
        .withIndex("by_user_and_period", q =>
          q
            .eq("userId", userId)
            .eq("periodId", previousPeriod._id))
        .first();
      if (!a)
        return null;
      return ctx.db.get(a.spotId);
    };
    const [currentSpot, previousSpot] = await Promise.all([
      getCurrentAssignment(),
      getPreviousAssignment(),
    ]);
    return {
      buildingName: building?.name ?? null,
      currentPeriod: currentPeriod ?? null,
      currentSpot,
      previousPeriod: previousPeriod ?? null,
      previousSpot,
    };
  },
});

// Admin query: returns all assignments for a given period with spot
// and user data stitched in.
export const listByPeriod = query({
  args: { periodId: v.id("periods") },
  handler: async (ctx, args) => {
    const callerId = await getAuthUserId(ctx);
    if (!callerId)
      throw new ConvexError("Not authenticated.");
    const caller = await ctx.db.get(callerId);
    if (caller?.role !== "admin") {
      throw new ConvexError("Not authorized.");
    }
    const assignments = await ctx.db
      .query("assignments")
      .withIndex("by_period", q =>
        q.eq("periodId", args.periodId))
      .collect();
    const [spots, users] = await Promise.all([
      Promise.all(assignments.map(a => ctx.db.get(a.spotId))),
      Promise.all(assignments.map(a => ctx.db.get(a.userId))),
    ]);
    return assignments.map((a, i) => ({
      ...a,
      spot: spots[i],
      user: users[i],
    }));
  },
});

// Admin mutation: run the weighted raffle for the current period.
// Executes per building, skips buildings with no unassigned spots
// or no eligible residents. Sets raffleRun: true atomically.
export const runRaffle = mutation({
  args: {},
  handler: async (ctx) => {
    const callerId = await getAuthUserId(ctx);
    if (!callerId)
      throw new ConvexError("Not authenticated.");
    const caller = await ctx.db.get(callerId);
    if (caller?.role !== "admin") {
      throw new ConvexError("Not authorized.");
    }
    const currentPeriod = await ctx.db
      .query("periods")
      .withIndex("by_phase", q => q.eq("phase", "current"))
      .first();
    if (!currentPeriod) {
      throw new ConvexError("No current period exists.");
    }
    if (currentPeriod.raffleRun) {
      throw new ConvexError(
        "Raffle has already been run for this period.",
      );
    }
    const previousPeriod = await ctx.db
      .query("periods")
      .withIndex("by_phase", q => q.eq("phase", "previous"))
      .first();

    // Collect all current-period assignments (for exclusion checks)
    const currentAssignments = await ctx.db
      .query("assignments")
      .withIndex("by_period", q =>
        q.eq("periodId", currentPeriod._id))
      .collect();
    const assignedSpotIds = new Set(
      currentAssignments.map(a => a.spotId),
    );
    const assignedUserIds = new Set(
      currentAssignments.map(a => a.userId),
    );

    // Collect previous-period assigned user IDs for weighting
    const prevAssignedUserIds = new Set<string>();
    if (previousPeriod) {
      const prevAssignments = await ctx.db
        .query("assignments")
        .withIndex("by_period", q =>
          q.eq("periodId", previousPeriod._id))
        .collect();
      for (const a of prevAssignments) {
        prevAssignedUserIds.add(a.userId);
      }
    }

    const buildings = await ctx.db.query("buildings").collect();
    const allSpots = await ctx.db.query("spots").collect();
    const allUsers = await ctx.db.query("users").collect();

    let totalFilled = 0;

    for (const building of buildings) {
      // Unassigned spots for this building in the current period
      const unassignedSpots = allSpots.filter(
        s =>
          s.buildingId === building._id
          && !assignedSpotIds.has(s._id),
      );
      if (unassignedSpots.length === 0)
        continue;

      // Eligible: role=resident, in this building, not assigned yet
      const eligible = allUsers.filter(
        u =>
          u.role === "resident"
          && u.buildingId === building._id
          && !assignedUserIds.has(u._id),
      );
      if (eligible.length === 0)
        continue;

      // Build weighted pool (weight 2 = not selected last period)
      const pool: typeof eligible = [];
      for (const u of eligible) {
        const weight = prevAssignedUserIds.has(u._id) ? 1 : 2;
        for (let w = 0; w < weight; w++) {
          pool.push(u);
        }
      }

      // Fisher-Yates shuffle
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }

      // Assign: one resident per spot, skip duplicates in pool
      const seen = new Set<string>();
      let spotIndex = 0;
      for (const u of pool) {
        if (spotIndex >= unassignedSpots.length)
          break;
        if (seen.has(u._id))
          continue;
        seen.add(u._id);
        const spot = unassignedSpots[spotIndex++];
        await ctx.db.insert("assignments", {
          periodId: currentPeriod._id,
          spotId: spot._id,
          userId: u._id,
        });
        assignedUserIds.add(u._id);
        totalFilled++;
      }
    }

    await ctx.db.patch(currentPeriod._id, { raffleRun: true });
    return { totalFilled };
  },
});

// Admin mutation: remove the assignment for a spot in the current
// period. No-op if no assignment exists.
export const unassign = mutation({
  args: { spotId: v.id("spots") },
  handler: async (ctx, args) => {
    const callerId = await getAuthUserId(ctx);
    if (!callerId)
      throw new ConvexError("Not authenticated.");
    const caller = await ctx.db.get(callerId);
    if (caller?.role !== "admin") {
      throw new ConvexError("Not authorized.");
    }
    const currentPeriod = await ctx.db
      .query("periods")
      .withIndex("by_phase", q => q.eq("phase", "current"))
      .first();
    if (!currentPeriod) {
      throw new ConvexError("No current period exists.");
    }
    const existing = await ctx.db
      .query("assignments")
      .withIndex("by_spot_and_period", q =>
        q
          .eq("spotId", args.spotId)
          .eq("periodId", currentPeriod._id))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
