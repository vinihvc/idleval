# src/

> Parent: [AGENTS.md](../AGENTS.md) (Ultracite) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

Application source for Idleval — a Viking idle game with separated layers (content → game → store → components).

## Folder map

| Folder | AGENTS.md | Role |
|--------|-----------|------|
| [app/](app/AGENTS.md) | Entry, providers, page composition |
| [audio/](audio/AGENTS.md) | Sound engine, SFX registry |
| [components/](components/AGENTS.md) | UI, dialogs, layout, debug |
| [content/](content/AGENTS.md) | Static catalog (factories, gods) |
| [game/](game/AGENTS.md) | Pure rules (economy, purchases, offline) |
| [hooks/](hooks/AGENTS.md) | React hooks (scheduler, session) |
| [i18n/](i18n/AGENTS.md) | Paraglide, messages, locale |
| [lib/](lib/AGENTS.md) | Minimal utilities (`cn`, `envs`) |
| [providers/](providers/AGENTS.md) | Context providers + store singleton |
| [store/](store/AGENTS.md) | Persisted Jotai state |
| [styles/](styles/AGENTS.md) | Global CSS, Tailwind v4 tokens |
| [utils/](utils/AGENTS.md) | Decimals and formatters |

**No AGENTS.md:** `test/` (empty/legacy).

## Layer rules

| Folder | May import | Must not import |
|--------|------------|-----------------|
| `content/` | `i18n/localize` | `game/`, `store/`, React |
| `game/` | `content/`, `utils/`, `store/atoms/settings` | `i18n/`, React |
| `store/` | `game/`, `content/`, `utils/` | `components/` |
| `components/` | all above + `hooks/`, `providers/` | inline business logic |
| `i18n/` | `content/`, `store/` (locale) | edit generated `i18n/paraglide/` |

## Data flow

```
content (IDs, numbers) → game (rules) → store (state) → components (UI)
                              ↑                    ↑
                         i18n (strings)      hooks/providers (effects)
```

## Before editing

1. Read the target folder's `AGENTS.md`.
2. Respect the layer rules above.
3. When conventions change, update that folder's `AGENTS.md` (Evolution section).

## Evolution

- 2026-06-07 — Initial hierarchical docs (12 folders + index)
