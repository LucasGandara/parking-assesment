# AGENTS.md

Instructions for AI coding assistants working on this codebase.

## Project Overview

Parking Management System for a residential community. The system handles:

- Parking spot allocation
- Raffle-based assignment rotating every 3 months
- Fairness prioritization (residents not selected previously get priority)

### Future Features

- Real-time vehicle detection (license plate recognition)
- Support for different vehicle types (Car, Motorcycle, Bicycle)
- Import/export data from spreadsheets

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React | UI framework |
| TypeScript | Language |
| Vite | Build tool |
| Convex | Backend & database |
| SCSS Modules | Styling (BEM convention) |
| clsx | Conditional class names |
| Vitest | Unit testing |
| React Testing Library | Component testing |
| Playwright | E2E testing |
| pnpm | Package manager |
| Volta | Node.js version management |

## Folder Structure (Feature-Based)

```
src/
  features/
    residents/
      components/
      hooks/
      utils/
      residents.module.scss
    raffle/
      components/
      hooks/
      utils/
      raffle.module.scss
    parking-spots/
      components/
      hooks/
      utils/
      parking-spots.module.scss
  shared/
    components/
    hooks/
    utils/
convex/
  schema.ts
  functions/
```

## Coding Conventions

### General

- **Max line length**: 80 columns
- **Ordering**: Alphabetical order for imports, function arguments,
  object keys, and props (unless another order is logical)
- **Shell**: Use PowerShell (Windows environment)

### TypeScript

- Use explicit types; avoid `any`
- Prefer interfaces over type aliases for object shapes
- Use named exports over default exports

### Styling (SCSS Modules + BEM)

```scss
// Example: residents.module.scss
.residents {
  &__list {
    // Element
  }

  &__item {
    // Element

    &--selected {
      // Modifier
    }
  }
}
```

```tsx
// Example: using clsx for conditional styles
import clsx from 'clsx';
import styles from './residents.module.scss';

<div className={clsx(
  styles.residents__item,
  { [styles['residents__item--selected']]: isSelected }
)} />
```

### Imports Order

1. External libraries (alphabetical)
2. Shared modules (alphabetical)
3. Feature modules (alphabetical)
4. Relative imports (alphabetical)
5. Styles

## Testing

- **Unit/Component tests**: Vitest + React Testing Library
- **E2E tests**: Playwright
- Run tests before committing

## Git

- Main branch: `main`
- Keep commits focused and atomic

## Commit & Pull Request Guidelines

- Use conventional commits (`feat|fix|docs|style|refactor|perf|test|build|ci|chore`, optional scope): `type(scope): subject`
- Examples:
  - `feat(raffle): add quarterly rotation logic`
  - `fix(residents): validate input on registration`
  - `docs: update README with setup instructions`
  - `test(parking-spots): add allocation unit tests`

## Constraints & Rules

### Do

- Follow BEM naming for CSS classes
- Use SCSS modules for all component styles
- Use clsx for conditional class names
- Keep lines under 80 characters
- Alphabetize imports and arguments

### Do Not

- Do NOT use UI component libraries (Material UI, Chakra, etc.)
  unless explicitly instructed
- Do NOT use inline styles
- Do NOT use CSS-in-JS solutions
- Do NOT commit code with TypeScript errors
- Do NOT modify Convex schema without discussing the changes first

## Commands

```powershell
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Build for production
pnpm build
```

