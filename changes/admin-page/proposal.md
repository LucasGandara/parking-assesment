# Proposal: Admin Page

## Problem

The system has no admin interface. Managing users and buildings requires
direct database access. The `role` field exists in the schema but is
not surfaced or enforced anywhere in the application.

## Goals

- The administrator can manage users and buildings from a protected web
  interface without touching the database directly.
- Non-admin users and unauthenticated visitors who navigate to `/admin`
  see a 404 page indistinguishable from any other missing route.
- Each admin section is reachable via a persistent sidebar and has its
  own URL.

## Approach

### Route Structure

The admin section uses TanStack Router's nested route pattern. A layout
route at `/admin` owns the sidebar and renders an `<Outlet />` for the
active section. The child routes are:

- `/admin/users` — user management (default section)
- `/admin/buildings` — building management
- `/admin/spots` — placeholder
- `/admin/raffle` — placeholder

Navigating to `/admin` redirects to `/admin/users`.

### Role Gating

The router context is extended with two new fields: `isAdmin: boolean`
and `isUserLoading: boolean`. In `app.tsx`, a new Convex query
(`api.users.currentUser`) fetches the authenticated user's profile.
`isAdmin` is derived as `currentUser?.role === "admin"`. While the query
is in flight, `isUserLoading` is `true`.

The admin layout route's `beforeLoad` redirects to `/login` if the user
is not authenticated. Role enforcement happens inside the `AdminLayout`
component: while `isUserLoading` is true a loading indicator is shown;
once resolved, if `isAdmin` is false the shared `NotFound` component is
rendered in place of the layout. This makes the route feel identical to
a missing URL — there is no redirect, no flash of restricted content.

### Not Found Component

A `NotFound` component is created in
`src/shared/components/not-found/`. It displays a short message and a
"Go to Dashboard" button that navigates to `/`. It is used in two
places:

1. The admin layout component (unauthorized or unauthenticated access
   after the loading phase)
2. A catch-all route (`/src/routes/$notFound.tsx`) that covers all
   genuinely missing URLs

### Admin Layout

The `AdminLayout` component renders a left sidebar and a main content
area side by side. The sidebar contains the four section links (Users,
Buildings, Spots, Raffle). The active link is visually highlighted using
the TanStack Router `<Link>` active state. The layout is full-viewport-
height. No mobile adaptation in this iteration.

---

### Users Section (`/admin/users`)

The section displays a table of all registered residents. Columns: full
name, email, phone, building, role. Role is shown as a read-only badge.

Each row has an Edit button. Clicking it expands an inline edit form
directly below the row. The form exposes two editable fields: building
(a dropdown populated from the buildings list) and phone (a text input).
Submitting the form calls a Convex mutation that updates the user record.
On success the row collapses back to read mode. On error a message is
shown inline.

Only one row can be in edit mode at a time. Opening a second row's
editor closes the first without saving.

### Buildings Section (`/admin/buildings`)

The section displays a list of existing buildings. Each building shows
its name and the count of residents currently assigned to it.

**Create:** A form at the top of the list (name input + "Add" button)
inserts a new building. The input is cleared on success.

**Rename:** Each building has a rename action. Clicking it turns the
name into an inline text input. Submitting saves the new name via a
Convex mutation. Pressing Escape cancels without saving.

**Delete:** Each building has a delete action. Before executing, the
system checks whether any users are assigned to that building. If so,
deletion is refused and an error message is shown inline: "Cannot delete
— X residents are assigned to this building." If no users are assigned,
the building is deleted immediately (no confirmation dialog).

### Spots Section (`/admin/spots`)

A placeholder panel with a "Coming Soon" message. No functionality.

### Raffle Section (`/admin/raffle`)

A placeholder panel with a "Coming Soon" message. No functionality.

---

## New Convex Functions

| File | Export | Purpose |
|---|---|---|
| `convex/users.ts` | `currentUser` (query) | Returns the authenticated user's full profile, or `null` if unauthenticated |
| `convex/users.ts` | `list` (query) | Returns all users joined with building name — fetches all users and all buildings, stitches them in memory by `buildingId` |
| `convex/users.ts` | `update` (mutation) | Updates a user's `buildingId` and/or `phone` |
| `convex/buildings.ts` | `create` (mutation) | Inserts a new building |
| `convex/buildings.ts` | `rename` (mutation) | Updates a building's name |
| `convex/buildings.ts` | `remove` (mutation) | Deletes a building; throws if users are assigned |
