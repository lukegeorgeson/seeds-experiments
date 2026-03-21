# Inspo Packs

> Pack creation, editing, and influence on generation.

---

## Overview

An Inspo Pack is a context vessel with multiple items — a curated bundle of references, vibes, or signals grouped under a semantic title. There is no separate data entity; a pack is simply a vessel used as a multi-item collection.

This document defines only the Inspo Pack concept and usage patterns. For vessel mechanics, data model, CRUD behavior, and visual treatment, see [context-vessels.md](context-vessels.md) and [context-model.md](../04_data/context-model.md).

---

## What Makes a Vessel an Inspo Pack

Any vessel with **two or more items** functions as a pack. The distinction is conceptual, not structural:

| Vessel state | Behavior |
|-------------|----------|
| 0 items | In-progress, excluded from generation |
| 1 item | Single reference — still useful, but not a "pack" |
| 2+ items | Inspo Pack — a curated collection of related signals |

The UI does not label vessels as "packs" explicitly. The term exists in product language and documentation to describe the pattern of bundling multiple references under one thematic umbrella.

---

## Common Pack Patterns

### Brand reference pack
```
[brand_inspo] "Quiet luxury, editorial clarity"
- Wales Bonner
- Jil Sander
- The Row
- Acne Studios
```
Teaches the system a taste territory through brand proxies. The title provides the interpretive frame; the items provide specificity.

### Vibe pack
```
[tone_vibe] "Voice and feel"
- ceremonial
- editorial restraint
- slow reveal
- earned confidence
```
Sets tonal direction through adjectives and phrases. Items are mood chips, not instructions.

### Anti-reference pack
```
[custom, anti] "Territory to stay away from"
- generic wellness startup
- fake futurism
- tech-bro hustle culture
- gradient mesh everything
```
Defines avoidance territory. Created via the "Anti-Reference" button (which sets `is_anti = true` on a `custom` vessel).

### Audience pack
```
[audience_cue] "Who this is for"
- creative directors at mid-size agencies
- independent fashion designers
- gallery curators
```
Grounds generation in audience specificity.

### Mixed-media pack
```
[visual_reference] "Visual direction"
- [file: mood-board.jpg]
- minimalist Japanese packaging
- [link: example.com/editorial-spread]
- matte textures, no gloss
```
Combines file uploads, links, and text items in one vessel. All item types coexist.

---

## How Packs Influence Generation

### Round 1

Packs are **primary enrichment** — the second-highest signal after the user's prompt text. They shape the initial creative territory:

- Brand packs → quality and aesthetic to channel (not templates to copy)
- Vibe packs → tonal constraints on card language and framing
- Anti packs → territory to actively avoid in all columns
- Audience packs → specificity anchors for relevance

### Round 2+

Packs decay to **background context** — still present but ranked below board-state signals (selected cards, edits, locks, groups, notes). They maintain taste consistency without overriding accumulated user decisions.

### Signal weighting detail

See [context-assembly.md](../03_ai/context-assembly.md) for exact placement in prompt assembly and [round-generation-logic.md](../03_ai/round-generation-logic.md) for full signal hierarchy.

---

## Pack Creation Flow

1. User clicks a kind button in the vessel toolbox (e.g., "Brand Inspo")
2. Vessel appears with default title, focused for editing
3. User types title (e.g., "Quiet luxury, editorial clarity")
4. User adds items one by one — Enter after each text chip, drag for files
5. Pack is persisted incrementally (vessel on create, items as added)
6. Pack is immediately active and will be included in the next generation

No "save" or "done" button. The pack is live as items are added.

---

## Pack Editing

Packs are fully editable at any point in the workspace lifecycle:

- Add/remove items after Round 1 has generated
- Change title to refine the interpretive frame
- Toggle active/inactive to temporarily exclude
- Toggle anti to flip from inspiration to avoidance
- Delete individual items without deleting the pack

Every generation call re-loads active vessels from the database, so edits take effect on the next Grow, Round 1 regeneration, or Riff.

---

## Pack and Generation Snapshot

When a round is generated, all active packs are serialized into `input_snapshot` on the `generation_requests` row. This means:

- You can see exactly what packs were active when Round 2 was generated
- Editing a pack after generation doesn't retroactively change the snapshot
- Deleting a pack doesn't remove it from historical snapshots
- The debug overlay can display which packs influenced each round

---

## v1 Scope

### Included
- Multi-item vessels functioning as packs
- All vessel kinds usable as packs
- Text, file, and link items in packs
- Anti-reference packs
- Pack state in generation snapshots

### Deferred
- Pack templates / preset packs (e.g., "Minimalist starter pack")
- Pack sharing between workspaces
- Pack analytics (which packs correlate with better outcomes)
- Cross-pack tension detection ("your brand pack and anti pack overlap")
- Pack import/export
