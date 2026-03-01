import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Returns the authenticated user's full profile, or null when no
// session exists.
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId)
      return null;
    return ctx.db.get(userId);
  },
});

// Returns all users with building name stitched in via in-memory
// join on buildingId.
export const list = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const buildings = await ctx.db.query("buildings").collect();
    const buildingMap = new Map(
      buildings.map(b => [b._id, b.name]),
    );
    return users.map(u => ({
      ...u,
      buildingName: buildingMap.get(u.buildingId) ?? null,
    }));
  },
});

// Updates a user's building assignment and phone number.
export const update = mutation({
  args: {
    buildingId: v.id("buildings"),
    id: v.id("users"),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      buildingId: args.buildingId,
      phone: args.phone,
    });
  },
});
