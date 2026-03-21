# Synthesis Rules

## Purpose

Define how Seeds should turn many user and system signals into a stronger next state.

## Synthesis definition

Synthesis is not summarization alone. It is the act of identifying patterns, preserving valuable ingredients, and generating a better-structured next set of cards.

## What synthesis should preserve

- cards the user locked
- user-authored additions
- edited wording where the user made meaning more precise
- strong blends
- useful tensions that should remain unresolved for another round

## What synthesis should reduce

- repeated ideas
- weak or generic cards
- cards ignored across multiple rounds
- noise introduced by unselected low-signal content

## Synthesis behaviors

### Pattern extraction

Identify recurring themes, contrasts, and directional clusters in selected and edited content.

### Hierarchy formation

Promote stronger cards into more central directional roles and let weaker ideas fall into support or disappear.

### Recombination

Combine complementary ingredients into stronger cards or directions without erasing nuance.

### Controlled divergence

Leave some room for surprise in later rounds so the board does not become predictable.

## Recommended v1 decisions

- `recommended v1 decision`: derive a compact internal synthesis summary before each new round prompt.
- `recommended v1 decision`: use locked and edited cards as anchors the next round must respect.
- `recommended v1 decision`: keep one or two alternative threads alive in Round 3 when the signal is not yet decisive.

## Export implications

The final markdown export should be based on the strongest synthesis state, not a raw dump of the last board.

## Future-facing notes

- later versions may generate explicit `why this changed` summaries between rounds
- ranking and confidence scoring can later support smarter pruning
