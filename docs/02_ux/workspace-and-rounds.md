# Workspace and Rounds

## Purpose

Define the canvas structure for Seeds as a round-based creative workspace.

This document is a product and UX spec. It establishes how the board is laid out, how rounds advance, how local riffing stays separate from round growth, and how history remains legible over time.

## Core rule

Seeds uses a two-axis model:

- X axis = formal round progression
- Y axis = local riff pockets inside a round

This is a product rule, not only a layout choice.

Interpretation:

- moving horizontally means the workspace has advanced to a new round state through `Grow`
- moving vertically means the user is exploring a local branch through `Riff`
- a riff pocket is not a round
- a promoted riff output can re-enter the main round flow, but promotion is explicit

## Workspace definition

A workspace is the persistent container for one creative exploration.

It should preserve:

- title
- original prompt and source inputs
- all rounds
- all riff pockets
- interaction history
- generation metadata
- export history

The workspace is the product-level object a user reopens later.

## Three-layer workspace model

### Layer 1: Main round flow

A horizontal progression of formal canvas states.

Recommended v1 progression:

- Round 1 = divergent exploration
- Round 2 = sensemaking and clustering
- Round 3 = sharpening and stress-testing
- Round 4 = handoff and coherence

### Layer 2: Local riff pockets

Vertical side explorations attached to a source card or source blend within a round.

Riff pockets must:

- render as a distinct sub-zone beneath the source column rather than masquerading as a child card stack
- retain visible lineage to the source
- remain small and modular
- allow later promotion into the main lane
- avoid looking like a hidden full-board reroll
- carry a short pocket title derived from the riff intent or returned pocket title
- appear immediately in a provisional state with skeleton cards while generation is in progress

### Layer 3: Hidden process engine

The UI does not need to show this as a dashboard, but the system must track it.

The engine reasons over:

- selected card count and distribution
- locked cards
- edited cards
- user-authored cards
- notes
- blends
- drag and regroup patterns
- promoted riff cards
- rejected cards and discarded territories
- semantic repetition
- novelty spread
- convergence level
- whether the board needs breadth, synthesis, or pressure

## Round definition

A round is an immutable board snapshot representing one cognitive stage in the workspace.

Each round contains:

- ordered visible columns for that round
- cards and card ordering
- manual groups created inside that round
- riff pockets anchored to that round
- round-level notes or scaffold responses
- synthesis summary
- generation provenance

Each round should be understandable on its own, but also legibly connected to the round before it.

## Round lifecycle

1. Create or reopen workspace.
2. Generate or restore the active round.
3. User curates the round through card actions and pocket actions.
4. User chooses at least one carry-forward card and may add an optional short directional note.
5. User triggers `Grow`.
6. System creates a new round snapshot on the X axis.
7. Prior rounds remain intact and revisitable.

## Round navigation model

Visible navigation should stay simple even though the underlying model supports branching.

Recommended v1 behavior:

- top navigation shows `Round 1`, `Round 2`, `Round 3`, `Round 4`
- viewport motion shifts horizontally between rounds
- only one round is active at a time
- immediate neighboring rounds can remain faintly visible at the edges to preserve continuity
- riff pockets are visible only when their parent round is active or when the user explicitly expands them
- the active round stays mounted while persisted data catches up, rather than blanking the canvas during handoff

Navigation should feel like moving across one evolving board, not opening separate pages.

## History and branching assumptions

Rounds are historical states, not editable drafts once finalized.

Firm behavior:

- generating a new round never mutates a prior round
- revisiting an earlier round and growing from it creates a child path
- the UI may keep the visible navigation linear in v1
- the data model must still preserve parent-child round relationships

Recommended v1 decision:

- support one primary visible path in the UI
- store enough lineage to surface alternate branches later without data migration

## Grow versus Riff

`Grow` and `Riff` must remain visibly and conceptually separate.

`Grow`:

- advances the workspace horizontally
- uses cumulative board signal
- creates a new formal round
- may replace or rename visible categories

`Riff`:

- expands a local seed vertically
- uses a source card or blend
- creates a small titled pocket cluster beneath the source column
- does not create a new round

## Legibility rules

The board must stay readable as rounds accumulate.

Rules:

- every round occupies a deterministic horizontal zone
- every riff pocket occupies a deterministic vertical sub-zone attached to one round
- riff pockets should read as their own small branch section, not as oversized nested parent cards
- columns remain aligned within a round even when category names change
- the number of visible columns should usually stay between 4 and 6
- riff pockets should usually stay between 3 and 6 cards
- a promoted riff card appears in the main lane with visible provenance
- historical rounds are preserved without being visually noisy by default

Recommended v1 decision:

- show round lineage and pocket lineage through subtle connectors or provenance chips, not heavy graph edges

## Round-specific workspace expectations

### Round 1: Divergent exploration

- maximize credible breadth
- keep categories loose and generative
- prevent early neatness

### Round 2: Sensemaking and clustering

- reflect the user's taste back to them
- rename structure around emerging patterns
- preserve weird but meaningful user groupings

### Round 3: Sharpening and pressure

- reduce noise
- challenge assumptions
- separate strong directions from merely interesting ones

### Round 4: Handoff and coherence

- consolidate the surviving structure
- prepare markdown export
- expose what remains unresolved

## Product behavior versus data requirement

Product behavior:

- the user experiences one horizontal round lane and local vertical branch pockets
- history is easy to revisit
- the board remains calm and legible
- provisional streaming rounds and pockets should remain visible until a persisted replacement is actually renderable

Data requirement:

- rounds, pockets, lineage, and branch ancestry must be stored explicitly
- the system must distinguish round-level generation from pocket-level generation
- the system must preserve enough history to explain how a round was formed

## Non-goals

- a chat transcript as the primary workspace
- a freeform infinite whiteboard without structural lanes
- treating riff pockets as hidden next rounds
- letting historical state drift because of later edits
