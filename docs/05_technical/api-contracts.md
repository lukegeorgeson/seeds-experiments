# API Contracts

## Purpose

Define the current and target server API surface, request shapes, response shapes, and streaming behavior for Seeds v1.

This document now reflects the chosen v1 model:

- round-scoped dynamic columns
- mandatory minimal pre-Grow scaffold
- first-class groups
- separate `Grow` and `Riff` orchestration
- unpromoted riff cards excluded from `Grow` by default

## Contract goals

- keep the route surface small and task-oriented
- make streaming behavior explicit
- preserve clear separation between round generation and local riff generation
- keep the API durable enough for the current app and the next implementation phase

## API style

Recommended v1 decision:

- use JSON over HTTPS for standard requests
- use streamed HTTP responses for `Grow`, Round 1 generation, and `Riff`
- treat streamed events as provisional UI hints and the final persisted payload as authoritative

## Auth contract

- deployed alpha currently runs with stub auth
- production-intended behavior is still ownership-based access derived from server session context

## Workspace endpoints

### `GET /api/workspaces`

Purpose:

- list available workspaces for the acting user or stub user

### `POST /api/workspaces`

Purpose:

- create a workspace record

Request body:

```json
{
  "title": "Quiet tea launch",
  "promptText": "Shape a launch direction for a premium tea brand..."
}
```

### `GET /api/workspaces/:workspaceId`

Purpose:

- load the workspace record plus persisted round, pocket, group, and export state

Recommended response shape:

```json
{
  "workspace": {},
  "activeRound": {},
  "columns": [],
  "cards": [],
  "groups": [],
  "pockets": [],
  "exports": []
}
```

## Round generation endpoints

### `POST /api/workspaces/bootstrap/stream`

Purpose:

- create a new workspace from prompt text and begin Round 1 generation in one streamed flow

Request body:

```json
{
  "promptText": "Shape a launch direction for a premium tea brand..."
}
```

### `POST /api/workspaces/:workspaceId/generate-round-one/stream`

Purpose:

- generate Round 1 for an existing empty workspace

Request body:

```json
{
  "promptText": "Shape a launch direction for a premium tea brand..."
}
```

### `POST /api/workspaces/:workspaceId/grow-next-round/stream`

Purpose:

- generate the next round from an existing source round

Request body:

```json
{
  "sourceRoundId": "uuid",
  "scaffold": {
    "carryForwardCardIds": ["uuid", "uuid", "uuid"],
    "directionalNote": "Keep the ritual feel, but make the direction less precious."
  }
}
```

Optional richer scaffold fields:

```json
{
  "sourceRoundId": "uuid",
  "scaffold": {
    "carryForwardCardIds": ["uuid", "uuid", "uuid"],
    "directionalNote": "Keep the ritual feel, but make the direction less precious.",
    "rejectedCardIds": ["uuid"],
    "mostDistinctiveCardIds": ["uuid", "uuid"],
    "mostUsableCardIds": ["uuid", "uuid"],
    "preservedTension": "Calm but not luxury cliche.",
    "avoidNote": "Avoid spa language."
  }
}
```

Rules:

- the minimal scaffold is mandatory in v1
- `carryForwardCardIds` should contain a small set of preserved cards
- `directionalNote` is required even if it is short
- raw unpromoted riff cards must not be sent as first-class `Grow` inputs
- the backend may include weak pocket-level metadata from unpromoted pockets during prompt assembly, but that stays server-controlled

Recommended response contract:

- final persisted round payload includes dynamic columns, cards, groups, group membership, pocket summaries, `synthesisSummary`, and `rationaleSummary`

## Card endpoints

### `PATCH /api/workspaces/:workspaceId/cards/:cardId`

Purpose:

- update card state or text

Supported request shapes:

State updates:

```json
{
  "isSelected": true,
  "isLocked": false,
  "isRejected": false
}
```

Text update:

```json
{
  "text": "Running club as weekly practice, not event series."
}
```

Optional sparring metadata updates:

```json
{
  "sparringPlacement": "sub_lane"
}
```

Rules:

- card state updates must also emit append-only interaction events
- `isRejected: true` clears selection and lock server-side
- sparring placement is persisted on the card so board restore remains deterministic

### `POST /api/workspaces/:workspaceId/cards`

Purpose:

- create a user-authored card in a round or column

Request body:

```json
{
  "roundId": "uuid",
  "columnId": "uuid",
  "text": "Make attendance visible through simple physical artifacts."
}
```

## Group endpoints

### `POST /api/workspaces/:workspaceId/rounds/:roundId/groups`

Purpose:

- create a manual group inside a round

Request body:

```json
{
  "title": "Useful restraint",
  "note": "Feels differentiated because it removes noise.",
  "cardIds": ["uuid", "uuid", "uuid"]
}
```

Rules:

- backend creates the `group` row and normalized `group_cards` membership rows
- grouping should also emit a semantic interaction event

### `PATCH /api/workspaces/:workspaceId/rounds/:roundId/groups/:groupId`

Purpose:

- rename a group, update its note, or replace membership

Request body:

```json
{
  "title": "Distinctive simplicity",
  "note": "This cluster should shape the next round.",
  "cardIds": ["uuid", "uuid", "uuid", "uuid"]
}
```

### `DELETE /api/workspaces/:workspaceId/rounds/:roundId/groups/:groupId`

Purpose:

- remove a manual group without deleting the underlying cards

## Riff endpoints

### `POST /api/workspaces/:workspaceId/rounds/:roundId/riff/stream`

Purpose:

- create a local riff pocket from one source card or one blend

Request body:

```json
{
  "sourceCardIds": ["uuid"],
  "pocketGoal": "expand"
}
```

Blend-driven example:

```json
{
  "sourceBlendId": "uuid",
  "pocketGoal": "contrast"
}
```

Rules:

- `Riff` returns a pocket, not a round
- streamed pocket cards remain provisional until persistence completes
- persisted pocket records may include a compact `summaryForGrow` field for optional weak-context use later

### `POST /api/workspaces/:workspaceId/rounds/:roundId/pockets/:pocketId/promote`

Purpose:

- promote one riff card into formal round material

Request body:

```json
{
  "sourceCardId": "uuid",
  "targetColumnId": "uuid"
}
```

Rules:

- backend creates a new main-lane card or upgrades the card into main-lane membership
- backend writes a `promotion_event`
- promoted cards become valid `Grow` input

## Blend and note endpoints

### `POST /api/workspaces/:workspaceId/rounds/:roundId/blends`

Purpose:

- create a blend seed from multiple cards

Request body:

```json
{
  "sourceCardIds": ["uuid", "uuid"],
  "summary": "Practical ritual with low-fi confidence."
}
```

### `POST /api/workspaces/:workspaceId/notes`

Purpose:

- attach a note to a card, round, group, pocket, or blend

Request body:

```json
{
  "targetType": "group",
  "targetId": "uuid",
  "text": "Keep this tension unresolved for one more round."
}
```

## Debug and export endpoints

### `GET /api/workspaces/:workspaceId/rounds/:roundId/debug`

Purpose:

- fetch structured generation metadata for one round

Recommended response fields:

```json
{
  "round": {},
  "generationRequest": {},
  "rationaleSummary": "The round shifts from signals to tensions because the user clustered cards around two competing behavioral patterns."
}
```

### `POST /api/workspaces/:workspaceId/rounds/:roundId/debug/explain`

Purpose:

- run a secondary inferred debug explanation for one round

### `POST /api/workspaces/:workspaceId/exports`

Purpose:

- generate and persist a markdown export artifact from the chosen round

Request body:

```json
{
  "sourceRoundId": "uuid"
}
```

## Streaming event contract

Round-generation streams should support:

```text
event: workspace.created
data: {"workspace": {...}}

event: generation.started
data: {"requestId":"uuid","type":"round"}

event: column.started
data: {"columnKind":"themes","columnName":"Themes","position":0}

event: card.completed
data: {"columnKind":"themes","card":{"text":"..."}, "cardIndex":0}

event: column.completed
data: {"columnKind":"themes","cards":[{"text":"..."}]}

event: generation.completed
data: {"workspace": {...}, "round": {...}, "columns": [...], "cards": [...], "groups": []}

event: generation.error
data: {"message":"Could not generate the round."}
```

Riff-generation streams should support:

```text
event: generation.started
data: {"requestId":"uuid","type":"riff"}

event: pocket.created
data: {"pocketId":"uuid","title":"Contrast pocket"}

event: riff_card.completed
data: {"pocketId":"uuid","card":{"text":"..."},"cardIndex":0}

event: pocket.completed
data: {"pocketId":"uuid","cards":[{"text":"..."}]}

event: generation.completed
data: {"pocket": {...}, "cards": [...]}

event: generation.error
data: {"message":"Could not generate the riff."}
```

## Contract notes

- `card.completed` and `riff_card.completed` should be the first useful content moments for the client
- `generation.completed` returns the authoritative persisted state
- clients should not infer `Grow` input from local-only UI state that was never persisted or scaffolded

## Recommended v1 decisions

- keep task-oriented route names until the product surface is stable
- keep stream payloads small and purpose-built for the client shell
- prefer explicit request fields for scaffold and mutation inputs over hidden inference from UI state
- keep group membership normalized server-side even if the client sends `cardIds` arrays for convenience

## Non-goals for current v1

- exposing raw prompt-assembly internals through the primary mutation APIs
- letting clients directly submit full generated round structures for persistence
- treating unpromoted riff cards as peer inputs to `Grow`
