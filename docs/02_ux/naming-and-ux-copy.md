# Naming and UX Copy

## Purpose

Set the default product language so the experience feels clear, calm, and differentiated.

## Product vocabulary

- workspace: the persistent project container
- round: one full canvas state
- card: one atomic idea unit
- riff: local variant generation
- blend: combine multiple cards into one seed
- grow: generate the next full round
- debug: inspect how a round was produced

## Preferred labels

- `New project`
- `Start growing`
- `Try a seed prompt`
- `Grow round 2`
- `Riff`
- `Blend`
- `Lock`
- `Thumbs down`
- `Debug`
- `Export`

## Labels to avoid

- `chat`
- `conversation`
- `regenerate` for round advancement
- `node`
- `graph`
- `pipeline`
- `agent`

## Voice guidelines

- concise
- calm
- directional
- non-anthropomorphic

The system should sound useful, not theatrical.

## Status copy guidelines

Prefer:
- `Reading the brief`
- `Finding the live tensions`
- `Streaming cards into place`
- `Parsing files`
- `Ready to grow`

Avoid:
- verbose AI self-narration
- exaggerated claims of certainty
- hidden system jargon

## Empty-state guidance

The first empty workspace should suggest momentum.

Example:
- `Turn a blank brief into a structured board.`

## Recommended v1 decisions

- `recommended v1 decision`: use `Grow` as the primary round-advance label.
- `recommended v1 decision`: use `Riff` for local exploration even if internal services call this generation type something else.
- `recommended v1 decision`: keep helper copy short enough that it does not compete with cards for attention.
- `recommended v1 decision`: use `Thumbs down` rather than abstract labels like `reject` in the visible UI.

## Future-facing notes

- more specialized creative modes can later introduce domain-specific language, but the core vocabulary should stay stable
