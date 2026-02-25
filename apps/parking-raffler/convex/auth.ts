import type { Id } from "./_generated/dataModel";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

import { ConvexError } from "convex/values";

const ALLOWED_DOMAIN = "@unosquare.com";

export const {
  auth,
  isAuthenticated,
  signIn,
  signOut,
  store,
} = convexAuth({
  providers: [
    Password({
      profile(params) {
        const email = String(params.email ?? "");
        if (!email.endsWith(ALLOWED_DOMAIN)) {
          throw new ConvexError(
            "Only @unosquare.com email addresses are accepted.",
          );
        }
        return {
          buildingId: params.buildingId as Id<"buildings">,
          email,
          emailVerificationTime: Date.now(),
          firstName: String(params.firstName),
          lastName: String(params.lastName),
          phone: String(params.phone),
          role: "resident" as const,
        };
      },
    }),
  ],
});
