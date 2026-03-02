import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return ctx.db.insert("buildings", { name: args.name });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("buildings").collect();
  },
});

export const remove = mutation({
  args: { id: v.id("buildings") },
  handler: async (ctx, args) => {
    const assigned = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("buildingId"), args.id))
      .collect();
    if (assigned.length > 0) {
      throw new ConvexError(
        `Cannot delete — ${assigned.length} `
        + `resident${assigned.length === 1 ? "" : "s"} `
        + `assigned to this building.`,
      );
    }
    const spots = await ctx.db
      .query("spots")
      .withIndex("by_building", q =>
        q.eq("buildingId", args.id))
      .collect();
    for (const spot of spots) {
      const spotAssignments = await ctx.db
        .query("assignments")
        .withIndex("by_spot_and_period", q =>
          q.eq("spotId", spot._id))
        .collect();
      for (const assignment of spotAssignments) {
        await ctx.db.delete(assignment._id);
      }
      await ctx.db.delete(spot._id);
    }
    await ctx.db.delete(args.id);
  },
});

export const rename = mutation({
  args: {
    id: v.id("buildings"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { name: args.name });
  },
});
