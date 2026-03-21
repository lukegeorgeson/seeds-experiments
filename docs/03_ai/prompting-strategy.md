# Prompting Strategy

## Purpose

Define how prompts should be constructed for Seeds generation tasks.

## Prompt design goals

- keep prompts deterministic and debuggable
- encode user signal explicitly
- preserve card brevity
- produce structured outputs suitable for rendering

## Prompt layers

### 1. System layer

Defines Seeds behavior:
- human-led ideation
- card-based output
- concise writing rules
- non-generic, non-redundant cards

### 2. Task layer

Defines whether the request is:
- Round 1 generation
- later-round synthesis
- local riffing
- export synthesis

### 3. Context layer

Includes:
- prompt text
- parsed file excerpts or summaries
- workspace brief summary
- relevant prior round summary

### 4. Signal layer

Includes structured user signal:
- locked cards
- edited cards
- user-authored cards
- notes
- selected cards
- blends

### 5. Output contract

Specifies the response schema and writing constraints.

## Recommended v1 decisions

- `recommended v1 decision`: summarize large file input before passing it into later round prompts to control token growth.
- `recommended v1 decision`: keep prompt templates versioned in code so changes can be evaluated over time.
- `recommended v1 decision`: include explicit non-goals in prompts, for example no long paragraphs, no repeated cards, no generic filler.

## Context trimming rules

- prioritize signal over raw history
- carry forward compact summaries of previous rounds instead of all cards
- include full text for locked and edited cards
- include only relevant notes and accepted riffs

## Guardrails

- require one idea per card
- discourage slogan-only cards unless intentionally useful
- discourage execution ideas that ignore the strategic frame

## Future-facing notes

- prompt variants may later be tuned by project type
- retrieval can later augment context, but should remain subordinate to current workspace signal
