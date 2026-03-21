# Context Model

> Domain entities, tables, and relationships for the context vessel system.

---

## Overview

Context vessels are workspace-scoped containers of creative context — brand references, vibes, anti-references, audience cues — that persist across the full workspace lifecycle and feed into every generation call. An "Inspo Pack" is simply a vessel with multiple items; there is no separate entity.

This document is the single source of truth for vessel data model. All other specs cross-reference here.

---

## Tables

### `context_vessels`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `workspace_id` | `uuid` | FK → `workspaces(id)` ON DELETE CASCADE, NOT NULL | Scoped to workspace, not round |
| `created_by_user_id` | `uuid` | FK → `profiles(id)`, NOT NULL | |
| `vessel_kind` | `text` | NOT NULL, CHECK IN (`brand_inspo`, `visual_reference`, `tone_vibe`, `audience_cue`, `material_texture`, `custom`) | `anti_reference` is NOT a kind — anti is a flag |
| `title` | `text` | NOT NULL | Semantic signal — included verbatim in generation prompt |
| `description` | `text` | | Optional elaboration — also passed to generation |
| `is_anti` | `boolean` | NOT NULL, DEFAULT `false` | Routes to avoidance section in prompt assembly |
| `activation_state` | `text` | NOT NULL, DEFAULT `'active'`, CHECK IN (`active`, `inactive`) | v1 supports `active` / `inactive` only; `next_action_only` deferred |
| `position` | `integer` | NOT NULL, DEFAULT `0` | User-controlled ordering within workspace |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**Indexes:**
- `idx_context_vessels_workspace` on `(workspace_id)` — primary lookup path
- `idx_context_vessels_active` on `(workspace_id, activation_state)` WHERE `activation_state = 'active'` — generation-time query

### `vessel_items`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `vessel_id` | `uuid` | FK → `context_vessels(id)` ON DELETE CASCADE, NOT NULL | |
| `item_type` | `text` | NOT NULL, DEFAULT `'text'`, CHECK IN (`text`, `file`, `link`) | |
| `text_content` | `text` | | For `text` items — chips, tags, short phrases |
| `source_input_id` | `uuid` | FK → `source_inputs(id)` | For `file` items — reuses existing file ingestion infra |
| `link_url` | `text` | | For `link` items — stored as-is in v1, no content fetching |
| `position` | `integer` | NOT NULL, DEFAULT `0` | Item ordering within vessel |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**Indexes:**
- `idx_vessel_items_vessel` on `(vessel_id)` — load items with vessel

---

## Relationships

```
workspaces
  └── context_vessels (many, cascade delete)
        ├── vessel_items (many, cascade delete)
        │     └── source_inputs (optional FK for file items)
        └── profiles (created_by_user_id)

generation_requests
  └── input_snapshot (JSONB) — contains serialized active vessels at generation time
```

- **Workspace → Vessels**: One workspace has zero or more vessels. Vessels are workspace-scoped, not round-scoped. They persist and remain editable across the full lifecycle.
- **Vessel → Items**: One vessel has zero or more items. Items are the actual content (text chips, files, links). A vessel with zero items is considered in-progress and is excluded from generation.
- **Vessel Item → Source Input**: File-type items reference existing `source_inputs` rows, reusing the file ingestion pipeline already in place.
- **Vessel → Generation Snapshot**: At generation time, active vessels are serialized into the `input_snapshot` JSONB field on `generation_requests`. This preserves what vessels were active when any round was generated, even if vessels are later edited or deleted.

---

## Domain Types

Added to `packages/domain/src/index.ts`:

```typescript
export type VesselKind =
  | "brand_inspo"
  | "visual_reference"
  | "tone_vibe"
  | "audience_cue"
  | "material_texture"
  | "custom";

export type VesselActivationState = "active" | "inactive";
// "next_action_only" deferred to post-v1

export type VesselItemType = "text" | "file" | "link";

export interface ContextVessel {
  id: string;
  workspaceId: string;
  createdByUserId: string;
  vesselKind: VesselKind;
  title: string;
  description: string | null;
  isAnti: boolean;
  activationState: VesselActivationState;
  position: number;
  items: VesselItem[];
  createdAt: string;
  updatedAt: string;
}

export interface VesselItem {
  id: string;
  vesselId: string;
  itemType: VesselItemType;
  textContent: string | null;
  sourceInputId: string | null;
  linkUrl: string | null;
  position: number;
  createdAt: string;
}
```

---

## Vessel Kind Semantics

| Kind | UI Label | Typical Items | Purpose |
|------|----------|---------------|---------|
| `brand_inspo` | Brand Inspo | Brand names, company references | Channel the quality/vibe of these brands |
| `visual_reference` | Visual Reference | Image files, style descriptions | Visual direction and aesthetic cues |
| `tone_vibe` | Tone / Vibe | Adjectives, mood words | Voice and feel for generated content |
| `audience_cue` | Audience Cue | Audience descriptions, personas | Who the work is for |
| `material_texture` | Material / Texture | Material names, texture descriptions | Physical or sensory qualities |
| `custom` | Custom | Anything | User-defined contextual signal |

Any vessel kind can be toggled `is_anti = true`, which routes it to the avoidance section during prompt assembly. The starter palette's "Anti-Reference" button creates a `custom` vessel with `is_anti = true`.

---

## Activation States

| State | Behavior |
|-------|----------|
| `active` | Included in generation prompt assembly |
| `inactive` | Persisted but excluded from generation |

Toggle is instant — no confirmation required. Re-activating a vessel immediately includes it in the next generation call.

---

## Lifecycle Rules

1. **Creation**: Vessels are created via explicit user action (toolbox button click or drag-to-create). Persisted immediately via API call — no optimistic-only state.
2. **Editing**: Vessels are fully mutable at any point. Title, description, kind, items, activation state, and anti flag can all be changed after Round 1 has generated.
3. **Deletion**: Cascade deletes all items. Historical snapshots in `input_snapshot` are unaffected since they are serialized copies.
4. **Generation inclusion**: Only vessels with `activation_state = 'active'` AND at least one item are included in prompt assembly. Empty vessels (title only, no items) are excluded.
5. **Snapshot**: At generation time, `resolveVesselContextBlocks()` serializes active vessels into the `input_snapshot` JSONB field on the `generation_requests` row. This is the audit trail.

---

## Migration

New migration file: `202603180005_context_vessels.sql`

```sql
-- Context vessels: workspace-scoped creative context containers
create table context_vessels (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  created_by_user_id uuid not null references profiles(id),
  vessel_kind text not null check (vessel_kind in (
    'brand_inspo', 'visual_reference', 'tone_vibe',
    'audience_cue', 'material_texture', 'custom'
  )),
  title text not null,
  description text,
  is_anti boolean not null default false,
  activation_state text not null default 'active'
    check (activation_state in ('active', 'inactive')),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_context_vessels_workspace on context_vessels(workspace_id);
create index idx_context_vessels_active on context_vessels(workspace_id, activation_state)
  where activation_state = 'active';

-- Vessel items: content within a vessel (text chips, files, links)
create table vessel_items (
  id uuid primary key default gen_random_uuid(),
  vessel_id uuid not null references context_vessels(id) on delete cascade,
  item_type text not null default 'text'
    check (item_type in ('text', 'file', 'link')),
  text_content text,
  source_input_id uuid references source_inputs(id),
  link_url text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_vessel_items_vessel on vessel_items(vessel_id);

-- updated_at trigger (reuse pattern from existing migrations)
create or replace function update_context_vessel_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_context_vessel_updated
  before update on context_vessels
  for each row execute function update_context_vessel_timestamp();
```

---

## Input Snapshot Schema Extension

When vessels are active at generation time, the `input_snapshot` JSONB field on `generation_requests` includes a `vessels` array:

```json
{
  "promptText": "...",
  "carryForwardCardIds": ["..."],
  "vessels": [
    {
      "id": "uuid",
      "vesselKind": "brand_inspo",
      "title": "Reference brands I like the vibe of",
      "description": null,
      "isAnti": false,
      "items": [
        { "itemType": "text", "textContent": "Wales Bonner" },
        { "itemType": "text", "textContent": "Jil Sander" }
      ]
    }
  ]
}
```

This is a denormalized snapshot — it captures vessel state at generation time regardless of subsequent edits or deletions.
