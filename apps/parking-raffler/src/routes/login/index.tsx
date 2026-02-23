import type { SubmitEvent } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";

import { AuthLayout } from "app/features/auth/components/auth-layout/auth-layout";

import { useState } from "react";

import styles from "./login.module.scss";

const ADMIN_EMAIL = String(
  import.meta.env.VITE_ADMIN_EMAIL ?? "admin@unosquare.com",
);

export const Route = createFileRoute("/login/")({
  beforeLoad: ({ context }) => {
    if (!context.isLoading && context.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthLayout adminEmail={ADMIN_EMAIL}>
      <LoginForm />
    </AuthLayout>
  );
}

export function LoginForm() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn("password", {
        email: String(data.get("email")),
        flow: "signIn",
        password: String(data.get("password")),
      });
      await navigate({ to: "/" });
    }
    catch {
      setError("Invalid email or password.");
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.login_form} onSubmit={handleSubmit}>
      <div className={styles.login_form__header}>
        <h2 className={styles.login_form__title}>Welcome back</h2>
        <p className={styles.login_form__subtitle}>
          Sign in to your account
        </p>
      </div>

      <div className={styles.login_form__fields}>
        <div className={styles.login_form__field}>
          <label
            className={styles.login_form__label}
            htmlFor="email"
          >
            Email
          </label>
          <input
            autoComplete="email"
            className={styles.login_form__input}
            id="email"
            name="email"
            required
            type="email"
          />
        </div>

        <div className={styles.login_form__field}>
          <div className={styles.login_form__field_row}>
            <label
              className={styles.login_form__label}
              htmlFor="password"
            >
              Password
            </label>
            <span
              aria-disabled="true"
              className={styles.login_form__forgot}
            >
              Forgot password?
            </span>
          </div>
          <input
            autoComplete="current-password"
            className={styles.login_form__input}
            id="password"
            name="password"
            required
            type="password"
          />
        </div>

        {error !== null && (
          <p className={styles.login_form__error} role="alert">
            {error}
          </p>
        )}
      </div>

      <button
        className={styles.login_form__submit}
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Signing in\u2026" : "Sign In"}
      </button>

      <p className={styles.login_form__signup}>
        {"Don't have an account? "}
        <Link
          className={styles.login_form__signup_link}
          to="/register"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
