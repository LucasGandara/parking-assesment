import {
  createFileRoute,
  Navigate,
  redirect,
} from "@tanstack/react-router";
import {
  ParkingRafflerCard,
} from "app/features/dashboard/components/parking-raffler-card/parking-raffler-card";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "~convex/_generated/api";

import styles from "./index.module.scss";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.isLoading && !context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: IndexRoute,
});

function IndexRoute() {
  const { isLoading } = useConvexAuth();
  const currentUser = useQuery(api.users.currentUser);

  if (isLoading || currentUser === undefined) {
    return <div>Loading…</div>;
  }

  if (currentUser?.role === "admin") {
    return <Navigate to="/admin" />;
  }

  return (
    <div className={styles.index}>
      <ParkingRafflerCard />
    </div>
  );
}
