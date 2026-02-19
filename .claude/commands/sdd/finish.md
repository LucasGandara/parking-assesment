---
description: Close change set and sync specs
argument-hint: <change-set-name>
---

# Finish

Close change set and sync change-set specs to canonical.

## Arguments

- `$ARGUMENTS` - Change set name

## Instructions

> **SDD Process**: Read `.augment/skills/sdd-state-management.md` for state management guidance.

> **Spec Format**: Use guidance from `.augment/skills/spec-format.md` (project-local) or `~/.augment/skills/spec-format.md` (global) for spec structure.

### Setup

1. Read `changes/<name>/state.md`

### Entry Check

Apply state entry check logic from `.augment/skills/sdd-state-management.md`.

Verify prerequisites: Reconciliation complete (phase `reconcile`, status `complete`).

### Stage 1: Sync Preview (Required)

If `changes/<name>/specs/` exists (created/updated during reconcile):

1. Enumerate all spec files under `changes/<name>/specs/`.
2. For each spec file, read its required YAML frontmatter:

```markdown
---
kind: new | delta
---
```

3. Present a **sync plan preview** to the user (before making any changes):
   - Source: `changes/<name>/specs/<path>.md`
   - Kind: `new` or `delta`
   - Target canonical path: `apps/documentation/docs/specs/<path>.md`
   - For `kind: delta`: confirm the target canonical spec exists and call out what sections you plan to add/modify/remove.

4. Call out blockers requiring user decisions:
   - Missing target canonical spec for `kind: delta`
   - Ambiguous `Before/After` matches
   - Any uncertainty about intent or boundaries

You MUST WAIT for the user to explicitly approve the sync plan before applying any spec changes.

### Stage 2: Apply Sync (After Approval)

Only after the user explicitly approves the sync plan:

- **`kind: new`**: copy/move spec content into `apps/documentation/docs/specs/` at same relative path.
- **`kind: delta`**: merge delta into existing spec in `apps/documentation/docs/specs/`.
  - Apply `### ADDED / ### MODIFIED / ### REMOVED` buckets (topics under `####`).
  - MODIFIED uses adjacent `Before/After` to locate and update text.

Verify specs in documentation folder reflect intended changes.

**Note:** Delta merging will eventually be automated; for now apply merges carefully and review results with user.

### Stage 3: Update Documentation Sidebar

After specs are merged into `apps/documentation/docs/specs/`:

1. Review the merged spec files to identify any new specs that need to be added to the documentation sidebar.
2. Open `apps/documentation/sidebars.ts` and locate the `📋 Specifications` section (around line 67-104).
3. For each new spec file merged:
   - Determine the appropriate category (e.g., 'GraphQL API', 'Schedule Builder', etc.)
   - Add the spec path to the `items` array in the correct category
   - Use the path relative to `apps/documentation/docs/` without the `.md` extension
   - Example: `'specs/graphql-api/new-spec-name'`
4. Maintain alphabetical ordering within each category where appropriate.
5. For nested categories (e.g., under 'ASC Management' > 'Room Schedule Management'), ensure the hierarchy matches the directory structure.
6. Verify the sidebar structure is valid TypeScript and follows the existing pattern.

**Example sidebar entry:**

```typescript
{
  type: 'category',
  label: 'GraphQL API',
  items: [
    'specs/graphql-api/index',
    'specs/graphql-api/apply-room-schedules',  // existing
    'specs/graphql-api/get-room-schedules',    // existing
    'specs/graphql-api/new-spec-name',         // newly added
  ],
}
```

### Stage 4: Update State

Update `changes/<name>/state.md`:

```markdown
## Phase

complete

## Phase Status

complete
```

Add completion timestamp to notes or leave empty.

### Stage 5: Cleanup Options (Separate Approval)

Discuss cleanup preference with user. Approval to sync specs does NOT imply approval to clean up artifacts.

1. **Keep all artifacts**: Leave `changes/<name>/` intact for history
2. **Archive**: Move to `changes/archive/<name>/`
3. **Remove**: Delete `changes/<name>/` (change-set specs already synced)

Only proceed with cleanup after user explicitly chooses an option.

### Summary Report

Provide completion summary:

- What was accomplished
- Files changed
- Specs added/modified/removed (if specs were created)
- Sidebar entries added (if new specs were added to documentation)
- Any notes or follow-up items
