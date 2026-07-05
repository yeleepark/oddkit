# oddkit

Small browser-based tools for design, development, and content workflows.

Website: https://oddkit.tools

## Current Tools

- Dummy Image Generator
  - Create solid, gradient, and pattern images
  - Download as PNG, JPG, JPEG, WebP, SVG, or GIF
  - Runs entirely in the browser
- Image Compressor
  - Reduce JPG, PNG, and WebP file sizes
  - Adjust quality, maximum dimensions, and output format
  - Runs entirely in the browser
- Image Converter
  - Convert images between JPG, PNG, and WebP
  - Adjust output quality for JPG and WebP
  - Runs entirely in the browser
- Image Resizer
  - Resize images by exact dimensions or percentage presets
  - Keep aspect ratio and choose the output format
  - Runs entirely in the browser

## Embeddable Placeholder Images

A locale-neutral, no-auth endpoint that renders a placeholder image directly, so it can be dropped into any `<img>` tag, README, or mockup:

```md
https://oddkit.tools/placeholder/600x400.png
https://oddkit.tools/placeholder/1080x1080.webp
https://oddkit.tools/placeholder/300x200.jpg
```

- Size: `{width}x{height}`, 1–4000px on each side
- Format: `png`, `jpg`, or `webp`
- Rendered server-side from the same generator the Dummy Image Generator tool uses, so output matches between the interactive tool and the embed URL
- Long-lived, immutable `Cache-Control` — repeat requests for the same URL are served from cache, not re-rendered
- Falls back to a plain placeholder image (never a bare error) if rendering fails for a given request

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- next-intl
- sharp
- Jest

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

## Project Structure

```txt
src/
  app/          # Next.js App Router routes and layouts
                # (app/placeholder/[dimensions]/ is locale-neutral, excluded from proxy.ts)
  config/       # Site, locale, and app-level configuration
  features/     # Feature modules
  shared/       # Shared UI, layout, and SEO utilities
  i18n/         # Locale routing and navigation helpers
  messages/     # Translation messages
  types/        # Global type declarations
  proxy.ts      # next-intl locale middleware
```

Before changing Next.js code, follow `AGENTS.md` and check the local Next.js docs in `node_modules/next/dist/docs/`.
