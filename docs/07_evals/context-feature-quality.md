# Context Feature Quality

> Quality criteria, test scenarios, and evaluation rubric for context vessels and the Start Zone.

---

## Overview

This document defines how to evaluate the quality of the context vessel and Start Zone implementation across four dimensions: data integrity, UX correctness, generation influence, and canvas integration.

---

## Quality Dimensions

### 1. Data integrity

Vessels and items are persisted correctly, survive page reloads, and cascade-delete properly.

### 2. UX correctness

Vessel CRUD interactions work as specified, Start Zone transitions are smooth, and visual treatment matches spec.

### 3. Generation influence

Vessels actually shape generation output — positive vessels steer toward, anti vessels steer away, and signal decay works across rounds.

### 4. Canvas integration

Start Zone behaves as a native ReactFlow node — pans, zooms, collapses, and coexists with round zones without layout breakage.

---

## Test Scenarios

### Data Integrity

| # | Scenario | Expected Outcome | Pass Criteria |
|---|----------|------------------|---------------|
| D1 | Create vessel with all six kinds | Each kind persists with correct `vessel_kind` | DB row matches input; API returns correct kind |
| D2 | Add text, file, and link items to vessel | Items persist with correct `item_type` and content | Items load on page refresh with correct data |
| D3 | Delete vessel | Vessel and all items cascade-deleted | No orphaned `vessel_items` rows; vessel gone from API response |
| D4 | Delete workspace | All vessels and items cascade-deleted | No orphaned rows in `context_vessels` or `vessel_items` |
| D5 | Toggle `is_anti` on vessel | Flag persists correctly | `is_anti` value correct after page refresh |
| D6 | Toggle `activation_state` | State persists correctly | `activation_state` value correct after page refresh |
| D7 | Reorder vessels (update position) | Position values persist | Vessels return in correct position order |
| D8 | Edit vessel title and description | Updates persist | Title/description correct after page refresh |
| D9 | Create vessel, close tab, reopen workspace | Vessel present | Vessels survive tab closure |
| D10 | Generate round, check `input_snapshot` | Active vessels serialized in snapshot | `input_snapshot.vessels` contains correct vessel data |

### UX Correctness

| # | Scenario | Expected Outcome | Pass Criteria |
|---|----------|------------------|---------------|
| U1 | Open new workspace | Start Zone expanded, prompt focused | Textarea visible and focused; vessel toolbox visible |
| U2 | Click kind button in toolbox | New vessel created with default title | Vessel appears in toolbox; title field focused for editing |
| U3 | Type text item and press Enter | Item chip appears in vessel | Chip visible; item persisted to API |
| U4 | Click ✕ on item chip | Item removed | Chip gone; item deleted from API |
| U5 | Toggle vessel active/inactive | Visual treatment changes | Active: full opacity; Inactive: dimmed |
| U6 | Toggle vessel anti | Visual treatment changes | Anti: red-tinted border/badge; Normal: standard |
| U7 | Create vessel with 0 items, generate | Vessel excluded from generation | Vessel not in `input_snapshot.vessels` |
| U8 | Create vessel with items, deactivate, generate | Vessel excluded from generation | Vessel not in `input_snapshot.vessels` |
| U9 | Generate Round 1 | Start Zone collapses | Collapsed state shows prompt summary + vessel indicators |
| U10 | Click collapsed Start Zone | Expands to full editing state | All vessel cards, toolbox, prompt textarea visible and editable |
| U11 | Edit vessel after Round 1, generate Round 2 | Updated vessel content in Round 2 generation | `input_snapshot` on Round 2 reflects edits |
| U12 | Delete vessel after Round 1 | Vessel removed; historical snapshots intact | Vessel gone from UI; Round 1 `input_snapshot` still has it |
| U13 | Click example prompt | Fills textarea | Prompt text populated; example prompts disappear |

### Generation Influence

| # | Scenario | Expected Outcome | Pass Criteria |
|---|----------|------------------|---------------|
| G1 | Round 1 with brand inspo vessel | Generated cards channel brand qualities | Cards reflect the sensibility of referenced brands without naming them |
| G2 | Round 1 with tone/vibe vessel | Card language matches vibe cues | Card voice feels ceremonial/editorial/etc. per vessel items |
| G3 | Round 1 with anti-reference vessel | Generated cards avoid anti territory | No cards in the avoidance zone defined by anti items |
| G4 | Round 1 with audience cue vessel | Cards grounded in audience specificity | Ideas relevant to specified audience |
| G5 | Round 2 with same vessels | Vessels present but board state takes precedence | Generation shaped primarily by selections/edits, with vessel as background |
| G6 | Round 1 with multiple vessels | All active vessels influence output | Prompt assembly includes all vessel blocks; output reflects combined signal |
| G7 | Round 1 with both positive and anti vessels | Positive direction with anti boundaries | Cards steer toward positive, avoid anti territory |
| G8 | Generate with vessels exceeding token budget | Truncation applied; generation succeeds | No errors; vessels truncated per priority rules; `truncated: true` recorded |
| G9 | Round 1 with no vessels, only prompt | Generation works normally | No regression; empty vessel blocks omitted from prompt |
| G10 | Riff with active vessels | Vessels present at low weight | Riff output has faint vessel influence; source card is primary |

### Canvas Integration

| # | Scenario | Expected Outcome | Pass Criteria |
|---|----------|------------------|---------------|
| C1 | Pan canvas left | Start Zone visible | Start Zone pans with canvas as ReactFlow node |
| C2 | Zoom canvas | Start Zone scales | Start Zone scales with zoom level |
| C3 | Generate Round 1 | Viewport shifts to Round 1 zone | Round 1 zone visible; Start Zone at left edge (may need pan to see) |
| C4 | Start Zone expanded + Round 1 zone | No layout overlap | Start Zone and Round 1 zone separated by `ROUND_ZONE_GAP` |
| C5 | Start Zone collapsed + Round 1 zone | Correct spacing | Collapsed Start Zone width + gap + Round 1 zone = no overlap |
| C6 | Multiple rounds generated | Round zones positioned correctly | All round zones shifted right by Start Zone reserved width |
| C7 | Expand/collapse Start Zone | Smooth transition | Width transition animates over 300-400ms; no layout jump |
| C8 | Start Zone with many vessels | Scrollable or wrapping | Vessel list doesn't break Start Zone height; overflow handled |

---

## Evaluation Rubric

### Per-scenario scoring

| Score | Meaning |
|-------|---------|
| Pass | Scenario works as specified |
| Partial | Core behavior works but with minor issues (visual glitches, slow transitions) |
| Fail | Scenario does not produce expected outcome |
| Blocked | Cannot test due to dependency or infrastructure issue |

### Feature-level quality gates

| Gate | Criteria | Required for ship |
|------|----------|-------------------|
| Data integrity | All D1-D10 pass | Yes |
| UX correctness | All U1-U13 pass | Yes |
| Generation influence | G1-G7, G9 pass; G8, G10 partial acceptable | Yes (G8/G10 partial OK) |
| Canvas integration | All C1-C8 pass | Yes |

### Known acceptable gaps in v1

- Token budget truncation (G8) may be approximate — character-based heuristic, not exact tokenizer
- Riff vessel influence (G10) may be subtle and hard to evaluate deterministically
- Start Zone transition animation (C7) may be refined iteratively — functional correctness over polish
- No automated generation quality tests — G1-G7 require human evaluation

---

## Regression Checks

Verify that vessel implementation does not break existing functionality:

| # | Check | What to verify |
|---|-------|---------------|
| R1 | Workspace without vessels | Creating and generating a workspace without any vessels works identically to current behavior |
| R2 | Existing workspaces | Opening a workspace created before vessel migration shows no errors (0 vessels, Start Zone works) |
| R3 | Round generation quality | Round generation without vessels produces same quality output (no regression from system prompt changes) |
| R4 | Riff generation | Riffing without vessels works identically |
| R5 | Canvas layout | Round zones, columns, cards, pockets all render at correct positions after layout metrics change |
| R6 | Viewport transitions | Round-to-round viewport shifts work correctly with Start Zone present |
| R7 | Card interactions | Select, lock, reject, edit, group — all card interactions unaffected |
| R8 | Export | Markdown export from rounds works correctly |
| R9 | Debug overlay | Debug overlay shows vessel data in input_snapshot for rounds generated with vessels |

---

## Test Data Fixtures

### Minimal vessel set (for quick testing)

```json
[
  {
    "vesselKind": "brand_inspo",
    "title": "Reference brands",
    "items": [
      { "itemType": "text", "textContent": "Aesop" },
      { "itemType": "text", "textContent": "Muji" }
    ]
  },
  {
    "vesselKind": "tone_vibe",
    "title": "Voice",
    "items": [
      { "itemType": "text", "textContent": "calm" },
      { "itemType": "text", "textContent": "precise" }
    ]
  }
]
```

### Full vessel set (for comprehensive testing)

```json
[
  {
    "vesselKind": "brand_inspo",
    "title": "Quiet luxury, editorial clarity",
    "items": [
      { "itemType": "text", "textContent": "Wales Bonner" },
      { "itemType": "text", "textContent": "Jil Sander" },
      { "itemType": "text", "textContent": "The Row" },
      { "itemType": "text", "textContent": "Acne Studios" }
    ]
  },
  {
    "vesselKind": "tone_vibe",
    "title": "Voice and feel",
    "items": [
      { "itemType": "text", "textContent": "ceremonial" },
      { "itemType": "text", "textContent": "editorial restraint" },
      { "itemType": "text", "textContent": "slow reveal" }
    ]
  },
  {
    "vesselKind": "audience_cue",
    "title": "Who this is for",
    "items": [
      { "itemType": "text", "textContent": "creative directors at mid-size agencies" },
      { "itemType": "text", "textContent": "independent fashion designers" }
    ]
  },
  {
    "vesselKind": "custom",
    "title": "Territory to stay away from",
    "isAnti": true,
    "items": [
      { "itemType": "text", "textContent": "generic wellness startup" },
      { "itemType": "text", "textContent": "fake futurism" },
      { "itemType": "text", "textContent": "tech-bro hustle culture" }
    ]
  },
  {
    "vesselKind": "material_texture",
    "title": "Textures and materials",
    "items": [
      { "itemType": "text", "textContent": "matte ceramic" },
      { "itemType": "text", "textContent": "raw linen" },
      { "itemType": "text", "textContent": "oxidized brass" }
    ]
  },
  {
    "vesselKind": "visual_reference",
    "title": "Visual direction",
    "items": [
      { "itemType": "text", "textContent": "minimalist Japanese packaging" },
      { "itemType": "text", "textContent": "editorial photography, desaturated" }
    ]
  }
]
```

### Anti-only vessel set (edge case)

```json
[
  {
    "vesselKind": "custom",
    "title": "Avoid at all costs",
    "isAnti": true,
    "items": [
      { "itemType": "text", "textContent": "corporate jargon" },
      { "itemType": "text", "textContent": "rainbow gradient" },
      { "itemType": "text", "textContent": "inspirational quotes" }
    ]
  }
]
```
