# Technical Architecture

## Purpose

Define the top-level technical shape of Seeds as a canvas-first web application.

This document describes how the system should be partitioned so that:

- the canvas remains the primary product surface
- `Grow` and `Riff` stay operationally distinct
- async generation remains inspectable and recoverable
- persistence quality stays high enough for round history, pocket lineage, and export quality

## Architecture summary

Seeds should run as a full-stack browser application with:

- a React-based frontend
- a server layer for orchestration and persistence
- Postgres for normalized application state
- object storage for uploaded files if used
- OpenAI Responses API for round, riff, and export generation

Architecture migration stance:

- move to round-scoped dynamic column objects now
- preserve default starting columns where useful for Round 1
- introduce true dynamic per-round columns through `Grow` incrementally
- do not preserve fixed universal columns as the long-term system model

## Core system shape

### 1. Canvas-first frontend

Responsibilities:

- render round zones horizontally
- render riff pockets vertically inside the active round
- render sparring cards in lightly separated sub-lanes within their columns
- manage interaction state
- manage streamed provisional generation state
- keep the workspace legible during round and pocket growth

### 2. Application orchestration layer

Responsibilities:

- assemble generation input from persisted state plus event history
- choose the correct orchestration path for `Grow`, `Riff`, or `Export`
- enforce round and pocket invariants
- persist normalized results only after validation

### 3. Domain and AI services

Responsibilities:

- derive process signals
- choose round stage and category logic
- apply anti-fixation and sparring rules
- build prompt inputs
- validate outputs

### 4. Persistence layer

Responsibilities:

- store workspaces, rounds, columns, cards, groups, pockets, lineage, events, generation requests, and exports
- preserve immutable round snapshots
- preserve promotion and blend relationships

## Frontend responsibilities

The frontend should own:

- workspace routing
- active round navigation
- canvas layout and viewport motion
- card-level actions
- pocket open and close state
- provisional streaming UI
- export preview UX

Recommended v1 decision:

- continue using React Flow for pan, zoom, layout primitives, and viewport transitions
- keep the visible UX structured and lane-based rather than graph-editor-like
- keep inline card editing and riff overlay composers in the canvas layer rather than moving those interactions into separate side panels

## Backend responsibilities

The backend should own:

- request validation and authorization
- generation input assembly
- AI request dispatch
- response validation and normalization
- final persistence
- debug snapshot retrieval

The client should never assemble authoritative `Grow` or `Riff` requests by itself from partial local state.

## Orchestration split: Grow versus Riff

### Grow orchestration

`Grow` should:

- load the active round snapshot
- load relevant interaction events and promoted pocket outputs
- derive fixation and convergence signals
- generate a new formal round
- stream provisional cards by category
- persist a new immutable round snapshot

### Riff orchestration

`Riff` should:

- load a source card or blend
- load local notes and minimal context
- generate a small pocket result
- stream pocket cards into a vertical sub-zone
- persist the pocket and pocket cards

Key rule:

- `Grow` and `Riff` must use separate request types, prompt templates, validators, and persistence paths

## Async generation

Generation types:

- round generation
- riff generation
- export generation
- optional debug explanation generation

Recommended v1 decision:

- keep generation behind persisted `generation_request` records for all major AI actions
- keep debug explanation additive so it never blocks primary creative flows

## Streaming assumptions

Streaming should be semantic and UI-oriented.

Round generation should be able to stream:

- request started
- category arrived
- card arrived
- category completed
- round completed
- round failed

Riff generation should be able to stream:

- request started
- pocket created
- riff card arrived
- pocket completed
- pocket failed

Rules:

- provisional cards are not authoritative until validation and persistence complete
- streamed ids must reconcile cleanly to persisted ids
- failed streams must not pollute final round history
- the client should keep provisional rounds mounted until the persisted target round has renderable cards
- the client should keep provisional riff pockets mounted until the persisted pocket for the relevant source card exists
- riff pockets may stream as titled pending zones with skeleton cards before final cards arrive

## Persistence model requirements

The system must persist:

- workspaces
- source inputs
- rounds
- columns
- cards
- groups
- riff pockets
- blends
- notes
- lineage records
- promotion events
- interaction events
- generation requests
- export artifacts

Recommended v1 decision:

- keep relational tables for core entities
- use JSONB for generation snapshots, derived process signals, and flexible debug metadata
- store `isSelected`, `isLocked`, and `isRejected` on cards for UI convenience
- also store append-only interaction events for state history

## Event and action logging

High-quality AI behavior depends on high-quality interaction logging.

The system should log:

- selections and deselections
- locks and unlocks
- rejections
- edits with before and after text
- added cards
- notes
- drag and regroup behavior
- blends
- riff starts
- promotions
- pre-Grow scaffold answers
- export creation
- concise generation rationale summaries

Why this matters:

- later round quality depends on more than final card booleans
- manual clustering and edits are premium signal
- fixation detection depends on behavioral context, not only raw card text
- inline edit flows must still emit explicit before/after edit events so text changes remain available to the AI layer

## Validation and repair

Before final persistence, the backend should validate:

- structured shape
- category count and naming quality
- card atomicity and length
- semantic non-overlap
- lineage completeness for pocket and promotion outputs

Repair behavior may:

- compact overlong cards
- reject malformed outputs and retry once
- fail fast when structure is not recoverable

## Recommended v1 decisions

- keep a single main deployable app while separating domain, AI, UI, and DB code into clear modules
- keep round snapshots immutable
- keep pocket persistence separate from round persistence
- keep group persistence separate from transient drag state
- keep export synthesis as its own generation path
- keep branching storage-ready even if the UI remains mostly linear

## Non-goals for v1

- microservices for their own sake
- event buses without demonstrated need
- full workflow engine semantics
- chat-style agent loops as the primary orchestration pattern

## Product behavior versus AI behavior versus data requirement

Product behavior:

- the user sees a calm canvas with clear round and pocket behavior

AI behavior:

- `Grow` recomposes the board
- `Riff` expands a local seed
- export assembles markdown from surviving process structure

Data requirement:

- persistence must distinguish round state from pocket state
- event logging must be rich enough to produce high-signal generation inputs
