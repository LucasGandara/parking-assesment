# Tasks: welcome-page

## Overview

Bootstrap the ParkSmart AI application from a blank repository through to a
fully working authentication entry point. Tasks run foundation-first: scaffold
→ Convex backend → router → shared layout → login page → registration page →
tests. Each task leaves the repository in a committable, non-broken state.

## Tasks

### [o] Task 1 — Project scaffolding

**Description:**
Initialize the Vite + React + TypeScript project, install all required
dependencies, and establish the base directory structure. Nothing works until
this exists.

**Requirements:**

#### Foundations & Prerequisites

- Initialize Vite project with React + TypeScript template via `pnpm create vite`
- Install runtime dependencies: `@tanstack/react-router`, `convex`,
  `@convex-dev/auth`, `clsx`, `sass`
- Install dev dependencies: `vitest`, `@testing-library/react`,
  `@testing-library/user-event`, `@playwright/test`, `@types/react`,
  `@types/react-dom`
- Create directory structure: `src/auth/components/`, `src/auth/hooks/`,
  `src/auth/utils/`, `src/shared/components/`, `src/shared/hooks/`,
  `src/shared/utils/`, `convex/`
- Configure `tsconfig.json` (strict mode, path aliases)
- Create minimal `src/main.tsx` and `src/App.tsx` entry points
- Configure Vitest and Playwright

---

### [ ] Task 2 — Convex setup + domain restriction

**Description:**
Initialize Convex in the project and configure Convex Auth with the Password
provider. Implement the `@unosquare.com` domain restriction in the server-side
`profile()` callback. This is the security foundation — all registration
attempts will be validated here regardless of what the client sends.

**Requirements:**

#### Foundations & Prerequisites

- Run `pnpm dlx convex dev` to initialize Convex and generate
  `convex/_generated/`
- Create `convex/schema.ts` with the auth tables required by Convex Auth

#### specs/auth/registration.md

- "The system SHALL enforce the `@unosquare.com` email domain restriction
  in the Convex Auth sign-up handler independently of client-side
  validation."

---

### [ ] Task 3 — TanStack Router + routing rules

**Description:**
Configure TanStack Router with code-based route definitions and implement all
routing rules from the specs: root redirect, auth guard for authenticated
users, and rendering of auth pages for unauthenticated users.

**Requirements:**

#### Foundations & Prerequisites

- Configure TanStack Router in `src/main.tsx` with a `RouterProvider`
- Define route tree: `/` (root), `/login`, `/register`
- Implement `beforeLoad` auth guard on `/login` and `/register` routes
  that reads Convex auth state

#### specs/auth/routing.md

- "WHEN an unauthenticated user navigates to `/` the system SHALL redirect
  to `/login`."
- "WHEN an unauthenticated user navigates to `/register` the system SHALL
  render the registration page."
- "WHEN an authenticated user navigates to `/login` the system SHALL
  redirect to the main application dashboard."
- "WHEN an authenticated user navigates to `/register` the system SHALL
  redirect to the main application dashboard."

---

### [ ] Task 4 — Auth layout component

**Description:**
Build the shared two-panel layout component used by both `/login` and
`/register`. The left panel carries the ParkSmart AI branding; the right
panel is a slot for the page's form content. The footer is rendered by this
component on both pages.

**Requirements:**

#### specs/auth/layout.md

- "The system SHALL render a two-panel layout on the `/login` and
  `/register` pages."
- "The system SHALL render a left panel containing the ParkSmart AI logo,
  the tagline "Intelligent Parking Management System", a list of feature
  highlights, and a parking-themed image."
- "The system SHALL render a right panel containing the authentication
  form for the current page."
- "The system SHALL render a footer on both the `/login` and `/register`
  pages with the text "Need help? Contact your building administrator.""
- "The system SHALL render the footer contact text as a hyperlink pointing
  to a configurable administrator email address."

---

### [ ] Task 5 — Login page

**Description:**
Build the login page inside the auth layout: all form fields, the inactive
"Forgot password?" link, navigation to `/register`, Convex Auth sign-in
integration, and inline error handling on failure.

**Requirements:**

#### specs/auth/login.md

- "The system SHALL render an email input field on the login page."
- "The system SHALL render a password input field on the login page."
- "The system SHALL render a "Forgot password?" link on the login page."
- "The system SHALL render the "Forgot password?" link as non-interactive."
- "The system SHALL render the "Forgot password?" link in a visually
  disabled state."
- "The system SHALL render a "Sign In" submit button on the login page."
- "The system SHALL render a "Don't have an account? Sign up" navigation
  link on the login page."
- "WHEN a user activates the "Don't have an account? Sign up" link the
  system SHALL navigate to `/register`."
- "WHEN a user submits the login form the system SHALL authenticate the
  provided credentials against Convex Auth."
- "WHEN authentication succeeds the system SHALL redirect the user to the
  main application dashboard."
- "IF authentication fails THEN the system SHALL display the error message
  "Invalid email or password." inline on the form."
- "IF authentication fails THEN the system SHALL display the same error
  message regardless of whether the email is unrecognized or the password
  is incorrect."

---

### [ ] Task 6 — Registration page

**Description:**
Build the registration page inside the auth layout: all six fields in order,
searchable building dropdown with Convex query + loading/empty/error states,
phone hint text, full client-side validation with exact error messages, Convex
Auth sign-up integration, and redirect on success.

**Requirements:**

#### specs/auth/registration.md — Form

- "The system SHALL render the following fields on the registration page in
  order: first name, last name, email, password, building, phone number."
- "The system SHALL render a "Create Account" submit button on the
  registration page."
- "The system SHALL render an "Already have an account? Sign in" navigation
  link on the registration page."
- "WHEN a user activates the "Already have an account? Sign in" link the
  system SHALL navigate to `/login`."

#### specs/auth/registration.md — Building dropdown

- "The system SHALL render the building field as a searchable dropdown."
- "WHEN the registration page loads the system SHALL fetch the list of
  available buildings from Convex."
- "WHILE the building list is being fetched the system SHALL render the
  building dropdown as non-interactive and display a loading indicator
  within it."
- "IF the building list fetch completes and returns no buildings THEN the
  system SHALL display the message "No buildings available. Contact your
  administrator." inside the building dropdown."
- "IF the building list fetch fails THEN the system SHALL display an error
  message inside the building dropdown."

#### specs/auth/registration.md — Phone field

- "The system SHALL display the hint text "10 digits, no spaces or dashes"
  beneath the phone number field at all times."

#### specs/auth/registration.md — Validation

- "WHEN a user submits the registration form the system SHALL validate all
  fields before sending the registration request."
- "IF any required field has no value THEN the system SHALL display an
  inline error message beneath that field."
- "IF the email value does not end with `@unosquare.com` THEN the system
  SHALL display the error "Only @unosquare.com email addresses are
  accepted." beneath the email field."
- "IF the password value contains fewer than 8 characters THEN the system
  SHALL display the error "Password must be at least 8 characters." beneath
  the password field."
- "IF the phone number value does not consist of exactly 10 numeric digits
  THEN the system SHALL display the error "Phone number must be exactly
  10 digits." beneath the phone number field."
- "IF any validation rule fails THEN the system SHALL not submit the
  registration request to Convex Auth."

#### specs/auth/registration.md — Account creation

- "WHEN all form validation passes the system SHALL submit the registration
  request to Convex Auth."
- "IF the Convex Auth sign-up handler rejects the email domain THEN the
  system SHALL display the error "Only @unosquare.com email addresses are
  accepted." beneath the email field."
- "IF the submitted email address is already associated with an existing
  account THEN the system SHALL display the error "An account with this
  email already exists." beneath the email field."
- "WHEN registration succeeds the system SHALL authenticate the user
  immediately without requiring email verification."
- "WHEN registration succeeds the system SHALL redirect the user to the
  main application dashboard."

---

### [ ] Task 7 — Tests

**Description:**
Write the full test suite covering all auth specs. Unit tests for validation
utilities, component tests for both forms, and E2E tests for the complete
login and registration flows.

**Requirements:**

#### Foundations & Prerequisites

- Unit tests: email domain validation, password length validation, phone
  format validation (`src/auth/utils/`)
- Component tests: login form renders correctly, shows error on bad
  credentials, navigates to /register; registration form shows validation
  errors, disables building dropdown while loading
- E2E tests (Playwright): full login flow, full registration flow, root
  redirect, auth guard redirects

#### All specs/auth/*.md

- All requirements across `routing.md`, `layout.md`, `login.md`, and
  `registration.md` must pass their corresponding test cases
