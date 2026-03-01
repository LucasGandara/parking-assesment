import type { SubmitEvent } from "react";
import type {
  BuildingFieldProps,
  EBProps,
  EBState,
  FormErrors,
} from "./register.types";

import { useAuthActions } from "@convex-dev/auth/react";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { AuthLayout } from "app/features/auth/components/auth-layout/auth-layout";
import { registerSchema } from "app/features/auth/utils/validation";
import { useQuery } from "convex/react";

import { Component, useState } from "react";

import { api } from "~convex/_generated/api";
import styles from "./register.module.scss";

const ADMIN_EMAIL = String(
  import.meta.env.VITE_ADMIN_EMAIL ?? "admin@unosquare.com",
);

export const Route = createFileRoute("/register/")({
  beforeLoad: ({ context }) => {
    if (!context.isLoading && context.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: RegisterPage,
});

// ---------------------------------------------------------------------------
// Building error boundary
// ---------------------------------------------------------------------------

class BuildingErrorBoundary extends Component<EBProps, EBState> {
  state: EBState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError
      ? this.props.fallback
      : this.props.children;
  }
}

const BUILDING_FETCH_ERROR = (
  <p className={styles.register_form__error} role="alert">
    Failed to load buildings. Please refresh and try again.
  </p>
);

// ---------------------------------------------------------------------------
// BuildingField combobox
// ---------------------------------------------------------------------------

function BuildingField({ error, onChange }: BuildingFieldProps) {
  const buildings = useQuery(api.buildings.list);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedName, setSelectedName] = useState("");

  const isLoading = buildings === undefined;
  const filtered = (buildings ?? []).filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()),
  );

  function select(id: string, name: string) {
    onChange(id);
    setIsOpen(false);
    setSearch("");
    setSelectedName(name);
  }

  return (
    <div className={styles.register_form__field}>
      <label
        className={styles.register_form__label}
        htmlFor="building-search"
      >
        Building
      </label>
      <div className={styles.register_form__combobox}>
        <input
          autoComplete="off"
          className={styles.register_form__input}
          disabled={isLoading}
          id="building-search"
          onChange={(e) => {
            setIsOpen(true);
            setSearch(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={isLoading ? "Loading\u2026" : "Search buildings\u2026"}
          type="text"
          value={isOpen ? search : selectedName}
        />
        {isOpen && !isLoading && (
          <ul
            className={styles.register_form__dropdown}
            role="listbox"
          >
            {filtered.length === 0
              ? (
                  <li className={styles.register_form__dropdown_empty}>
                    No buildings available.
                    {" "}
                    Contact your administrator.
                  </li>
                )
              : (
                  filtered.map(b => (
                    <li
                      aria-selected={selectedName === b.name}
                      className={styles.register_form__dropdown_item}
                      key={b._id}
                      onClick={() => select(b._id, b.name)}
                      role="option"
                    >
                      {b.name}
                    </li>
                  ))
                )}
          </ul>
        )}
      </div>
      {error !== undefined && (
        <p className={styles.register_form__error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// RegisterForm
// ---------------------------------------------------------------------------

export function RegisterForm() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [buildingId, setBuildingId] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const raw = {
      buildingId,
      email: String(data.get("email") ?? ""),
      firstName: String(data.get("firstName") ?? ""),
      lastName: String(data.get("lastName") ?? ""),
      password: String(data.get("password") ?? ""),
      phone: String(data.get("phone") ?? ""),
    };

    const result = registerSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      const flat = result.error.flatten().fieldErrors;
      for (const key of Object.keys(flat)) {
        const msgs = flat[key as keyof typeof flat];
        if (msgs?.[0] !== undefined) {
          fieldErrors[key as keyof FormErrors] = msgs[0];
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await signIn("password", {
        buildingId: result.data.buildingId,
        email: result.data.email,
        firstName: result.data.firstName,
        flow: "signUp",
        lastName: result.data.lastName,
        password: result.data.password,
        phone: result.data.phone,
      });
      await navigate({ to: "/" });
    }
    catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("Only @unosquare.com")) {
        setErrors({
          email:
            "Only @unosquare.com email addresses are accepted.",
        });
      }
      else if (
        msg.includes("already exists")
        || msg.includes("duplicate")
      ) {
        setErrors({
          email:
            "An account with this email already exists.",
        });
      }
      else {
        setErrors({
          submit: "Something went wrong. Please try again.",
        });
      }
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className={styles.register_form}
      onSubmit={handleSubmit}
    >
      <div className={styles.register_form__header}>
        <h2 className={styles.register_form__title}>
          Create account
        </h2>
        <p className={styles.register_form__subtitle}>
          Join your building&apos;s parking system
        </p>
      </div>

      <div className={styles.register_form__fields}>
        {/* First name */}
        <div className={styles.register_form__field}>
          <label
            className={styles.register_form__label}
            htmlFor="firstName"
          >
            First name
          </label>
          <input
            autoComplete="given-name"
            className={styles.register_form__input}
            id="firstName"
            name="firstName"
            type="text"
          />
          {errors.firstName !== undefined && (
            <p
              className={styles.register_form__error}
              role="alert"
            >
              {errors.firstName}
            </p>
          )}
        </div>

        {/* Last name */}
        <div className={styles.register_form__field}>
          <label
            className={styles.register_form__label}
            htmlFor="lastName"
          >
            Last name
          </label>
          <input
            autoComplete="family-name"
            className={styles.register_form__input}
            id="lastName"
            name="lastName"
            type="text"
          />
          {errors.lastName !== undefined && (
            <p
              className={styles.register_form__error}
              role="alert"
            >
              {errors.lastName}
            </p>
          )}
        </div>

        {/* Email */}
        <div className={styles.register_form__field}>
          <label
            className={styles.register_form__label}
            htmlFor="email"
          >
            Email
          </label>
          <input
            autoComplete="email"
            className={styles.register_form__input}
            id="email"
            name="email"
            type="email"
          />
          {errors.email !== undefined && (
            <p
              className={styles.register_form__error}
              role="alert"
            >
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className={styles.register_form__field}>
          <label
            className={styles.register_form__label}
            htmlFor="password"
          >
            Password
          </label>
          <input
            autoComplete="new-password"
            className={styles.register_form__input}
            id="password"
            name="password"
            type="password"
          />
          {errors.password !== undefined && (
            <p
              className={styles.register_form__error}
              role="alert"
            >
              {errors.password}
            </p>
          )}
        </div>

        {/* Building */}
        <BuildingErrorBoundary fallback={BUILDING_FETCH_ERROR}>
          <BuildingField
            error={errors.buildingId}
            onChange={setBuildingId}
          />
        </BuildingErrorBoundary>

        {/* Phone */}
        <div className={styles.register_form__field}>
          <label
            className={styles.register_form__label}
            htmlFor="phone"
          >
            Phone number
          </label>
          <input
            autoComplete="tel"
            className={styles.register_form__input}
            id="phone"
            name="phone"
            type="tel"
          />
          <p className={styles.register_form__hint}>
            10 digits, no spaces or dashes
          </p>
          {errors.phone !== undefined && (
            <p
              className={styles.register_form__error}
              role="alert"
            >
              {errors.phone}
            </p>
          )}
        </div>

        {errors.submit !== undefined && (
          <p
            className={styles.register_form__error}
            role="alert"
          >
            {errors.submit}
          </p>
        )}
      </div>

      <button
        className={styles.register_form__submit}
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Creating account\u2026" : "Create Account"}
      </button>

      <p className={styles.register_form__signin}>
        {"Already have an account? "}
        <Link
          className={styles.register_form__signin_link}
          to="/login"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

// ---------------------------------------------------------------------------
// RegisterPage
// ---------------------------------------------------------------------------

function RegisterPage() {
  return (
    <AuthLayout adminEmail={ADMIN_EMAIL}>
      <RegisterForm />
    </AuthLayout>
  );
}
