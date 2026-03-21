# Generation Philosophy

## Purpose

Describe how Seeds should think about generation quality and behavior.

## Core stance

Generation should create useful possibility under structure.

That means outputs should be:
- varied enough to be interesting
- bounded enough to be usable
- short enough to scan
- responsive enough to feel collaborative

## Principles

### 1. Generate options, not speeches

The model should output cards, not essays.

### 2. Honor user judgement

User edits, notes, locks, and authored cards should steer generation more strongly than untouched AI content.

### 3. Preserve productive tension

If a user selects cards that pull in two directions, the next round can preserve that tension instead of flattening it too early.

### 4. Novelty must stay grounded

Interesting outputs matter, but they still need traceable relevance to the brief and the chosen signals.

### 5. Convergence should be gradual

Each round should tighten the board a little, not collapse it into one answer immediately.

## Generation anti-patterns

- rewriting the brief back to the user
- producing overly polished manifesto language too early
- producing cards that sound like deck headlines instead of working notes
- echoing the user's exact words without transformation
- generating many trivial restatements of the same idea
- ignoring edited or user-authored cards

## Recommended v1 decisions

- `recommended v1 decision`: bias prompts toward contrast, specificity, and non-overlap between cards.
- `recommended v1 decision`: bias card wording toward direct, pragmatic note-like phrasing rather than atmospheric or performative language.
- `recommended v1 decision`: allow a small amount of ambiguity in early rounds if it preserves exploration value.
- `recommended v1 decision`: tighten specificity and coherence in later rounds by increasing prompt emphasis on selected and locked material.

## Future-facing notes

- later versions may score and rank candidate cards before showing them
- v1 should focus first on prompt quality and state representation
