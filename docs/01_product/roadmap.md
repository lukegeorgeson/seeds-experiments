# Roadmap

## Purpose

Outline the likely sequence of product expansion after v1 so current implementation choices preserve the right flexibility.

## Product phases

## Phase 1: Strong single-user core

Goal:
- make the end-to-end brief-to-direction loop genuinely useful

Expected scope:
- structured canvas
- rounds
- local riffing
- persistence
- markdown export

Success signals:
- users can reach a clear direction in 3 to 4 rounds
- exported markdown is reused downstream
- workspaces feel worth reopening

## Phase 2: Better shaping and branching

Goal:
- deepen control without making the product heavier

Likely additions:
- visible branching from prior rounds
- stronger blend and merge behaviors
- better round summaries and comparisons
- saved views or filters
- more deliberate column adaptation

## Phase 3: Collaboration and downstream flow

Goal:
- support teams and handoff

Likely additions:
- shared workspaces
- comments and presence
- versioned exports
- richer export targets
- shareable read-only links

## Phase 4: Knowledge and system intelligence

Goal:
- make Seeds better at context carry-forward without becoming a heavy research product

Likely additions:
- reusable reference libraries
- project memory
- reusable prompt packs or creative modes
- evaluation and tuning pipelines informed by past usage

## What should stay stable across phases

- cards remain the core thinking unit
- rounds remain the core synthesis unit
- user actions remain the primary signal source
- the UI remains canvas-first, not chat-first

## Recommended v1 decisions made for roadmap fit

- `recommended v1 decision`: persist event-like interaction data so future branching and evals are possible.
- `recommended v1 decision`: keep AI generation behind internal service boundaries even if only one provider is used.
- `recommended v1 decision`: model rounds as immutable snapshots plus references to carried-forward cards.
- `recommended v1 decision`: keep export synthesis as its own step so future export formats can reuse it.

## Risks to avoid

- adding collaboration before the solo flow is strong
- adding heavy framework templates that make the tool formulaic
- letting file ingestion grow into a general document management system
- turning local riffing into an unbounded chat subtree
