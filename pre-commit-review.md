# Pre-Commit Code Review

Reviews only the **actual code changes** in the current branch before committing.

## When to Use

- Before committing a feature branch
- After completing an epic or user story
- When preparing a PR for review

## Process

### 1. Get Changed Lines Only

Review only the diff, not entire files:

```bash
# Get list of changed files (excluding generated files and unit tests, but INCLUDING playwright-tests)
git diff origin/develop --name-only | grep -E '\.(ts|tsx|scss)$' | grep -v '__tests__' | grep -v 'generated' | grep -v '\.d\.ts'

# For each file, review only the changed lines
git diff origin/develop -- <file>
```

**Important:**

- Only flag issues in lines that were actually changed in this branch
- **Include `apps/playwright-tests/`** - E2E tests should be reviewed for code quality
- Exclude `__tests__/` folders (unit tests) and generated files

### 2. Apply Checklist to Changed Lines

For each changed line, check against [Code Review Checklist](../../packages/@scheduling/code-review/REVIEW_CHECKLIST.md):

| Category   | What to Check                            |
| ---------- | ---------------------------------------- |
| TypeScript | No `any`, no enums, proper null handling |
| Naming     | Constants in SCREAMING_SNAKE_CASE        |
| CSS        | No `!important`, use Forge constants     |
| React      | All useEffect dependencies listed        |
| Functions  | Max 3 params, no rogue booleans          |
| Logging    | No console.log in production             |

### 3. Create Review File

Save findings to `packages/@scheduling/code-review/reviews/<branch>-<date>.md`:

```bash
# Get branch name and date for filename
BRANCH=$(git rev-parse --abbrev-ref HEAD)
DATE=$(date +%Y-%m-%d)
# Example: packages/@scheduling/code-review/reviews/room-draft-2026-01-28.md
```

Use this format:

```markdown
# Code Review: <Feature Name>

**Date:** YYYY-MM-DD
**Reviewer:** AI Agent (Claude Opus 4.5 via Augment)
**On Behalf Of:** <!-- Add your name here -->
**Branch:** <branch-name> (vs origin/develop)

## Summary

- Files with changes: X
- Issues found: Y (Z critical)

## Critical Issues

- [ ] **file.ts:123** - Description
  - Fix: Suggested change

## Suggestions

- [ ] **file.ts:456** - Description
  - Consider: Alternative approach

## Passed Checks

| Category            | Status |
| ------------------- | ------ |
| No console.log      | ✅/❌  |
| No TypeScript enums | ✅/❌  |
| ...                 | ...    |
```

### 4. User Reviews Issues

The user can:

1. Open the review file in `packages/@scheduling/code-review/reviews/`
2. Fill in their name in "On Behalf Of"
3. Check off items as they fix them
4. Commit the review file with the PR for documentation

## Example Usage

```
Agent, run the pre-commit review skill
```

The agent will:

1. Get the diff of changed files
2. Review only changed lines against the checklist
3. Create review file in `packages/@scheduling/code-review/reviews/`
