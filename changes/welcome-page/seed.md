# welcome-page Seed

## Problem Statement

The application has no entry point. Users (residents) and admins need a way
to authenticate before accessing the parking management system. Without a
landing/auth page, the app is inaccessible.

## Core Thesis

A two-route auth experience (login + register) serves as the system's front
door. It must enforce the @unosquare.com domain restriction, present the
ParkSmart AI brand clearly, and guide residents through a multi-field
registration flow that connects to existing building/unit data in Convex.

## Proposed Approach

Two separate routes:

- `/login` — email + password form with a link to register
- `/register` — multi-field sign-up form with a link to login

Both routes share a two-panel layout:
- **Left panel**: ParkSmart AI branding, tagline ("Intelligent Parking
  Management System"), brief feature highlights, parking imagery
- **Right panel**: the auth form

Authentication is handled via **Convex Auth** (email + password only — no
social providers, no email verification).

### Login form fields
- Email (must be @unosquare.com)
- Password
- "Forgot password?" link — visible but inactive (out of scope)

### Register form fields
- Name
- Last name
- Email (validated against @unosquare.com on submit)
- Password
- Building — searchable dropdown populated from Convex (existing buildings)
- Unit number — searchable dropdown filtered by selected building
- Phone number (10 digits, numeric only)

### Footer
Static note: "Need help? Contact your building administrator" — links to an
email address to be provided later.

### Post-auth redirect
After successful login or registration, redirect to the main app dashboard
(route TBD — out of scope here).

### Admin accounts
Admins are seeded directly in the database. No admin registration path exists
on the welcome page.

## Constraints

- Convex Auth for authentication (email + password only)
- Domain restriction (@unosquare.com) must be enforced in Convex Auth's
  sign-up handler, not just the UI
- No email verification required
- No UI component libraries (custom components + SCSS Modules only)
- Building and unit data must be fetched from Convex at runtime
- Unit dropdown must be dependent on building selection
- Phone number must be exactly 10 digits, numeric only

## Dependencies

- Buildings and units are managed via a separate super-admin panel
  (`/admin-panel` change set — TBD). This change set assumes building/unit
  data is available in Convex before residents attempt to register.

## Open Questions

- What are the password requirements (min length, complexity)?
- What is the email address for the footer "contact" link?
- What route does a successful login/register redirect to?

## Risks

- Building/unit data fetch on the register page adds a loading state that
  needs graceful handling
- Unit dropdown depending on building selection adds UI complexity
  (empty state, reset on building change)
- If no buildings exist yet (admin panel not set up), the register form's
  building dropdown will be empty — residents won't be able to complete
  registration
