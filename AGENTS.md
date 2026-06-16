# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Per-folder context

Domain-specific conventions live in [`src/AGENTS.md`](src/AGENTS.md) and each `src/{folder}/AGENTS.md`.
Architecture and feature recipes: [`docs/CONTEXT.md`](docs/CONTEXT.md).
Visual design system: [`docs/DESIGN.md`](docs/DESIGN.md).
Read the folder's AGENTS.md before editing files in it.

## Quick Reference

- **Format code**: `pnpm dlx ultracite fix`
- **Check for issues**: `pnpm dlx ultracite check`
- **Diagnose setup**: `pnpm dlx ultracite doctor`

Biome (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

## localStorage persistence

**Do not bump storage key versions when persisted shape changes.** Keep stable keys in [`src/config/local-storage.ts`](src/config/local-storage.ts) (`LOCAL_STORAGE`) and migrate old blobs on read.

| Need | Use |
|------|-----|
| Stable shape | `persistedAtom` |
| Normalize / strip removed fields | `persistedAtomWithNormalize` |

**On schema change:**

1. Update the atom’s `normalize` function — default missing fields, drop removed ones.
2. Never rename or version-bump a `LOCAL_STORAGE` key — evolve schema via `normalize` only.

Details and examples: [`src/store/AGENTS.md`](src/store/AGENTS.md).

---

## Game asset images

**Mandatory for every AI-generated sprite without a scene:** generate on a **solid magenta** (`#FF00FF`) background first, then run `pnpm remove-bg` — never commit checkerboard “fake PNG” transparency or ask the model for a transparent background directly.

After generating a pixel-art sprite (AI or otherwise), always run this pipeline before committing to `public/images/`.

### 1. Generate with chroma key

- Prompt must include: **solid flat magenta background `#FF00FF`**, not checkerboard, not transparent.
- Use **green** (`#00FF00`) only when the subject is mostly purple/violet and magenta key would eat the sprite (see step 2).
- Never fake transparency (checkerboard baked into pixels).
- **Magenta** for most sprites. **Green** when the subject has **purple/violet** (capes, robes, amethyst) — magenta key treats purple like background and removes or washes it out.
- **Red gems** on magenta (crowns, hearts) are safe with the default pipeline; if edges look dull, re-run with `--no-despill`.
- No scene, pedestal, or extra props unless requested.
- Chunky pixel art: thick black outlines, limited palette, readable at small sizes.

### 2. Remove background

```bash
# Game sprites (400×400) — auto-picks green when purple is detected
pnpm remove-bg input.png public/images/characters/example.webp --size 400 --auto-key
pnpm remove-bg input.png public/images/gods/example.webp --size 400 --auto-key

# Explicit green-screen source (purple cape, violet robes)
pnpm remove-bg input.png output.webp --key green --size 400

# Red-heavy subject on magenta — skip despill if rubies look black
pnpm remove-bg input.png output.webp --size 400 --no-despill

# Batch
pnpm remove-bg -- --batch ./raw ./out --size 400 --auto-key
```

Defaults: `--key magenta`, subject-color protection + despill, nearest-neighbor centering, lossless WebP. With `--auto-key`, green is chosen when purple subject pixels are detected. Do **not** use ML tools (rembg, remove.bg) for pixel art — they blur edges and eat black outlines.

### 3. Compress for production

```bash
pnpm compress-image public/images/characters/example.webp --in-place
pnpm compress-image -- --batch public/images/characters public/images/characters --in-place
```

Defaults: **400×400**, WebP **quality 70%**, nearest-neighbor resize.

### Full pipeline example

```bash
pnpm remove-bg sprite.png public/images/characters/aru.webp --size 400 --auto-key
pnpm compress-image public/images/characters/aru.webp --in-place
```

Inspect the result visually. Complex interiors (e.g. harp strings, thin gaps) may need manual pixel cleanup after the automated pass.

---

## Accessibility

Idleval targets WCAG-minded patterns: semantic HTML, keyboard support, screen-reader labels, and i18n-backed strings. UI details live in [`src/components/AGENTS.md`](src/components/AGENTS.md); this section is the project-wide contract.

### Landmarks and page shell

- **Skip link** on `HomePage` → `#main-content` (`ui.a11y.skipToContent`)
- **`<main id="main-content">`** wraps the factory grid (not a generic `<div>`)
- **`<header>`**, **`<footer>`**, **`<nav>`** with distinct `aria-label` when multiple nav regions exist (`ui.nav.gameSections`, `ui.nav.actions`, `ui.nav.label`)
- **`<section aria-label>`** for grouped content (e.g. factory grid via `ui.factoryGrid.label`)
- **`index.html` viewport** must allow zoom — do not set `user-scalable=no` or `maximum-scale=1`

### Strings and i18n

All user-facing and assistive strings go through Paraglide (`m["ui.*"]()`). Add keys to **en, es, and pt** before use.

| Key prefix | Use |
|------------|-----|
| `ui.a11y.*` | Skip link, live-region announcements (`claimed`, `purchased`, `invoked`, `activated`) |
| `ui.common.close` | Dialog, drawer, and action-bar dismiss buttons |
| `ui.common.completed`, `ui.common.insufficientGold` | Disabled card states |
| `ui.inventory.slot.empty` | Empty relic slots (not the relic name alone) |

Never hardcode English on `aria-label`, `aria-labelledby`, or close buttons.

### Dialogs and overlays

- Use **`ResponsiveDialog`** (Dialog ≥768px, modal **Drawer** below). Mobile drawers must stay **`modal={true}`** so focus stays trapped.
- **`DialogTitle`** + **`ResponsiveDialogDescription`** always visible on mobile — do not hide descriptions behind an unlabeled icon (`hideDescription` is removed).
- Blocking flows use **`role="alertdialog"`** (welcome, offline earning).
- Close controls use **`ui.common.close`** and keep a visible **focus ring** (do not use `focus-visible:ring-0`).

### Controls and navigation

- **Real `<button>`** elements for actions — no `div` + `onClick`
- **Icon-only triggers**: `sr-only` text inside the button or `aria-label` from i18n
- **Mobile bottom nav**: `<nav>` + `<ul>` + `<button>` — not tab semantics without tab panels
- **Hold actions**: keyboard via `use-hold-press` (Space/Enter); expose **`aria-busy`** during hold
- **Disabled informational cards** (`UpgradeCard`): prefer **`aria-disabled`** (still focusable) over native `disabled` so screen readers hear why; wire **`aria-describedby`** to the `description` prop
- **Sliders**: associate labels with **`aria-labelledby`**; do not hide essential mute toggles on mobile without an equivalent

### Images and live feedback

- **Decorative** sprites inside labeled controls: `alt=""` + `aria-hidden`
- **Dialog hero images** duplicate the title — keep `aria-hidden` on `DialogImage`; meaningful `alt` is optional for maintainers only
- **Action feedback** (claim, purchase, invoke, activate): `useLiveAnnouncer` + `<LiveAnnouncer message={…} />` with `ui.a11y.*` keys
- **`Alert`**: use `live="polite"` or `live="assertive"` when content should be announced on mount/update

### Motion, focus, and formatting

- Respect **`prefers-reduced-motion`** (`motion-reduce:*` on animated UI)
- **Focus-visible rings** on interactive primitives (buttons, tabs, slider thumbs, dialog close)
- **`timeFormatter`** ceils fractional seconds before display — scheduler ticks can pass floats (e.g. `66.381` → `1:07`, never `1:6.381`)

### Tests

- Prefer **`getByRole`** with accessible names in component tests
- Assert i18n close labels, button (not tab) roles in mobile nav, and `live` semantics on `Alert` where relevant
- Run **`pnpm i18n:check`** when adding or changing `ui.a11y.*` / `ui.common.*` keys

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**
- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**
- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**
- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `pnpm dlx ultracite fix` before committing to ensure compliance.
