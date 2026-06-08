# lib/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

Minimal cross-cutting utilities — no domain logic.

## Do

- Keep functions small and side-effect free
- Use `cn()` for Tailwind class merge (`clsx` + `tailwind-merge`)
- Put env flags like `IS_DEV` in `envs.ts`
- Add here only what is used in 3+ places with no clear domain

## Don't

- Put game, store, or i18n logic here
- Add a new file for a single-use helper — inline at the call site
- Pull in heavy dependencies
- Create barrel `index.ts` files

## Patterns

- One file per concern (`cn.ts`, `envs.ts`)
- Imports: `@/lib/cn`, `@/lib/envs`

## Key files

| File | Role |
|------|------|
| `cn.ts` | `cn(...inputs)` — className merge |
| `envs.ts` | `IS_DEV` and environment constants |

## Neighbors

- Reads from: npm packages only
- Consumed by: `components/`, `app/`

## Evolution

- 2026-06-07 — Initial docs: cn + envs
