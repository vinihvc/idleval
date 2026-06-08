# hooks/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

React hooks that connect browser lifecycle to the store and game logic.

## Do

- Prefix with `use` (`useSessionSync`, `useProductionScheduler`)
- Keep sync logic testable in pure modules (`production-scheduler-sync.ts`)
- Use `store.get` / `store.set` via `@/providers/store` when outside React
- Test pure sync in `*.test.ts` without RTL
- Put long-lived global effects in `providers/` when appropriate

## Don't

- Duplicate `game/` rules — call functions from there
- Own persisted state — use `store/` atoms
- Call hooks conditionally (violates rules of hooks)
- Return JSX — hooks return data/effects only

## Patterns

- `use-*.ts` for React hooks; sync modules without the prefix
- Tests: colocated sync modules; `use-session-sync.test.ts` for light integration

## Key files

| File | Role |
|------|------|
| `use-production-scheduler.ts` | Per-factory production tick |
| `production-scheduler-sync.ts` | Pure tick sync + offline progress |
| `use-session-sync.ts` | `lastSeenAt` persistence, offline detection |
| `use-context-menu.ts` | Disable context menu in production |
| `use-countdown.ts`, `use-interval.ts` | Timing utilities |

## Neighbors

- Reads from: `store/`, `game/`, `content/`
- Consumed by: `providers/`, `components/`, `app/`

## Evolution

- 2026-06-07 — Initial docs: scheduler + session sync + pure modules
