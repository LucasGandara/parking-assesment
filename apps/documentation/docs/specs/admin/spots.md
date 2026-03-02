# Admin Spot Management

## Overview

The Spots section of the admin dashboard. Allows the admin to manage
the inventory of named parking spots per building — adding, editing,
and removing spots. Each spot belongs to exactly one building and has
a numeric identifier and a human-readable label.

## Access

> Authenticated, Admin

## Requirements

### Display

- The system SHALL display a list of all buildings.
- Each building entry SHALL display its spots in a table with columns:
  spot number, label, and current assignee.
- The current assignee column SHALL show the full name of the resident
  assigned to that spot in the current period, or "—" if the spot is
  unassigned or no current period exists.

### Add Spot

- Each building entry SHALL provide an "Add Spot" action.
- WHEN the admin activates "Add Spot" on a building the system SHALL
  pre-fill the spot number with the next available value (the highest
  existing spot number in that building plus one, or 1 if no spots
  exist) and pre-fill the label with "A{number}".
- WHEN the admin activates "Add Spot" the system SHALL present the
  number and label as editable fields before saving.
- WHEN the admin submits the new spot form the system SHALL create the
  spot and display it in the building's spot table.
- IF the spot creation fails THEN the system SHALL display an inline
  error message and keep the form open so the admin may retry.

### Edit Spot

- Each spot row SHALL provide an edit action.
- WHEN the admin activates the edit action on a spot the system SHALL
  render the spot number and label as editable inline fields.
- WHEN the admin submits the inline edit the system SHALL update the
  spot's number and label.
- IF the submitted number is already in use by another spot in the same
  building THEN the system SHALL display a field-level error and not
  save the change.
- IF the edit submission fails for any other reason THEN the system
  SHALL display an inline error message and keep the edit fields open
  so the admin may retry.
- WHILE the inline edit is active, WHEN the admin presses Escape the
  system SHALL discard the change and restore the read-only row.

### Remove Spot

- Each spot row SHALL provide a delete action.
- WHEN the admin activates the delete action on a spot that has no
  assignment in the current period the system SHALL delete the spot
  immediately without a confirmation step.
- WHEN the admin activates the delete action on a spot that has an
  assignment in the current period the system SHALL display a
  confirmation dialog identifying the affected resident by full name.
- WHEN the admin confirms the deletion dialog the system SHALL delete
  the spot and all its assignments.
- IF the deletion fails THEN the system SHALL display an inline error
  message and leave the spot and any assignment intact.

### Cascade

- WHEN a building is deleted the system SHALL delete all spots
  belonging to that building.
- WHEN a spot is deleted the system SHALL delete all assignments
  associated with that spot across all periods.
