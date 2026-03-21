# Core User Flows

This document defines the core end-to-end user flows for Seeds v1.

Seeds is designed as a visual creative sparring environment. The primary interactions should happen on the canvas through cards and rounds, rather than through a persistent chat interface.

## Flow overview

The main flow in Seeds is:

1. Create workspace
2. Input brief or prompt
3. Generate Round 1
4. Curate and shape the board
5. Grow next round
6. Repeat through convergence
7. Export consolidated markdown

In addition to this main path, the product should support local riffing, user-authored cards, and revisiting previous rounds.

## Flow 1: Create a workspace

### Goal

Start a new creative exploration from a blank slate.

### Entry state

The user lands in Seeds and chooses to start a new workspace.

### UX behavior

The interface should feel like a blank creative canvas rather than a form-heavy setup flow.

Suggested first-screen elements:
- workspace title field
- prompt input area
- file upload zone
- primary action to begin generation

### Notes

There should be no mandatory multi-step setup wizard in v1. The user should feel like they are already in the work.

## Flow 2: Add input and start ideation

### Goal

Provide enough starting context for Seeds to generate Round 1.

### Supported v1 inputs

- typed prompt
- uploaded files such as pdf, md, docx, txt
- optional additional notes

### UX behavior

The user can:
- type a prompt only
- upload files only
- combine both

Example prompt:
"Help me come up with a strategy and creative social concepts for an Adidas x Wales Bonner launch in Paris."

### System behavior

After submission, Seeds should:
1. extract text from uploaded files
2. normalize the combined input internally
3. generate the initial creative board

### Important constraint

There should be no confirmation gate where the user must approve a parsed brief before ideation begins.

## Flow 3: Generate Round 1

### Goal

Present the first set of structured possibilities.

### Round 1 behavior

Round 1 should prioritize breadth and originality over polish.

Suggested initial column pattern:
- Signals
- Nuggets
- Directions
- Ideas
- Modifiers

Each column should contain roughly 8 to 10 short atomic cards.

### Card behavior

Cards should:
- be easy to scan
- be intentionally short
- communicate one directional thought each
- avoid over-explanation

### UX behavior

Cards should populate directly into the canvas in situ, without making the user leave the workspace.

## Flow 4: Curate and shape the board

### Goal

Let the user turn the generated board into structured signal.

### Supported v1 actions

The user can:
- select cards
- edit card text
- add a new blank card
- add a note to a card
- lock a card
- drag a card within or across columns
- blend cards
- riff on a card

### Meaning of these actions

- **Select** = use this as signal for the next round
- **Edit** = this is close, but should read differently
- **Add** = my own thinking belongs in the system
- **Note** = push this in a direction without rewriting the card
- **Lock** = preserve this across future rounds
- **Drag** = reinterpret or reclassify the card
- **Blend** = combine multiple cards into a new shared seed
- **Riff** = explore local variants of one promising idea without regenerating the entire board

### UX guidance

The default interaction model should bias toward clicking, selecting, grouping, dragging, and lightly typing.

## Flow 5: Local riffing

### Goal

Explore one card or combination in more depth without creating a full new round.

### Trigger

The user chooses a card and clicks **Riff**.

Optional variation:
The user selects two cards and chooses to blend/riff them together.

### System behavior

Seeds generates a small cluster of new sibling cards near the original card or within the same column.

These variants should:
- stay short and atomic
- stay visibly related to the source card
- expand local possibility without disturbing the whole canvas

### Why this matters

The product should distinguish between:
- **local exploration** of one seed
- **global evolution** of the whole board

## Flow 6: Grow next round

### Goal

Create the next full canvas state from the user's cumulative signal.

### Trigger

The user clicks the primary round-advance action.

Recommended label:
**Grow** or **Grow next round**

### Input to next round

The system should use:
- selected cards
- locked cards
- edited cards
- user-created cards
- card notes
- blend relationships
- round-level notes if present

### System behavior

Seeds should:
- infer commonality across chosen ingredients
- preserve useful tension where relevant
- reduce noise
- create a more coherent next round
- adapt column structure if needed

### Important rule

The next round must not feel like a random reroll. It should feel materially shaped by the user's actions.

## Flow 7: Navigate rounds and history

### Goal

Allow the user to revisit and continue earlier creative states.

### UX behavior

Each round should be preserved as its own canvas state.

The user should be able to:
- move back to prior rounds
- re-open them
- continue working from them
- branch from them in the future

### v1 guidance

The UI can keep this simple, but the system should not discard previous rounds.

## Flow 8: Converge toward a final direction

### Goal

Move from broad possibility into a sharpened strategic shape.

### Expected progression

- Round 1 = divergent and exploratory
- Round 2 = clearer directional recombination
- Round 3 = stronger coherence and strategic shape
- Round 4 = optional final sharpening

### User decision point

The user decides when the board is strong enough to stop iterating.

There should be no forced end-state other than the user's own sense that the direction is ready.

## Flow 9: Export markdown

### Goal

Produce a usable downstream artifact from the final creative state.

### v1 export format

A consolidated markdown document.

### Export content should include

- original prompt and input context
- concise brief summary
- chosen direction or directions
- retained key cards
- user-authored additions
- supporting ideas and modifiers
- alternatives or appendix content
- a clean downstream prompt for future AI or presentation creation

### Important note

This is not yet a slides export flow. Seeds should sit before slides and act more like a creative and strategic shaping layer.

## Flow 10: Resume and continue later

### Goal

Allow a user to return to an unfinished workspace.

### Behavior

A workspace should retain:
- source inputs
- all round states
- card actions
- user-authored content
- export history

The user should be able to reopen the workspace and continue ideation without losing prior context.

## UX summary

Seeds should support two core types of motion:

### Global motion

The user shapes the whole board and generates a new round.

### Local motion

The user explores one seed or blend in place.

This distinction should be made obvious in both interaction design and language.

## UX anti-patterns to avoid

- forcing the user through a long setup flow before ideation
- making cards too dense or essay-like
- turning the interface into a chat log
- making next round feel like a random regenerate button
- hiding user authorship behind excessive AI automation
- collapsing too early into one polished answer

## Success condition

A successful Seeds session should leave the user feeling that:
- they started with ambiguity
- the system opened up multiple credible paths
- their choices materially shaped the direction
- the final state feels sharper and more coherent than where they began
- they still feel ownership over the work
