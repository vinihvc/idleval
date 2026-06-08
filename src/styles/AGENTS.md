# styles/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

Global CSS — theme tokens, fonts, and Tailwind v4 variables.

## Do

- Define tokens in `@theme inline` inside `globals.css`
- Use CSS variables (`--background`, `--primary`, etc.) referenced in `@theme`
- Import fonts via `@fontsource/*` at the top of the file
- Use `@custom-variant dark` for dark mode
- Reference tokens in components via Tailwind classes (`bg-background`, `text-primary`)

## Don't

- Put component-specific styles here — use `className` + `tv()` in components
- Hardcode colors in TSX when a token exists
- Edit `tw-animate-css` — external package
- Add CSS modules in this folder

## Patterns

- Single file: `globals.css`
- Fonts: Jersey 10 (numbers), Almendra (display), Grenze Gotisch (sans)
- Dark mode via `.dark` class on an ancestor

## Key files

| File | Role |
|------|------|
| `globals.css` | Imports, `@theme`, variables, base styles |

## Neighbors

- Reads from: `@fontsource/*`, `tailwindcss`, `tw-animate-css`
- Consumed by: `main.tsx` (global import)

## Evolution

- 2026-06-07 — Initial docs: globals.css + Tailwind v4 tokens
