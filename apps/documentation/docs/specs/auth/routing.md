# Auth Routing

## Overview

Defines how the application routes users between auth pages and the
application based on authentication state and role.

## Access

> Public

## Requirements

### Root redirect

- WHEN an unauthenticated user navigates to `/` the system SHALL redirect
  to `/login`.
- WHEN an unauthenticated user navigates to `/register` the system SHALL
  render the registration page.
- WHEN an authenticated user with role "admin" navigates to `/` the
  system SHALL redirect to `/admin`.
- WHEN an authenticated user with role "resident" navigates to `/` the
  system SHALL render the resident dashboard.

### Auth-page guard

- WHEN an authenticated user navigates to `/login` the system SHALL redirect
  to the main application dashboard.
- WHEN an authenticated user navigates to `/register` the system SHALL
  redirect to the main application dashboard.
