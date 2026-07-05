---
name: commit-convention
description: Use this skill when creating, reviewing, or suggesting commit messages for this repository.
---

# Commit Convention

This repository uses Conventional Commits with a concise title and a detailed body.

## Format

Use this format:

```txt
<type>: <summary>

<detailed body>
```

Use a scope only when it adds useful clarity:

```txt
<type>(<scope>): <summary>

<detailed body>
```

The title is required. The body is also required for normal commits and should describe the actual work in enough detail that the commit can be understood later without opening the full diff.

## Types

- `feat`: user-visible feature or capability
- `fix`: bug fix or incorrect behavior correction
- `docs`: documentation-only change
- `style`: visual styling, copy polish, formatting-only UI change, or CSS-only appearance change
- `refactor`: code structure change without behavior change
- `test`: test-only change or test infrastructure
- `chore`: maintenance, config, dependency, generated metadata, or repository hygiene
- `perf`: performance improvement
- `build`: build system, packaging, or bundler change
- `ci`: CI workflow or automation change

## Summary Rules

- Write in English.
- Use imperative mood when natural.
- Keep the summary under 72 characters when possible.
- Start the summary lowercase unless it begins with a proper noun.
- Do not end with a period.
- Be concrete about the changed behavior.
- Avoid vague summaries such as `update files`, `fix bug`, or `cleanup`.

## Body Rules

- Write the body in English.
- Add a blank line between the title and body.
- Describe what changed and why it changed.
- Include important implementation details, affected areas, and user-facing impact.
- Mention related issue numbers when applicable, using `Refs #123` or `Closes #123`.
- Mention validation only when it is part of the commit context; detailed test output can stay outside the commit message.
- Use bullets when multiple areas changed.
- Do not leave the body empty for implementation commits.
- A body may be omitted only for truly trivial metadata or typo-only commits.

Recommended body shape:

```txt
- Explain the main code or behavior change.
- Note any related UI, copy, test, or data updates.
- Include issue linkage when relevant, such as Refs #12.
```

## Scope Rules

Prefer no scope for small changes.

Use a scope when the change is clearly isolated to one area, for example:

```txt
feat(image-compressor): add target size mode
fix(theme): persist selected color mode
test(image-resizer): cover aspect-ratio resizing
docs(readme): describe placeholder image API
```

## Splitting Commits

If changes cover unrelated purposes, split them into separate commits.

Good split:

```txt
feat(theme): add light and dark mode toggle

- Add the theme switcher to the shared layout.
- Persist the selected theme in local storage.

test(theme): cover persisted theme selection

- Add coverage for saved dark and light mode preferences.
- Mock color-scheme detection for deterministic assertions.
```

Accept a single commit when tests directly support the same feature:

```txt
feat(theme): add persisted light mode toggle

- Add the theme switcher and local storage persistence.
- Cover stored preference and system preference fallback in tests.
```

## Breaking Changes

For breaking changes, use `!` and add a short body:

```txt
feat(api)!: change placeholder route parameter format

BREAKING CHANGE: placeholder dimensions now require WIDTHxHEIGHT syntax.

- Update placeholder request parsing to reject legacy formats.
- Adjust route tests for the new required syntax.
```

## Examples From This Repository

Valid examples:

```txt
fix: mismatched border width made the light-mode accent edge look broken

- Align the light-mode accent border width with the dark theme.
- Keep the existing color tokens and hover behavior unchanged.

style: make light mode read as a dev tool, not a generic SaaS page

- Replace the soft palette with stronger terminal-inspired contrast.
- Adjust panel, border, and accent colors for better hierarchy.

feat: surface the placeholder embed URL on the dummy image tool page

- Add embed URL copy to the dummy image tool SEO section.
- Document supported dimensions and image formats.

docs: write README covering the tools and placeholder embed API

- Document the current image tools and local-processing behavior.
- Add placeholder API examples for direct image embedding.

chore: add gstack skill routing rules to CLAUDE.md

- Route stacked-branch workflows to the gstack skill.
- Keep the existing repository guidance intact.
```

## Pre-Commit Checklist

Before proposing or creating a commit:

1. Inspect the staged diff.
2. Identify the primary user-visible purpose.
3. Pick the narrowest valid type.
4. Add a scope only if it improves clarity.
5. Confirm the title describes the resulting behavior, not the file operation.
6. Write a detailed body explaining what changed and why.
7. Add issue references in the body when relevant.
8. Mention validation results separately from the commit title.
