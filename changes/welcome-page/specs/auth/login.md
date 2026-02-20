---
kind: new
depends_on:
  - specs/auth/routing.md
  - specs/auth/layout.md
---

# Login

## Overview

Allows registered residents and admins to authenticate using their
@unosquare.com email address and password.

## Access

> Public

## Requirements

### Form

- The system SHALL render an email input field on the login page.
- The system SHALL render a password input field on the login page.
- The system SHALL render a "Forgot password?" link on the login page.
- The system SHALL render the "Forgot password?" link as non-interactive.
- The system SHALL render the "Forgot password?" link in a visually
  disabled state.
- The system SHALL render a "Sign In" submit button on the login page.
- The system SHALL render a "Don't have an account? Sign up" navigation
  link on the login page.
- WHEN a user activates the "Don't have an account? Sign up" link the
  system SHALL navigate to `/register`.

### Authentication

- WHEN a user submits the login form the system SHALL authenticate the
  provided credentials against Convex Auth.
- WHEN authentication succeeds the system SHALL redirect the user to the
  main application dashboard.
- IF authentication fails THEN the system SHALL display the error message
  "Invalid email or password." inline on the form.
- IF authentication fails THEN the system SHALL display the same error
  message regardless of whether the email is unrecognized or the password
  is incorrect.
