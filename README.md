# oddkit

Small browser-based toolkit for design, development, and content workflows. All tools run entirely in-browser with zero server-side processing.

**Website:** https://oddkit.tools

## Features

- **100% Client-Side Processing** — No file uploads, no server storage
- **Fast & Lightweight** — Instant results, minimal dependencies
- **Multilingual** — English, Korean, Japanese, Simplified Chinese, Traditional Chinese, Spanish
- **SEO & Analytics** — Structured metadata, Google Analytics tracking

## Tools

### Dummy Image Generator
Create placeholder images on-the-fly
- Solid colors, gradients, and patterns
- Output formats: PNG, JPG, JPEG, WebP, SVG, GIF
- Configurable dimensions and styling

### Image Compressor
Reduce file sizes without losing quality
- Supports JPG, PNG, WebP
- Manual quality adjustment or automatic target-size compression
- Dimension constraints to reduce file size further

### Image Converter
Convert between image formats
- Supports JPG, PNG, WebP
- Per-format quality control
- Preserves image dimensions

### Image Resizer
Resize images precisely or by preset
- Exact dimensions or percentage presets (50%, 100%, 150%, 200%)
- Aspect ratio preservation
- Format and quality options

## Placeholder Images API

A locale-neutral endpoint that renders placeholder images directly into any `<img>` tag, README, or mockup:

```md
https://oddkit.tools/placeholder/600x400.png
https://oddkit.tools/placeholder/1080x1080.webp
https://oddkit.tools/placeholder/300x200.jpg
```

**Specification:**
- Size: `{width}x{height}`, 1–4000px per side
- Formats: `png`, `jpg`, `webp`
- Server-rendered using the same engine as the Dummy Image Generator tool
- Immutable, long-lived `Cache-Control` headers
- Graceful fallback if rendering fails

## Analytics

Usage metrics are tracked via Google Analytics to understand tool adoption and patterns:

- **tool_opened** — Tool page visits
- **tool_action** — Primary tool actions (generate, convert, compress, resize)
- **file_upload** — File uploads with size and type
- **download** — Generated/processed file downloads with size and format
- **error** — Processing errors by type
- **feature_preference** — Feature usage patterns (compression mode, resize presets)

All tracking is client-side only. No data is sent to the server during tool use.

## Tech Stack

**Frontend**
- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4

**Internationalization**
- next-intl with 6 locales

**Image Processing**
- Canvas API (client-side rendering)
- sharp (server-side rendering for placeholder API)

**Analytics & Monitoring**
- react-ga4 (Google Analytics)

**Testing & Quality**
- Jest
- ESLint

## Getting Started

```bash
pnpm install
pnpm dev
```

The development server runs at `http://localhost:3000` by default.

## Scripts

```bash
pnpm dev      # Start the development server
pnpm build    # Create a production build
pnpm start    # Start the production server
pnpm lint     # Run ESLint
pnpm test     # Run Jest
```

## Architecture

### File Structure
```txt
src/
  app/              # Routes and layouts (Next.js App Router)
  config/           # Site config, locales, feature flags
  features/         # Feature modules (one per tool)
    tools/
      [tool-id]/
        components/ # Interactive UI
        lib/        # Processing logic
        model/      # Types and constants
  shared/           # Reusable UI, layouts, utilities
    analytics/      # GA tracking helpers
    seo/            # Metadata generators
    ui/             # Shared components
  i18n/             # Locale routing and navigation
  messages/         # i18n translation files
  proxy.ts          # next-intl middleware
```

### Development Guidelines
- Before editing Next.js code, read `AGENTS.md` and check `node_modules/next/dist/docs/`
- All tools should prefer client-side processing (no server uploads)
- Add new tools by creating a feature module and registering in `src/features/tools/catalog.ts`
- Update all locale message files when adding user-facing text

## Contributing

See `CLAUDE.md` for development guidance and conventions.
