# Admin Period and Raffle Management

## Overview

The Raffle section of the admin dashboard. Allows the admin to create
allocation periods, run the automated weighted raffle once per period,
and manually override individual spot assignments for the current period.

## Access

> Authenticated, Admin

## Requirements

### Display

- The system SHALL display all periods in reverse chronological order.
- Each period entry SHALL display its label, start date, end date,
  phase, and whether the raffle has been run.

### Create Period

- The system SHALL provide a form to create a new period containing
  label, start date, and end date fields.
- WHEN the admin submits the create-period form the system SHALL
  atomically perform the following phase transition:
  - update any period with phase "previous" to phase "archived"
  - update any period with phase "current" to phase "previous"
  - insert the new period with phase "current" and raffleRun false.
- IF the period creation fails THEN the system SHALL display an inline
  error message and keep the form open so the admin may retry.

### Run Raffle

- WHEN the current period has raffleRun false the system SHALL display
  a "Run Raffle" action on that period's entry.
- WHEN the admin activates "Run Raffle" the system SHALL display a
  confirmation prompt stating that assignments will be auto-created
  and the action cannot be undone.
- WHEN the admin confirms the prompt the system SHALL execute the
  raffle algorithm and set raffleRun to true on the period.
- WHEN the raffle completes the system SHALL display a summary showing
  the number of spots filled and the number of spots that remain
  unassigned across all buildings.
- IF the raffle execution fails THEN the system SHALL display an error
  message, leave raffleRun as false, and keep the "Run Raffle" action
  visible so the admin may retry.
- WHEN the current period has raffleRun true the system SHALL NOT
  display a "Run Raffle" action for that period.

### Raffle Algorithm

The following rules govern the automated raffle execution:

- The system SHALL execute the raffle independently for each building.
- For each building, the system SHALL collect all spots that have no
  assignment in the current period.
- For each building, the system SHALL collect all users with role
  "resident" assigned to that building who have no assignment in the
  current period. Users with role "admin" SHALL be excluded.
- IF a building has no unassigned spots OR has no eligible residents
  THEN the system SHALL skip that building.
- The system SHALL assign each eligible resident a weight of 2 if they
  had no assignment in the previous period or if no previous period
  exists, and a weight of 1 if they had an assignment in the previous
  period.
- The system SHALL select residents using weighted random selection
  and assign them to unassigned spots one per spot until spots or
  residents are exhausted.
- The system SHALL persist all new assignments as part of the same
  atomic operation that sets raffleRun to true.

### Manual Assignment Override

- The raffle page SHALL display a spot assignment section grouped by
  building, showing each building's spots as rows with columns: spot
  number, label, and assigned resident.
- Each spot in the current period SHALL display its assigned resident
  (or "—") alongside an assignment control.
- The assignment control SHALL be a dropdown listing all residents
  assigned to that building and a "— None" option.
- WHEN the admin selects a resident from the dropdown the system SHALL
  assign that resident to the spot in the current period.
- IF the selected resident already holds a different spot in the current
  period THEN the system SHALL remove their prior assignment before
  creating the new one.
- WHEN the admin selects "— None" the system SHALL remove the existing
  assignment for that spot in the current period.
- IF an assignment change fails THEN the system SHALL display an inline
  error message and revert the control to its previous value.
- The assignment control SHALL only be available for periods with
  phase "current". Periods with phase "previous" or "archived" SHALL
  be read-only.
