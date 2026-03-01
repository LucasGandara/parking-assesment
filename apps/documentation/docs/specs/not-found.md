---
kind: new
---

# Not Found

## Overview

A shared "not found" view displayed for genuinely missing routes and
for authenticated users who lack admin access. Both cases are
intentionally indistinguishable to the user.

## Requirements

### Display

- The system SHALL render the not-found view when a user navigates to
  a URL that matches no defined route.
- The system SHALL render the not-found view when an authenticated
  non-admin user's role resolves on a route that requires admin access.
- The system SHALL display a message indicating the page could not be
  found.
- The system SHALL display a "Go to Dashboard" action on the not-found
  view.

### Navigation

- WHEN the user activates the "Go to Dashboard" action the system
  SHALL navigate to the home route.
