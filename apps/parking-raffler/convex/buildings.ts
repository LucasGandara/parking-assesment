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
        `Cannot delete — ${assigned.length} resident${assigned.length === 1 ? "" : "s"} assigned to this building.`,
      );
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
