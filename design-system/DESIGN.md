# Seeds Design System

## Grid Contract

The 20px grid is the foundational primitive. Everything derives from it.

- **GRID**: 20px — the base unit
- **Spacing scale**: xs=10, sm=20, md=40, lg=60, xl=80 (all GRID multiples)
- **GUTTER**: 40px (GRID × 2)
- **Card size**: 180×180 (GRID × 9)
- **Zone size**: 600×500 (GRID × 30 × GRID × 25)
- **Summary**: 600×80 (zone width × GRID × 4)
- **Brief**: 260×200 (GRID × 13 × GRID × 10)
- **Question width**: 360 (GRID × 18)

**Rule**: Every dimension on canvas must be a GRID multiple. This makes snap-to-grid feel inevitable.

## Token Architecture

Three-layer token system:

1. **Primitive** → Raw color values (e.g., `#fabd2f`)
2. **Semantic** → Named by purpose (e.g., `--postit-yellow`)
3. **Component** → Used by components (e.g., `--card-bg`)

### Foreground hierarchy
- `--fg` — Primary text
- `--fg-2` — Secondary text
- `--fg-3` — Muted/disabled text

### Background depth
- `--bg` — Base background
- `--bg-1` — Raised/elevated surface
- `--surface` — Card/panel background

### Border system
- `--border` — Default border
- `--border-strong` — Hover/emphasis border

### Edge colors
- `--connection` — Default connection line
- `--connection-hover` — Hover state connection

## Node Type System

| Node | Default Size | Resizable | Handles | Parent |
|------|-------------|-----------|---------|--------|
| postit | 180×180 | No | top, bottom, left, right | zone |
| zone | 600×500 | Yes | corners + edges | null |
| brief | 260×200 | No | brief-out | null |
| question | 360×auto | No | q-in, q-out | null |
| zoneSummary | 600×80 | No | summary-bottom, left, right | null |
| modifier | 220×100 | No | top, bottom, left, right | null |
| generate | 200×auto | No | gen-out, gen-out-bottom, top, gen-right | null |

## Layout Relationships

- **Summary → Zone → Cards**: Implicit hierarchy
- Summary sits above zone with `xs` (10px) gap
- Zones arranged in 2-column grid with `md` (40px) gaps
- Cards inside zones with `sm` (20px) gaps, 2 cards per row
- Card Y offset inside zones: 44px (zone header height + padding)

## Interaction Patterns

### Three interaction layers
1. **Canvas** — Pan, zoom, fit view (React Flow built-in)
2. **Spatial** — Drag, resize, nudge (pointer events + snap + collision)
3. **Content** — Edit text, answer questions (contentEditable / forms)

### Progressive disclosure on hover
Action buttons and resize handles use `opacity: 0` → `opacity: 1` on parent `:hover`. This keeps the interface clean while making tools discoverable.

### Resize nudging
When a zone resizes, sibling nodes push away to maintain gutters. Growth direction determines push direction. Only nodes in the same "band" (overlapping on the perpendicular axis) are affected.

## CSS Architecture

- **Flat, component-scoped** naming (`.zone-node`, `.postit-node`)
- **BEM-like** for compound elements (`.zone-resize-handle-corner`)
- **Zero border-radius** everywhere — strong geometric aesthetic
- **Transition scale**: fast (80ms), normal (100ms), medium (120ms), slow (150ms)
- **`nodrag` class** escape hatch from canvas drag — apply to interactive elements inside nodes

## Colorway System

9 colorway themes, each with light and dark variants:

**Color themes**: Gruvbox (default), Andromeda, Rosé Pine, Nord, Solarized, Flexoki
**Monochromatic themes**: Ink, Ash, Bone

Toggle via `data-theme="dark"` and `data-colorway="name"` attributes on `<html>`.
