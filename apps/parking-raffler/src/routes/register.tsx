import { AuthLayout } from "@repo/ui/auth-layout";
import { createFileRoute, redirect } from "@tanstack/react-router";

const ADMIN_EMAIL = String(
  import.meta.env.VITE_ADMIN_EMAIL ?? "admin@unosquare.com",
);

export const Route = createFileRoute("/register")({
  beforeLoad: ({ context }) => {
    if (!context.isLoading && context.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <AuthLayout adminEmail={ADMIN_EMAIL}>
      <div>Register form (coming soon)</div>
    </AuthLayout>
  );
}
