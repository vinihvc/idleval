# Plan 001: Fix offline earning double-count

> **Planned at:** commit `ef0e01b`, 2026-06-30

## Status

- **Priority:** P1 | **Effort:** M | **Risk:** MED | **Depends on:** none

## Why this matters

Scheduler ticks while tab hidden; resume also applies offline bulk gold for the same window — duplicated income.

## Scope

**In scope:** `use-production-scheduler.ts`, `use-offline-earning.ts`, tests under `tests/providers/offline-earning/`

## Done criteria

- [ ] Scheduler interval paused when tab hidden
- [ ] Visibility resume uses `handleVisibleResume` (RESUME_GAP respected)
- [ ] `consumedOfflineRef` cleared when new offline progress arrives
- [ ] Offline tests pass
