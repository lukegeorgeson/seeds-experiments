# Round State Model

## Purpose

Define what constitutes a round state, how round snapshots are preserved, and what state is passed into `Grow` versus `Riff`.

This document is a data and orchestration spec.

## Round state definition

A round state is the normalized snapshot of one formal board state at a point in time.

It includes:

- round metadata
- visible columns
- main-lane cards and ordering
- stored groups and group membership
- round-level notes
- pocket summaries for that round
- current curation state
- lineage references
- generation provenance

It does not include:

- mutable client-only UI hover state
- unfinished streaming partials that were never finalized

## Snapshot rules

Firm rules:

- each finalized round is immutable
- a new `Grow` creates a new round snapshot
- revisiting a prior round and growing from it creates a child round
- pocket creation does not mutate round identity

Recommended v1 decision:

- preserve finalized snapshot objects directly rather than reconstructing them only from event replay

## What is preserved in a round snapshot

Required preserved data:

- `round.id`
- `round.number`
- `round.stage`
- `round.parentRoundId`
- `round.title`
- `round.synthesisSummary`
- `round.rationaleSummary`
- ordered visible columns
- ordered main-lane cards
- stored groups with membership and optional title or note
- current select, lock, and reject state on cards
- user edits and authored cards as visible text
- mandatory scaffold answers
- compact pocket summary metadata
- generation request reference

Optional but recommended preserved data:

- normalized grouping relationships
- blend references
- derived fixation and convergence scores

## Pocket state inside a round

Pockets belong to a round but are not equivalent to round state.

A pocket state includes:

- pocket metadata
- source lineage
- pocket cards and ordering
- promotion outcomes
- current pocket visibility or status
- optional compact summary for future weak-context use in `Grow`

Pocket state should be queryable alongside a round, but persisted separately enough that local experimentation does not blur formal round history.

## What is passed into Grow

`Grow` should receive a normalized input object assembled from:

- source round snapshot
- selected cards
- locked cards
- edited cards
- user-authored cards
- notes
- group objects and group summaries
- blend relationships
- drag and regroup relationships
- promoted riff outputs
- rejected cards or directions
- mandatory scaffold responses
- compact prior-round history
- derived process signals such as fixation, novelty spread, and convergence level

Rules:

- only promoted riff outputs should become high-confidence main-lane input
- raw unpromoted riff cards are excluded from `Grow` by default
- unpromoted pocket output may be included only as weak pocket-level metadata if explicitly configured
- historical rounds should contribute compact summaries, not full raw board dumps

## What is passed into Riff

`Riff` should receive a much smaller context object:

- parent round id
- source card or blend id
- source text
- local notes
- local sibling context when useful
- workspace brief summary
- requested pocket goal if present

Rules:

- `Riff` should not receive the whole board unless needed for minimal grounding
- `Riff` should not be able to rename round categories or create a new round snapshot

## History assumptions

The system should preserve:

- linear round order on the primary path
- parent-child round ancestry for future visible branching
- group membership inside each round
- pocket lineage within each round
- promotion history from pocket to main lane

Recommended v1 decision:

- support one visible primary path in the UI
- keep alternative child rounds addressable in storage

## Streaming assumptions

- streamed partial content is provisional until validation and persistence complete
- provisional card ids should reconcile to persisted ids
- failed generation should never masquerade as a finalized round state

## Derived state versus stored state

Store directly:

- rounds
- columns
- cards
- groups
- pockets
- lineage links
- interaction events
- generation snapshots

Derive on read or generation assembly:

- fixation score
- semantic repetition score
- novelty spread
- safe-selection score
- convergence level

Recommended v1 decision:

- persist derived signals inside generation snapshots for debuggability, but do not require them as standalone relational tables yet
