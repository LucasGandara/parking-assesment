---
kind: new
---

# Admin Access Control

## Overview

Controls who can access the admin section. Unauthenticated users are
redirected to login before the route renders. Authenticated non-admin
users see the not-found view once their role resolves. Both cases
produce no visible distinction to the user.

## Access

> Authenticated

## Requirements

### Role Resolution

- The system SHALL expose a data endpoint that returns the
  authenticated user's full profile, including their role, or null
  when no session exists.
- The system SHALL derive the admin status from the user's role field
  being equal to `"admin"`.

### Route Protection

- WHEN the user navigates to any admin route and is not authenticated
  the system SHALL redirect to the login route.
- WHILE the authenticated user's role is being resolved the system
  SHALL display a loading indicator in place of the admin layout.
- WHILE the authenticated user's role has resolved and is not `"admin"`
  the system SHALL render the not-found view in place of the admin
  layout.
- WHILE the authenticated user's role has resolved and is `"admin"`
  the system SHALL render the admin layout.
- IF role resolution fails THEN the system SHALL render the not-found
  view in place of the admin layout.
