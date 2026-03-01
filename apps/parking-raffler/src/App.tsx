import type { RouterContext } from "./types";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { ConvexReactClient, useConvexAuth, useQuery } from "convex/react";
import { api } from "~convex/_generated/api";
import { routeTree } from "./routeTree.gen";

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL as string,
);

declare module "@tanstack/react-router" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}

const router = createRouter({
  context: {
    isAdmin: false,
    isAuthenticated: false,
    isLoading: true,
  } satisfies RouterContext,
  routeTree,
});

function RouterProviderAuthenticated() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const currentUser = useQuery(api.users.currentUser);
  const isAdmin = currentUser?.role === "admin";
  return (
    <RouterProvider
      context={{ isAdmin, isAuthenticated, isLoading }}
      router={router}
    />
  );
}

export function App() {
  return (
    <ConvexAuthProvider client={convex}>
      <RouterProviderAuthenticated />
    </ConvexAuthProvider>
  );
}
