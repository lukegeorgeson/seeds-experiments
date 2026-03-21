# Context Vessels

> Vessel concept, interaction patterns, visual treatment, and CRUD behavior.

---

## Overview

A context vessel is a small, labeled container of creative context that teaches the generation system taste without requiring long prose prompts. Vessels hold items — text chips, file references, links — grouped under a semantic title like "Reference brands I like the vibe of" or "Territory to stay away from."

Vessels are workspace-scoped, not round-scoped. They persist across the full workspace lifecycle and remain fully editable at any point. Every generation call loads active vessels from the database, picking up mid-session changes.

This document is the authoritative spec for vessel mechanics. See [context-model.md](../04_data/context-model.md) for data model, [inspo-packs.md](inspo-packs.md) for the Inspo Pack concept, and [start-zone.md](start-zone.md) for where vessels live on the canvas.

---

## Vessel Anatomy

```
┌─────────────────────────────────────────┐
│ 🏷 Brand Inspo                    ● ✕  │  ← kind badge, active toggle, delete
│ "Reference brands I like the vibe of"   │  ← title (semantic, included in prompt)
│                                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │Wales Bonner│ │Jil Sander│ │ The Row  │ │  ← items (text chips)
│ └──────────┘ └──────────┘ └──────────┘ │
│                                         │
│ [ + Add item ]                          │  ← item input
└─────────────────────────────────────────┘
```

### Elements

| Element | Required | Purpose |
|---------|----------|---------|
| Kind badge | Yes | Visual indicator of vessel type — colored label chip |
| Title | Yes | Semantic signal included verbatim in generation prompt |
| Description | No | Optional elaboration, also passed to generation |
| Items | No (but required for generation inclusion) | The actual content: text chips, files, links |
| Active toggle | Yes | Switches between `active` / `inactive` |
| Anti toggle | Yes | Marks vessel as avoidance signal |
| Delete button | Yes | Removes vessel and all items (cascade) |

---

## Vessel Kinds

Six kinds are available, presented as labeled buttons in the vessel toolbox:

| Kind | Label | Badge Color | Default Title |
|------|-------|-------------|---------------|
| `brand_inspo` | Brand Inspo | Warm amber | "Reference brands" |
| `visual_reference` | Visual Reference | Cool blue | "Visual direction" |
| `tone_vibe` | Tone / Vibe | Soft purple | "Voice and feel" |
| `audience_cue` | Audience Cue | Green | "Who this is for" |
| `material_texture` | Material / Texture | Earthy brown | "Textures and materials" |
| `custom` | Custom | Neutral gray | "Context" |

A seventh button, **Anti-Reference**, creates a `custom` vessel with `is_anti = true` pre-set. It is not a separate kind — `anti_reference` is never a value of `vessel_kind`.

---

## Interaction Patterns

### Creating a vessel

1. User clicks a kind button in the vessel toolbox (inside Start Zone)
2. New vessel is created immediately via `POST /api/workspaces/:id/vessels` with default title and empty items
3. Vessel card appears in the toolbox area with title focused for inline editing
4. User types or accepts default title, then adds items

### Adding items

- **Text items**: User types in the item input field and presses Enter. Creates a chip. Multiple chips can be added in sequence.
- **File items**: User drags a file onto the vessel card, or clicks an upload button. File is processed through existing `source_inputs` pipeline, then linked as a `file`-type item.
- **Link items**: User pastes a URL. Stored as-is — no content fetching in v1.

Each item is persisted immediately via `POST /api/workspaces/:id/vessels/:vesselId/items`.

### Editing a vessel

- **Title**: Click to edit inline. Blur or Enter saves via `PATCH`.
- **Description**: Click "Add description" to reveal textarea. Blur saves.
- **Items**: Items can be reordered (drag), removed (click ✕ on chip), or added.
- **Kind**: Not changeable after creation. User should delete and recreate if wrong kind chosen.

### Toggling activation

Single click on the active indicator toggles between `active` (included in generation) and `inactive` (excluded). Visual treatment:

| State | Appearance |
|-------|------------|
| Active | Full opacity, colored kind badge |
| Inactive | Reduced opacity (0.5), muted badge, "paused" indicator |

### Toggling anti

The anti toggle flips `is_anti` on the vessel. Visual treatment:

| State | Appearance |
|-------|------------|
| Normal | Standard vessel appearance |
| Anti | Red-tinted border or badge overlay, "avoid" indicator |

Any vessel kind can be anti. A `brand_inspo` vessel marked anti means "avoid the vibe of these brands."

### Deleting a vessel

Click delete (✕). No confirmation modal — action is immediate. Historical snapshots in `input_snapshot` are unaffected.

---

## Visual Treatment

### Vessel card (expanded)

- **Container**: Rounded rectangle, subtle border, background tinted by kind color at low opacity
- **Kind badge**: Small colored pill in top-left showing kind label
- **Title**: Semi-bold, editable inline
- **Items**: Horizontal chip flow, wrapping. Each chip shows text content (or filename for files, domain for links)
- **Controls**: Active toggle (dot indicator), anti toggle, delete button — all in top-right corner row

### Vessel card (collapsed, post-Round 1)

After the Start Zone collapses, vessels render as compact indicators:

- **Pill format**: `[Kind badge] Title (N items)` — single line
- **Active vessels**: Full opacity
- **Inactive vessels**: Dimmed, smaller
- **Anti vessels**: Red accent on pill
- Click to expand Start Zone and edit

### Empty vessel

- Shows title and "Add items to include in generation" hint text
- Visually distinct (dashed border) to signal incompleteness
- Excluded from generation — no items means no signal

---

## Generation Behavior

### Inclusion rules

A vessel is included in prompt assembly when ALL of:
1. `activation_state = 'active'`
2. Item count > 0

### Prompt rendering

Vessels render into the user prompt as structured text blocks. See [context-assembly.md](../03_ai/context-assembly.md) for full assembly spec.

**Positive vessels** (is_anti = false):
```
Active context vessels:
[brand_inspo] "Reference brands I like the vibe of": Quiet luxury, editorial clarity
- Wales Bonner
- Jil Sander
- The Row
```

**Anti vessels** (is_anti = true):
```
Anti-references (avoid these directions):
[custom, anti] "Territory to stay away from":
- generic wellness startup
- fake futurism
```

### Audit trail

At generation time, active vessels are serialized into `input_snapshot` on `generation_requests`. See [context-model.md](../04_data/context-model.md) for snapshot schema.

---

## CRUD API

All endpoints follow existing patterns from [api-contracts.md](../05_technical/api-contracts.md).

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/workspaces/:id/vessels` | List all vessels for workspace (all states) |
| `POST` | `/api/workspaces/:id/vessels` | Create vessel |
| `PATCH` | `/api/workspaces/:id/vessels/:vesselId` | Update vessel (title, description, is_anti, activation_state, position) |
| `DELETE` | `/api/workspaces/:id/vessels/:vesselId` | Delete vessel (cascade deletes items) |
| `POST` | `/api/workspaces/:id/vessels/:vesselId/items` | Add item(s) to vessel |
| `DELETE` | `/api/workspaces/:id/vessels/:vesselId/items/:itemId` | Remove item from vessel |

### Request/response shapes

**Create vessel:**
```json
POST /api/workspaces/:id/vessels
{
  "vesselKind": "brand_inspo",
  "title": "Reference brands",
  "description": null,
  "isAnti": false
}
→ { "vessel": ContextVessel }
```

**Update vessel:**
```json
PATCH /api/workspaces/:id/vessels/:vesselId
{
  "title": "Brands I admire",
  "isAnti": false,
  "activationState": "active"
}
→ { "vessel": ContextVessel }
```

**Add item:**
```json
POST /api/workspaces/:id/vessels/:vesselId/items
{
  "itemType": "text",
  "textContent": "Wales Bonner"
}
→ { "item": VesselItem }
```

---

## Data Layer Functions

New functions in `workspaces.ts`:

| Function | Purpose |
|----------|---------|
| `createVessel(workspaceId, userId, input)` | Insert `context_vessels` row, return with empty items |
| `updateVessel(workspaceId, vesselId, patch)` | Partial update on `context_vessels` |
| `deleteVessel(workspaceId, vesselId)` | Delete vessel (items cascade) |
| `addVesselItem(vesselId, input)` | Insert `vessel_items` row |
| `removeVesselItem(vesselId, itemId)` | Delete single item |
| `listVessels(workspaceId)` | Load all vessels with items, ordered by position |
| `listActiveVessels(workspaceId)` | Load active vessels with ≥1 item, ordered by position |
| `resolveVesselContextBlocks(workspaceId)` | Load active vessels, format as prompt text blocks, return for assembly |

---

## v1 Scope

### Included
- All six vessel kinds + custom
- Text items (chips/tags)
- File items via existing `source_inputs`
- Link items (stored URL, no fetching)
- is_anti toggle on any vessel
- active / inactive toggle
- Full CRUD lifecycle
- Vessel serialization in input_snapshot
- Token budget enforcement (~800 tokens)

### Deferred
- `next_action_only` activation state
- Influence strength slider per vessel
- Image analysis for visual reference items
- Link content fetching and summarization
- Vessel templates / presets
- Cross-workspace vessel sharing
- Drag-to-reorder between vessels
