import type { RouterContext } from "app/types";

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

function RootLayout() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
