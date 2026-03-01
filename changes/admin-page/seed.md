# Admin Page Seed

## Problem Statement

The system has no admin interface. The `role` field exists in the schema but
is not enforced anywhere. There is no way to manage users, buildings, or
parking spots without direct database access.

## Core Thesis

A single administrator (lucas.gandara@unosquare.com) needs a protected
dashboard to manage the system's core entities. The admin role is immutable
from the UI — it is set directly in the database and the application never
exposes controls to grant or revoke it.

## Proposed Approach

Introduce an `/admin` route with four sections:

- **Users** — View all residents, edit their building assignment and profile
  info
- **Parking Spots** — Create, edit, and deactivate parking spots
- **Buildings** — Create and manage buildings
- **Raffle** — Placeholder UI; the raffle feature is not yet implemented

Role-gating is enforced at the **frontend routing layer only** — non-admin
users are shown a 404 page. Convex functions are not individually protected
for now; the router is the single enforcement point.

The 404 approach for unauthorized access is intentional: residents cannot
distinguish a missing route from a restricted one (security through
obscurity). The 404 component is reused for genuinely missing routes too,
so `/admin` and `/anything-random` look identical to a resident. A "Go to
Dashboard" button gives them a way out.

## Constraints

- Admin user is provisioned directly in the database — no UI for role
  assignment or promotion, ever
- Role field on users is read-only from the application layer
- No UI component libraries (custom components only)
- SCSS Modules + BEM naming
- Max 80 columns per line (ESLint enforced)

## Open Questions

None.

## Risks

- Frontend-only gating means a resident with devtools could call Convex
  functions directly — accepted for now, to be revisited before production
- Raffle placeholder must be clearly marked as not-yet-functional to avoid
  confusion during demos
