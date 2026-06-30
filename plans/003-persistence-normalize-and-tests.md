# Plan 003: Persistence normalize and tests

> **Planned at:** commit `ef0e01b`, 2026-06-30

## Status

- **Priority:** P2 | **Effort:** M | **Risk:** LOW | **Depends on:** 004

## Why this matters

Wallet, session, gods, settings use raw `persistedAtom` — corrupt localStorage can break economy.

## Scope

**In scope:** `wallet.ts`, `session.ts`, `gods.ts`, `settings.ts`, `use-local-storage.ts`, `tests/store/persistence-normalize.test.ts`

## Done criteria

- [ ] Critical atoms use `persistedAtomWithNormalize`
- [ ] `useLocalStorage` safe-parse on read
- [ ] Table-driven normalize tests pass
