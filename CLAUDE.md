# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Parking Management System for a residential community. Handles parking spot allocation via a raffle-based system that rotates every 3 months, with fairness prioritization (residents not previously selected get priority).

## Commands

```bash
pnpm install      # Install dependencies
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm test         # Run unit/component tests (Vitest + React Testing Library)
pnpm test:e2e     # Run E2E tests (Playwright)
```

> Note: This is a Windows environment. Shell is PowerShell, but use Unix path syntax in commands.

## Architecture

**Feature-based structure** — each feature is self-contained. Cross-feature dependencies go through `src/shared/`.

```
src/
  features/
    residents/        # Resident management
    raffle/           # Quarterly raffle allocation
    parking-spots/    # Parking spot management
  shared/
    components/       # Reusable UI components
    hooks/
    utils/
convex/
  schema.ts           # Database schema — do NOT modify without discussing first
  functions/          # Serverless backend functions
```

Each feature follows the pattern: `components/`, `hooks/`, `utils/`, `<feature>.module.scss`.

**Backend:** Convex (serverless + database). Two roles: Admin and Resident.

## Coding Conventions

### TypeScript
- Explicit types; no `any`
- Interfaces over type aliases for object shapes
- Named exports over default exports

### Styling
- SCSS Modules only — no inline styles, no CSS-in-JS
- BEM naming convention: `.feature__element--modifier`
- Use `clsx` for conditional class names

```tsx
import clsx from 'clsx';
import styles from './residents.module.scss';

<div className={clsx(styles.residents__item, { [styles['residents__item--selected']]: isSelected })} />
```

### Code Style
- Max 80 columns per line
- Alphabetical order for imports, function arguments, object keys, and props

### Import Order
1. External libraries
2. Shared modules
3. Feature modules
4. Relative imports
5. Styles

## Constraints

- No UI component libraries (no MUI, Chakra, etc.)
- No TypeScript errors at commit time
- Run tests before committing

## Commits

Conventional commits: `type(scope): subject`

Types: `feat|fix|docs|style|refactor|perf|test|build|ci|chore`

Examples: `feat(raffle): add quarterly rotation logic`, `fix(residents): validate input on registration`
