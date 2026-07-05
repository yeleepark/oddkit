# oddkit Design Guide — Terminal

A developer tool monospace system. Expresses the nature of "odd but useful toolkit" through terminal prompts, monospace fonts, and acid green accents. Dark theme by default with **first-class light theme support** (header theme toggle, `prefers-color-scheme` detection, `localStorage` persistence).

> Tone: tech/mono / neutral + one accent color / light wit in microcopy.

---

## 1. Color

Colors are defined as CSS custom properties (`--theme-*`) and switched via `<html data-theme="dark|light">`. Tailwind's `@theme` directive maps `--color-*` utilities to these variables (`bg-ink`, `text-acid`, `border-line`, etc.).

### Dark (Default)

| Token         | Value                    | Usage                              |
| ------------- | ------------------------ | ---------------------------------- |
| `ink`         | `#0c0e0c`                | Primary background                 |
| `ink-deep`    | `#07080a`                | Text/icons on acid green           |
| `panel`       | `#0f120f`                | Input fields, empty preview state  |
| `acid`        | `#8ee66b`                | Accent (green) — single color only |
| `acid-hover`  | `#12160f`                | Card hover background              |
| `text-main`   | `#e9ebe4`                | Body text                          |
| `text-sub`    | `#c3c8bb`                | Secondary text (chip labels, etc.) |
| `mist`        | `#8a8f83`                | Descriptions, captions             |
| `faint`       | `#5a5f52`                | Prompts, annotations, disabled     |
| `line`        | `rgba(255,255,255,0.07)` | Dividers, card borders             |
| `line-strong` | `rgba(255,255,255,0.14)` | Input borders                      |
| `error`       | `#f87171`                | Error text                         |

### Light

| Token         | Value                 |
| ------------- | --------------------- |
| `ink`         | `#f7f8f1`             |
| `ink-deep`    | `#ffffff`             |
| `panel`       | `#ffffff`             |
| `acid`        | `#2d7f32`             |
| `acid-hover`  | `#edf5e9`             |
| `text-main`   | `#11140f`             |
| `text-sub`    | `#30372c`             |
| `mist`        | `#5f6958`             |
| `faint`       | `#87917d`             |
| `line`        | `rgba(17,20,15,0.14)` |
| `line-strong` | `rgba(17,20,15,0.32)` |
| `error`       | `#dc2626`             |

**Rules**

- Use green as the only accent color. Establish hierarchy through gray tonal values.
- Text/icons on `acid` must use `ink-deep`. In light theme, `acid` is dark green, so `ink-deep` becomes white (WCAG AA contrast).
- Background: very subtle dot grid via `radial-gradient(var(--theme-grid) 1px, transparent 1px)` with `32px 32px` spacing. `--theme-grid` varies by theme.
- Light theme adds subtle shadows (`--theme-shadow`); dark uses `none`. Apply to cards, inputs, previews via `shadow-[var(--theme-shadow)]` helper.

---

## 2. Typography

- **Body/Headings**: Geist (`--font-sans`)
- **Labels, prompts, numerals, tags**: Geist Mono (`--font-mono`) — all "mechanical" UI parts use mono.

| Role                             | Size                       | Weight  | Notes                 |
| -------------------------------- | -------------------------- | ------- | --------------------- |
| Hero heading                     | 42px (mobile) / 56px (sm+) | 600     | `leading-[0.98]`      |
| Tool heading (H1)                | 30px                       | 600     | —                     |
| Card heading                     | 20px (`text-xl`)           | 600     | —                     |
| Body text                        | 16.5px                     | 400     | Hero description      |
| Caption                          | 13.5–14.5px                | 400     | Card/tool description |
| Label (mono, uppercase)          | 11px                       | 500     | `uppercase`           |
| Prompt/caption/breadcrumb (mono) | 12px (`text-xs`)           | 400–500 | —                     |

Cursor: use `▮` glyph after logo with `blink 1.1s step-end infinite`.

---

## 3. Layout

- Content max-width: **1180px**, horizontal padding 24px (mobile) / 32px (sm+).
- Header: `sticky top-0`, `backdrop-blur-md`, semi-transparent bg (`bg-ink/80`), bottom `1px` divider. Right side: language switcher + theme toggle.
- Home hero: prompt line (`~/oddkit $ ls tools # {count} tools`) → title (`max-w-3xl`) → one-line description.
- Tool screens: 1-column stack on mobile; 2-column grid on `md+` with **left controls / right preview** (`1fr 1.05fr`, gap 48px).
- Tool screen header: breadcrumb `~/oddkit / <current tool ▾>` — dropdown to switch tools directly (not a fixed "← back" link).

---

## 4. Components

### Tool Card (Home Grid)

- Mobile: 1 column; `sm+`: 2-column grid, `gap-px`, container bg `line` creates hairlines between cards.
- Container: `border-radius: 14px; overflow: hidden`. Individual cards round outer corners only to align with container.
- **Hover**: bg `acid-hover`, `outline: 1px solid rgba(142,230,107,0.5)` (offset -1px), number → `acid`, `·` → `→`.
- Card interior: (number · `·`/`→`) / title (H2) / description / `#tags` (mono, faint).

### Chip / Segment (Type, Preset, Mode, Format Selection)

Generated by `toolChipClassName()` helper. Padding `16px 8px` (`px-4 py-2`), radius `6px` (`rounded-md`), mono 12px.

- **Active**: `border-acid bg-acid font-semibold text-ink-deep`.
- **Inactive**: `border-line-strong text-text-sub`, hover: `border-acid/70 text-acid`.
- **Outline Active**: no background, `border-acid text-acid` (e.g., size preset buttons).

### Input / Number Field / Select

- Common: `background: panel; border: 1px solid line-strong; radius: 6px`, mono font, focus: `border-acid`.
- `<select>`: height `h-10`, hover: `border-acid/70`.

### Slider

- Track: `4px`, `--theme-range-track`; fill + knob (14px circle): `acid`.

### Button

- **Primary** (`toolPrimaryClassName`): `background: acid; color: ink-deep; font-weight: 600`, mono, radius `8px` (`rounded-lg`), padding `16px 12px`. Hover: background inverts to `text-main`. `disabled`: 50% opacity + disabled cursor.
- **Secondary** (`toolSecondaryClassName`, e.g., download confirm): opposite — `background: text-main` + `ink-deep` text. Hover: background `acid`.

### File Upload

- **Custom dropzone avoided** — style native `<input type="file">` instead (`toolFileClassName`).
- Container: `border: 1px dashed line-strong`, `panel` background, radius `10px`, padding `20px` (`p-5`).
- File button (`::file-selector-button`): acid background + ink-deep text, pill-button style.

### Result Stat Panel (`ToolStatGrid` / `ToolStat`)

- `sm+`: 2-column grid (`gap-3`); item count varies per tool (not fixed 2×2).
- Each cell: `border: 1px solid line`, radius `8px` (`rounded-lg`).
- Label: mono 10px `uppercase` faint / value: `font-semibold text-main`.

---

## 5. Microcopy (Light Wit)

Stored per-locale in `src/messages/*.json`. English (`en.json`) examples:

- Prompt comment: `~/oddkit $ ls tools # {count} browser tools`
- Hero: "Small toolkit for makers."
- Hero description: "Useful tools that come in handy, all in one place."
- Footer: "oddkit — work in the browser, no server needed."
- Preview caption trust note: "· no server upload" (`common.noServerUpload`).

Tone rules: Keep descriptions short and understated. Drop one light joke at the end per screen, never overdo it. When adding copy, update all six locales: `en`, `ko`, `ja`, `zh-CN`, `zh-TW`, `es`.

---

## 6. Implementation

- Theme tokens: `src/app/globals.css` (`@theme` + `:root[data-theme]`)
- Layout/header/fonts: `src/app/[locale]/layout.tsx`
- Reusable UI: `src/shared/ui/` (`ToolCard`, `ToolUI`, style helpers in `styles.ts` for chips/buttons/inputs), `src/shared/layout/` (`ThemeToggle`, `LocaleSwitcher`, `Footer`)
- Tool catalog: `src/features/tools/catalog.ts`

New components must reuse helpers and `--color-*` utilities instead of hardcoding color, typography, or spacing values.
