import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.isLoading && !context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <div>Dashboard (coming soon)</div>,
});
