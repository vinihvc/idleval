# Plan 004: Add CI verification baseline

> **Planned at:** commit `ef0e01b`, 2026-06-30

## Status

- **Priority:** P1 | **Effort:** S | **Risk:** LOW | **Depends on:** none

## Why this matters

CI runs test + build but not lint or isolated typecheck. Contributors miss failures until full build.

## Scope

**In scope:** `package.json`, `.github/workflows/ci.yml`, `vitest.config.ts`

## Done criteria

- [ ] `pnpm typecheck` script exists and passes
- [ ] CI runs `pnpm lint:check` and `pnpm typecheck`
- [ ] Playwright browsers cached in CI
- [ ] Vitest coverage thresholds on `src/game/**` and `src/store/**`
