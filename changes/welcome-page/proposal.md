# Proposal: welcome-page

## Problem

The ParkSmart AI application has no entry point. There is no way for
residents to authenticate or register, making the system completely
inaccessible. A landing and authentication experience is needed before any
other part of the app can be used.

## Routing

When an unauthenticated user navigates to `/`, the system redirects them to
`/login`. When an authenticated user navigates to `/login` or `/register`,
the system redirects them to the main application dashboard. This prevents
authenticated users from seeing the auth pages and ensures all unauthenticated
users land at the login screen.

## Layout

Both the login and register routes share a two-panel layout. The left panel
displays ParkSmart AI branding: the logo, the tagline "Intelligent Parking
Management System", a brief list of feature highlights, and a parking-themed
image. The right panel contains the authentication form. This layout is
consistent across both routes so users feel continuity as they move between
login and registration.

## Login

A user navigating to `/login` sees the two-panel layout with a login form on
the right. The form presents an email field, a password field, a "Forgot
password?" link, and a "Sign In" button. Below the button, a line reads
"Don't have an account? Sign up" which navigates to `/register`.

The "Forgot password?" link is visible in the UI but does nothing when
clicked. It is a placeholder for a future feature.

When the user submits the form, the system authenticates against Convex Auth.
If the credentials are valid, the user is redirected to the main application
dashboard. If the credentials are invalid — wrong password, unrecognized
email, or any other authentication failure — the form displays an inline
error: "Invalid email or password." No distinction is made between an
unrecognized email and a wrong password, to avoid leaking account existence.

## Registration

A user navigating to `/register` sees the same two-panel layout with a
registration form on the right. The form contains the following fields, in
order: first name, last name, email, password, building, and phone number.
A "Create Account" button submits the form. Below the button, a line reads
"Already have an account? Sign in" which navigates to `/login`.

### Building selection

The building field is a searchable dropdown. When the register page loads, the
system fetches the list of existing buildings from Convex and populates the
dropdown. While the fetch is in progress, the dropdown shows a loading
indicator and is non-interactive. If the fetch completes and no buildings
exist in the system, the dropdown displays the message: "No buildings
available. Contact your administrator."

### Validation

The system validates the form on submission. Validation errors are displayed
inline beneath the relevant field. The following rules apply:

- All fields are required.
- Email must end with `@unosquare.com`. If it does not, the field shows:
  "Only @unosquare.com email addresses are accepted."
- Password must be at least 8 characters. If it is not, the field shows:
  "Password must be at least 8 characters."
- Phone number must be exactly 10 numeric digits. The field displays a hint
  beneath it at all times: "10 digits, no spaces or dashes." If the value
  does not meet the rule, the field shows: "Phone number must be exactly
  10 digits."

The form does not submit if any validation rule fails. The user must correct
all errors before the system attempts to create the account.

### Account creation

When the form is submitted with valid data, the system sends the registration
request to Convex Auth. The Convex Auth sign-up handler enforces the
`@unosquare.com` domain restriction server-side, regardless of what the client
sends. If the email domain is rejected at the server, the form displays:
"Only @unosquare.com email addresses are accepted."

If the email address is already associated with an existing account, the form
displays: "An account with this email already exists."

On successful registration, the user is immediately authenticated and
redirected to the main application dashboard. No email verification step
occurs.

## Footer

Both the login and register pages display a footer with the text: "Need help?
Contact your building administrator." The text links to an administrator email
address. The exact email address is a configuration value to be provided
before launch; a placeholder is used during development.

## Admin accounts

Admin accounts are seeded directly into the database. There is no registration
path for admins on the welcome page. Admin users authenticate through the same
`/login` route as residents.

## Out of scope

Password reset, social login, and email verification are not part of this
change set. Unit number assignment is handled in a later change set. The admin
panel for managing buildings is a separate change set that this feature depends
on for its building dropdown data.
