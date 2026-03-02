import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    endDate: v.number(),
    label: v.string(),
    startDate: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId)
      throw new ConvexError("Not authenticated.");
    const caller = await ctx.db.get(userId);
    if (caller?.role !== "admin") {
      throw new ConvexError("Not authorized.");
    }
    // Step 1: archive any existing previous period
    const previous = await ctx.db
      .query("periods")
      .withIndex("by_phase", q => q.eq("phase", "previous"))
      .first();
    if (previous) {
      await ctx.db.patch(previous._id, { phase: "archived" });
    }
    // Step 2: demote any existing current period to previous
    const current = await ctx.db
      .query("periods")
      .withIndex("by_phase", q => q.eq("phase", "current"))
      .first();
    if (current) {
      await ctx.db.patch(current._id, { phase: "previous" });
    }
    // Step 3: insert the new period as current
    return ctx.db.insert("periods", {
      endDate: args.endDate,
      label: args.label,
      phase: "current",
      raffleRun: false,
      startDate: args.startDate,
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const periods = await ctx.db.query("periods").collect();
    return periods.sort((a, b) => b.startDate - a.startDate);
  },
});
