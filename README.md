# Parking Management System

A parking management system for residential communities with raffle-based
spot allocation.

## Features

- **Parking Spot Management**: Track and manage available parking spots
- **Resident Management**: Manage resident information and assignments
- **Raffle System**: Fair allocation through quarterly raffles
- **Priority Queue**: Residents not selected in previous cycles get priority

### Planned Features

- Real-time vehicle detection (license plate recognition)
- Support for vehicle types (Car, Motorcycle, Bicycle)
- Spreadsheet import/export

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Convex
- **Styling**: SCSS Modules (BEM), clsx
- **Testing**: Vitest, React Testing Library, Playwright

## Architecture Decision: Feature-Based Structure

This project uses a **feature-based folder structure** to organize code.
Each feature is self-contained with its own components, hooks, and utilities.

### Why Feature-Based?

1. **Scalability**: Easy to add new features without affecting existing code
2. **Discoverability**: All related code lives together
3. **Team collaboration**: Teams can own entire features
4. **Encapsulation**: Clear boundaries between features

### Structure

```
src/
  features/
    residents/           # Resident management feature
      components/        # Feature-specific components
      hooks/             # Feature-specific hooks
      utils/             # Feature-specific utilities
      residents.module.scss
    raffle/              # Raffle system feature
      components/
      hooks/
      utils/
      raffle.module.scss
    parking-spots/       # Parking spot management feature
      components/
      hooks/
      utils/
      parking-spots.module.scss
  shared/                # Shared across features
    components/          # Reusable UI components
    hooks/               # Shared hooks
    utils/               # Shared utilities
convex/                  # Backend (Convex)
  schema.ts              # Database schema
  functions/             # Backend functions
```

### Guidelines

- Place feature-specific code inside `src/features/<feature-name>/`
- Place reusable code inside `src/shared/`
- Each feature should be as independent as possible
- Cross-feature imports should go through shared modules when possible

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (managed via Volta)
- [pnpm](https://pnpm.io/)
- [Volta](https://volta.sh/)

### Installation

```powershell
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |

## Contributing

See [AGENTS.md](./AGENTS.md) for coding conventions and guidelines.

