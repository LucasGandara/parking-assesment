---
kind: new
depends_on:
  - changes/admin-page/specs/admin/access-control.md
---

# Admin Layout

## Overview

The persistent shell for all admin sections. Renders a left sidebar
containing section navigation links and a main content area that
displays the active section.

## Access

> Authenticated, Admin

## Requirements

### Structure

- The system SHALL render a full-viewport-height layout consisting of
  a left sidebar and a main content area.
- The sidebar SHALL contain navigation links for the following sections
  in order: Users, Buildings, Spots, Raffle.

### Navigation

- WHEN the user navigates to `/admin` the system SHALL redirect to
  `/admin/users`.
- WHEN the user activates a sidebar navigation link the system SHALL
  navigate to the corresponding section route.
- The system SHALL visually distinguish the sidebar link whose route
  matches the currently active route.
