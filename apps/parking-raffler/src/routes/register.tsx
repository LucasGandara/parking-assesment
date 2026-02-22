import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  beforeLoad: ({ context }) => {
    if (!context.isLoading && context.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: () => <div>Register (coming soon)</div>,
});
