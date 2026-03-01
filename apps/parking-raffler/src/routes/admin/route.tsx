import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  AdminLayout,
} from "app/features/admin/components/admin-layout/admin-layout";

import { NotFound } from "app/shared/components/not-found/not-found";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "~convex/_generated/api";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ context }) => {
    if (!context.isLoading && !context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminRoute,
});

function AdminRoute() {
  const { isLoading } = useConvexAuth();
  const currentUser = useQuery(api.users.currentUser);

  if (isLoading || currentUser === undefined) {
    return <div>Loading…</div>;
  }

  if (currentUser?.role !== "admin") {
    return <NotFound />;
  }

  return <AdminLayout />;
}
