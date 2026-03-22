# Seeds Design System

A geometric, token-driven design system built on the Gruvbox palette with 9 colorway variants. Zero border-radius, IBM Plex Mono + Inter typography, 20px grid foundation.

**Showcase**: Serve this directory and open `index.html` for a live component reference.

---

## 1. Architecture Overview

### File Structure

```
design-system/
  index.css              # Entry point — imports all modules
  reset.css              # CSS reset
  tokens.css             # All design tokens (primitives + semantic + state)
  index.html             # Live component showcase
  DESIGN.md              # This document
  components/
    layout.css           # Sidebar, top bar, page shells
    buttons.css          # btn-primary, btn-ghost, btn-action, btn-danger
    cards.css            # Project cards, post-it nodes
    forms.css            # Inputs, selects, sort dropdowns
    navigation.css       # Nav links, breadcrumbs, tabs
    zones.css            # Zone containers, zone summaries, resize handles
    menus.css            # Context menus, dropdown menus
    toolbar.css          # Floating canvas toolbar
    questions.css        # Question nodes with option lists
    canvas.css           # Canvas background, edges, handles, generate nodes
    tooltips.css         # Tooltip component
    nodes.css            # Node base template, brief node, selection, new-node dropdown
    animations.css       # Skeletons, sweep/thinking, toasts, transitions, motion
```

### CSS Import Order

Import order matters — later files can override earlier ones:

```css
@import 'reset.css';
@import 'tokens.css';
@import 'components/layout.css';
@import 'components/buttons.css';
@import 'components/cards.css';
@import 'components/forms.css';
@import 'components/navigation.css';
@import 'components/zones.css';
@import 'components/menus.css';
@import 'components/toolbar.css';
@import 'components/questions.css';
@import 'components/canvas.css';
@import 'components/tooltips.css';
@import 'components/nodes.css';
@import 'components/animations.css';
```

---

## 2. Grid Contract

The 20px grid is the foundational primitive. Everything derives from it.

| Concept | Value | Grid Multiple |
|---------|-------|---------------|
| GRID | 20px | 1× |
| Spacing xs | 10px | 0.5× |
| Spacing sm | 20px | 1× |
| Spacing md | 40px | 2× |
| Spacing lg | 60px | 3× |
| Spacing xl | 80px | 4× |
| GUTTER | 40px | 2× |
| Card size | 180×180 | 9×9 |
| Zone size | 600×500 | 30×25 |
| Summary | 600×80 | 30×4 |
| Brief | 260×200 | 13×10 |
| Question width | 360 | 18× |

**Rule**: Every dimension on canvas must be a GRID multiple. This makes snap-to-grid feel inevitable.

---

## 3. Token Architecture

Three-layer system defined in `tokens.css`:

### Layer 1 — Primitives (raw values)

Raw color hex values that change per colorway. Never referenced directly by components.

### Layer 2 — Semantic tokens

Named by purpose, referencing primitives. These are the tokens components use:

| Category | Tokens | Notes |
|----------|--------|-------|
| **Background** | `--bg`, `--bg-1`, `--surface` | Depth: page → elevated → card |
| **Foreground** | `--fg`, `--fg-2`, `--fg-3` | Hierarchy: primary → secondary → muted |
| **Border** | `--border`, `--border-strong` | Default → hover/emphasis |
| **Post-it colors** | `--postit-yellow`, `--postit-pink`, `--postit-green`, `--postit-blue`, `--postit-orange`, `--postit-purple` | Card background colors |
| **Post-it foreground** | `--postit-yellow-fg`, `--postit-pink-fg`, `--postit-green-fg`, `--postit-blue-fg` | Text on post-it backgrounds |
| **Zone strokes** | `--zone-stroke-yellow`, `--zone-stroke-pink`, `--zone-stroke-green`, `--zone-stroke-blue` | Zone border colors |
| **Canvas** | `--accent`, `--dot-color`, `--handle-color`, `--connection`, `--connection-hover` | Canvas chrome |

### Layer 3 — State & composite tokens

Derived from semantic tokens using `color-mix()`:

| Token | Value | Usage |
|-------|-------|-------|
| `--danger` | `var(--accent)` | Destructive actions |
| `--success` | `var(--postit-green)` | Success states |
| `--warning` | `var(--postit-yellow)` | Warning states |
| `--select` | `var(--postit-blue)` | Selection border/highlight |
| `--select-bg` | `color-mix(in srgb, var(--postit-blue) 8%, transparent)` | Selection fill |
| `--overlay` | `color-mix(in srgb, var(--fg) 15%, transparent)` | Backdrop overlay |
| `--overlay-strong` | `color-mix(in srgb, var(--fg) 30%, transparent)` | Strong backdrop overlay |
| `--disabled-opacity` | `0.4` | Disabled state opacity |

### Typography Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--font` | `'Inter', -apple-system, system-ui, sans-serif` | Body text |
| `--mono` | `'IBM Plex Mono', 'SF Mono', 'Consolas', monospace` | Labels, UI chrome, code |
| `--text-xs` | `9px` | Smallest labels |
| `--text-sm` | `10px` | Meta text, badges |
| `--text-base` | `11px` | Default body |
| `--text-md` | `12px` | Comfortable body |
| `--text-lg` | `13px` | Large body, inputs |
| `--text-xl` | `14px` | Headings |
| `--weight-regular` | `400` | Body text |
| `--weight-medium` | `500` | Emphasis |
| `--weight-semibold` | `600` | Strong emphasis, labels |
| `--tracking-tight` | `0.02em` | Tight spacing |
| `--tracking-normal` | `0.04em` | Default |
| `--tracking-wide` | `0.06em` | Loose labels |
| `--tracking-wider` | `0.08em` | Wide labels |
| `--tracking-widest` | `0.12em` | Widest labels |
| `--tracking-ultra` | `0.14em` | Maximum tracking |
| `--leading-tight` | `1` | Compact lines |
| `--leading-snug` | `1.3` | Snug lines |
| `--leading-normal` | `1.5` | Default |
| `--leading-relaxed` | `1.55` | Relaxed lines |
| `--leading-loose` | `1.65` | Loose lines |

### Spacing Tokens

| Token | Value |
|-------|-------|
| `--space-0` through `--space-24` | 0, 1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 20, 24px |

### Border & Geometry Tokens

| Token | Value | Notes |
|-------|-------|-------|
| `--border-width` | `1px` | Default border |
| `--border-width-thick` | `1.5px` | Emphasized border |
| `--border-width-accent` | `2px` | Accent/selected border |
| `--radius` | `0` | **Zero everywhere** — core aesthetic |

### Transition Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | `0.08s` | Color changes |
| `--transition-normal` | `0.1s` | General hover |
| `--transition-medium` | `0.12s` | Transforms |
| `--transition-slow` | `0.15s` | Layout shifts |
| `--transition-toast` | `0.2s` | Toast enter/exit |
| `--transition-anim` | `0.25s` | Node appear |

---

## 4. Colorway System

9 colorway themes, each with light and dark variants:

| Colorway | Type | Toggle |
|----------|------|--------|
| Gruvbox | Color (default) | `data-colorway` not set |
| Andromeda | Color | `data-colorway="andromeda"` |
| Rosé Pine | Color | `data-colorway="rosepine"` |
| Nord | Color | `data-colorway="nord"` |
| Solarized | Color | `data-colorway="solarized"` |
| Flexoki | Color | `data-colorway="flexoki"` |
| Ink | Monochromatic | `data-colorway="ink"` |
| Ash | Monochromatic | `data-colorway="ash"` |
| Bone | Monochromatic | `data-colorway="bone"` |

Toggle via attributes on `<html>`:
- `data-theme="dark"` / `data-theme="light"` (default is light)
- `data-colorway="name"` (default is gruvbox)

Every colorway overrides the same semantic token set, so components are colorway-agnostic.

---

## 5. Component Reference

### Node Base Template (`nodes.css`)

Every canvas node extends `.node-base`:

```html
<div class="node-base brief-node">...</div>
<div class="node-base postit-node">...</div>
```

Shared patterns:
- `.node-header` — mono font, uppercase, icon + label
- `.node-actions` — hover-reveal action buttons (absolute positioned)
- `.node-meta` — bottom info line
- `.node-base.selected` — `border-color: var(--select)`
- `.node-base.multi-selected` — `border-color: var(--select)` + `box-shadow: 0 0 0 1px var(--select)`
- `.node-base.dragging` — `opacity: 0.7`

### Node Type System

| Node | Default Size | Resizable | Handles | Parent |
|------|-------------|-----------|---------|--------|
| postit | 180×180 | No | top, bottom, left, right | zone |
| zone | 600×500 | Yes | corners + edges | null |
| brief | 260×200 | No | brief-out | null |
| question | 360×auto | No | q-in, q-out | null |
| zoneSummary | 600×80 | No | summary-bottom, left, right | null |
| modifier | 220×100 | No | top, bottom, left, right | null |
| generate | 200×auto | No | gen-out, gen-out-bottom, top, gen-right | null |

### Buttons (`buttons.css`)

| Class | Usage |
|-------|-------|
| `.btn-primary` | Primary action — accent background, inverted text |
| `.btn-ghost` | Secondary — border only, transparent bg |
| `.btn-action` | Icon-only — 20×20, no border, hover reveals bg |
| `.btn-danger` | Destructive — accent (red) background |

All buttons: zero radius, mono font, uppercase, `--tracking-wide`.

### Cards (`cards.css`)

**Post-it nodes**: `.postit-node[data-color="yellow|pink|green|blue|orange|purple"]`
- `.postit-type` — category label
- `.postit-text` — content area
- `.postit-actions` — hover-reveal actions

**Project cards**: `.project-card`
- `.card-thumb` — thumbnail area with dot grid
- `.card-info` — title + meta below
- `.card-actions` — hover actions

### Brief Node (`nodes.css`)

**Input state**: `.brief-node-input`
- `.brief-input-text` — textarea with visible border, 140px min-height
- `.brief-drop-zone` — dashed border upload area, `.drag-over` state
- `.brief-attachments` — file list with `.brief-attachment` items
  - States: default, `.uploading`, `.error`
  - Sub-elements: `-icon`, `-info`, `-name`, `-size`, `-progress`, `-delete`
- `.brief-input-footer` — char count + action buttons

**Prompt suggestions**: `.brief-suggestions` (placed below textarea)
- `.brief-suggestions-label` — icon + "Suggested prompts"
- `.brief-suggestion-chips` — flex-wrap container
- `.brief-suggestion` — clickable chip, inverts on hover
- `.brief-suggestions-divider` — thin line separator

### Zones (`zones.css`)

`.zone-node` — container with colored left border
- `.zone-header` with `.zone-label` and `.zone-actions`
- Resize handles: `.zone-resize-handle-corner`, `.zone-resize-handle-edge`
- Color variants via `.zone-yellow`, `.zone-pink`, `.zone-green`, `.zone-blue`

`.zone-summary-node` — compact summary below zones

### Forms (`forms.css`)

- `.form-group` with `.form-label` and `.form-input`
- `.sort-select-wrapper` — styled select with CSS border-triangle chevron
- `.form-input:focus` — `border-color: var(--border-strong)`

### Toolbar (`toolbar.css`)

`.floating-toolbar` — fixed bottom-center canvas toolbar
- `.toolbar-section` — grouped buttons
- `.toolbar-divider` — vertical separator
- `.toolbar-btn` with `.toolbar-label`, `.active` state
- `.toolbar-badge` — count badge on toolbar buttons

### Menus (`menus.css`)

`.context-menu` — positioned dropdown
- `.context-menu-item` with optional `.destructive`
- `.context-menu-divider`
- `.context-menu-section-label` — group headers

### New Node Dropdown (`nodes.css`)

`.new-node-dropdown` — positioned above toolbar
- `.new-node-item` — icon + label + description
- `.new-node-item-desc` — right-aligned secondary text

### Tooltips (`tooltips.css`)

`.tooltip` — small label, absolute positioned
- `.tooltip-top`, `.tooltip-bottom`, `.tooltip-left`, `.tooltip-right`
- Hidden on touch devices via `@media (hover: none)`

### Selection System (`nodes.css`)

- `.selection-box` — rubber-band drag selection (blue border + fill)
- `.selection-count` — fixed bar showing "N items selected" + actions
- `.multi-selected` variants for postit, zone, project-card
- All selection uses `--select` (blue) not `--accent` (red)

---

## 6. Animation & Motion (`animations.css`)

### Skeleton Loading

Geometric skeleton style — dashed borders + flat blocks + opacity pulse:

```css
@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.15; }
}
```

Add `.skeleton` class to any component:
- `.postit-node.skeleton` — dashed border, hidden content, placeholder lines via `::before`/`::after`
- `.project-card.skeleton` — dashed border, centered dashed square in thumb
- `.zone-node.skeleton` — dashed border, placeholder label
- `.zone-summary-node.skeleton` — dashed border, placeholder text
- `.question-node.skeleton` — dashed border
- `.generate-node.skeleton` — dashed border, pulsing buttons

### Sweep / Thinking

`.thinking` — overlay sweep animation for "processing" state:
- Accent-colored gradient sweeps across the element
- `.toast.thinking` variant uses background-colored sweep

### Toast Notifications

**Enter/exit**: `.anim-slide-up`, `.anim-slide-down`, `.anim-fade`
**Semantic variants**: `.toast-success`, `.toast-error`, `.toast-warning`
**Progress**: `.toast-progress` bar with countdown animation
**Ellipsis**: `.toast-ellipsis` — sequential dot reveal for "thinking" states:

```html
<div class="toast thinking">
  generating ideas<span class="toast-ellipsis"><span>.</span><span>.</span><span>.</span></span>
</div>
```

### Node Transitions

- `.node-appear` — scale 0.92→1 + fade in
- `.populating` — staggered content reveal (type label, then text)
- `.content-stream` — max-height + fade for streaming text

### Other Animations

- `.processing` — border color pulses between default and accent
- `.waiting` — subtle opacity pulse
- `.edge-idle` — slow opacity pulse on inactive edges
- `.zone-expand` / `.zone-collapse` — scale + fade
- `.generating` — spinner rotation on generate node icon
- `.results-in` — staggered button reveal on generate results

### Reduced Motion

All animations respect `prefers-reduced-motion: reduce`:
- Skeleton pulse → static
- Sweep overlays → hidden
- All pulses → stopped
- Toast transitions → instant
- Ellipsis dots → all visible immediately
- Node appear/collapse → instant, no transform

---

## 7. Responsive Breakpoints

**Primary**: `max-width: 700px` (mobile)
**Secondary**: `max-width: 1100px` (tablet, layout.css only)

Mobile adaptations applied per-component:

| Component | Mobile Change |
|-----------|---------------|
| Layout | Sidebar collapses, top bar shrinks |
| Buttons | Touch targets ≥36px height |
| Cards | Single column, full width |
| Forms | 100% width inputs |
| Toolbar | Compact, labels hidden |
| Menus | Max-width viewport protection |
| Navigation | Larger tap targets |
| Questions | Compact padding |
| Canvas | Larger handles for touch |
| Zones | Larger resize handles |
| Tooltips | Hidden on touch (`@media (hover: none)`) |
| Brief node | Reduced padding, stacked suggestions |
| New node dropdown | Description text hidden |

---

## 8. Interaction Patterns

### Three interaction layers

1. **Canvas** — Pan, zoom, fit view (React Flow built-in)
2. **Spatial** — Drag, resize, nudge (pointer events + snap + collision)
3. **Content** — Edit text, answer questions (contentEditable / forms)

### Progressive disclosure

Action buttons and resize handles use `opacity: 0` → `opacity: 1` on parent `:hover`. This keeps the interface clean while making tools discoverable.

### Multi-select

- **Shift+Click**: Toggle individual items into selection
- **Drag box**: Rubber-band selection with `.selection-box`
- **Selection bar**: `.selection-count` shows count + bulk actions

### Cursor modes

- `.canvas-pointer-mode` — `cursor: default` (select/move)
- `.canvas-node-mode` — `cursor: crosshair` (place new node)

### Keyboard accessibility

All interactive elements support `focus-visible` outline for keyboard navigation. Components use semantic HTML (`<button>` not `<div onClick>`).

---

## 9. Layout Relationships

- **Summary → Zone → Cards**: Implicit hierarchy
- Summary sits above zone with `xs` (10px) gap
- Zones arranged in 2-column grid with `md` (40px) gaps
- Cards inside zones with `sm` (20px) gaps, 2 cards per row
- Card Y offset inside zones: 44px (zone header height + padding)

---

## 10. Migration Guide — Old System → seeds-design-system

This section maps the old Seeds CSS system (the `globals.css` monolith) to `seeds-design-system`, and documents deliberate departures.

### 10.1 Philosophy Differences

| Aspect | Old System | seeds-design-system |
|--------|-----------|----------|
| **File structure** | Single 4000+ line `globals.css` | 15 modular CSS files |
| **Naming** | BEM-ish (`.studio-card-node`, `.vessel-card`) | Flat, semantic (`.postit-node`, `.zone-node`) |
| **Border radius** | 12-14px cards, 999px pills, 8-10px buttons | **0 everywhere** — geometric aesthetic |
| **Shadows** | Layered `box-shadow` on cards and buttons | **None** — flat design, borders only |
| **Typography** | Inter + system mono | Inter + **IBM Plex Mono** |
| **Color source** | Custom purple/pink palette (`#eac1f5`) | **Gruvbox** palette with 9 colorway variants |
| **Accent** | Purple/pink (`#eac1f5`) | Red (`#cc241d`) — Gruvbox's accent |
| **Selection** | Purple glow (`rgba(234,193,245,0.26)`) | Blue (`--postit-blue`) — thematic, non-destructive |
| **Spacing** | Ad-hoc (4-40px) | 20px grid system with named tokens |
| **Dark mode** | `data-theme="dark"` | `data-theme="dark"` + `data-colorway` (compatible) |
| **Skeleton** | Shimmer gradient sweep | Dashed borders + opacity pulse (geometric) |
| **Component API** | Class strings, no abstraction | Still CSS, but with `.node-base` template pattern |

### 10.2 Deliberate Departures — Do NOT Migrate Back

These are intentional design decisions. Prefer the `seeds-design-system` approach:

1. **Zero border-radius**: The old system's rounded corners (12-14px) are replaced by sharp geometry everywhere. This is the core aesthetic. Do not add `border-radius` back.

2. **No shadows**: The old system uses layered `box-shadow` for depth. `seeds-design-system` uses borders and background color for depth hierarchy. Do not add shadows.

3. **No pill-shaped buttons**: Old system uses `border-radius: 999px`. `seeds-design-system` buttons are rectangular with `--radius: 0`.

4. **IBM Plex Mono over system mono**: The old system uses system monospace. `seeds-design-system` uses IBM Plex Mono for its geometric character that matches the aesthetic.

5. **Blue selection over purple**: The old `--sel-border: #eac1f5` (purple) is replaced by `--select: var(--postit-blue)`. Blue is thematically appropriate and doesn't signal "delete" like red/accent colors.

6. **Dashed skeleton over shimmer**: The old shimmer gradient is replaced by dashed outlines + opacity pulse. This matches the geometric aesthetic and feels more "blueprint-like."

7. **Colorway system**: The old system has one light/dark palette. `seeds-design-system` has 9 colorways. Components must use semantic tokens (`--fg`, `--bg`, `--border`) not hardcoded hex values.

### 10.3 Token Mapping

#### Colors

| Old Token | seeds-design-system Token | Notes |
|-----------|---------------|-------|
| `--bg` / `#f4f4f2` | `--bg` | Same concept, different value |
| `--surface` / `#ffffff` | `--surface` | Same concept |
| `--surface-hover` / `#f8f8f6` | `--bg-1` | Renamed — elevated surface |
| `--chrome` | N/A | Removed — use `--surface` |
| `--chrome-border` | `--border` | Simplified |
| `--divider` | `--border` | Simplified — one border token |
| `--text` | `--fg` | Renamed |
| `--text-2` | `--fg-2` | Renamed |
| `--text-3` | `--fg-3` | Renamed |
| `--text-4` | N/A | Removed — use `--fg-3` with opacity |
| `--text-5` | N/A | Removed — use `--disabled-opacity` |
| `--accent` / `#eac1f5` | `--accent` / `#cc241d` | **Different color** — Gruvbox red |
| `--accent-hover` | N/A | Use CSS `:hover` with `--accent` |
| `--accent-text` | `--bg` | Text on accent — just use background color |
| `--sel-border` / `#eac1f5` | `--select` / `var(--postit-blue)` | **Blue not purple** |
| `--sel-bg` | `--select-bg` | Same concept, blue-based |
| `--sel-glow` | N/A | Removed — no glows in flat design |

#### Status colors

| Old Pattern | seeds-design-system Token |
|-------------|---------------|
| Orange for "steered/comment" | `--postit-orange` |
| Red for "rejected" | `--accent` (red) with `--disabled-opacity` |
| Purple for "locked" | `--select` (blue) with `--border-width-accent` |
| Green for "promoted" | `--success` / `--postit-green` |
| Dashed purple for "pocket" | Dashed `--border` (no purple special-case) |

#### Typography

| Old Value | seeds-design-system Token |
|-----------|---------------|
| `24-30px` / `700` (page title) | `--text-xl` + `--weight-semibold` (smaller scale) |
| `16-18px` / `600` (section heading) | `--text-xl` + `--weight-semibold` |
| `13-14px` / `400-500` (card body) | `--text-lg` + `--weight-regular` |
| `10-11px` / `600` (label) | `--text-sm` + `--weight-medium` |
| `9-10px` / `600` (small caps) | `--text-xs` + `--weight-medium` + `--tracking-widest` |
| `13px` / `700` (button text) | `--text-md` + `--weight-semibold` |

Note: `seeds-design-system`'s type scale is intentionally smaller and more compact. The old system's 24-30px titles don't exist — the largest token is `--text-xl: 14px`. This fits the dense, tool-like aesthetic.

#### Spacing

| Old Value | seeds-design-system Token |
|-----------|---------------|
| `4px` | `--space-4` |
| `6px` | `--space-6` |
| `8px` | `--space-8` |
| `10px` | `--space-10` |
| `12px` | `--space-12` |
| `14px` | `--space-14` |
| `16px` | `--space-16` |
| `20px` | `--space-20` |
| `24px` | `--space-24` |
| `28px`, `32px`, `40px` | No token — use multiples or raw values |

#### Transitions

| Old Value | seeds-design-system Token |
|-----------|---------------|
| `120ms` (color) | `--transition-medium` (0.12s) |
| `180ms` (transform) | `--transition-slow` (0.15s) |
| `220ms` (layout) | `--transition-toast` (0.2s) |
| `280-300ms` (enter) | `--transition-anim` (0.25s) |
| `cubic-bezier(0.22, 1, 0.36, 1)` | `ease-out` (simplified) |

### 10.4 Class Name Mapping

#### Buttons

| Old Class | seeds-design-system Class |
|-----------|---------------|
| `.studio-prompt-button`, `.studio-grow-button` | `.btn-primary` |
| `.studio-secondary-button` | `.btn-ghost` |
| `.studio-card-action`, `.studio-toolbar-button` | `.btn-action` |
| Destructive variant | `.btn-danger` |

#### Cards

| Old Class | seeds-design-system Class |
|-----------|---------------|
| `.studio-card-node` | `.postit-node[data-color]` |
| `.studio-card-node.is-selected` | `.postit-node.selected` or `.node-base.selected` |
| `.studio-card-node.is-rejected` | Style with `--accent` + `--disabled-opacity` |
| `.studio-card-node.is-skeleton` | `.postit-node.skeleton` |
| `.studio-card-pill--col0` through `--col4` | `.postit-type` (single class, color from parent `data-color`) |
| `.vessel-card` | No direct equivalent — compose from `.node-base` |

#### Layout

| Old Class | seeds-design-system Class |
|-----------|---------------|
| Header with glass morphism | `.top-bar` (solid, no blur) |
| `.studio-form-field` / `.field` | `.form-group` |
| `.field-label` / `.studio-label` | `.form-label` |
| `.field-input` / `.studio-form-input` | `.form-input` |
| Debug panel (460px slide-in) | `.sidebar` (persistent, not overlay) |

#### Loading States

| Old Class | seeds-design-system Class |
|-----------|---------------|
| `.is-skeleton` | `.skeleton` |
| `.studio-skeleton-line` | `.skeleton-block` |
| `.studio-skeleton-spinner` | `.generating .generate-title svg` (spin animation) |
| Shimmer gradient keyframe | `skeleton-pulse` keyframe (opacity, not gradient) |

### 10.5 Behavioral Differences

#### Hover effects

| Old | seeds-design-system |
|-----|---------|
| `translateY(-1px)` on hover | No translate — border color change only |
| `scale(0.98)` on active | No scale — opacity change only |
| Elevated shadow on hover | No shadow — `border-color: var(--border-strong)` |

#### Animation enter effects

| Old | seeds-design-system |
|-----|---------|
| `blur(2px)→0` on card enter | No blur — `scale(0.92)→1` + fade |
| `scale(0.97)→1` on card enter | `scale(0.92)→1` on node appear |
| `300ms cubic-bezier(0.22, 1, 0.36, 1)` | `0.25s ease-out` |

#### Form validation

The old system has no client-side validation UI. `seeds-design-system` provides:
- `.form-input:focus` border change
- `.brief-attachment.error` state with `--danger` border
- `.brief-attachment-progress` for upload feedback

This is still CSS-only — the React component layer should add `FormField` with error/helper text slots (see Section 11).

### 10.6 Migration Steps

1. **Install `seeds-design-system`**: Copy `design-system/` into your project, or import from `@seeds/ui` when the package is ready.

2. **Add CSS import**: Import `design-system/index.css` alongside (not replacing) your existing `globals.css`.

3. **Set colorway attributes**: Add `data-theme` and `data-colorway` to your `<html>` element.

4. **Migrate component by component**: For each component:
   - Replace old class names with `seeds-design-system` classes
   - Remove corresponding CSS from `globals.css`
   - Verify in all 9 colorways + light/dark

5. **Eliminate hardcoded colors**: Search for hex values in your CSS and replace with tokens.

6. **Remove `globals.css`**: Once all components are migrated, delete the monolith.

### 10.7 Coexistence Strategy

During migration, old and new CSS will coexist. To prevent conflicts:

- `seeds-design-system` uses flat, semantic names (`.postit-node`, `.zone-node`) — these don't collide with the old BEM namespace (`.studio-card-node`, `.vessel-card`)
- `seeds-design-system`'s `reset.css` should be loaded first but won't break existing styles
- If using CSS layers, wrap `seeds-design-system` in `@layer seeds-design-system { }` for clean cascade control
- Token names (`--fg`, `--bg`, `--border`) may overlap — if the old system uses the same names, scope `seeds-design-system` tokens under a container class or rename the old ones during migration

### 10.8 What NOT to Migrate

Some old patterns should be dropped entirely:

| Old Pattern | Action |
|-------------|--------|
| `<div onClick>` buttons | Replace with `<button>` |
| String concatenation for class states | Use data attributes or variant classes |
| Inline event handlers on drop zones | Use React event handlers |
| `filter: invert(1)` for dark mode images | Use colorway-aware SVGs with `currentColor` |
| 5-level text hierarchy (`text-4`, `text-5`) | 3 levels (`--fg`, `--fg-2`, `--fg-3`) + opacity |
| `rgba()` hardcoded borders | `color-mix()` with tokens |
| `999px` border-radius | `--radius: 0` |
| Layered box-shadows | Borders only |

---

## 11. Future — React Component Layer

`seeds-design-system` is currently CSS-only. When building the React component layer (`@seeds/ui`):

### Recommended patterns

```tsx
// Use data-color attribute, not className variants
<PostitNode dataColor="yellow" selected>
  <PostitType>Idea</PostitType>
  <PostitText>Content here</PostitText>
</PostitNode>

// Node base as composable wrapper
<NodeBase selected multiSelected={false} dragging={false}>
  <BriefNodeInput />
</NodeBase>

// Skeleton as boolean prop, not separate component
<PostitNode dataColor="blue" skeleton />
<ProjectCard skeleton />

// Toast with built-in ellipsis
<Toast variant="thinking">generating ideas</Toast>
// Component auto-adds animated ellipsis
```

### Component checklist

- [ ] Forward refs on all components
- [ ] `className` escape hatch prop
- [ ] TypeScript prop interfaces (no `any`)
- [ ] Accept domain types (`CanvasCard`, `ContextVessel`) directly
- [ ] `prefers-reduced-motion` respected (already in CSS)
- [ ] `data-theme` + `data-colorway` support (already in CSS)
- [ ] Keyboard accessible (focus-visible already in CSS)
- [ ] Use `lucide-react` for icons (same as app)

### Package structure

```
packages/seeds-ui/
  src/
    tokens/          # Re-export CSS tokens as JS constants
    primitives/      # Button, Input, Badge, Card, Skeleton
    composed/        # NodeBase, BriefNode, FormField, DropZone, Toast
    layout/          # Sidebar, TopBar, PageShell
    utils/           # cn() helper, variant helpers
    index.ts         # Public exports
```
