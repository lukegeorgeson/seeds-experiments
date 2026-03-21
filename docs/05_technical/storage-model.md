# Storage Model

## Purpose

Define where data lives and how it should be partitioned in v1.

## Primary storage choices

- Postgres via Supabase for application data
- Supabase Storage for uploaded files

## What belongs in Postgres

- workspaces
- source input metadata
- extracted text and summaries
- rounds
- columns
- cards
- notes
- interaction events
- generation requests
- exports

## What belongs in object storage

- original uploaded files
- optional derived artifacts that are too large for row storage

## Recommended v1 decisions

- `recommended v1 decision`: store normalized text artifacts in Postgres for prompt assembly convenience.
- `recommended v1 decision`: keep the original uploaded file in object storage even after text extraction succeeds.
- `recommended v1 decision`: use JSONB only for flexible metadata and snapshots, not as a replacement for core relational tables.

## Data shape guidance

- normalize core entities for reliable querying
- use JSONB for prompt input snapshots, model metadata, and event payloads
- keep round snapshots reconstructable without replaying every event

## Retention and recovery

- workspaces should be durable by default
- generation metadata should be retained for debugging and evals
- failed jobs should remain inspectable

## Non-goals for v1

- warehouse-style analytics pipelines
- generalized vector storage
- asset management beyond what uploaded brief files require

## Future-facing notes

- vector search can later be introduced for optional knowledge features without changing the core relational model
- export history can later expand to multiple artifact types using the same storage approach
