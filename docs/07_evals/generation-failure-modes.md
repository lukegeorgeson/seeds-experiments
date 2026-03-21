# Generation Failure Modes

## Purpose

Catalog the most important ways Seeds can fail at generation quality so prompt, orchestration, and product changes can be evaluated against concrete risks.

## Core failure modes

### Fixation

Definition:

- the system gets stuck in one territory, frame, or mechanic too early

What it looks like:

- selected cards all point to the same safe logic
- later cards mostly paraphrase the same core move

Why it matters:

- the board stops helping the user traverse the messy middle

### Premature convergence

Definition:

- the board narrows before enough meaningful exploration has happened

What it looks like:

- Round 2 behaves like a final answer
- optionality disappears before tradeoffs are surfaced

### Semantic repetition

Definition:

- multiple cards say nearly the same thing with minor wording changes

What it looks like:

- repeated nouns, mechanics, tone, or structure across categories

### Shallow clustering

Definition:

- Round 2 category names or groups are generic and do not reflect real user logic

What it looks like:

- labels like `Ideas`, `Concepts`, or `Themes` without meaningful differentiation
- manual user clusters are ignored

### Sycophantic sparring behavior

Definition:

- sparring cards pretend to challenge while actually validating the same direction

What it looks like:

- faux-opposition that restates the chosen path
- challenge cards with no real tradeoff or pressure

### Overly long cards

Definition:

- cards become mini paragraphs or multi-idea bundles

What it looks like:

- cards that cannot be scanned quickly
- cards that require surrounding explanation

### Generic column naming

Definition:

- category names feel templated, lazy, or detached from the board

What it looks like:

- stale taxonomies repeated across rounds
- labels that could apply to any brief

### Reroll-feeling Grow rounds

Definition:

- the next round feels regenerated from scratch rather than shaped by user action

What it looks like:

- locked or edited cards have little visible influence
- the new board ignores notes, groups, or rejections

### Riff pockets that feel like accidental new rounds

Definition:

- local pocket output becomes too broad, too large, or too detached from the parent

What it looks like:

- pocket categories mimic a full board taxonomy
- pocket size rivals the main round
- lineage to the source is weak

## Detection checklist

Use this checklist during evals:

- are multiple cards semantic near-duplicates?
- did the round collapse too early?
- do category names reflect the user's logic?
- do sparring cards introduce real friction?
- are cards still atomic and movable?
- does the next round visibly reflect edits, locks, notes, groups, and promotions?
- does a riff pocket remain local and lineage-bound?

## Likely causes and responses

| Failure mode | Likely cause | Response |
| --- | --- | --- |
| Fixation | weak diversity logic, safe-selection bias | inject opposite, anti-cliche, or constraint moves |
| Premature convergence | over-weighting locks too early | preserve one meaningful alternative territory |
| Semantic repetition | loose dedupe checks | add similarity filtering and stronger non-overlap instructions |
| Shallow clustering | generic category prompt | feed manual groups and drag patterns into category generation |
| Sycophantic sparring | weak challenge framing | require explicit counter-position or failure probe behavior |
| Overly long cards | prompt drift toward prose | enforce tighter card length validation and repair |
| Generic column naming | fixed-template bias | require category rationale grounded in board signal |
| Reroll-feeling Grow | insufficient event weighting | increase priority of edits, notes, promotions, and rejects |
| Riff pocket feels like round | riff prompt too global | constrain input context and pocket size |

## Evaluation note

These failure modes should be attached to eval runs and prompt experiments so quality changes can be judged against specific regressions rather than vague preference.
