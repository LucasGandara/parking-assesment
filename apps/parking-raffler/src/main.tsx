import type { RouterContext } from "app/types";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { ConvexReactClient, useConvexAuth } from "convex/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { routeTree } from "./routeTree.gen.ts";

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL as string,
);

const router = createRouter({
  context: {
    isAuthenticated: false,
    isLoading: true,
  } satisfies RouterContext,
  routeTree,
});

declare module "@tanstack/react-router" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <RouterProvider
      context={{ isAuthenticated, isLoading }}
      router={router}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <InnerApp />
    </ConvexAuthProvider>
  </StrictMode>,
);
