---
depends_on:
  - specs/auth/routing
---

# Resident Dashboard

## Overview

The main landing page at `/` for authenticated residents. Displays a
"Parking Raffler" card showing the resident's building and their spot
assignment status for the current and previous allocation period. The
card is read-only.

## Access

> Authenticated, Resident

## Requirements

### Parking Raffler Card

- The dashboard SHALL display a card labeled "Parking Raffler".
- The card SHALL display the name of the building the resident is
  assigned to.
- The card SHALL display the resident's spot assignment status for the
  current period.
- IF no current period exists THEN the current period field SHALL
  display "No active period".
- IF a current period exists and the resident has an assignment in
  that period THEN the current period field SHALL display the spot's
  label and number.
- IF a current period exists and the resident has no assignment in
  that period THEN the current period field SHALL display "No spot
  this period".
- The card SHALL display the resident's spot assignment status for the
  previous period.
- IF no previous period exists OR the resident had no assignment in
  the previous period THEN the previous period field SHALL display "—".
- IF a previous period exists and the resident had an assignment in
  that period THEN the previous period field SHALL display the spot's
  label and number.
- The card SHALL be read-only. The resident SHALL NOT be able to edit
  their building, spot, or assignment from this view.
