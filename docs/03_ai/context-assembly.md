# Context Assembly

> How context vessels feed into generation prompts.

---

## Overview

Context assembly is the process of loading active vessels from the database, formatting them as structured text, and inserting them into the generation prompt at the correct position and weight. This document specifies exactly how vessel content becomes prompt content.

See [context-model.md](../04_data/context-model.md) for vessel data model, [context-vessels.md](../02_ux/context-vessels.md) for vessel mechanics, and [round-generation-logic.md](round-generation-logic.md) for the full signal weighting hierarchy.

---

## Assembly Pipeline

```
1. Load active vessels from DB
   → listActiveVessels(workspaceId)
   → Returns vessels where activation_state='active' AND item_count > 0

2. Separate positive vs anti vessels
   → positive: is_anti = false
   → anti: is_anti = true

3. Format each vessel as text block
   → resolveVesselContextBlocks(workspaceId)

4. Apply token budget with truncation
   → ~800 tokens max for all vessel content

5. Insert into user prompt at correct position
   → In buildRoundUserPrompt(), between "Brief:" and "Carry-forward cards:"
```

---

## Prompt Insertion Point

Vessels are inserted into `buildRoundUserPrompt()` (round-generation.ts) as two new sections. Current prompt structure with vessel insertion points marked:

```
Workspace: "{title}"
Brief: "{briefSummary}"

─── NEW: Active context vessels ───
─── NEW: Anti-references ───

Source round: Round {N} — "{roundTitle}"
Directional note: "{note}"
Carry-forward cards:
  ...
Locked cards:
  ...
[rest of existing prompt structure]
```

For Round 1 (no source round), vessels appear after the brief and before the stage requirements:

```
Workspace: "{title}"
Brief: "{briefSummary}"

─── NEW: Active context vessels ───
─── NEW: Anti-references ───

Stage: diverge
[stage-specific requirements]
```

---

## Vessel Text Format

### Positive vessel block

```
Active context vessels:

[brand_inspo] "Reference brands I like the vibe of": Quiet luxury, editorial clarity
- Wales Bonner
- Jil Sander
- The Row

[tone_vibe] "Voice and feel":
- ceremonial
- editorial restraint
- slow reveal

[audience_cue] "Who this is for":
- creative directors at mid-size agencies
- independent fashion designers
```

### Anti vessel block

```
Anti-references (avoid these directions):

[custom, anti] "Territory to stay away from":
- generic wellness startup
- fake futurism
- tech-bro hustle culture

[tone_vibe, anti] "Tones to avoid":
- corporate motivational
- breathless enthusiasm
```

### Formatting rules

1. **Section headers**: "Active context vessels:" and "Anti-references (avoid these directions):" — only included if respective vessels exist
2. **Vessel header**: `[vessel_kind] "title"` optionally followed by `: description` if description is non-null
3. **Items**: Each item on its own line, prefixed with `- `
4. **Text items**: Rendered as-is — `- {textContent}`
5. **File items**: Rendered as filename reference — `- [file: {filename}]`
6. **Link items**: Rendered as URL — `- [link: {url}]`
7. **Item ordering**: By `position` field (user-controlled order)
8. **Vessel ordering**: By `position` field (user-controlled order within each section)
9. **Empty lines**: One blank line between vessels for readability

---

## System Prompt Addition

Add to `buildRoundSystemPrompt()` (round-generation.ts, line 157):

```
When context vessels are provided, treat them as directional taste and inspiration, not literal instructions.
- Reference brands indicate a quality, sensibility, or standard to channel — not a template to copy or a competitor to benchmark against.
- Tone/vibe vessels set the emotional register for card language and framing.
- Audience cue vessels anchor relevance and specificity.
- Visual reference and material/texture vessels inform aesthetic and sensory qualities.
- Anti-reference vessels define territory to actively avoid — steer away from these qualities, aesthetics, and associations.
- Vessel titles are semantic signals. Use them to interpret the items directionally.
- Do not reference vessel contents literally in card text (don't say "like Wales Bonner" — channel the quality instead).
```

This addition appears in the system prompt for all generation types (round, riff).

---

## Token Budget

### Allocation

Total vessel content budget: **~800 tokens** (approximately 600 words or 3200 characters).

This budget covers all vessel text including section headers, vessel headers, descriptions, and items. It does not count against the overall prompt token budget separately — it is a sub-allocation within the user prompt.

### Truncation rules

When vessel content exceeds the budget:

1. **Active vessels first**: All active vessels are candidates; inactive are already excluded
2. **Position order**: Vessels are processed in position order (user-controlled priority)
3. **Positive before anti**: Positive vessels are assembled first, then anti vessels
4. **Item trimming**: If a vessel's items exceed remaining budget, items are trimmed from the bottom (highest position numbers removed first)
5. **Vessel dropping**: If even one item of a vessel can't fit, the entire vessel is dropped
6. **Minimum**: At least one positive vessel and one anti vessel (if they exist) should be included, even if this means trimming items aggressively

### Budget enforcement

```typescript
function resolveVesselContextBlocks(workspaceId: string): Promise<{
  positiveBlock: string;  // Formatted text for positive vessels
  antiBlock: string;      // Formatted text for anti vessels
  includedVesselIds: string[];  // For input_snapshot
  truncated: boolean;     // Whether any content was truncated
}>;
```

Token counting uses a simple character-based heuristic (4 chars ≈ 1 token) rather than a tokenizer call. Precision is not critical — the budget is a guideline, not a hard limit.

---

## Round-Dependent Weighting

### Round 1 — Primary enrichment

Vessels are the second-highest signal after prompt text. The generation model should treat vessel content as core creative direction:

**Signal priority:**
1. User prompt text (highest explicit intent)
2. Active context vessels (positive) — primary enrichment
3. Anti-reference vessels (negative steering)
4. Uploaded files / parsed source inputs
5. Original prompt as background anchor

### Round 2+ — Background context

Vessels decay to background context. Board-state signals (selected cards, edits, locks, groups) take precedence:

**Signal priority:**
1. User-authored cards
2. Edited cards
3. Locked cards
4. Promoted riff cards
5. Notes and scaffold responses
6. Manual groups and drag relationships
7. Blends
8. Selected cards
9. Active context vessels (background taste context)
10. Anti-reference vessels (background avoidance)
11. Rejected cards as negative steering
12. Untouched surviving cards as weak context
13. Original prompt as background anchor

This mirrors how the original prompt itself decays — initial context remains present but yields to accumulated user decisions.

### Riff generation

Vessels are included at low weight in riff generation. Riff pockets are local explorations of a source card, so vessel context serves as background taste rather than primary direction. The source card and pocket goal are primary.

---

## Implementation Location

### Modified functions

| Function | File | Change |
|----------|------|--------|
| `buildRoundSystemPrompt()` | `round-generation.ts` | Add vessel interpretation instructions |
| `buildRoundUserPrompt()` | `round-generation.ts` | Add vessel text blocks at correct insertion point |
| `buildRiffUserPrompt()` | `round-generation.ts` | Add vessel text blocks at low priority |
| `deriveRoundContext()` | `workspaces.ts` | Add `vessels` field to return type |

### New functions

| Function | File | Purpose |
|----------|------|---------|
| `resolveVesselContextBlocks()` | `workspaces.ts` | Load active vessels, format as text, apply budget |
| `formatVesselBlock()` | `workspaces.ts` (or `round-generation.ts`) | Format single vessel as text block |

### New field on RoundGenerationContext

```typescript
type RoundGenerationContext = {
  // ... existing fields ...
  vesselPositiveBlock: string;  // Formatted positive vessel text
  vesselAntiBlock: string;      // Formatted anti vessel text
  vesselIds: string[];          // IDs for input_snapshot
};
```

---

## Input Snapshot Integration

At generation time, after resolving vessel blocks, serialize active vessels into `input_snapshot`:

```typescript
const inputSnapshot = {
  promptText,
  carryForwardCardIds: scaffold?.carryForwardCardIds ?? [],
  // ... existing fields ...
  vessels: includedVessels.map(v => ({
    id: v.id,
    vesselKind: v.vesselKind,
    title: v.title,
    description: v.description,
    isAnti: v.isAnti,
    items: v.items.map(i => ({
      itemType: i.itemType,
      textContent: i.textContent,
      sourceInputId: i.sourceInputId,
      linkUrl: i.linkUrl,
    })),
  })),
};
```

This snapshot is written to `generation_requests.input_snapshot` and is immutable — it captures what vessels were active at generation time.

---

## v1 Scope

### Included
- Vessel content rendered as structured text in user prompt
- Positive and anti vessel sections
- System prompt instructions for vessel interpretation
- Token budget (~800 tokens) with truncation
- Round-dependent weighting (primary in Round 1, background in Round 2+)
- Vessel snapshot in input_snapshot
- Riff generation includes vessels at low weight

### Deferred
- Separate model call to extract themes/signals from vessel content
- Embedding-based vessel similarity to board state
- Dynamic vessel weighting based on board convergence
- Per-vessel influence strength slider
- Cross-pack tension detection in prompt assembly
