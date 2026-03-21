# Round Generation Logic

## Purpose

Define how `Grow` produces the next formal round in Seeds.

This document covers:

- round-specific generation behavior
- category generation
- signal weighting
- fixation detection
- diversity injection
- sparring triggers

`Grow` is the full-board recomposition path. It is distinct from `Riff`, which is local and pocket-scoped.

## Core rule

The next round must feel materially shaped by the user's board behavior, not like a fresh brainstorm or reroll.

## Grow inputs

Every `Grow` request should be assembled from a normalized round-state snapshot.

Required inputs:

- workspace prompt text and brief summary
- source round metadata
- visible columns and card distribution
- selected cards
- locked cards
- edited cards
- user-authored cards
- notes
- manual groups with card membership and optional labels
- blend relationships
- drag and regroup relationships
- promoted riff outputs
- rejected directions
- mandatory minimal scaffold responses
- preserved compact history from earlier rounds

Derived process signals:

- semantic repetition score
- novelty spread
- convergence level
- selection concentration
- safe-selection score
- manual clustering strength
- whether the board needs breadth, synthesis, or pressure
- pocket-level metadata for unpromoted riff pockets when explicitly included as weak context

## Signal weighting

Recommended weighting order after Round 1:

1. user-authored cards
2. edited cards
3. locked cards
4. promoted riff cards
5. notes and scaffold responses
6. manual groups and drag relationships
7. blends
8. selected cards
9. rejected cards as negative steering
10. untouched surviving cards as weak context
11. original prompt as background anchor

Rules:

- do not treat absence of selection as rejection
- do not let untouched AI cards outweigh human-authored or human-edited material
- rejected cards should shape avoidance logic, not produce a simplistic opposite
- raw unpromoted riff cards are excluded from `Grow` by default
- unpromoted riff pockets may contribute only weak pocket-level metadata when explicitly enabled

## Grow pipeline

1. Load the source round snapshot.
2. Normalize current board signal into structured features.
3. Detect stage, convergence level, and fixation risk.
4. Choose the next round mode.
5. Generate an explainable visible category set.
6. Assemble prompt input with both structured state and concise history.
7. Request structured output for the next round.
8. Validate card atomicity, category quality, and non-overlap.
9. Stream provisional results to the client.
10. Persist the finalized round snapshot and generation metadata.

## Round modes by stage

### Round 1: Divergent exploration

Goal:

- create breadth without chaos
- avoid early polish
- inject stimulus variety

Default visible categories:

- Signals
- Nuggets
- Directions
- Ideas
- Modifiers

Rules:

- keep cards short and atomic
- maintain at least one diversity mechanism
- avoid judgment-heavy framing
- avoid best-answer behavior
- use opposites, analogies, anti-cliches, or constraints where useful

### Round 2: Sensemaking and thematic synthesis

Goal:

- cluster what is emerging
- reflect user taste back to them
- rename the board around the user's own logic

Possible visible categories:

- Themes
- Territories
- Tensions
- Patterns
- Behaviors
- Principles
- Reframes

Rules:

- do not blindly carry forward Round 1 columns
- infer themes from selected, grouped, locked, edited, and dragged material
- use manual clusters to name or reshape categories where possible
- preserve some optionality rather than collapsing into one answer

### Round 3: Sharpening and strategic pressure

Goal:

- move from interesting to strong
- surface tradeoffs
- challenge assumptions
- test usability and distinctiveness

Possible visible categories:

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

- add pressure and challenge explicitly
- support sparring cards
- support simplification and reduction
- do not spend the round generating more near-neighbor idea volume

### Round 4: Handoff and coherence

Goal:

- turn the surviving structure into a clean downstream artifact

Possible visible categories:

- Brief restatement
- Chosen direction
- Key ingredients
- Foundational pillars
- Supporting signals
- Do / Don't guidance
- Next tests
- Downstream prompt

Rules:

- categories should map cleanly to markdown export
- this round should optimize for coherence and usefulness, not breadth

## Category generation engine

Architecture rule:

- columns are modeled as round-scoped dynamic objects
- preserve the default Round 1 starter columns where useful
- introduce true per-round dynamic category generation through `Grow` incrementally
- do not treat fixed universal columns as the long-term model

Visible categories should be derived from three inputs:

1. stage or round number
2. user interaction signal
3. fixation or diversity signal

### Stage-based rules

- if selected material is mostly raw observation or insight, emphasize themes, tensions, and reframes next
- if selected material is mostly directional, emphasize articulation, differentiation, proof, and boundary conditions
- if selected material is mostly executional, emphasize systems, variants, proof points, and tests

### Signal-based rules

- if the user made strong manual clusters, use them as naming inputs
- if the user heavily edited language, adopt the user's wording style where it improves precision
- if the user locked multiple cards from one semantic territory, treat that territory as a likely anchor
- if the user preserves tension instead of resolving it, keep a tension-oriented category alive

### Fixation-based rules

- if semantic similarity among selected cards is high, force at least one diversity injector
- if the user is over-selecting polished but safe material too early, inject a sparring or anti-fixation move
- if the board has collapsed to one narrow territory too early, re-open one adjacent or opposite territory

## When to preserve versus replace columns

Preserve a visible category when:

- the user has clearly organized around it
- the category still matches the stage's cognitive job
- the category helps the board stay legible

Replace or rename a visible category when:

- the stage has changed
- the user's clustering logic has diverged from the prior taxonomy
- the old category now mixes incompatible card types
- the board would otherwise feel templated or stale

Recommended v1 decision:

- preserve at most 1 or 2 category names across adjacent rounds when they still carry meaningful continuity
- do not preserve a whole prior taxonomy by default

## Fixation detection inputs

The process engine should monitor:

- semantic repetition across selected cards
- narrow territory concentration
- repeated card syntax and phrasing
- repeated execution mechanics
- unusually early convergence
- selection bias toward safe or polished material
- lack of novelty in promoted riff outputs

## Diversity injection

At least one anti-fixation or diversity mechanism should be available in divergent and early convergent rounds.

Possible injections:

- opposite direction
- anti-cliche direction
- cross-domain analogy
- harsh constraint
- simplification challenge
- remove the obvious ingredient
- what if the opposite market logic is true?
- what if this had to work at one tenth the budget?
- what would make this dangerously bland?
- what would make this feel unexpectedly distinct?

Trigger when:

- selected-card similarity is high
- the board is clustering too neatly too early
- the user keeps selecting obvious answers only
- the next round would otherwise become a polished paraphrase of the current board

## Sparring behavior

Sparring is deliberate, useful friction.

Examples:

- counter-position
- simplification pressure
- reduction lens
- low-cost alternative
- opposite audience framing
- assumption challenge
- failure mode prompt
- what are we over-romanticizing?

Trigger sparring when:

- Round 3 or later needs sharper tradeoff thinking
- the board is over-indexing on affirmation
- selections show premature certainty without proof
- the system detects safe-selection behavior

Rules:

- most output stays constructive
- some output is strategically challenging
- sparring should be selective, not constant
- sparring should challenge the work, not insult the user

## Output contract

Each round generation should return:

- round title
- round mode
- visible categories with names and descriptions
- cards grouped by category
- sparring tags when used
- synthesis summary
- concise rationale summary for debugging and product transparency
- full generation rationale metadata inside the generation snapshot for debug and evals

## Validation rules

Reject or repair a round when:

- cards are too long
- cards repeat one another semantically
- categories are generic or stage-inappropriate
- the next round ignores strong user signal
- the round feels like a reroll rather than a continuation
- sparring becomes sycophantic, vague, or gratuitously negative

## Product behavior versus AI behavior versus data requirement

Product behavior:

- `Grow` advances the board horizontally and feels shaped by the user

AI behavior:

- infer next cognitive job
- generate explainable categories
- guard against fixation
- introduce sparring selectively

Data requirement:

- store derived fixation and convergence signals in the generation snapshot
- store full category-generation rationale in generation snapshots
- expose a concise first-class rationale summary field for debugging and product transparency
