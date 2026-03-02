import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    buildingId: v.id("buildings"),
    label: v.string(),
    number: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId)
      throw new ConvexError("Not authenticated.");
    const caller = await ctx.db.get(userId);
    if (caller?.role !== "admin") {
      throw new ConvexError("Not authorized.");
    }
    const duplicate = await ctx.db
      .query("spots")
      .withIndex("by_building", q =>
        q.eq("buildingId", args.buildingId))
      .filter(q => q.eq(q.field("number"), args.number))
      .first();
    if (duplicate) {
      throw new ConvexError(
        `Spot number ${args.number} already exists `
        + `in this building.`,
      );
    }
    return ctx.db.insert("spots", {
      buildingId: args.buildingId,
      label: args.label,
      number: args.number,
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const spots = await ctx.db.query("spots").collect();
    const currentPeriod = await ctx.db
      .query("periods")
      .withIndex("by_phase", q => q.eq("phase", "current"))
      .first();
    if (!currentPeriod) {
      return spots.map(s => ({
        ...s,
        currentAssigneeName: null,
      }));
    }
    const assignments = await ctx.db
      .query("assignments")
      .withIndex("by_period", q =>
        q.eq("periodId", currentPeriod._id))
      .collect();
    const users = await Promise.all(
      assignments.map(a => ctx.db.get(a.userId)),
    );
    const assigneeMap = new Map(
      assignments.map((a, i) => {
        const u = users[i];
        return [
          a.spotId,
          u ? `${u.firstName} ${u.lastName}` : null,
        ] as const;
      }),
    );
    return spots.map(s => ({
      ...s,
      currentAssigneeName: assigneeMap.get(s._id) ?? null,
    }));
  },
});

export const remove = mutation({
  args: { id: v.id("spots") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId)
      throw new ConvexError("Not authenticated.");
    const caller = await ctx.db.get(userId);
    if (caller?.role !== "admin") {
      throw new ConvexError("Not authorized.");
    }
    const spotAssignments = await ctx.db
      .query("assignments")
      .withIndex("by_spot_and_period", q =>
        q.eq("spotId", args.id))
      .collect();
    for (const assignment of spotAssignments) {
      await ctx.db.delete(assignment._id);
    }
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("spots"),
    label: v.string(),
    number: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId)
      throw new ConvexError("Not authenticated.");
    const caller = await ctx.db.get(userId);
    if (caller?.role !== "admin") {
      throw new ConvexError("Not authorized.");
    }
    const spot = await ctx.db.get(args.id);
    if (!spot)
      throw new ConvexError("Spot not found.");
    const duplicate = await ctx.db
      .query("spots")
      .withIndex("by_building", q =>
        q.eq("buildingId", spot.buildingId))
      .filter(q =>
        q.and(
          q.eq(q.field("number"), args.number),
          q.neq(q.field("_id"), args.id),
        ),
      )
      .first();
    if (duplicate) {
      throw new ConvexError(
        `Spot number ${args.number} already exists `
        + `in this building.`,
      );
    }
    await ctx.db.patch(args.id, {
      label: args.label,
      number: args.number,
    });
  },
});
