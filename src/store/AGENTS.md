# store/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

Global Jotai state — persistence, mutations, and selectors; orchestrates `game/` without duplicating rules.

## Do

- Persist via `persistedAtom(key, initial)` from `storage.ts`
- Use `persistedAtomWithNormalize(key, initial, normalize)` when reads need migration/normalization
- Define all localStorage keys in `@/config/local-storage-keys` (`LOCAL_STORAGE`) — never inline strings in atoms
- Mutations as imperative functions (`store.set`/`store.get`), not write-only atoms
- Export `get*` (imperative) + `use*` (React) for reads
- Split large domains: `factories.{atom,actions,selectors}.ts` + barrel `factories.ts`
- Keep transient UI coordination, such as the globally open dialog id, in plain Jotai atoms rather than persisted storage
- Store gold/decimals as serialized strings (`serializeDecimal`/`deserializeDecimal`)
- Use `beforeEach(() => resetGame())` in tests; seed via `test-utils.ts`
- Use `selectAtom` + `Map` cache for granular subscriptions
- Use `useAtomValue` only in atom accessor hooks (`useXxx = () => useAtomValue(xxxAtom)` or parameterized `selectAtom` variant); derived hooks and providers compose accessors — never call `useAtomValue` directly

## Don't

- Inline economy rules — call `@/game/*`
- Use `atomWithStorage` directly — use `persistedAtom` or `persistedAtomWithNormalize`
- Add barrel files at the store root
- Import components or i18n strings
- Import `useAtomValue` outside store atom accessor hooks (providers/components use `useSettings`, `useWallet`, etc.)
- Use `useEffect` or other React lifecycle in `store/atoms/*` — move sync to `hooks/` + `providers/`
- Change storage keys without a version suffix when schema changes (e.g. `wallet-v4`); update `LOCAL_STORAGE` in config

## Patterns

- Atoms: `{domain}Atom`; hooks: `use{Domain}`; getters: `get{Thing}`
- Raw atom reads: `use{Domain}State = () => useAtomValue({domain}Atom)`; derived hooks call the accessor
- Reset: `resetRunProgress()` (run) vs `resetGame()` (full wipe)
- Colocated tests `*.test.ts`; `vi.mock("@/providers/sound")` when actions trigger audio
- Explicit imports: `@/store/atoms/factories`, `@/store/reset`

## Key files

| File | Role |
|------|------|
| `storage.ts` | `persistedAtom`, `persistedAtomWithNormalize`, in-memory fallback for SSR/test |
| `reset.ts` | `resetGame()` — full wipe |
| `reset-run-progress.ts` | Run reset (partial prestige) |
| `offline-earning.ts` | `applyOfflineEarning`, `offlineSummaryAtom`, `offlineCycleProgressAtom` |
| `atoms/session.ts` | Persisted `lastSeenAt`, `touchLastSeen*` helpers |
| `test-utils.ts` | `seedGold`, `seedFactory`, `setupStoreTest` |
| `atoms/factories.actions.ts` | Purchases, production, upgrades |
| `atoms/wallet.ts` | Gold balance |
| `atoms/inventory.ts` | Power-up slots, daily streak, active buff (`inventory-v4`) |
| `atoms/power-ups.actions.ts` | Claim daily reward, activate power-ups |
| `atoms/settings.ts` | Locale, volumes |
| `atoms/notifications.ts` | Dialog badge visibility, dismiss-on-visit |
| `atoms/dialogs.ts` | Single-open dialog coordination and factory-scoped dialog ids |

## Neighbors

- Reads from: `game/`, `content/`, `utils/`, `providers/store` (singleton)
- Consumed by: `components/`, `hooks/`, `providers/`, `i18n/`

## Evolution

- 2026-06-08 — Removed legacy save migrations; bumped inventory/gods/factories/statistics keys
- 2026-06-08 — Notification dismissal sync moved to `use-notification-sync`; no `useEffect` in store atoms
- 2026-06-08 — `useAtomValue` restricted to atom accessor hooks; derived hooks compose accessors
- 2026-06-08 — `notifications-v1` atom: dismiss-on-visit badges for nav dialogs
- 2026-06-08 — Centralized keys in `config/local-storage-keys.ts`; `persistedAtomWithNormalize` for migrated atoms
- 2026-06-13 — Added transient `dialogsAtom` to enforce one open `ResponsiveDialog` at a time
