# Backend Architecture

## Purpose

Define the server-side structure for Seeds v1.

## Recommended v1 decision

Use a clean modular backend inside the full-stack app boundary.

Suggested layers:

1. route or handler layer
2. application services
3. domain logic
4. infrastructure adapters

## Responsibilities by layer

### Route or handler layer

- validate input
- identify workspace and round context
- start or attach to streaming responses
- return concise API contracts

### Application services

- orchestrate workspace creation
- manage round growth
- manage riff generation
- coordinate export synthesis

### Domain logic

- determine signal weighting
- build synthesis summaries
- enforce round creation rules
- validate state transitions

### Infrastructure adapters

- OpenAI Responses API client
- Postgres repositories
- Supabase Storage client
- file parsing adapters

## API surface

Likely endpoints:
- create workspace
- upload and ingest files
- generate Round 1
- grow next round
- generate riff
- update card
- update selection or lock state
- export markdown

## Recommended v1 decisions

- `recommended v1 decision`: keep generation orchestration in backend services, not in the client.
- `recommended v1 decision`: persist final normalized round state only after validation, but allow the client to render streamed partials before final commit.
- `recommended v1 decision`: store prompt versions and model metadata for every generation request.

## Scalability guidance

- application services should depend on repository interfaces, not raw framework code
- prompt assembly should live in the AI module, not route handlers
- file ingestion should be isolated from round generation paths

## Future-facing notes

- dedicated worker processes can later execute the same application services
- provider failover can later be added behind the AI adapter layer if ever needed
