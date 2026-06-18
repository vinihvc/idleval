# Idleval — Visual Design System

Normative UI guide for agents and contributors. Source of truth for tokens: [`src/styles/globals.css`](../src/styles/globals.css). Architecture: [CONTEXT.md](./CONTEXT.md). Code conventions: [AGENTS.md](../AGENTS.md).

## Visual identity

Idleval is a **fantasy medieval idle game** with a dark, warm forest backdrop and **parchment-like UI panels**. Gold (`primary`) accents signal value and interactivity. **Pixel art sprites** render crisp via `pixel-crisp`; the UI itself is stylized medieval (elevated borders, outlined text), not flat Material defaults.

- **Do:** reuse `boxBorder`, `borderedText`, and semantic tokens.
- **Don't:** introduce generic gray Tailwind (`zinc-500`) or raw hex/OKLCH in components.

## Color system

Dark-only palette defined in `:root` ([`globals.css`](../src/styles/globals.css)). Use Tailwind token classes — never hardcode OKLCH in TSX unless adding a new token to `globals.css`.

| Token | Role | Example usage |
|-------|------|---------------|
| `background` | App canvas, dark warm brown | Page shell, card inner panels |
| `foreground` | Body text on dark | Default readable text |
| `primary` | Gold — value, CTA fill | Buttons (`default`), progress fill, card frames |
| `primary-foreground` | Text on gold | Button labels on `default` |
| `card` / `popover` | Parchment cream | Dialog/drawer surfaces, popover content |
| `card-foreground` / `popover-foreground` | Text on parchment | Dialog body copy |
| `secondary` | Muted brown panels | `Button` `brown` variant |
| `muted` / `muted-foreground` | Subdued UI | Disabled hints, secondary labels |
| `success` | Afford / upgrade / claim | `UpgradeCard` green preset, `Button` `green` |
| `warning` | Attention (non-destructive) | Timers, streaks |
| `destructive` | Danger actions | Reset, irreversible |
| `info` | Active production / blue state | Factory producing, `Button` `blue` |
| `purple` | God / mystical | God cards, wiki entries |
| `teal`, `olive`, `wine`, `ember` | Domain accents | Themed buttons, `borderedText` strokes |
| `stone` | Disabled / sealed | Locked cards, muted chrome |
| `border`, `ring`, `input` | Shared chrome | Focus rings, inputs |

## Typography

| Class | Font | Use |
|-------|------|-----|
| `font-display` | Almendra | Dialog titles, section headers, uppercase labels (`tracking-wide`) |
| `font-number` | Jersey 10 | Gold, counts, timers, progress — always with `tabular-nums` |
| `font-sans` | Grenze Gotisch | Default body (applied on `body`) |

**Outlined text** — [`borderedText`](../src/components/ui/text-border/text-border.tsx) for legibility on busy backgrounds:

| Variant | When |
|---------|------|
| `cream` | Stats on dark panels (factory progress) |
| `green` | Success / producing states |
| `brown` / `default` | General labels on mixed surfaces |
| `blue`, `purple`, `teal`, etc. | Match surrounding domain accent |

Sizes: `sm` (2px stroke), `md` (3px), `lg` (4px) — default `lg` for hero numbers.

- **Do:** `className={cn("font-number tabular-nums", borderedText({ variant: "cream" }))}`.
- **Don't:** plain white text on the pixel background without stroke when contrast is weak.

## Elevation (`boxBorder`)

Hard shadow elevation via [`boxBorder`](../src/components/ui/box-border/box-border.tsx) — the signature Idleval look.

| Variant | When |
|---------|------|
| `brown` | Default interactive cards, factory surfaces |
| `green` | Purchasable / affordable / upgrade (`UpgradeCard` green preset) |
| `cream` | Gold-accent highlights on parchment |
| `stone` | Disabled, sealed, locked |
| `muted` | Inset inner panels |
| `blue` | Production-active chrome |
| `purple` | God-related surfaces |
| `red` | Destructive emphasis |

Common props: `size: 'sm' | 'md' | 'lg'`, `soft: true` (drop shadow), `interactive` / `interactiveOnly` (hover/active depth), `inset: 'md'` (recessed wells).

- **Do:** `boxBorder({ variant: 'brown', size: 'md', soft: true })` for default cards.
- **Don't:** plain `shadow-md` without `boxBorder` on game cards.

## Component grammar

### Cards

- **[UpgradeCard](../src/components/ui/upgrade-card/upgrade-card.tsx)** — compound API (`UpgradeCardPanel`, `UpgradeCardArt`, `UpgradeCardSeal`). Fixed presets: `brown` (default), `green` (affordable). Hold-to-confirm via `useHoldPress`.
- **[FactoryCard](../src/components/ui/factory-card/)** — production UI; `borderedText` blue when producing, cream otherwise.

### Buttons

[`Button`](../src/components/ui/button/button.tsx): `rounded-lg border-3 inset-shadow-xs`, variants `default` (gold), `brown`, `cream`, `stone`, `green`, `blue`, `purple`, `teal`, `olive`, `wine`, `ember`, `destructive`, `ghost`. Optional `sound` prop for SFX.

- **Do:** `variant="default"` for primary CTA; domain colors for themed actions.
- **Don't:** unstyled `<button>` for game actions.

### Overlays

- **≥768px:** `ResponsiveDialog` (Dialog)
- **<768px:** Drawer (modal, focus trapped)
- Titles: `font-display font-semibold`; hero images: `pixel-crisp`, `aria-hidden`

### Tooltips

- **≥768px:** `ResponsiveTooltip` (Tooltip)
- **<768px:** `ToggleTooltip`

### Progress

Inset track pattern (see [missions.claim-content.tsx](../src/components/dialog/missions/missions.claim-content.tsx)):

`inset-shadow-xs h-4 rounded-sm border-2 border-primary/40 bg-muted` + `ProgressRange` with `bg-primary`.

### Icons

- UI icons: `pixelarticons/react/IconName` (per-icon import)
- Custom SVGs: [`components/icons/`](../src/components/icons/)

## Imagery and sprites

Full pipeline: [AGENTS.md § Game asset images](../AGENTS.md#game-asset-images).

- Sprites: 400×400 WebP under `public/images/`
- UI: `@unpic/react` `Image` + `pixel-crisp`
- Decorative sprites in labeled controls: `alt=""` + `aria-hidden`
- Style: chunky pixel art, thick black outlines, limited palette, readable at small sizes

## Layout and responsive

- **Mobile-first:** `sm:`, `md:` — never `max-sm:` / `max-md:`
- **768px:** dialog and tooltip breakpoint
- **Game shell:** [`GameShell`](../src/components/game/shell/shell.tsx) — `max-w-4xl`, centered on desktop
- **Background:** [`Background`](../src/components/layout/background/background.tsx) — full-bleed `bg.webp` + stone vignette gradients (desktop)
- **Mobile:** viewport-locked scroll on `html`/`body`; desktop allows normal scroll

## Motion and feedback

- Respect `prefers-reduced-motion`: `motion-reduce:transition-none!` on animated controls
- Card press: `active:scale-[0.99]`, `hover:brightness-105`
- Hold actions: `HoldProgress` + `aria-busy`
- Claims/purchases: `useLiveAnnouncer` + `LiveAnnouncer` with `ui.a11y.*` keys

## Reference screens

| Screen | Canonical files |
|--------|-----------------|
| Factory grid | `game/factory-grid/`, `ui/factory-card/` |
| Upgrade / god cards | `ui/upgrade-card/`, `dialog/gods/`, `dialog/upgrades/` |
| Mission board + claim | `game/stage/mission-slots.tsx`, `dialog/missions/` |
| Settings | `dialog/settings/` |

## Anti-patterns

- Module-level Tailwind class string variables — inline on `className` or use `tv()` ([components/AGENTS.md](../src/components/AGENTS.md))
- Generic shadcn styling without `boxBorder` / `borderedText`
- ML background removal on pixel art (use `pnpm remove-bg`)
- Hardcoded English in JSX
- Inventing colors not in `globals.css`

## Changelog

- 2026-06-15 — Initial design system doc extracted from globals.css and UI primitives
