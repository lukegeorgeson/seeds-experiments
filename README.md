# Seeds Experiments

Private experimental repo for developing marketing pages, app UI, design systems, and general front-end experimentation for [Seeds](https://github.com/your-org/seeds).

## Structure

```
marketing/          — Landing pages and promotional content
app/                — Application UI prototypes
  boards/           — Round/board views
  export/           — Export flows
design-system/      — Design tokens, component libraries, style guides
experiments/        — Freeform exploration and throwaway prototypes
  canvas/           — Canvas interaction experiments
docs/               — Seeds app context (design system spec, domain types, architecture)
```

### How to decide where something goes

- **marketing/** — Will users see this before signing up? Put it here.
- **app/** — Is it a screen or flow inside the product? Put it here.
- **design-system/** — Is it a reusable token, component, or style guide? Put it here.
- **experiments/** — Trying something out? Put it here. Promote to `app/` or `marketing/` when it matures.
- **docs/** — Reference material from the main Seeds app. Treat as context, not source of truth.

### Naming

Use descriptive filenames. For iterative work, prefix with version (`v1-`, `v2-`). Keep names lowercase with hyphens.

## Running locally

Serve static files with any HTTP server:

```bash
python3 -m http.server 3000
```
