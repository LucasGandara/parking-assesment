import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  buildings: defineTable({
    name: v.string(),
  }),
  users: defineTable({
    buildingId: v.id("buildings"),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    firstName: v.string(),
    lastName: v.string(),
    phone: v.string(),
    role: v.union(v.literal("admin"), v.literal("resident")),
  }),
});
