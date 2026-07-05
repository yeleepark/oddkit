# CLAUDE.md

Guidance for Claude Code and other coding agents working in this repository.

## First Rule

Read and follow `AGENTS.md` before changing Next.js code.

This project uses Next.js 16, which may differ from older Next.js conventions. Before editing App Router, metadata, proxy, route handlers, or file conventions, check the relevant local docs in:

```txt
node_modules/next/dist/docs/
```

## Product

oddkit is a browser-based toolkit for small design, development, and content workflows.

- Public domain: `https://oddkit.tools`
- Current tool: Dummy Image Generator
- Future work will add more tools
- Prefer client-side processing for tools when possible

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS v4
- next-intl
- Jest
- pnpm

## Architecture

Keep `src/app` focused on routing, layouts, metadata, and Next.js special files.

Feature code belongs under:

```txt
src/features/
```

Shared app-wide code belongs under:

```txt
src/shared/
src/config/
src/i18n/
src/messages/
```

Use absolute imports with `@/...`. Do not add new relative imports between source modules.

## Adding a New Tool

Create a feature module:

```txt
src/features/tools/<tool-id>/
  components/
  lib/
  model/
  __tests__/
  index.ts
```

Create the route:

```txt
src/app/[locale]/tools/<tool-id>/page.tsx
```

The route page should stay thin. Put interactive state and UI composition in a feature component.

Update:

- `src/features/tools/catalog.ts`
- every locale file in `src/messages/*.json`
- sitemap/SEO behavior if the tool should be indexed
- tests for non-trivial logic

## Tool Catalog

All public tools must be registered in:

```txt
src/features/tools/catalog.ts
```

The home page reads from this catalog. Do not hard-code tool cards directly inside the home page.

## i18n

Supported locales are centralized in:

```txt
src/config/locales.ts
```

Locale routing is wired through:

```txt
src/i18n/routing.ts
src/i18n/navigation.ts
src/i18n/request.ts
src/proxy.ts
```

When adding user-facing text, update all message files:

```txt
src/messages/en.json
src/messages/ko.json
src/messages/ja.json
src/messages/zh-CN.json
src/messages/zh-TW.json
src/messages/es.json
```

## SEO and GEO

SEO/GEO utilities are centralized in:

```txt
src/shared/seo/
```

Site-level config lives in:

```txt
src/config/site.ts
```

For every indexable tool page:

- Add localized `generateMetadata`
- Set canonical URL and language alternates
- Add Open Graph and Twitter metadata
- Add JSON-LD with `JsonLd`
- Include concise crawlable text explaining what the tool does
- Add FAQ content when it helps AI/search systems understand the page

The domain should be `https://oddkit.tools`. Use `SITE_CONFIG.url` or `NEXT_PUBLIC_SITE_URL`, never hard-code another domain.

Do not make `src/proxy.ts` matcher dynamic. Next statically analyzes proxy matcher constants.

## Current SEO Files

```txt
src/app/sitemap.ts
src/app/robots.ts
src/app/llms.txt/route.ts
```

Keep these aligned with the tool catalog and site config.

## UI Guidelines

- Keep interfaces quiet, utilitarian, and tool-focused.
- Do not make marketing landing pages for tools. The usable tool should be the primary screen.
- Use Tailwind CSS v4 only. Do not introduce a UI library unless explicitly requested.
- Keep reusable UI in `src/shared/ui`.
- Keep feature-specific UI inside the feature module.
- Avoid deeply nested cards and decorative gradients.

## Public Assets

Only keep assets that are used.

Current public asset:

```txt
public/gif.worker.js
```

It is required by GIF generation. Do not delete it unless GIF support is removed.

App icons live in:

```txt
src/app/favicon.ico
src/app/icon.svg
```

## Validation

After code changes, run:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test --runInBand
pnpm build
```

For documentation-only changes, tests are not required.

`tsconfig.tsbuildinfo` is a generated cache file. Do not commit it.

## Git Hygiene

- Do not revert unrelated user changes.
- Keep changes scoped to the requested work.
- Remove unused scaffold files and unused assets.
- Preserve existing config files unless there is a clear reason to change them.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Commit message/commit convention → invoke `.claude/skills/commit-convention/SKILL.md`
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
