# AI Overview

## Purpose

Define the role of AI in Seeds and the boundaries of the v1 generation system.

## AI role in Seeds

AI in Seeds should generate structured possibility, not finished authority.

The system is responsible for:

- turning prompt context into a usable Round 1
- synthesizing future rounds from structured user signal
- producing an inspectable explanation layer for debugging
- later generating export-ready markdown summaries

The system is not responsible for:

- replacing user taste
- building final slide narratives
- running long autonomous research workflows

## Current implemented AI modes

### Round generation

Generate a full board for Round 1 or a later round using prompt context and current card signal.

### Debug explanation

Generate a compact inferred explanation of how a completed round was likely shaped by the prompt, selected cards, locked cards, rejected cards, and weak context.

## Planned v1 follow-on modes

### Local riff generation

Generate a small local cluster from one source card or blend.

### Export synthesis

Turn the chosen state of the workspace into a markdown handoff.

## Firm decisions

- Use OpenAI Responses API.
- Optimize for low-latency streaming generation.
- Prefer fewer, cleaner model calls over deep orchestration trees.
- Treat user actions as structured inputs, not only natural-language prompt text.
- Keep the main round path text-first until output quality is strong enough.

## Recommended v1 decisions

- `recommended v1 decision`: use one primary model family for the main round path first, and only split models later if latency or cost requires it.
- `recommended v1 decision`: keep prompt assembly deterministic and inspectable.
- `recommended v1 decision`: require structured JSON outputs from the model for board generation, then render those objects into cards.
- `recommended v1 decision`: use a secondary debug run only as an additive inspection layer, never as the authoritative record of what happened.

## Quality bar

The AI system is successful when:

- Round 1 feels varied but still disciplined
- later rounds visibly respond to selected, locked, and rejected cards
- outputs stay atomic, direct, and note-like
- streaming starts fast enough that the canvas feels alive before final persistence completes
- debugging surfaces explain the run without pretending to expose hidden chain-of-thought

## Data implications

- prompts should be assembled from normalized workspace state
- model outputs should be captured with enough metadata for debugging and evals
- generation inputs and outputs should be linked to the round request that produced them
- negative steering must be stored or passed explicitly rather than inferred from absence

## Future-facing notes

- model specialization can later be added for summarization, ranking, or export
- learning loops should be built through evals and prompt revision, not hidden stateful hacks
