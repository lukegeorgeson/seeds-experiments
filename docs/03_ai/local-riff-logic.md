# Local Riff Logic

## Purpose

Define how `Riff` creates a local experimental pocket without triggering a new round.

`Riff` is the Y-axis branch mechanism inside Seeds. It is local, modular, and lineage-aware. It must remain separate from `Grow`, which creates a new formal round on the X axis.

## Riff definition

A riff pocket is a small sibling cluster generated from:

- one source card
- one blend seed
- or one tightly scoped source cluster

The pocket exists to explore nearby options without re-composing the full board.

## Core rules

- riff is local, not global
- riff lives on the Y axis of the current round
- riff retains visible lineage to its parent
- riff does not reorder or replace the main round structure
- riff output stays atomic and concise
- riff output can later be promoted, blended, or discarded

## Riff inputs

Required inputs:

- parent round id
- source card id or blend id
- source card text or blend summary
- source column context
- local notes if present
- workspace brief summary
- current round mode

Optional inputs:

- second source card
- pocket goal such as `push wider`, `make bolder`, `make simpler`, `find opposite`, `stress test`
- nearby selected or locked sibling cards for context

## Pocket generation rules

### Scope

- generate a small cluster, not a board
- default size should be 3 to 5 cards
- allow up to 6 only when a blend seed is unusually rich

### Shape

- cards must stay visibly related to the parent seed
- cards should vary along useful dimensions such as angle, tone, audience, mechanism, or simplification
- cards should not all be paraphrases of the parent

### Placement

- place the pocket in a vertical sub-zone attached to the source
- keep the pocket visually separate from the main column lane
- do not align the pocket so closely to the next round zone that it reads as a formal round

## Lineage rules

Every pocket should retain:

- pocket id
- parent round id
- source card ids
- source blend id if relevant
- generation request id
- created timestamp

Every riff-generated card should retain:

- origin type `riff`
- parent pocket id
- parent source ids
- optional promotion event id later

## Pocket behavior types

Riff prompts may bias toward one local job:

- expand
- contrast
- simplify
- sharpen
- translate
- stress-test

Recommended v1 decision:

- support one implicit default `expand` mode first
- keep the pocket goal as metadata so richer riff modes can be added cleanly later

## Promotion rules

The user may promote one or more riff outputs into the main round flow.

Rules:

- promotion is explicit
- promoted cards become formal round material inside the current round
- promoted cards are eligible input for the next `Grow`
- promoted cards retain provenance to the parent pocket and source card
- promotion should not destroy the pocket history
- unpromoted riff cards are excluded from `Grow` by default
- unpromoted pockets may expose only compact pocket metadata as weak background signal

## Cross-pocket blending

Cross-pocket blending can be useful, but should stay controlled.

Recommended v1 behavior:

- allow blending between two promoted riff cards
- defer direct blend-generation across multiple unpromoted pockets unless needed

Future-facing behavior:

- support direct cross-pocket blends when the UI can make lineage legible

## Separation from Grow logic

`Riff` differs from `Grow` in all of these ways:

| Dimension | `Riff` | `Grow` |
| --- | --- | --- |
| Scope | local | full board |
| Axis | Y axis | X axis |
| Trigger | card or blend action | explicit round advance |
| Output | pocket cluster | new round |
| Categories | inherits local context | may rename or replace visible categories |
| History effect | stays inside round | creates new immutable round snapshot |

## Validation rules

Repair or reject a riff result when:

- the pocket looks like a mini full board
- the cards are too long
- the cards are near-duplicates
- the cards lose visible relation to the parent
- the pocket reuses global round categories instead of staying local

## Product behavior versus AI behavior versus data requirement

Product behavior:

- riff feels like a protected sandbox attached to one idea

AI behavior:

- expand locally
- preserve lineage
- create useful variation without global recomposition

Data requirement:

- store pockets separately from rounds
- store promotion events explicitly
- keep riff generation requests distinct from round generation requests
