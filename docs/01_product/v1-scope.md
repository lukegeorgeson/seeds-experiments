# V1 Scope

## Purpose

Define the committed v1 surface area so product and engineering stay focused around the actual Seeds build, not only the original concept.

## V1 goal

Ship a full-stack browser application that helps one user go from a text brief to sharpened directions through a structured multi-round card canvas, with persistent workspaces, streaming generation, and markdown export.

## Current implemented baseline

The current app already includes:

- persistent workspaces
- a blank-canvas landing experience
- a floating prompt panel inside the canvas
- Round 1 generation from prompt text
- Round 2 growth from user curation signals
- card-by-card streaming into the board
- selection and locking
- explicit rejection via `Thumbs down`
- between-round bridge summaries
- a debug overlay
- light and dark modes
- Vercel deployment wired to GitHub `main`

## In scope for v1

### Core workflow

- create or reopen a workspace
- enter prompt text directly on canvas
- generate Round 1 on a structured board
- select, lock, and reject cards
- grow Round 2 and later rounds from those signals
- inspect generation metadata through a debug surface
- revisit previous rounds on the same canvas
- export a markdown artifact

### Input support

- prompt text is the primary quality path
- uploaded `pdf`, `docx`, `md`, and `txt` remain in v1 scope
- `recommended v1 decision`: finish text-first quality before expanding ingestion-heavy flows

### Persistence

- persistent projects/workspaces
- stored round history
- stored card state for selected, locked, and rejected cards
- reopen and continue later
- generation request metadata for debugging and evals

### Technical baseline

- Next.js full-stack app
- React Flow canvas
- Supabase/Postgres storage
- OpenAI Responses API
- streamed generation
- Vercel deployment

## Partially implemented or intentionally deferred inside v1

- file-upload-driven generation quality
- markdown export UX
- user-authored notes and comments
- blend and riff interactions
- real authentication

## Out of scope

- multiplayer collaboration
- shared commenting and presence
- deck, slide, or PDF export
- deep retrieval/RAG over large knowledge bases
- enterprise permissions and role systems
- mobile-first UX
- agentic multi-step research pipelines
- model-provider abstraction beyond clean internal boundaries

## Firm decisions

- Use React Flow from the start.
- The canvas is structured and snap-to-column, not freeform graph-first.
- Use OpenAI Responses API for generation.
- Optimize for fast streaming over slow orchestration.
- Use Supabase/Postgres unless a blocker appears.
- Export markdown only in v1.
- Keep the current alpha text-first rather than file-first.

## Recommended v1 decisions

- `recommended v1 decision`: target 3 rounds as the normal session length, with an optional fourth polishing round.
- `recommended v1 decision`: keep stub auth during the current closed-alpha product build, but keep the data model ready for real authenticated ownership.
- `recommended v1 decision`: support one active branch in the UI while storing enough data to support future branching.
- `recommended v1 decision`: treat rejected cards as first-class negative steering for future rounds.

## Quality bar for v1

V1 is successful if:

- Round 1 reliably produces useful breadth from prompt text alone
- Round 2 visibly responds to selected, locked, and rejected cards
- the canvas feels calm, premium, and legible while streaming
- reopening a workspace preserves meaningful context cleanly
- debug information is strong enough to inspect prompt and steering behavior
- export produces a useful markdown handoff

## Explicit tradeoffs

- text-first quality is being prioritized over broader ingestion coverage
- single-user assumptions reduce complexity during closed alpha
- stub auth speeds product iteration but is not the long-term production state
- markdown export stays intentionally minimal to keep effort on ideation quality

## Future-facing notes

- branching can later become a visible navigation pattern
- collaboration can layer onto workspaces, rounds, and cards
- richer exports can be built on top of the markdown-oriented synthesis model
