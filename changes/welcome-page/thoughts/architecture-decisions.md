# Architecture Decisions: welcome-page

## Router

**Decision**: TanStack Router

**Rationale**: Fully type-safe routes. Chosen over React Router v6 for better
TypeScript DX. Note: TanStack Router uses file-based or code-based route
definitions — implementation will use code-based route definitions to align
with the feature structure.

## Auth Feature Location

**Decision**: `src/auth/`

**Rationale**: Top-level `src/auth/` directory, outside `src/features/`. This
is a deliberate departure from the feature-based convention in CLAUDE.md,
treating auth as a foundational layer rather than a product feature.

**Structure (anticipated)**:
```
src/auth/
  components/     # Login page, Register page, AuthGuard
  hooks/          # useAuth, useRequireAuth
  utils/          # domain validation helpers
  auth.module.scss
```

The `AuthGuard` component wraps unauthenticated-only routes and is consumed
by the router — it lives in `src/auth/components/` since it is owned by the
auth layer.

## Convex Auth Domain Restriction

**Decision**: Enforce `@unosquare.com` in Convex Auth's Password provider
`profile()` callback (server-side).

**Rationale**: The `profile()` callback runs during sign-up before the user
record is created. Throwing an error there prevents non-unosquare.com accounts
from being created regardless of client-side behavior.

**Convex file**: `convex/auth.ts`

## Auth Guard Pattern

**Decision**: Wrapper component using TanStack Router's `beforeLoad` or a
layout route that checks Convex auth state and redirects.

**Rationale**: TanStack Router supports route-level `beforeLoad` guards and
layout routes. Either approach is valid; `beforeLoad` is more idiomatic for
TanStack Router and keeps auth logic out of component trees.
