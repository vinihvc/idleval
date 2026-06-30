# Plan 005: Mission presentation single source

> **Planned at:** commit `ef0e01b`, 2026-06-30

## Status

- **Priority:** P2 | **Effort:** M | **Risk:** MED | **Depends on:** 003

## Why this matters

Mission scaling duplicated in slot hook and claim dialog — diverges with player-level tuning.

## Scope

**In scope:** new `game/missions/presentation.ts`, `missions.ts` barrel, `use-mission-slot-view.ts`, `mission.content.tsx`

## Done criteria

- [ ] `buildMissionSlotPresentation` centralizes scaled objective/rewards
- [ ] Components consume single helper
- [ ] Mission tests pass
