# Database Schema

## Purpose

Define the recommended production-ready relational schema for Seeds v1.

This document turns the domain model into concrete database structures, ownership rules, and indexing guidance.

## Schema goals

- support a single-user-oriented product without blocking multi-user production deployment
- preserve round history reliably
- keep prompt assembly efficient
- support auditability and observability for AI generation
- support dynamic round-scoped columns, manual grouping, riff pockets, and promotion without schema churn

## Core production decisions

- `firm decision`: every persisted workspace belongs to a real authenticated user in production, even if current closed-alpha builds still use a stub user.
- `firm decision`: a round is immutable once it has been finalized and persisted.
- `firm decision`: reopening an old round for continued work creates a new child round rooted in that prior round, rather than mutating history.
- `firm decision`: selected, locked, and rejected state live on `cards` for UI convenience and are also recorded in append-only `interaction_events`.
- `firm decision`: manual groups are first-class rows with normalized membership via a join table, not JSON arrays stored on a round.
- `firm decision`: sparring mode and sparring placement are persisted on `cards` so restored boards match the generated board shape exactly.

## ID strategy

Recommended v1 decision:

- use UUID primary keys for all main tables
- use `created_at` and `updated_at` timestamps on user-mutable entities
- use `deleted_at` only where soft delete is truly needed; avoid broad soft delete by default

## Enumerations

Recommended Postgres enums or constrained text values:

- `workspace_status`: `active`, `archived`
- `source_input_type`: `prompt`, `pdf`, `docx`, `md`, `txt`
- `source_input_parse_status`: `pending`, `running`, `completed`, `failed`
- `round_status`: `draft`, `finalized`, `failed`
- `round_stage`: `diverge`, `synthesize`, `sharpen`, `handoff`
- `generation_request_type`: `round`, `riff`, `export`
- `generation_request_status`: `queued`, `running`, `completed`, `failed`, `cancelled`
- `card_origin_type`: `ai`, `user`, `edited_ai`, `riff`, `blend`, `locked_carry`, `promoted_riff`
- `pocket_status`: `active`, `promoted`, `discarded`, `archived`
- `note_target_type`: `card`, `blend`, `pocket`, `round`, `group`
- `sparring_mode`: `counter_position`, `simplification_pressure`, `reduction_lens`, `low_cost_alternative`, `opposite_audience`, `assumption_challenge`, `failure_probe`
- `sparring_placement`: `main`, `sub_lane`
- `interaction_event_type`: `select`, `deselect`, `edit`, `add`, `note`, `lock`, `unlock`, `reject`, `unreject`, `drag`, `group`, `ungroup`, `blend_create`, `riff_start`, `riff_promote`, `grow_start`, `grow_complete`, `export_create`

## Tables

### `profiles`

Purpose:

- app-level user profile data linked to auth

Fields:

- `id uuid primary key`
- `email text unique not null`
- `display_name text null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Notes:

- in Supabase, this is typically linked 1:1 to `auth.users.id`

### `workspaces`

Purpose:

- top-level project container

Fields:

- `id uuid primary key`
- `owner_user_id uuid not null`
- `title text not null`
- `prompt_text text null`
- `brief_summary text null`
- `status workspace_status not null default 'active'`
- `active_round_id uuid null`
- `last_export_id uuid null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:

- foreign key `owner_user_id -> profiles.id`

Indexes:

- `(owner_user_id, updated_at desc)`
- `(active_round_id)`

### `source_inputs`

Purpose:

- uploaded files and prompt-like source material attached to a workspace

Fields:

- `id uuid primary key`
- `workspace_id uuid not null`
- `created_by_user_id uuid not null`
- `type source_input_type not null`
- `filename text null`
- `mime_type text null`
- `storage_bucket text null`
- `storage_path text null`
- `inline_text text null`
- `parse_status source_input_parse_status not null default 'pending'`
- `parse_error text null`
- `byte_size integer null`
- `extracted_text text null`
- `normalized_summary text null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:

- foreign key `workspace_id -> workspaces.id`
- foreign key `created_by_user_id -> profiles.id`
- check that at least one of `storage_path` or `inline_text` is present

Indexes:

- `(workspace_id, created_at asc)`
- `(workspace_id, parse_status)`

### `rounds`

Purpose:

- immutable canvas snapshots and active draft state

Fields:

- `id uuid primary key`
- `workspace_id uuid not null`
- `number integer not null`
- `stage round_stage not null`
- `parent_round_id uuid null`
- `root_round_id uuid null`
- `status round_status not null default 'draft'`
- `generation_mode text not null`
- `title text null`
- `synthesis_summary text null`
- `rationale_summary text null`
- `scaffold_response jsonb not null default '{}'::jsonb`
- `generation_request_id uuid null`
- `created_by_user_id uuid not null`
- `created_at timestamptz not null default now()`
- `finalized_at timestamptz null`

Constraints:

- foreign key `workspace_id -> workspaces.id`
- foreign key `parent_round_id -> rounds.id`
- foreign key `root_round_id -> rounds.id`
- foreign key `created_by_user_id -> profiles.id`
- unique `(workspace_id, number, parent_round_id)`

Recommended v1 decision:

- the primary UI stays linear by following `workspaces.active_round_id`
- `parent_round_id` exists from v1 to avoid future schema migration when branching becomes visible

Indexes:

- `(workspace_id, created_at asc)`
- `(workspace_id, status)`
- `(parent_round_id)`

### `columns`

Purpose:

- ordered dynamic lane metadata for a round

Fields:

- `id uuid primary key`
- `round_id uuid not null`
- `name text not null`
- `kind text not null`
- `description text null`
- `position integer not null`
- `layout_x integer null`
- `layout_width integer null`
- `created_at timestamptz not null default now()`

Constraints:

- foreign key `round_id -> rounds.id`
- unique `(round_id, position)`
- unique `(round_id, kind)`

Indexes:

- `(round_id, position asc)`

### `cards`

Purpose:

- atomic units of ideation persisted within a round or pocket

Fields:

- `id uuid primary key`
- `round_id uuid not null`
- `column_id uuid null`
- `pocket_id uuid null`
- `created_by_user_id uuid null`
- `origin_type card_origin_type not null`
- `text text not null`
- `is_selected boolean not null default false`
- `is_locked boolean not null default false`
- `is_rejected boolean not null default false`
- `is_promoted boolean not null default false`
- `sparring_mode sparring_mode null`
- `sparring_placement sparring_placement null`
- `sort_order numeric(12,4) not null`
- `layout_x integer null`
- `layout_y integer null`
- `source_round_id uuid null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:

- foreign key `round_id -> rounds.id`
- foreign key `column_id -> columns.id`
- foreign key `pocket_id -> riff_pockets.id`
- foreign key `created_by_user_id -> profiles.id`
- foreign key `source_round_id -> rounds.id`
- check that at least one of `column_id` or `pocket_id` is present

Indexes:

- `(round_id, column_id, sort_order asc)`
- `(pocket_id, sort_order asc)`
- `(round_id, is_selected)`
- `(round_id, is_locked)`
- `(round_id, is_rejected)`
- `(round_id, is_promoted)`

Recommended v1 decision:

- store selected, locked, rejected, and promoted as explicit columns for fast UI restore
- also record semantic events in `interaction_events`
- persist `sparring_mode` and `sparring_placement` directly on the card because sparring layout is part of the authored board state

### `groups`

Purpose:

- lightweight manual clusters created by the user inside a round

Fields:

- `id uuid primary key`
- `workspace_id uuid not null`
- `round_id uuid not null`
- `title text null`
- `note text null`
- `created_by_user_id uuid not null`
- `created_at timestamptz not null default now()`

Constraints:

- foreign key `workspace_id -> workspaces.id`
- foreign key `round_id -> rounds.id`
- foreign key `created_by_user_id -> profiles.id`

Indexes:

- `(round_id, created_at asc)`

### `group_cards`

Purpose:

- normalized membership between groups and cards

Fields:

- `group_id uuid not null`
- `card_id uuid not null`
- `position integer null`
- `created_at timestamptz not null default now()`

Constraints:

- primary key `(group_id, card_id)`
- foreign key `group_id -> groups.id`
- foreign key `card_id -> cards.id`

Indexes:

- `(card_id)`
- `(group_id, position asc)`

Recommended v1 decision:

- use a join table instead of storing `card_ids` in JSON or an array column
- this keeps membership queryable, avoids write-amplifying full-row rewrites, and allows future support for card order inside a group

### `riff_pockets`

Purpose:

- local Y-axis exploration clusters attached to a round

Fields:

- `id uuid primary key`
- `workspace_id uuid not null`
- `round_id uuid not null`
- `source_blend_id uuid null`
- `pocket_goal text null`
- `title text null`
- `status pocket_status not null default 'active'`
- `summary_for_grow text null`
- `layout_y integer null`
- `generation_request_id uuid null`
- `created_by_user_id uuid not null`
- `created_at timestamptz not null default now()`

Constraints:

- foreign key `workspace_id -> workspaces.id`
- foreign key `round_id -> rounds.id`
- foreign key `created_by_user_id -> profiles.id`

Indexes:

- `(round_id, created_at asc)`
- `(round_id, status)`

### `riff_pocket_sources`

Purpose:

- normalized source membership between a riff pocket and its source cards

Fields:

- `pocket_id uuid not null`
- `source_card_id uuid not null`
- `created_at timestamptz not null default now()`

Constraints:

- primary key `(pocket_id, source_card_id)`
- foreign key `pocket_id -> riff_pockets.id`
- foreign key `source_card_id -> cards.id`

Indexes:

- `(source_card_id)`

### `blends`

Purpose:

- user-created synthesis seeds made from multiple cards

Fields:

- `id uuid primary key`
- `workspace_id uuid not null`
- `round_id uuid not null`
- `summary text null`
- `created_by_user_id uuid not null`
- `created_at timestamptz not null default now()`

Constraints:

- foreign key `workspace_id -> workspaces.id`
- foreign key `round_id -> rounds.id`
- foreign key `created_by_user_id -> profiles.id`

Indexes:

- `(round_id, created_at asc)`

### `blend_cards`

Purpose:

- normalized membership between blends and source cards

Fields:

- `blend_id uuid not null`
- `source_card_id uuid not null`
- `position integer null`
- `created_at timestamptz not null default now()`

Constraints:

- primary key `(blend_id, source_card_id)`
- foreign key `blend_id -> blends.id`
- foreign key `source_card_id -> cards.id`

Indexes:

- `(source_card_id)`

### `notes`

Purpose:

- user-authored steering notes attached to cards, rounds, pockets, blends, or groups

Fields:

- `id uuid primary key`
- `workspace_id uuid not null`
- `target_type note_target_type not null`
- `target_id uuid not null`
- `created_by_user_id uuid not null`
- `text text not null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:

- foreign key `workspace_id -> workspaces.id`
- foreign key `created_by_user_id -> profiles.id`

Indexes:

- `(workspace_id, created_at asc)`
- `(target_type, target_id, created_at asc)`

Recommended v1 decision:

- use a polymorphic note target at the application layer
- enforce target existence in service code rather than attempting polymorphic foreign keys in SQL

### `card_provenance`

Purpose:

- explicit lineage between a derived card and its source cards

Fields:

- `id uuid primary key`
- `card_id uuid not null`
- `source_card_id uuid not null`
- `relationship_type text not null`
- `created_at timestamptz not null default now()`

Constraints:

- foreign key `card_id -> cards.id`
- foreign key `source_card_id -> cards.id`
- unique `(card_id, source_card_id, relationship_type)`

Recommended relationship types:

- `riff_from`
- `blend_from`
- `carry_from`
- `synthesized_from`
- `promoted_from`

Indexes:

- `(card_id)`
- `(source_card_id)`

### `promotion_events`

Purpose:

- explicit record of promoting a riff card into the main round flow

Fields:

- `id uuid primary key`
- `workspace_id uuid not null`
- `round_id uuid not null`
- `pocket_id uuid not null`
- `source_card_id uuid not null`
- `promoted_card_id uuid not null`
- `created_by_user_id uuid not null`
- `created_at timestamptz not null default now()`

Constraints:

- foreign key `workspace_id -> workspaces.id`
- foreign key `round_id -> rounds.id`
- foreign key `pocket_id -> riff_pockets.id`
- foreign key `source_card_id -> cards.id`
- foreign key `promoted_card_id -> cards.id`
- foreign key `created_by_user_id -> profiles.id`

Indexes:

- `(round_id, created_at asc)`
- `(pocket_id, created_at asc)`

### `interaction_events`

Purpose:

- semantic event log for signal weighting, audit, and analytics

Fields:

- `id uuid primary key`
- `workspace_id uuid not null`
- `round_id uuid null`
- `card_id uuid null`
- `group_id uuid null`
- `pocket_id uuid null`
- `blend_id uuid null`
- `actor_user_id uuid not null`
- `event_type interaction_event_type not null`
- `payload jsonb not null default '{}'::jsonb`
- `idempotency_key text null`
- `created_at timestamptz not null default now()`

Constraints:

- foreign key `workspace_id -> workspaces.id`
- foreign key `round_id -> rounds.id`
- foreign key `card_id -> cards.id`
- foreign key `group_id -> groups.id`
- foreign key `pocket_id -> riff_pockets.id`
- foreign key `blend_id -> blends.id`
- foreign key `actor_user_id -> profiles.id`

Indexes:

- `(workspace_id, created_at asc)`
- `(round_id, created_at asc)`
- `(card_id, created_at asc)`
- unique `(idempotency_key)` where `idempotency_key is not null`

### `generation_requests`

Purpose:

- durable record of generation jobs and model metadata

Fields:

- `id uuid primary key`
- `workspace_id uuid not null`
- `round_id uuid null`
- `pocket_id uuid null`
- `requested_by_user_id uuid not null`
- `request_type generation_request_type not null`
- `status generation_request_status not null default 'queued'`
- `model text not null`
- `prompt_version text not null`
- `request_fingerprint text not null`
- `input_snapshot jsonb not null`
- `derived_signals jsonb null`
- `rationale_summary text null`
- `stream_started_at timestamptz null`
- `started_at timestamptz null`
- `completed_at timestamptz null`
- `failed_at timestamptz null`
- `error_code text null`
- `error_message text null`
- `response_snapshot jsonb null`
- `created_at timestamptz not null default now()`

Constraints:

- foreign key `workspace_id -> workspaces.id`
- foreign key `round_id -> rounds.id`
- foreign key `pocket_id -> riff_pockets.id`
- foreign key `requested_by_user_id -> profiles.id`

Indexes:

- `(workspace_id, created_at desc)`
- `(round_id, created_at desc)`
- `(pocket_id, created_at desc)`
- `(status, created_at asc)`
- unique `(request_fingerprint)` for active deduplication policy

Recommended v1 decision:

- persist full rationale inside `input_snapshot` and `response_snapshot`
- also persist a concise `rationale_summary` field for debug surfaces and product transparency

### `exports`

Purpose:

- stored markdown outputs

Fields:

- `id uuid primary key`
- `workspace_id uuid not null`
- `source_round_id uuid not null`
- `created_by_user_id uuid not null`
- `markdown_body text not null`
- `export_version text not null`
- `input_snapshot jsonb null`
- `created_at timestamptz not null default now()`

Constraints:

- foreign key `workspace_id -> workspaces.id`
- foreign key `source_round_id -> rounds.id`
- foreign key `created_by_user_id -> profiles.id`

Indexes:

- `(workspace_id, created_at desc)`

## Ownership and RLS shape

- every user-owned row must trace back to `owner_user_id` or `created_by_user_id`
- all workspace-scoped tables should be readable only if the current auth user owns the workspace
- writes should be constrained to the owning user
- service-role operations should be limited to backend server code for generation, ingestion, and export

## Draft versus finalized rounds

Recommended v1 lifecycle:

1. create a draft round record when a generation request begins
2. stream provisional UI events without treating them as authoritative database state
3. persist the finalized round with dynamic columns, cards, groups, and pocket references
4. set `finalized_at` and move the round to `finalized`
5. update `workspaces.active_round_id`

## Non-goals for v1

- generalized polymorphic SQL foreign keys for notes
- vector storage or embedding tables
- denormalizing group membership into arrays for convenience
