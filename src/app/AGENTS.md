# app/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

SPA entry point — game shell composition and provider tree.

## Do

- Keep `page.tsx` as a thin orchestrator (layout + imports from `components/`)
- Chain providers in `providers.tsx` in order: Store → Sound → Offline → I18n (innermost, so locale remounts UI only)
- Use `IS_DEV` from `@/lib/envs` for debug flags
- Delegate game logic to `store/`, `hooks/`, and `providers/`

## Don't

- Put economy, purchase, or production logic here
- Keep local state that belongs in the Jotai store
- Hardcode strings — use `m[]()` via child components
- Add providers without wiring them in `providers.tsx` in the correct order

## Patterns

- `export const HomePage` (named export)
- Imports via `@/` alias
- `Providers` wraps the full tree in `page.tsx`

## Key files

| File | Role |
|------|------|
| `page.tsx` | Composition: GameShell, GamePanel, Header, FactoryGrid, nav, Footer, WelcomeDialog |
| `providers.tsx` | Application provider stack |

## Neighbors

- Reads from: `components/`, `hooks/`, `lib/`, `providers/`
- Consumed by: `main.tsx`

## Evolution

- 2026-06-07 — I18nProvider innermost so `key={locale}` remounts page without resetting scheduler/sound
- 2026-06-07 — Initial docs: entry + provider stack
