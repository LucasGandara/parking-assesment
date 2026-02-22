import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

const ALLOWED_DOMAIN = "@unosquare.com";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
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
          email,
          emailVerificationTime: Date.now(),
        };
      },
    }),
  ],
});
