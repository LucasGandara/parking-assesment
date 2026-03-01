# Architecture Findings: admin-page

## Verdict: Clean Fit

All specs slot into the existing architecture without workarounds or
new primitives. Four areas assessed.

---

## 1. Layout Route (Sidebar Shell)

TanStack Router v1 supports a `route.tsx` file inside a directory
as the layout route for that directory's children. The pattern:

- `src/routes/admin/route.tsx` — layout route; renders `AdminLayout`
  (sidebar + `<Outlet />`); owns the `beforeLoad` auth redirect
- `src/routes/admin/index.tsx` — redirects to `/admin/users`
- `src/routes/admin/users.tsx`, `buildings.tsx`, `spots.tsx`,
  `raffle.tsx` — leaf section routes

Everything lives inside the `admin/` folder. No `admin.tsx` file
at the routes root. TanStack Router generates the nested route tree
automatically.

## 2. RouterContext Extension

Current: `{ isAuthenticated: boolean, isLoading: boolean }`
New: add `isAdmin: boolean`, `isUserLoading: boolean`

Changes:
- `src/types.ts` — extend RouterContext type
- `src/app.tsx` → `RouterProviderAuthenticated`:
  - Add `useQuery(api.users.currentUser)` (fires once auth resolves)
  - Derive `isAdmin = currentUser?.role === "admin" ?? false`
  - Derive `isUserLoading = currentUser === undefined`
  - Pass all four fields into RouterProvider context
- Initial router context default: `isAdmin: false, isUserLoading: true`

Note: `useQuery` returns `undefined` while loading and `null` when
authenticated but user record not found. Both cases → `isAdmin: false`.

## 3. Convex Backend

New file `convex/users.ts`:
- `currentUser` (query) — uses `getAuthUserId` from
  `@convex-dev/auth/server`; returns full user profile or null
- `list` (query) — fetches all users + all buildings, stitches
  building name onto each user in memory
- `update` (mutation) — patches `buildingId` and `phone` by user ID

Existing `convex/buildings.ts` gets three mutations added:
- `create` — inserts a new building
- `rename` — updates building name by ID
- `remove` — checks assigned users count; throws if > 0, deletes if 0

Pattern: follows `buildings.ts` exactly (query/mutation exports).

## 4. Not Found

`notFoundComponent` added to `__root.tsx` — TanStack Router's
built-in mechanism for unmatched URLs.

`NotFound` component lives at `src/shared/components/not-found/`.
`src/shared/components/` directory does not exist yet — created as
part of this change.

The same `NotFound` component is rendered by:
1. Root `notFoundComponent` (missing URLs)
2. `AdminLayout` directly (authenticated non-admin on `/admin/*`)

---

## File Impact Summary

| File | Change |
|---|---|
| `src/types.ts` | Extend RouterContext (+2 fields) |
| `src/app.tsx` | Add useQuery, derive isAdmin/isUserLoading |
| `src/routes/__root.tsx` | Add notFoundComponent |
| `src/routes/admin/route.tsx` | New — layout route |
| `src/routes/admin/index.tsx` | New — redirect to /admin/users |
| `src/routes/admin/users.tsx` | New |
| `src/routes/admin/buildings.tsx` | New |
| `src/routes/admin/spots.tsx` | New |
| `src/routes/admin/raffle.tsx` | New |
| `src/shared/components/not-found/` | New — shared component |
| `convex/users.ts` | New |
| `convex/buildings.ts` | Add create, rename, remove mutations |
| `src/features/admin/` | New feature directory |
