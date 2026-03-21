# Interactions

## Purpose

Define the action vocabulary for Seeds and the exact meaning of each action for:

- user experience
- AI interpretation
- persistence and event logging

Seeds should treat user actions as meaningful creative signal, not as superficial UI toggles.

## Interaction set

Core actions:

- Select
- Edit
- Add
- Note
- Lock
- Drag
- Group
- Blend
- Riff
- Promote
- Reject
- Grow
- Export
- Debug

## Action semantics

| Action | UX meaning | AI interpretation | Data consequence |
| --- | --- | --- | --- |
| `Select` | Weak positive signal. "Keep this in play." | Positive preference with moderate weight | Store event and current state |
| `Edit` | User corrects or sharpens a card | Semantic correction and taste refinement. Higher authority than untouched AI copy | Store edited text, source text, and edit event |
| `Add` | User creates a new card | High-authority user-originated direction | Create user card plus add event |
| `Note` | User steers without rewriting the card | Directional guidance and contextual preference | Attach note object and event |
| `Lock` | Strong preservation signal | High-weight carry-forward anchor | Store lock state and event |
| `Drag` | Reorder or reclassify | Importance signal or relationship signal | Store drag event with from/to position and column |
| `Group` | User creates a local semantic cluster | Premium evidence of human pattern recognition | Store first-class `Group` object plus event |
| `Blend` | User requests synthesis between cards | Explicit intent to combine ingredients | Create blend object and event |
| `Riff` | User requests local expansion | Explore nearby possibilities without changing round structure | Create riff generation request and pocket |
| `Promote` | User upgrades a riff output into formal round material | Strong endorsement of a local branch | Create promotion event and main-lane card relationship |
| `Reject` | User marks "not this" | Negative signal and anti-pattern clue | Store rejection state and event |
| `Grow` | User requests full next-round recomposition | Trigger next round using cumulative board signal | Create round generation request and new round |
| `Export` | User requests downstream handoff | Assemble markdown from surviving process structure | Create export artifact |
| `Debug` | User inspects system reasoning | No creative preference signal by itself | Fetch generation metadata only |

## Weighting rules

Recommended signal strength order once a session is underway:

1. user-authored cards
2. edited cards
3. locked cards
4. promotion events
5. notes
6. manual groups and drag/regroup behavior
7. blends
8. selected cards
9. rejected cards as negative steering
10. untouched AI cards as weak context

The original prompt still matters, but it should matter less than cumulative human signal after Round 1.

## Detailed behavior by action

### Select

Use when the user wants to keep a card active without overcommitting.

Rules:

- lightweight toggle
- visible but lower-emphasis than `Lock`
- multi-select supported

### Edit

Use when the user wants to rewrite wording or meaning.

Rules:

- edit should happen inline on the card, not in a detached side panel
- edited cards should visually remain cards, not turn into document blocks
- the original source text should remain available in metadata
- editing an AI-authored card should preserve its lineage and mark it as an edited AI card in persistence
- edits should materially affect future round language

### Add

Use when the user wants to inject their own thought directly.

Rules:

- user-authored cards should be easy to create inline
- user-authored cards carry high authority even without selection

### Note

Use when the user wants to steer a card, cluster, or round without replacing it.

Rules:

- notes can attach to cards, blends, pockets, or the round
- notes should be concise and directional

### Lock

Use when the user wants to preserve a card strongly.

Rules:

- locked cards imply selection
- lock state should be visibly stronger than selection
- later rounds should preserve locked meaning even if wording evolves

### Drag

Use when the user wants to reprioritize or reclassify.

Rules:

- drag within a column implies relative importance
- drag across columns implies reinterpretation
- drag into a manual cluster implies relationship, not only position

### Group

Use when the user wants to create a local cluster that reflects their own logic.

Rules:

- manual groups should not be overwritten by simplistic AI reclustering
- weird human groups are premium signal
- persist groups as first-class round objects with `cardIds` and optional title or note

### Blend

Use when the user wants to synthesize multiple cards into one shared seed.

Rules:

- blend should create a distinct seed object or derived card set
- blend lineage must remain visible
- a blend can become the source for a riff pocket

### Riff

Use when the user wants a local side exploration.

Rules:

- triggered from one card or one blend seed
- opens a lightweight freeform comment-style composer attached to the source card
- accepts optional freeform riff intent, not only fixed presets
- produces a small vertical pocket zone beneath the source column
- the pocket should appear immediately with provisional skeleton cards
- must not reorder the global round structure

### Promote

Use when the user wants a riff output to become formal round material.

Rules:

- promotion is explicit, not automatic
- promoted cards become valid input to future `Grow`

### Reject

Use when the user wants to signal an avoided direction.

Rules:

- rejection clears lock and selection on the same card
- rejection is stronger than silence
- rejection should move future rounds away from a pattern, not force the literal opposite

### Grow

Use when the user wants the next formal round.

Rules:

- `Grow` is explicit
- `Grow` should feel like recomposition, not reroll
- `Grow` uses current signal plus preserved history

## Pre-Grow narrowing scaffold

Before `Grow`, the product must require a lightweight scaffold so the next round has at least minimal explicit steering.

Required v1 scaffold:

- choose a small carry-forward set
- optionally add one short directional note

Optional richer scaffold:

- reject 3
- mark 2 as most distinctive
- mark 2 as most usable
- preserve 1 key tension
- note 1 thing to avoid

This can be implemented as a compact overlay, side panel, or inline footer above the `Grow` action.

Rules:

- selecting at least one carry-forward card is mandatory in v1
- the directional note is optional in v1
- scaffold responses become explicit structured input to round generation
- scaffold should take under 60 seconds
- the default Grow bar should stay compact and lightweight rather than feeling like a large form

## Sparring card interaction patterns

Sparring is strategic friction, not generic negativity.

Interaction patterns:

- a sparring card should look meaningfully different from a normal constructive card
- users can select, lock, reject, edit, note, or ignore a sparring card
- users may convert a sparring card into a normal card by editing or promoting its insight

Recommended v1 behavior:

- tag sparring cards with a small label such as `Challenge` or `Pressure`
- render sparring cards in a lightly separated sub-lane within the same column
- keep sparring cards near the constructive material they challenge

## UX priorities

Highest-frequency actions should stay close to the card:

- Select
- Lock
- Reject
- Edit
- Note
- Riff

Recommended v1 behavior:

- `Edit` should switch the card itself into an inline editable state
- `Riff` should use a small overlay composer anchored to the source card
- `Grow` should live in a compact footer bar with carry-forward gating and an optional note field

More structural actions can live in secondary UI:

- Group
- Blend
- Promote
- Grow
- Export
- Debug

## Product behavior versus AI behavior versus data requirement

Product behavior:

- actions feel simple and distinct
- `Riff` and `Grow` are never confused

AI behavior:

- treat actions as weighted signal
- infer meaning from relationships, not only card text

Data requirement:

- store semantic interaction events, not just final card booleans
- store current `isSelected`, `isLocked`, and `isRejected` state on the card for UI convenience
- preserve before/after state for edits, drag/regroup, promotion, and rejection
- store first-class `Group` objects tied to the round
- make scaffold answers queryable for later evals
