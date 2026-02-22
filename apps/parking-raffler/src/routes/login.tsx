import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (!context.isLoading && context.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: () => <div>Login (coming soon)</div>,
});
