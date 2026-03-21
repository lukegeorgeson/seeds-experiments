# Columns and Cards

## Purpose

Define the visible board structure and the atomic content rules that make Seeds usable as a creative sparring environment.

This document covers:

- what a card is
- what a column is
- how visible categories change by round
- how persistent hidden meta-layers remain available beneath changing columns
- how lineage is preserved when cards are blended, riffed, or promoted

## Core rules

- cards are atomic ingredients, not mini essays
- columns are stage-specific facilitation devices, not universal templates
- visible categories can change by round
- hidden meta-layers remain stable even when visible categories change
- card lineage must remain inspectable after edits, blends, riffs, and promotion

## Card definition

A card is the smallest useful unit of thinking in Seeds.

A good card contains one directional thought the user can quickly scan, move, combine, keep, challenge, or discard.

Cards should be:

- short
- atomic
- legible
- movable
- blendable
- lockable
- editable

## Atomic card rules

### Required content behavior

- one idea per card
- readable without surrounding paragraph context
- useful as a standalone ingredient
- concise enough to scan alongside neighboring cards

### Target shape

- usually 4 to 16 words
- usually 1 or 2 clauses at most
- default collapsed size should fit 1 to 3 short lines

### Anti-patterns

- stacked arguments on one card
- thesis paragraphs
- generic slogan language
- polished deck-copy tone
- cards that merely repeat the prompt
- cards that require a note to explain the core idea

## Card types by origin

Cards may originate from:

- AI round generation
- user authoring
- user edit of an AI card
- riff generation
- blend generation
- locked carry-forward
- promoted riff output

Origin should be preserved as metadata even when the visible text changes.

Recommended v1 persistence behavior:

- editing an AI-generated card should keep lineage to the original card while changing origin metadata to an edited-AI state

## Column definition

A column is a visible lane for a round-specific cognitive job.

Columns exist to help the user compare neighboring ingredients and see the board's structure. They are not meant to impose one fixed framework across the whole product.

## Visible categories versus hidden meta-layers

### Visible categories

Visible columns change by round because the cognitive task changes by round.

Examples:

- early rounds expand possibility
- middle rounds cluster and name patterns
- later rounds challenge, justify, simplify, and prepare handoff

### Hidden meta-layers

The system should always be able to reason about:

- questions and unknowns
- assumptions
- constraints
- diversity injection
- tests, evidence, and next experiments

These do not need to be full visible columns in every round. They are stable process layers beneath the changing board structure.

## Round-by-round column behavior

### Round 1: Divergent exploration

Goal:

- widen the search space without turning the canvas into chaos

Default v1 starter pattern:

- Signals
- Nuggets
- Directions
- Ideas
- Modifiers

Rules:

- treat this as a starting pattern, not a permanent taxonomy
- maintain at least one diversity-driving lane or mechanism
- avoid heavy evaluative language
- avoid sounding like the board has already decided

### Round 2: Sensemaking and thematic synthesis

Goal:

- cluster what is emerging and name it in the user's logic

Possible column sets:

- Themes
- Territories
- Tensions
- Patterns
- Behaviors
- Principles
- Reframes

Rules:

- do not blindly carry forward Round 1 columns
- rename around selected, locked, edited, grouped, and dragged material
- preserve non-obvious human groupings rather than flattening them into generic AI buckets

### Round 3: Sharpening and strategic pressure

Goal:

- move from interesting material to stronger direction

Possible column sets:

- Core direction
- Reasons to believe
- Risks
- Assumptions
- Do / Don't
- Execution plays
- Simplifications
- Opposites
- What would break this?
- What would make this inevitable?

Rules:

- categories should help decision quality, not add more idea volume
- at least one category may be explicitly sparring-oriented when the board needs challenge
- sparring cards should render in a lightly separated sub-lane within the same column rather than as a detached board section

### Round 4: Handoff and coherence

Goal:

- convert surviving structure into a downstream-ready artifact

Possible column sets:

- Brief restatement
- Chosen direction
- Key ingredients
- Foundational pillars
- Supporting signals
- Do / Don't guidance
- Next tests
- Downstream prompt

Rules:

- categories should map cleanly into markdown export sections
- this round should feel cleaner, not broader

## Dynamic renaming rules

Category naming should feel like good facilitation, not random re-templating.

The category engine may:

- rename columns
- merge columns
- split columns
- add one pressure or diversity column
- remove a column that is no longer useful

The category engine should not:

- preserve old names out of inertia
- invent categories unrelated to the user's actual board behavior
- erase manually created groupings that carry clear human intent

## Card lineage rules

Every card should retain lineage metadata even if the UI only reveals it on demand.

Lineage can include:

- source round
- source card ids
- source blend id
- parent riff pocket id
- promotion event id
- edit history

Lineage should answer:

- where did this card come from?
- what was it derived from?
- was it preserved, transformed, blended, or promoted?

## Promoted riff cards

A promoted riff card is a card that began inside a local pocket and was later admitted into the main round flow.

Rules:

- promotion is explicit
- promotion does not delete the source pocket
- the promoted card should show provenance to the pocket and parent source
- promoted cards become normal round material for future `Grow` operations

## Riff pocket presentation

Riff pockets are not rendered as oversized parent cards or as a hidden second board.

Rules:

- a pocket should render as a titled micro-section beneath the relevant column
- the pocket title can come from the user riff note or the generated pocket title
- pocket cards stay smaller than the main lane and remain visually grouped together
- a pending pocket should show skeleton cards immediately so the branch is legible before final cards arrive
- when real pocket cards arrive, they should replace the provisional state in place rather than wiping the branch away

## Board density rules

- visible columns should usually stay between 4 and 6
- visible cards per column should usually stay between 4 and 10
- riff pockets should remain smaller than the main column flow
- cards should remain vertically stackable without becoming a scroll swamp

## Product behavior versus AI behavior versus data requirement

Product behavior:

- the user sees a board with legible lanes and compact cards
- categories shift as the work matures
- cards remain atomic even while editing, riffing, or being promoted from a pocket

AI behavior:

- generate cards that remain atomic
- adapt categories by stage and signal
- preserve hidden meta reasoning across rounds

Data requirement:

- store visible category objects separately from hidden meta-state
- store lineage for blend, riff, promotion, and edits
- preserve card origin even if text is edited later
- model columns as round-scoped dynamic objects now, even if early rounds still reuse the default starter taxonomy where useful
