# Domain Model

## Purpose

Define the core entities required to implement Seeds as a canvas-first, round-based, riff-capable co-creation system.

This document is the conceptual domain model. It describes the business objects and their responsibilities. For implementation-oriented interfaces, see `object-schemas.md`.

## Modeling principles

- the workspace is the persistent unit of creative work
- the round is the primary horizontal synthesis unit
- the riff pocket is the primary vertical exploration unit
- the card is the primary thinking unit
- interaction events are first-class input to AI logic
- lineage must survive editing, blending, riffing, and promotion
- finalized rounds are immutable snapshots
- columns are round-scoped dynamic objects, not a universal fixed taxonomy

## Core entities

### Workspace

Represents one creative exploration for one user.

Key responsibilities:

- stores brief context
- owns rounds, groups, and pockets
- owns generation history
- owns exports

Key fields:

- `id`
- `ownerUserId`
- `title`
- `promptText`
- `briefSummary`
- `status`
- `activeRoundId`
- `activeBranchId`
- `createdAt`
- `updatedAt`

### Round

Represents one formal board state on the X axis.

Key responsibilities:

- stores the visible category set for that stage
- stores the cards in the formal board lane
- stores round-level summary, scaffold state, and generation provenance
- anchors groups and riff pockets created inside that round

Key fields:

- `id`
- `workspaceId`
- `number`
- `stage`
- `parentRoundId`
- `rootRoundId`
- `title`
- `status`
- `synthesisSummary`
- `rationaleSummary`
- `generationRequestId`
- `createdAt`
- `finalizedAt`

### Column

Represents one visible category lane within a round.

Key responsibilities:

- holds a stage-appropriate category name and description
- orders cards inside the formal lane
- preserves per-round category structure

Key fields:

- `id`
- `roundId`
- `kind`
- `name`
- `description`
- `position`
- `layoutX`
- `layoutWidth`

### Card

Represents one atomic idea unit.

Key responsibilities:

- stores visible card text
- stores current curation state for UI convenience
- stores origin and lineage pointers
- optionally stores sparring placement inside a column

Key fields:

- `id`
- `workspaceId`
- `roundId`
- `columnId`
- `groupId`
- `pocketId`
- `text`
- `originType`
- `sortOrder`
- `isSelected`
- `isLocked`
- `isRejected`
- `isPromoted`
- `sparringMode`
- `sparringPlacement`
- `createdByUserId`
- `createdAt`
- `updatedAt`

### Group

Represents a lightweight manual cluster created by the user inside one round.

Key responsibilities:

- stores manual grouping chosen by the user
- preserves card membership for AI interpretation
- optionally carries a user-authored title or note

Key fields:

- `id`
- `workspaceId`
- `roundId`
- `cardIds`
- `title`
- `note`
- `createdByUserId`
- `createdAt`

### CardLineage

Represents where a card came from and how it was derived.

Use this to answer:

- what source cards led to this card?
- did it come from a riff, blend, locked carry, or manual edit?
- which round, group, and pocket relationships produced it?

Key fields:

- `id`
- `cardId`
- `parentRoundId`
- `parentCardIds`
- `parentPocketId`
- `parentBlendId`
- `lineageType`
- `derivedFromCardVersionId`
- `promotionEventId`
- `createdAt`

### RiffPocket

Represents one local vertical branch cluster inside a round.

Key responsibilities:

- anchors a local exploration to a source
- preserves pocket-scoped cards and ordering
- remains separate from the main round lane
- exposes compact metadata for optional weak-context use in `Grow`

Key fields:

- `id`
- `workspaceId`
- `roundId`
- `sourceCardIds`
- `sourceBlendId`
- `pocketGoal`
- `title`
- `status`
- `summaryForGrow`
- `layoutY`
- `generationRequestId`
- `createdAt`

### Blend

Represents an explicit synthesis seed created from multiple cards.

Key responsibilities:

- stores blend membership
- stores user intent to combine ingredients
- acts as a valid source for `Riff`

Key fields:

- `id`
- `workspaceId`
- `roundId`
- `sourceCardIds`
- `summary`
- `createdByUserId`
- `createdAt`

### Note

Represents a user-authored steering note.

Notes may attach to:

- a card
- a blend
- a riff pocket
- a round

Key fields:

- `id`
- `workspaceId`
- `targetType`
- `targetId`
- `text`
- `createdByUserId`
- `createdAt`

### Card state concepts

Selection, lock, and rejection remain first-class domain concepts, but v1 should not introduce dedicated state tables for them.

V1 modeling rule:

- store `isSelected`, `isLocked`, and `isRejected` on `Card` for UI convenience
- also store append-only `InteractionEvent` history for selection, lock, and rejection changes

Rejection is not absence of selection. It is an intentional anti-pattern signal.

### PromotionEvent

Represents the explicit upgrade of a riff output into the main round flow.

Key responsibilities:

- links a riff card to a main-lane card
- records who promoted it and when
- upgrades pocket output into future `Grow` input

Key fields:

- `id`
- `workspaceId`
- `roundId`
- `pocketId`
- `sourceCardId`
- `promotedCardId`
- `createdByUserId`
- `createdAt`

### InteractionEvent

Represents a semantic action by the user or system.

Examples:

- `select`
- `edit`
- `add`
- `note`
- `lock`
- `drag`
- `group`
- `blend`
- `riff_started`
- `riff_promoted`
- `reject`
- `grow_started`
- `grow_completed`

Key fields:

- `id`
- `workspaceId`
- `roundId`
- `actorUserId`
- `eventType`
- `targetType`
- `targetId`
- `payload`
- `createdAt`

### GenerationRequest

Represents one AI generation job.

Request types:

- `round`
- `riff`
- `export`

Key fields:

- `id`
- `workspaceId`
- `roundId`
- `pocketId`
- `requestType`
- `status`
- `model`
- `promptVersion`
- `requestFingerprint`
- `inputSnapshot`
- `derivedSignals`
- `rationaleSummary`
- `responseSnapshot`
- `streamStartedAt`
- `startedAt`
- `completedAt`
- `failedAt`
- `errorCode`
- `errorMessage`

### ExportArtifact

Represents the markdown handoff assembled from surviving process structure.

Key fields:

- `id`
- `workspaceId`
- `sourceRoundId`
- `format`
- `title`
- `markdown`
- `inputSnapshot`
- `createdByUserId`
- `createdAt`

## Relationship summary

- a workspace has many rounds
- a workspace has many groups
- a workspace has many riff pockets
- a round has many columns
- a round has many main-lane cards
- a round has many groups
- a round has many riff pockets
- a riff pocket has many pocket cards
- a blend can source a riff pocket
- a promoted riff card becomes a main-lane card with lineage
- a generation request may produce a round, pocket, or export

## Product behavior versus data requirement

Product behavior:

- the user sees rounds, cards, groups, pockets, blends, notes, and exports

Data requirement:

- store both current state and semantic event history
- store card state booleans plus append-only interaction events instead of dedicated selection or lock tables in v1
- preserve round immutability
- preserve pocket lineage and promotion history
- keep export artifacts reconstructable from stored input snapshots
