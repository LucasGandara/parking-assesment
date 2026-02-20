---
kind: new
depends_on:
  - specs/auth/routing.md
  - specs/auth/layout.md
---

# Registration

## Overview

Allows new residents with a valid @unosquare.com email address to create an
account by providing their personal details and building selection.

## Access

> Public

## Requirements

### Form

- The system SHALL render the following fields on the registration page in
  order: first name, last name, email, password, building, phone number.
- The system SHALL render a "Create Account" submit button on the
  registration page.
- The system SHALL render an "Already have an account? Sign in" navigation
  link on the registration page.
- WHEN a user activates the "Already have an account? Sign in" link the
  system SHALL navigate to `/login`.

### Building dropdown

- The system SHALL render the building field as a searchable dropdown.
- WHEN the registration page loads the system SHALL fetch the list of
  available buildings from Convex.
- WHILE the building list is being fetched the system SHALL render the
  building dropdown as non-interactive and display a loading indicator
  within it.
- IF the building list fetch completes and returns no buildings THEN the
  system SHALL display the message "No buildings available. Contact your
  administrator." inside the building dropdown.
- IF the building list fetch fails THEN the system SHALL display an error
  message inside the building dropdown.

### Phone field

- The system SHALL display the hint text "10 digits, no spaces or dashes"
  beneath the phone number field at all times.

### Validation

- WHEN a user submits the registration form the system SHALL validate all
  fields before sending the registration request.
- IF any required field has no value THEN the system SHALL display an
  inline error message beneath that field.
- IF the email value does not end with `@unosquare.com` THEN the system
  SHALL display the error "Only @unosquare.com email addresses are
  accepted." beneath the email field.
- IF the password value contains fewer than 8 characters THEN the system
  SHALL display the error "Password must be at least 8 characters." beneath
  the password field.
- IF the phone number value does not consist of exactly 10 numeric digits
  THEN the system SHALL display the error "Phone number must be exactly
  10 digits." beneath the phone number field.
- IF any validation rule fails THEN the system SHALL not submit the
  registration request to Convex Auth.

### Account creation

- WHEN all form validation passes the system SHALL submit the registration
  request to Convex Auth.
- The system SHALL enforce the `@unosquare.com` email domain restriction
  in the Convex Auth sign-up handler independently of client-side
  validation.
- IF the Convex Auth sign-up handler rejects the email domain THEN the
  system SHALL display the error "Only @unosquare.com email addresses are
  accepted." beneath the email field.
- IF the submitted email address is already associated with an existing
  account THEN the system SHALL display the error "An account with this
  email already exists." beneath the email field.
- WHEN registration succeeds the system SHALL authenticate the user
  immediately without requiring email verification.
- WHEN registration succeeds the system SHALL redirect the user to the
  main application dashboard.
