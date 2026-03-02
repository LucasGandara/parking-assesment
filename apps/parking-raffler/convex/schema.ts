import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  assignments: defineTable({
    periodId: v.id("periods"),
    spotId: v.id("spots"),
    userId: v.id("users"),
  })
    .index("by_period", ["periodId"])
    .index("by_spot_and_period", ["spotId", "periodId"])
    .index("by_user_and_period", ["userId", "periodId"]),
  buildings: defineTable({
    name: v.string(),
  }),
  periods: defineTable({
    endDate: v.number(),
    label: v.string(),
    phase: v.union(
      v.literal("archived"),
      v.literal("current"),
      v.literal("previous"),
    ),
    raffleRun: v.boolean(),
    startDate: v.number(),
  }).index("by_phase", ["phase"]),
  spots: defineTable({
    buildingId: v.id("buildings"),
    label: v.string(),
    number: v.number(),
  }).index("by_building", ["buildingId"]),
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
