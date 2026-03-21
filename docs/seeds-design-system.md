# Seeds Design System — Reference Spec

> **Source**: Handover document from the main Seeds app repo (March 2026).
> **Status**: Guidance, not absolute truth. The main app is not production-structured — this doc captures intent and current state to inform new work.
> **Use this for**: Understanding the app's visual language, tokens, and component patterns when building app UI prototypes, design system components, or marketing pages in this repo.

---

## Stack Context

| Layer | Current app | Target for new work |
|-------|------------|-------------------|
| Framework | Next.js 16 (App Router, React 19, Turbopack) | Same |
| Language | TypeScript 5.9, strict mode | Same |
| Styling | Vanilla CSS + custom properties (single 4000+ line globals.css) | Tailwind CSS + custom properties |
| Icons | `lucide-react` | Same |
| Canvas | `@xyflow/react` (ReactFlow) | Same |
| Auth/DB | Supabase | Same |
| Monorepo | `apps/web`, `packages/domain`, `packages/ui` (empty) | Same |

---

## Design Tokens

### Colors — Semantic

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| bg | `#f4f4f2` | `#131316` | Page background |
| surface | `#ffffff` | `#1b1b20` | Cards, panels |
| surface-hover | `#f8f8f6` | `#232329` | Hover state for surfaces |
| chrome | `#ffffff` | `#1b1b20` | Headers, toolbars (often with backdrop blur) |
| chrome-border | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.07)` | Subtle borders on chrome |
| divider | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.07)` | Separator lines |

### Colors — Text Hierarchy

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| text | `#1a1a18` | `#e8e8e4` | Primary / headings |
| text-2 | `#5a5a56` | `#a8a8a4` | Secondary / body |
| text-3 | `#8a8a86` | `#6e6e6a` | Tertiary / labels |
| text-4 | `#b5b5b2` | `#4a4a48` | Quaternary / placeholders |
| text-5 | `#d5d5d2` | `#333330` | Faint / disabled |

### Colors — Accent

| Token | Value | Usage |
|-------|-------|-------|
| accent | `#eac1f5` | Primary accent (purple/pink), same in both modes |
| accent-hover | `#ddb0eb` | Hover state |
| accent-text | `#2f2433` (light) / `#f0e0f8` (dark) | Text on accent background |

### Colors — Selection State

| Token | Value |
|-------|-------|
| sel-border | `#eac1f5` |
| sel-bg | `rgba(234,193,245,0.18)` |
| sel-glow | `rgba(234,193,245,0.26)` |

### Colors — Card Status

| Status | Color | Usage |
|--------|-------|-------|
| Steered/Comment | `rgba(212,146,71)` / orange | Card has a steering comment |
| Rejected | red, opacity 0.55, desaturated | Card explicitly rejected |
| Locked | accent border, thicker | Card locked for carry-forward |
| Promoted riff | green border | Card promoted from a riff pocket |
| Pocket/riff | dashed purple border | Card is in a riff pocket |

### Colors — Vessel Kind Badges

| Kind | Color |
|------|-------|
| brand_inspo | `#fef3c7` (amber) |
| visual_reference | `#dbeafe` (blue) |
| tone_vibe | `#f3e8ff` (purple) |
| audience_cue | `#dcfce7` (green) |
| material_texture | `#ffe4e6` (rose) |
| custom | `#f3f4f6` (gray) |

### Typography

Font: `Inter, ui-sans-serif, system-ui, -apple-system, sans-serif`
Mono: `"SFMono-Regular", ui-monospace, "Cascadia Code", "Roboto Mono", monospace`

| Use Case | Size | Weight | Letter Spacing |
|----------|------|--------|----------------|
| Page title | 24-30px | 700 | -0.03em |
| Section heading | 16-18px | 600 | -0.01em |
| Card body | 13-14px | 400-500 | normal |
| Label / meta | 10-11px | 600 | 0.04-0.08em |
| Small caps label | 9-10px | 600 | 0.06-0.12em (uppercase) |
| Button text | 13px | 700 | 0.01em |

### Spacing

No formal scale. Values used: 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 40px. A 4px base grid covers all cases.

### Border Radius

| Element | Radius |
|---------|--------|
| Cards | 12-14px |
| Buttons (pill) | 999px |
| Buttons (rect) | 8-10px |
| Inputs | 10px |
| Badges/pills | 999px |
| Modals/panels | 16-18px |

### Shadows

```css
/* Card resting */
box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);

/* Card hover */
box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.04);

/* Selected card glow */
box-shadow: 0 0 0 2px var(--sel-border), 0 0 16px var(--sel-glow);

/* Button primary */
box-shadow: 0 2px 8px rgba(234,193,245,0.3), 0 1px 3px rgba(0,0,0,0.08);
```

### Transitions

Standard durations: 120ms (color), 180ms (transforms/shadows), 220ms (layout), 280-300ms (enter animations).
Easing: `ease` for simple, `cubic-bezier(0.22, 1, 0.36, 1)` for enter/appear.

---

## Component Inventory

### Tier 1 — Primitives

**Button** — 3 variants: Primary (accent bg, pill), Secondary (border only, pill), Ghost (no border, hover reveals bg). States: hover (translateY -1px), active (scale 0.98), disabled (opacity 0.6), loading (spinner).

**Input / Textarea** — Text input, large textarea (prompts), small textarea (inline editing), inline edit (transparent bg). Currently 4+ redundant implementations.

**Badge / Pill** — Column categories, card origin ("ai"/"user"/"riff"), vessel kind, status ("promoted"/"carry"), count badges.

**Card** — The core component. Used for canvas cards (ideas), project cards (dashboard), vessel cards (context). All share: surface bg, 12-14px radius, subtle shadow, hover lift. Canvas cards have composable states: `selected + locked`, `rejected`, `has-comment`, `is-skeleton`, `is-pocket`, `is-entering`.

### Tier 2 — Composed

**Header / Toolbar** — Fixed glass morphism bar (backdrop blur + semi-transparent bg). Contains logo, project title (editable), round tabs, actions.

**Drop Zone** — Dashed border drag-drop area. Sub-components: DropZone, FileChip, ProgressRing.

**Form Field** — Label + input + error wrapper.

**Dialog / Panel** — Overlay panel (slides from right, 460px) and modal node (centered on canvas). Both use backdrop blur.

**Skeleton** — Shimmer overlay on cards, line variants (long/medium/short), spinner, float animation.

### Tier 3 — Domain-Specific

VesselCard, CanvasCard, StartZone, RoundTab, ColumnNode, RiffComposer, ExampleChip, SortDropdown. These compose from Tier 1 & 2.

---

## Layout Patterns

| Shell | Structure | Scroll |
|-------|-----------|--------|
| Dashboard | Header + scrollable grid | Page scrolls |
| Studio | Header + full-viewport canvas | Canvas pans (ReactFlow) |
| Landing | Centered prompt node | No scroll |

Single responsive breakpoint at **980px**. Below: single column, stacked. Above: multi-column, side panels.

---

## Animation & Motion

| Animation | Duration | Easing | Properties |
|-----------|----------|--------|------------|
| Page enter | 300ms | cubic-bezier(0.22, 1, 0.36, 1) | opacity, translateY 6→0 |
| Card enter | 280ms | same | opacity, scale 0.97→1, blur 2→0 |
| Pill appear | 200ms | same | scale 0.85→1, translateY 4→0 |
| Skeleton shimmer | 1.6s | infinite | gradient sweep |
| Spinner | 1.1s | infinite | rotation |

`prefers-reduced-motion: reduce` must be respected (all animations to 0.01ms).

---

## Dark Mode

Implemented via `data-theme="dark"` on `<html>` (not media query — user-controlled). Accent stays `#eac1f5` in both modes.

---

## Domain Types

```typescript
type WorkspaceSummary = {
  id: string; title: string; status: "active" | "archived";
  roundCount: number; briefSummary: string | null;
  createdAt: string; updatedAt: string;
};

type CanvasCard = {
  id: string; text: string;
  originType: "ai" | "user" | "edited_ai" | "riff" | "blend" | "locked_carry" | "promoted_riff";
  isSelected: boolean; isLocked: boolean; isRejected: boolean;
  steeringComment: string | null; influence: CardInfluenceMetadata;
};

type ContextVessel = {
  id: string;
  vesselKind: "brand_inspo" | "visual_reference" | "tone_vibe" | "audience_cue" | "material_texture" | "custom";
  title: string; description: string | null;
  isAnti: boolean; activationState: "active" | "inactive";
  items: VesselItem[];
};

type CardInfluenceState =
  | "selected" | "rejected" | "locked" | "commented"
  | "riff_source" | "riff_variant" | "promoted_riff";
```

---

## Known Anti-Patterns in Current App

These are what new work in this repo should avoid:

1. Single monolithic CSS file (4000+ lines in globals.css)
2. No component abstraction — just CSS classes on raw HTML
3. Card state via string concatenation (fragile)
4. 5+ duplicated button/input style variants
5. No formal design token layer
6. No client-side form validation UI
7. Inconsistent HTML semantics (`<div onClick>` instead of `<button>`)

## Recommended Target Architecture

```
packages/seeds-ui/
  src/
    tokens/          # Colors, spacing, typography, shadows
    primitives/      # Button, Input, Textarea, Badge, Card, Skeleton
    composed/        # Header, FormField, DropZone, FileChip, Panel, Dialog
    layout/          # Shell, PageHeader, Grid
    utils/           # cn() helper, variant helpers
    index.ts
```

Use variant-based APIs (cva or tailwind-variants), `forwardRef`, semantic HTML, and CSS layers to avoid conflicts during incremental migration.
