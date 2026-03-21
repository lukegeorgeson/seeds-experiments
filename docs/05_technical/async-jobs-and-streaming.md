# Async Jobs and Streaming

## Purpose

Define how Seeds handles operations that are too slow or stateful for a simple request-response cycle.

## Job types in current v1

- full round generation
- debug explanation generation
- later: file ingestion
- later: markdown export synthesis

## Streaming goals

- make generation feel alive and lightweight
- reduce the perceived wait before the board becomes useful
- keep persistence reliable even while content arrives incrementally

## Current implementation stance

Use streamed HTTP responses for round generation, with a persisted `generation_request` record behind the scenes for recovery and observability.

## Current round generation flow

1. client requests Round 1 or `Grow`
2. backend creates a `generation_request` record
3. backend calls OpenAI Responses API with streaming enabled
4. backend parses output deltas into card-level provisional events
5. client renders skeleton placeholders immediately
6. client swaps placeholders for streamed cards as `card.completed` arrives
7. backend validates the final structured output
8. backend persists the finalized round snapshot
9. client reconciles provisional state with persisted objects

## Debug explanation flow

1. user opens debug overlay
2. client fetches stored generation metadata
3. client optionally triggers a second explanation run
4. explanation result is shown as additive inspection, not canonical state

## Failure handling

- job status should move through `queued`, `running`, `completed`, `failed`
- client should show concise recoverable errors
- partial UI state from failed generation should not be mistaken for persisted round state
- incomplete model responses should retry once before surfacing failure

## Recommended v1 decisions

- `recommended v1 decision`: keep stream events semantic and UI-oriented rather than mirroring raw model deltas.
- `recommended v1 decision`: keep a durable job record even if the UI connection drops.
- `recommended v1 decision`: retry external model calls only when the failure is clearly transient or structurally incomplete.
- `recommended v1 decision`: keep debug explanation generation isolated from the main round path so it never blocks the board.

## Non-goals for current v1

- full workflow engine semantics
- distributed queues unless real load demands it
- streaming every database mutation event to the UI
- style-repair loops in the critical path

## Future-facing notes

- a dedicated queue worker can later take over ingestion and export
- live collaborative updates can later build on the same job and event infrastructure
