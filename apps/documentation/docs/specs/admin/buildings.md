---
kind: new
depends_on:
  - changes/admin-page/specs/admin/layout.md
---

# Admin Building Management

## Overview

The Buildings section of the admin dashboard. Allows the admin to
create, rename, and delete buildings. Deletion is blocked when
residents are assigned to the building.

## Access

> Authenticated, Admin

## Requirements

### Display

- The system SHALL display a list of all buildings.
- Each building entry SHALL show the building's name and the count
  of residents currently assigned to it.

### Create

- The system SHALL provide a creation form above the buildings list
  containing a name input and a submit action.
- WHEN the user submits the creation form the system SHALL create a
  new building with the provided name.
- WHEN the creation succeeds the system SHALL clear the name input.
- IF the creation fails THEN the system SHALL display an inline
  error message below the creation form.

### Rename

- Each building entry SHALL include a rename action.
- WHEN the user activates the rename action the system SHALL replace
  the building name with an editable text input pre-filled with the
  current name.
- WHEN the user submits the rename input the system SHALL update the
  building's name.
- IF the rename fails THEN the system SHALL display an inline error
  message and restore the rename input so the user may retry.
- WHILE the rename input is active, WHEN the user presses Escape the
  system SHALL discard the change and restore the read-only name.

### Delete

- Each building entry SHALL include a delete action.
- WHEN the user activates the delete action the system SHALL check
  whether any users are assigned to the building.
- IF one or more users are assigned to the building THEN the system
  SHALL display an inline error message stating the number of
  residents assigned.
- IF no users are assigned to the building THEN the system SHALL
  delete the building immediately.
