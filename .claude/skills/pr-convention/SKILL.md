---
name: pr-convention
description: Use this skill when creating, reviewing, or suggesting pull request titles and descriptions for this repository.
---

# PR Convention

This repository uses clear PR titles and detailed PR bodies. A PR should explain the work well enough that it can be reviewed later without reconstructing intent from the diff alone.

## Title

Use a short English title with a conventional prefix:

```txt
[Feature] Add image watermark tool
[Fix] Preserve locale when switching tools
[Improvement] Move shared tool styles into components
[Refactor] Convert shared components to PascalCase files
[Docs] Update setup instructions
[Chore] Refresh generated metadata
```

## Title Rules

- Write in English.
- Use a readable prefix: `[Feature]`, `[Fix]`, `[Improvement]`, `[Refactor]`, `[Docs]`, `[Test]`, `[Chore]`, `[Build]`, or `[CI]`.
- Keep the title concise and concrete.
- Describe the resulting behavior or project state, not the file operation.
- Do not end the title with a period.
- Prefer one clear purpose per PR.

## Body Format

Use this body format:

```md
## Summary
- What changed at a high level.
- Why the change is needed.

## Changes
- Detailed implementation change.
- Related UI, copy, test, config, or data update.
- Any important migration or compatibility note.

## Validation
- `pnpm exec eslint`
- `pnpm exec tsc --noEmit`
- `pnpm test --runInBand`
- `pnpm build`

## Issues
- Refs #123
```

## Body Rules

- Write the body in English.
- Include a detailed `Summary` and `Changes` section for normal implementation PRs.
- Include validation commands that were actually run.
- If validation was not run, say so directly and explain why.
- Reference related issues with `Refs #123`, `Closes #123`, or `Fixes #123`.
- Use `Closes` or `Fixes` only when the PR fully resolves the issue.
- Keep unrelated work out of the PR body; split unrelated changes into separate PRs.
- Mention user-facing behavior, design changes, API changes, and testing impact when relevant.

## Small PRs

For very small docs, typo, or metadata-only PRs, this shorter format is acceptable:

```md
## Summary
- Update the relevant documentation or metadata.

## Validation
- Not run; documentation-only change.
```

## Examples

```md
[Improvement] Move tool layout styles into shared components

## Summary
- Replace global CSS component classes with shared UI components and style constants.
- Keep global CSS focused on Tailwind tokens, theme variables, and base element styling.

## Changes
- Add shared page shell and tool UI components.
- Update home, legal, breadcrumb, and image tool screens to use component-level styles.
- Adjust tests that previously depended on global CSS class names.

## Validation
- `pnpm exec eslint`
- `pnpm exec tsc --noEmit`
- `pnpm test --runInBand`
- `pnpm build`

## Issues
- Refs #12
```

```md
[Feature] Add timestamp converter

## Summary
- Add a local browser tool for converting Unix timestamps to readable dates.
- Support both seconds and milliseconds inputs.

## Changes
- Add timestamp parsing and formatting utilities.
- Add a tool page with UTC and local time outputs.
- Add copy actions and invalid input states.

## Validation
- `pnpm exec eslint`
- `pnpm exec tsc --noEmit`
- `pnpm test --runInBand`

## Issues
- Closes #4
```

## Pre-PR Checklist

Before proposing or creating a PR:

1. Inspect the diff and confirm the PR has one primary purpose.
2. Pick the correct title prefix.
3. Write a concise title.
4. Fill in detailed `Summary` and `Changes` sections.
5. Add issue references when relevant.
6. Run appropriate validation and list only what actually ran.
7. Call out any known limitation, skipped validation, or follow-up work.
