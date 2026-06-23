# audio/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

Pure audio engine — SFX and music playback, no React.

## Do

- Register sounds in `registry.ts` with typed IDs (`SfxId`)
- Expose API via `engine.ts` (`play`, `stop`, `playMusic`, volumes)
- Keep types in `types.ts` (`PlayOptions`, `SfxId`)
- Test logic in `tests/audio/engine.test.ts` (Vitest, node)

## Don't

- Import React or components
- Read settings directly — `SoundProvider` injects volumes via callback
- Add SFX without updating `SfxId` and the registry
- Leave `console.log` in production code

## Patterns

- Singleton `soundEngine` exported from `engine.ts`
- Sound IDs as union type, not loose strings
- Tests in `tests/audio/*.test.ts`

## Key files

| File | Role |
|------|------|
| `engine.ts` | Init, unlock, play/stop, volume |
| `registry.ts` | URL/path map per `SfxId` |
| `types.ts` | `SfxId`, `PlayOptions` |

## Neighbors

- Reads from: none (self-contained)
- Consumed by: `providers/sound.tsx`, `store/` (via provider)

## Evolution

- 2026-06-07 — Initial docs: engine + registry + SfxId
