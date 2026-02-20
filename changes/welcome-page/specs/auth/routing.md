---
kind: new
---

# Auth Routing

## Overview

Defines how the application routes users between auth pages and the
application dashboard based on authentication state.

## Access

> Public

## Requirements

### Root redirect

- WHEN an unauthenticated user navigates to `/` the system SHALL redirect
  to `/login`.
- WHEN an unauthenticated user navigates to `/register` the system SHALL
  render the registration page.

### Auth-page guard

- WHEN an authenticated user navigates to `/login` the system SHALL redirect
  to the main application dashboard.
- WHEN an authenticated user navigates to `/register` the system SHALL
  redirect to the main application dashboard.
