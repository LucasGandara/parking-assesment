# Tasks: admin-page

## Overview

Implement the admin dashboard: a role-gated `/admin` section with a
persistent sidebar and four sections (Users, Buildings, Spots, Raffle).
Builds on existing Convex auth and TanStack Router infrastructure.

---

## Tasks

### [ ] 1. NotFound component + root catch-all

**Description:**
Create the shared `NotFound` component in `src/shared/components/` and
wire it as `notFoundComponent` on the root route. This is foundational —
it is reused by the admin role gate in task 3.

**Requirements:**

#### Foundations & Prerequisites

- Create `src/shared/components/not-found/` directory.
- Add `notFoundComponent` to `src/routes/__root.tsx`.

#### `changes/admin-page/specs/not-found.md`

- "The system SHALL render the not-found view when a user navigates to
  a URL that matches no defined route."
- "The system SHALL render the not-found view when an authenticated
  non-admin user's role resolves on a route that requires admin access."
- "The system SHALL display a message indicating the page could not be
  found."
- "The system SHALL display a 'Go to Dashboard' action on the
  not-found view."
- "WHEN the user activates the 'Go to Dashboard' action the system
  SHALL navigate to the home route."

---

### [ ] 2. Convex backend

**Description:**
Create `convex/users.ts` with three exports (`currentUser`, `list`,
`update`) and add `create`, `rename`, and `remove` mutations to
`convex/buildings.ts`. No frontend changes — pure backend, fully
committable alone.

**Requirements:**

#### `changes/admin-page/specs/admin/access-control.md`

- "The system SHALL expose a data endpoint that returns the
  authenticated user's full profile, including their role, or null
  when no session exists."

#### `changes/admin-page/specs/admin/users.md`

- "The system SHALL display a table of all registered users."
- "WHEN the user submits the inline edit form the system SHALL update
  the user's building assignment and phone number."

#### `changes/admin-page/specs/admin/buildings.md`

- "WHEN the user submits the creation form the system SHALL create a
  new building with the provided name."
- "WHEN the user submits the rename input the system SHALL update the
  building's name."
- "WHEN the user activates the delete action the system SHALL check
  whether any users are assigned to the building."
- "IF one or more users are assigned to the building THEN the system
  SHALL display an inline error message stating the number of
  residents assigned."
- "IF no users are assigned to the building THEN the system SHALL
  delete the building immediately."

---

### [ ] 3. Admin route scaffold

**Description:**
Extend `RouterContext` with `isAdmin` and `isUserLoading`. Update
`app.tsx` to fetch the current user and derive the admin flag. Create
`src/routes/admin/route.tsx` (layout route with auth gate and loading/
404 logic) and `src/routes/admin/index.tsx` (redirect to `/admin/users`).
Stub out the four section routes as empty components. After this task
the admin route is fully gated and navigable.

**Requirements:**

#### Foundations & Prerequisites

- Update `src/types.ts`: add `isAdmin: boolean` and
  `isUserLoading: boolean` to `RouterContext`.
- Update `src/app.tsx` (`RouterProviderAuthenticated`): call
  `useQuery(api.users.currentUser)`, derive `isAdmin` and
  `isUserLoading`, pass all four fields into the router context.
- Create `src/routes/admin/` directory with stub files for
  `users.tsx`, `buildings.tsx`, `spots.tsx`, `raffle.tsx`.

#### `changes/admin-page/specs/admin/access-control.md`

- "The system SHALL derive the admin status from the user's role
  field being equal to `'admin'`."
- "WHEN the user navigates to any admin route and is not
  authenticated the system SHALL redirect to the login route."
- "WHILE the authenticated user's role is being resolved the system
  SHALL display a loading indicator in place of the admin layout."
- "WHILE the authenticated user's role has resolved and is not
  `'admin'` the system SHALL render the not-found view in place of
  the admin layout."
- "WHILE the authenticated user's role has resolved and is `'admin'`
  the system SHALL render the admin layout."
- "IF role resolution fails THEN the system SHALL render the
  not-found view in place of the admin layout."

#### `changes/admin-page/specs/admin/layout.md`

- "The system SHALL render a full-viewport-height layout consisting
  of a left sidebar and a main content area."
- "WHEN the user navigates to `/admin` the system SHALL redirect to
  `/admin/users`."

---

### [ ] 4. Admin layout + sidebar

**Description:**
Build the `AdminLayout` component in `src/features/admin/components/`
with the sidebar navigation and main content area. Wire it into
`route.tsx`. After this task the sidebar is visible, links are present,
and the active section is highlighted.

**Requirements:**

#### Foundations & Prerequisites

- Create `src/features/admin/` feature directory with `components/`,
  `hooks/`, `utils/` subdirectories.

#### `changes/admin-page/specs/admin/layout.md`

- "The sidebar SHALL contain navigation links for the following
  sections in order: Users, Buildings, Spots, Raffle."
- "WHEN the user activates a sidebar navigation link the system
  SHALL navigate to the corresponding section route."
- "The system SHALL visually distinguish the sidebar link whose route
  matches the currently active route."

---

### [ ] 5. Users section — display

**Description:**
Implement the read-only users table in `/admin/users`. Fetches all
users via `api.users.list` (in-memory join with buildings), renders
columns (full name, email, phone, building name, role badge), and
includes a non-functional Edit button placeholder per row.

**Requirements:**

#### `changes/admin-page/specs/admin/users.md`

- "The system SHALL display a table of all registered users."
- "The table SHALL include the following columns: full name, email,
  phone, building name, and role."
- "The system SHALL display each user's role as a read-only badge."
- "Each table row SHALL include an Edit action."

---

### [ ] 6. Users section — inline edit

**Description:**
Add the inline edit form below each row. Activating Edit expands the
form; only one row can be open at a time. Submitting calls
`api.users.update`; success collapses the form and updates the row;
failure shows an inline error.

**Requirements:**

#### `changes/admin-page/specs/admin/users.md`

- "WHEN the user activates the Edit action on a row the system SHALL
  expand an inline edit form directly below that row."
- "The inline edit form SHALL include a building field and a phone
  field."
- "The building field SHALL be a dropdown populated from all existing
  buildings."
- "WHILE another row's edit form is open, WHEN the user activates
  the Edit action on a row the system SHALL close the open edit form
  without saving its changes."
- "WHEN the user submits the inline edit form the system SHALL update
  the user's building assignment and phone number."
- "WHEN the update succeeds the system SHALL collapse the inline edit
  form."
- "WHEN the update succeeds the system SHALL reflect the updated
  values in the row."
- "IF the update fails THEN the system SHALL display an error message
  within the inline edit form."

---

### [ ] 7. Buildings section — display + create

**Description:**
Implement the buildings list in `/admin/buildings`. Each entry shows
the building name and assigned resident count (derived from
`api.users.list`). A creation form at the top inserts new buildings
via `api.buildings.create`; the input clears on success and shows an
inline error on failure.

**Requirements:**

#### `changes/admin-page/specs/admin/buildings.md`

- "The system SHALL display a list of all buildings."
- "Each building entry SHALL show the building's name and the count
  of residents currently assigned to it."
- "The system SHALL provide a creation form above the buildings list
  containing a name input and a submit action."
- "WHEN the user submits the creation form the system SHALL create a
  new building with the provided name."
- "WHEN the creation succeeds the system SHALL clear the name input."
- "IF the creation fails THEN the system SHALL display an inline
  error message below the creation form."

---

### [ ] 8. Buildings section — rename + delete

**Description:**
Add rename and delete actions to each building entry. Rename turns
the name into an editable input; Escape cancels, submit calls
`api.buildings.rename`. Delete calls `api.buildings.remove`; a
Convex-thrown error surfaces as an inline message with the resident
count; success removes the entry immediately.

**Requirements:**

#### `changes/admin-page/specs/admin/buildings.md`

- "Each building entry SHALL include a rename action."
- "WHEN the user activates the rename action the system SHALL replace
  the building name with an editable text input pre-filled with the
  current name."
- "WHEN the user submits the rename input the system SHALL update the
  building's name."
- "IF the rename fails THEN the system SHALL display an inline error
  message and restore the rename input so the user may retry."
- "WHILE the rename input is active, WHEN the user presses Escape
  the system SHALL discard the change and restore the read-only
  name."
- "Each building entry SHALL include a delete action."
- "WHEN the user activates the delete action the system SHALL check
  whether any users are assigned to the building."
- "IF one or more users are assigned to the building THEN the system
  SHALL display an inline error message stating the number of
  residents assigned."
- "IF no users are assigned to the building THEN the system SHALL
  delete the building immediately."

---

### [ ] 9. Placeholder sections

**Description:**
Implement the Spots and Raffle section routes as "Coming Soon" panels.
Completes all admin routes and closes out the change set.

**Requirements:**

#### `changes/admin-page/specs/admin/placeholders.md`

- "The system SHALL display a 'Coming Soon' message in the Spots
  section."
- "The system SHALL display a 'Coming Soon' message in the Raffle
  section."
