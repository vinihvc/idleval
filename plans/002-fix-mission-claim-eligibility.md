# Plan 002: Fix mission claim eligibility

> **Planned at:** commit `ef0e01b`, 2026-06-30

## Status

- **Priority:** P1 | **Effort:** S | **Risk:** LOW | **Depends on:** none

## Why this matters

`readyToClaimIds` only grows; holdGold missions stay claimable after spending below target.

## Scope

**In scope:** `missions.actions.ts`, `slots.ts`, `missions.actions.test.ts`

## Done criteria

- [ ] `readyToClaimIds` pruned on sync via `isMissionReadyToClaim`
- [ ] `canClaimMission` revalidates live snapshot
- [ ] Regression test: spend after holdGold ready → claim fails
