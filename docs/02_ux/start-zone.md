# Start Zone

> Blank project experience, layout, transition to board state.

---

## Overview

The Start Zone replaces the current floating `PromptSurface` with a canvas-native region where the user is already inside the workspace from the first second. It is a registered ReactFlow node type (`startZone`) that pans and zooms with the canvas naturally — not an overlay that sits outside the viewport.

The Start Zone contains the prompt textarea, file drop zone, and vessel toolbox. After Round 1 generates, it transitions to a collapsed state. Vessels remain inspectable, toggleable, and editable at any point.

---

## Design Rationale

The current `PromptSurface` (workspace-canvas.tsx) is a floating form on a blank page that disappears once Round 1 generates. This creates two problems:

1. **Spiritual separation**: The prompt entry feels like a pre-step rather than part of the creative workspace
2. **Lost context**: Once generation starts, the user's input context (prompt, references, vibes) vanishes from the canvas

The Start Zone fixes both by making initial input a canvas-native region that persists (collapsed) alongside generated rounds.

---

## Layout

### Position on canvas

The Start Zone occupies a fixed region at the **left edge of the canvas**, before the Round 1 zone. It uses the same spatial coordinate system as round zones.

```
┌─────────────────┐  ┌─────────────────────────────────────┐
│                  │  │                                     │
│   START ZONE     │  │           ROUND 1 ZONE              │
│                  │  │                                     │
│  [Prompt area]   │  │  Col 1  │  Col 2  │  Col 3  │ ... │
│  [File drop]     │  │   ○ ○   │   ○ ○   │   ○ ○   │     │
│  [Vessel toolbox]│  │   ○ ○   │   ○ ○   │   ○ ○   │     │
│                  │  │         │         │         │     │
└─────────────────┘  └─────────────────────────────────────┘
   ← ROUND_ZONE_GAP →
```

### Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| Zone width | ~480px | Wider than a single column, narrower than a full round zone |
| Zone origin X | 0 | Start Zone is always at canvas origin |
| Round 1 origin X | Zone width + `ROUND_ZONE_GAP` (200px) | Existing round layout shifts right |
| Vertical alignment | Centered on canvas Y midpoint | Aligns with round zone vertical center |

### Start Zone node registration

```typescript
const nodeTypes = {
  startZone: StartZoneNode,   // NEW
  column: ColumnNode,
  card: CardNode,
  skeleton: SkeletonCardNode,
  pocketZone: PocketZoneNode,
};
```

---

## Expanded State (Pre-Generation)

The Start Zone is fully expanded before Round 1 generates. Layout from top to bottom:

### 1. Prompt textarea

- Always visible, always first
- Same styling as current `PromptSurface` textarea
- Placeholder: "What are you exploring?"
- Auto-grows with content (up to max height, then scrolls)
- No change from current prompt behavior — this is the primary input

### 2. File drop zone

- Always visible below prompt
- Accepts drag-and-drop files (images, PDFs, documents)
- Files processed through existing `source_inputs` pipeline
- Shows thumbnails/names of dropped files
- Same behavior as current file drop — just relocated into Start Zone

### 3. Generate button

- Primary action button: "Generate" / "Start exploring"
- Triggers `POST /api/workspaces/:id/generate-round-one/stream`
- Disabled until prompt has content
- Same keyboard shortcut as current PromptSurface (Cmd+Enter)

### 4. Vessel toolbox (below generate button)

- Collapsible section labeled "Add context" or similar
- Contains kind buttons for creating vessels:

```
[ Brand Inspo ] [ Visual Ref ] [ Tone/Vibe ]
[ Audience ]    [ Material ]   [ Custom ]
[ Anti-Reference ]
```

- Below buttons: list of existing vessels as compact cards
- See [context-vessels.md](context-vessels.md) for vessel card visual treatment
- Vessels are optional — prompt + file drop remain the top-level primitives

### 5. Example prompts (empty state only)

- When prompt is empty and no vessels exist, show example prompts below the toolbox
- Same example prompts as current `PromptSurface`
- Clicking an example fills the prompt textarea
- Disappear once user starts typing or creates a vessel

---

## Collapsed State (Post-Generation)

After Round 1 generates, the Start Zone transitions to a collapsed state:

### Appearance

```
┌─────────────────────────────────┐
│ ✎ "Brand identity for a quiet  │  ← prompt summary (truncated)
│    luxury ceramics studio..."   │
│                                 │
│ ● Brand Inspo (3)  ● Vibe (2) │  ← active vessel indicators
│ ○ Anti-Ref (2)                 │  ← anti vessel in red accent
│                                 │
│ [ Expand ]                      │  ← click to re-expand
└─────────────────────────────────┘
```

### Metrics

| Metric | Value |
|--------|-------|
| Collapsed width | ~280px (roughly one column width) |
| Collapsed height | Dynamic based on content, typically 80-140px |

### Behavior

- Shows first ~80 characters of prompt text
- Shows compact vessel indicators: kind badge + title + item count
- Active vessels at full opacity, inactive dimmed
- Anti vessels with red accent
- Single click on "Expand" or the collapsed zone re-expands to full Start Zone
- Re-expanded Start Zone allows full editing of prompt text, vessels, and files
- Re-collapsing happens via "Collapse" button or clicking outside

---

## Transition Animation

### Expand → Collapse (after Round 1 generates)

1. Round 1 generation starts streaming
2. Viewport begins panning right toward Round 1 zone (existing behavior)
3. Start Zone begins width transition: 480px → 280px over 400ms (ease-out)
4. Prompt textarea fades to summary text
5. Vessel cards compress to indicator pills
6. Vessel toolbox fades out
7. File drop zone fades out

### Collapse → Expand (user clicks to edit)

1. User clicks collapsed Start Zone
2. Width transitions: 280px → 480px over 300ms (ease-out)
3. Summary text expands back to editable textarea
4. Vessel indicators expand to full vessel cards
5. Vessel toolbox fades in
6. File drop zone fades in

---

## Viewport Behavior

### Initial load (new workspace)

- Viewport centers on Start Zone
- No round zones exist yet
- Canvas is interactive (pan, zoom) but Start Zone is the focus

### After Round 1 generates

- Viewport pans right to center on Round 1 zone (existing behavior from `PromptSurface`)
- Start Zone collapses as viewport moves away
- Start Zone remains visible at left edge if user pans back

### Returning to Start Zone

- User can pan left to see collapsed Start Zone at any time
- Round navigation bar does not include Start Zone (it shows Round 1, 2, 3...)
- Start Zone is always at the leftmost position

---

## State Management

### New state in `workspace-studio.tsx`

```typescript
// Vessel state
const [vessels, setVessels] = useState<ContextVessel[]>([]);

// Start Zone expansion state
const [startZoneExpanded, setStartZoneExpanded] = useState(true);
// Defaults to true (expanded) for new workspaces
// Set to false after Round 1 generates
// Toggled by user interaction
```

### Vessel loading

On workspace load, fetch vessels via `GET /api/workspaces/:id/vessels` and populate state. Vessels are loaded regardless of whether rounds exist.

### Vessel CRUD handlers

```typescript
const handleCreateVessel = async (kind: VesselKind) => { ... };
const handleUpdateVessel = async (vesselId: string, patch: Partial<ContextVessel>) => { ... };
const handleDeleteVessel = async (vesselId: string) => { ... };
const handleAddVesselItem = async (vesselId: string, item: Partial<VesselItem>) => { ... };
const handleRemoveVesselItem = async (vesselId: string, itemId: string) => { ... };
```

These handlers call the vessel API endpoints and update local state on success.

---

## Component Structure

### New components

| Component | File | Purpose |
|-----------|------|---------|
| `StartZoneNode` | `start-zone.tsx` | ReactFlow node wrapping the entire Start Zone |
| `VesselToolbox` | `vessel-toolbox.tsx` | Kind buttons + vessel list |
| `VesselCard` | `vessel-card.tsx` | Compact vessel display with inline editing |
| `VesselEditor` | `vessel-editor.tsx` | Inline editor for vessel title, description, items |

### Modified components

| Component | Change |
|-----------|--------|
| `workspace-canvas.tsx` | Remove `PromptSurface`, add `startZone` to `nodeTypes`, adjust `buildLayoutMetrics` to account for Start Zone width |
| `workspace-studio.tsx` | Add vessel state, CRUD handlers, pass vessels to generation calls, load vessels on workspace open |
| `workspace-empty-state.tsx` | May merge into Start Zone or adapt (Start Zone handles the empty state now) |

---

## Migration from PromptSurface

The current `PromptSurface` component (workspace-canvas.tsx, line 105) handles:
1. Prompt textarea with placeholder
2. Example prompt cards
3. File drop zone
4. Generate button

All four responsibilities move into `StartZoneNode`. The `PromptSurface` component is deleted. The `CanvasMode` type (`"prompt" | "board"`) is replaced by Start Zone expanded/collapsed state — the canvas is always in "board" mode; the Start Zone is just another node on it.

---

## v1 Scope

### Included
- Start Zone as ReactFlow node type
- Prompt textarea, file drop, generate button in Start Zone
- Vessel toolbox with all six kinds + anti-reference button
- Example prompts in empty state
- Collapse transition after Round 1
- Expand/collapse toggle
- Vessel indicators in collapsed state
- Full vessel editing in expanded state

### Deferred
- Start Zone minimap indicator
- Animated vessel creation (vessel "grows" into place)
- Drag vessels from toolbox to canvas
- Start Zone templates (pre-configured vessel sets)
- Multi-user collaborative Start Zone editing
