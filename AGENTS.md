# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Per-folder context

Domain-specific conventions live in [`src/AGENTS.md`](src/AGENTS.md) and each `src/{folder}/AGENTS.md`.
Read the folder's AGENTS.md before editing files in it.

## Quick Reference

- **Format code**: `pnpm dlx ultracite fix`
- **Check for issues**: `pnpm dlx ultracite check`
- **Diagnose setup**: `pnpm dlx ultracite doctor`

Biome (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

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
pnpm remove-bg input.png public/images/msc/example.webp --size 400 --auto-key
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
pnpm compress-image public/images/msc/example.webp --in-place
pnpm compress-image -- --batch public/images/msc public/images/msc --in-place
```

Defaults: **400×400**, WebP **quality 70%**, nearest-neighbor resize.

### Full pipeline example

```bash
pnpm remove-bg sprite.png public/images/msc/about.webp --size 400 --auto-key
pnpm compress-image public/images/msc/about.webp --in-place
```

Inspect the result visually. Complex interiors (e.g. harp strings, thin gaps) may need manual pixel cleanup after the automated pass.

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
