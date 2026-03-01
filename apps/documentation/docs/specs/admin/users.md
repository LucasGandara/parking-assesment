---
kind: new
depends_on:
  - changes/admin-page/specs/admin/layout.md
---

# Admin User Management

## Overview

The Users section of the admin dashboard. Displays all registered
residents and allows the admin to update a user's building assignment
and phone number.

## Access

> Authenticated, Admin

## Requirements

### Display

- The system SHALL display a table of all registered users.
- The table SHALL include the following columns: full name, email,
  phone, building name, and role.
- The system SHALL display each user's role as a read-only badge.

### Inline Edit

- Each table row SHALL include an Edit action.
- WHEN the user activates the Edit action on a row the system SHALL
  expand an inline edit form directly below that row.
- The inline edit form SHALL include a building field and a phone
  field.
- The building field SHALL be a dropdown populated from all existing
  buildings.
- WHILE another row's edit form is open, WHEN the user activates
  the Edit action on a row the system SHALL close the open edit form
  without saving its changes.

### Saving

- WHEN the user submits the inline edit form the system SHALL update
  the user's building assignment and phone number.
- WHEN the update succeeds the system SHALL collapse the inline edit
  form.
- WHEN the update succeeds the system SHALL reflect the updated
  values in the row.
- IF the update fails THEN the system SHALL display an error message
  within the inline edit form.
