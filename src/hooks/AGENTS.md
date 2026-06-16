# hooks/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

Shared React hooks used by multiple modules. Hooks with a single consumer live next to that consumer (component folder, `providers/*`, or `app/`).

## Do

- Prefix with `use` (`useHoldPress`, `useLiveAnnouncer`)
- Colocate hooks used by one consumer — see `components/`, `providers/offline-earning/`, `app/use-context-menu.ts`
- Use `store.get` / `store.set` via `@/providers/store` when outside React
- Put long-lived global effects in `providers/` when appropriate

## Don't

- Duplicate `game/` rules — call functions from there
- Own persisted state — use `store/` atoms
- Call hooks conditionally (violates rules of hooks)
- Return JSX — hooks return data/effects only (except `use-live-announcer.tsx`, shared across dialogs)

## Patterns

- `use-*.ts` in this folder only when **two or more** unrelated consumers import it
- Pure sync modules colocate with their hook (e.g. `providers/offline-earning/production-scheduler-sync.ts`)

## Key files

| File | Role |
|------|------|
| `use-install-prompt.ts` | PWA install prompt + iOS Safari instructions (`main.tsx` + settings) |
| `use-hold-press.ts` | Hold-to-confirm input (`hold-button`, domain cards) |
| `use-live-announcer.tsx` | Screen-reader claim/purchase announcements (multiple dialogs) |

## Neighbors

- Reads from: `store/`, `game/`, `content/`
- Consumed by: `providers/`, `components/`, `app/`

## Evolution

- 2026-06-14 — Single-consumer hooks colocated with components, `providers/offline-earning/`, and `app/`
- 2026-06-14 — `use-install-prompt` adds iOS Safari install instructions and test reset helpers
- 2026-06-08 — Renamed offline modules to singular `use-offline-earning` (now under `providers/offline-earning/`)
- 2026-06-07 — Initial docs: scheduler + session sync + pure modules
