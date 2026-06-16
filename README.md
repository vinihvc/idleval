# Idleval

Raise a tiny realm, hire strange helpers, court impossible powers, and watch your coffers grow while you are away.

### Preview

<img width="1437" alt="image" src="https://github.com/user-attachments/assets/45586ff5-49a3-48ba-b4a6-0e19d160da9b" />

## Getting Started

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Start the development server with `pnpm dev`
4. Open your browser and navigate to `http://localhost:5173`

## Architecture

Layered source under `src/` — see [docs/CONTEXT.md](docs/CONTEXT.md) for data flow, domain map, and feature recipes; [docs/DESIGN.md](docs/DESIGN.md) for visual tokens and UI patterns. Per-folder conventions live in [src/AGENTS.md](src/AGENTS.md) and each `src/{folder}/AGENTS.md`.

## Technologies

- Vite 8 (Rolldown + Oxc) + React Compiler
- TypeScript
- Tailwind CSS
- Jotai
- Pixelarticons
- Shark UI (Ark UI)

### Installation

```bash
git clone https://github.com/vinihvc/idleval
```

### Installing dependencies

```bash
pnpm install
```

### Running Locally

```bash
pnpm dev
```
