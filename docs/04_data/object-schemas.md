# Object Schemas

## Purpose

Define implementation-oriented object shapes for Seeds.

These schemas are intentionally TypeScript-like. They are not a strict database schema and they are not a final API contract, but they should be close enough to guide frontend, backend, and orchestration work.

## Core enums

```ts
type WorkspaceStatus = "active" | "archived";
type RoundStatus = "draft" | "finalized" | "failed";
type RoundStage = "diverge" | "synthesize" | "sharpen" | "handoff";
type GenerationRequestType = "round" | "riff" | "export";
type GenerationStatus = "queued" | "running" | "completed" | "failed" | "cancelled";
type CardOriginType =
  | "ai"
  | "user"
  | "edited_ai"
  | "riff"
  | "blend"
  | "locked_carry"
  | "promoted_riff";
type PocketStatus = "active" | "promoted" | "discarded" | "archived";
type NoteTargetType = "card" | "blend" | "pocket" | "round";
type LineageType = "direct" | "edited" | "blend" | "riff" | "promoted" | "locked_carry";
type SparringPlacement = "main" | "sub_lane";
type InteractionEventType =
  | "select"
  | "deselect"
  | "lock"
  | "unlock"
  | "reject"
  | "unreject"
  | "edit"
  | "add"
  | "note"
  | "drag"
  | "group"
  | "ungroup"
  | "blend_create"
  | "riff_start"
  | "riff_promote"
  | "grow_start"
  | "grow_complete"
  | "export_create";
```

## Workspace and round objects

```ts
interface Workspace {
  id: string;
  ownerUserId: string;
  title: string;
  promptText: string;
  briefSummary?: string | null;
  status: WorkspaceStatus;
  activeRoundId?: string | null;
  activeBranchId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Round {
  id: string;
  workspaceId: string;
  number: number;
  stage: RoundStage;
  parentRoundId?: string | null;
  rootRoundId?: string | null;
  title?: string | null;
  synthesisSummary?: string | null;
  rationaleSummary?: string | null;
  status: RoundStatus;
  generationRequestId?: string | null;
  scaffold: PreGrowScaffoldResponse;
  createdAt: string;
  finalizedAt?: string | null;
}

interface Column {
  id: string;
  roundId: string;
  kind: string;
  name: string;
  description?: string | null;
  position: number;
  layoutX?: number | null;
  layoutWidth?: number | null;
}
```

## Card, group, pocket, and lineage objects

```ts
interface Card {
  id: string;
  workspaceId: string;
  roundId: string;
  columnId?: string | null;
  groupId?: string | null;
  pocketId?: string | null;
  text: string;
  originType: CardOriginType;
  sortOrder: number;
  isSelected: boolean;
  isLocked: boolean;
  isRejected: boolean;
  isPromoted: boolean;
  sparringMode?: SparringMode | null;
  sparringPlacement?: SparringPlacement | null;
  createdByUserId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Group {
  id: string;
  workspaceId: string;
  roundId: string;
  cardIds: string[];
  title?: string | null;
  note?: string | null;
  createdByUserId: string;
  createdAt: string;
}

interface RiffPocket {
  id: string;
  workspaceId: string;
  roundId: string;
  sourceCardIds: string[];
  sourceBlendId?: string | null;
  pocketGoal?: PocketGoal | null;
  title?: string | null;
  status: PocketStatus;
  summaryForGrow?: string | null;
  layoutY?: number | null;
  generationRequestId?: string | null;
  createdAt: string;
}

interface CardLineage {
  id: string;
  cardId: string;
  lineageType: LineageType;
  parentRoundId?: string | null;
  parentCardIds: string[];
  parentPocketId?: string | null;
  parentBlendId?: string | null;
  promotionEventId?: string | null;
  createdAt: string;
}

type PocketGoal =
  | "expand"
  | "contrast"
  | "simplify"
  | "sharpen"
  | "translate"
  | "stress_test";
```

## Blend, note, and promotion objects

```ts
interface Blend {
  id: string;
  workspaceId: string;
  roundId: string;
  sourceCardIds: string[];
  summary?: string | null;
  createdByUserId: string;
  createdAt: string;
}

interface Note {
  id: string;
  workspaceId: string;
  targetType: NoteTargetType;
  targetId: string;
  text: string;
  createdByUserId: string;
  createdAt: string;
}

interface PromotionEvent {
  id: string;
  workspaceId: string;
  roundId: string;
  pocketId: string;
  sourceCardId: string;
  promotedCardId: string;
  createdByUserId: string;
  createdAt: string;
}
```

## Interaction events

```ts
interface InteractionEvent<TPayload = Record<string, unknown>> {
  id: string;
  workspaceId: string;
  roundId?: string | null;
  actorUserId?: string | null;
  eventType: InteractionEventType;
  targetType?: "workspace" | "round" | "column" | "card" | "blend" | "pocket" | "group" | "export";
  targetId?: string | null;
  payload: TPayload;
  createdAt: string;
}

interface DragEventPayload {
  cardId: string;
  fromColumnId?: string | null;
  toColumnId?: string | null;
  fromSortOrder?: number | null;
  toSortOrder?: number | null;
  fromGroupId?: string | null;
  toGroupId?: string | null;
}

interface EditEventPayload {
  cardId: string;
  previousText: string;
  nextText: string;
}

interface GroupEventPayload {
  groupId: string;
  cardIds: string[];
  groupLabel?: string | null;
}
```

## Round generation request and result

```ts
interface GenerationRequest {
  id: string;
  workspaceId: string;
  roundId?: string | null;
  pocketId?: string | null;
  requestType: GenerationRequestType;
  status: GenerationStatus;
  model: string;
  promptVersion: string;
  requestFingerprint: string;
  inputSnapshot: RoundGenerationInput | RiffGenerationInput | ExportGenerationInput;
  derivedSignals?: DerivedSignalSnapshot | null;
  rationaleSummary?: string | null;
  responseSnapshot?: unknown;
  streamStartedAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  createdAt: string;
}

interface RoundGenerationInput {
  workspaceId: string;
  sourceRoundId?: string | null;
  roundNumber: number;
  stage: RoundStage;
  briefSummary: string;
  sourceColumns: Array<{
    id: string;
    name: string;
    kind: string;
    cardIds: string[];
  }>;
  selectedCardIds: string[];
  lockedCardIds: string[];
  editedCardIds: string[];
  userAuthoredCardIds: string[];
  rejectedCardIds: string[];
  promotedCardIds: string[];
  groupSummaries: Array<{
    id: string;
    title?: string | null;
    note?: string | null;
    cardIds: string[];
  }>;
  noteIds: string[];
  blendIds: string[];
  scaffold: PreGrowScaffoldResponse;
  pocketContext?: Array<{
    pocketId: string;
    sourceCardIds: string[];
    summary: string;
  }> | null;
  compactHistory: CompactRoundHistory[];
}

interface RoundGenerationResult {
  title: string;
  stage: RoundStage;
  synthesisSummary: string;
  rationaleSummary: string;
  categoryRationale: string[];
  columns: GeneratedColumn[];
  cards: GeneratedCard[];
  sparringSummary?: string | null;
}

interface GeneratedColumn {
  kind: string;
  name: string;
  description?: string | null;
  position: number;
}

interface GeneratedCard {
  columnKind: string;
  text: string;
  sparringMode?: SparringMode | null;
  sparringPlacement?: SparringPlacement | null;
  parentCardIds?: string[];
}
```

## Riff generation request and result

```ts
interface RiffGenerationInput {
  workspaceId: string;
  roundId: string;
  pocketGoal?: PocketGoal | null;
  sourceCardIds: string[];
  sourceBlendId?: string | null;
  briefSummary: string;
  sourceContext: Array<{
    cardId: string;
    text: string;
    columnName?: string | null;
  }>;
  noteIds: string[];
}

interface RiffGenerationResult {
  pocketTitle?: string | null;
  summaryForGrow?: string | null;
  cards: Array<{
    text: string;
    parentCardIds: string[];
  }>;
}
```

## Derived signal objects

```ts
interface DerivedSignalSnapshot {
  semanticRepetitionScore: number;
  noveltySpreadScore: number;
  convergenceScore: number;
  safeSelectionScore: number;
  manualClusteringStrength: number;
  needsBreadth: boolean;
  needsSynthesis: boolean;
  needsPressure: boolean;
  triggeredDiversityModes: DiversityMode[];
}

type DiversityMode =
  | "opposite_direction"
  | "anti_cliche"
  | "cross_domain_analogy"
  | "harsh_constraint"
  | "simplification_challenge"
  | "remove_obvious_ingredient"
  | "opposite_market_logic";

type SparringMode =
  | "counter_position"
  | "simplification_pressure"
  | "reduction_lens"
  | "low_cost_alternative"
  | "opposite_audience"
  | "assumption_challenge"
  | "failure_probe";
```

## Export objects

```ts
interface ExportGenerationInput {
  workspaceId: string;
  sourceRoundId: string;
  briefSummary: string;
  chosenDirection: string;
  pillarCardIds: string[];
  supportingCardIds: string[];
  doList: string[];
  dontList: string[];
  openQuestionIds: string[];
  assumptionIds: string[];
  nextTestIds: string[];
}

interface ExportArtifact {
  id: string;
  workspaceId: string;
  sourceRoundId: string;
  format: "markdown";
  title: string;
  markdown: string;
  sections: ExportSections;
  createdByUserId: string;
  createdAt: string;
}

interface ExportSections {
  originContext: string;
  briefSummary: string;
  synthesizedStrategicDirection: string;
  foundationalPillars: string[];
  supportingIdeas: string[];
  doGuidance: string[];
  dontGuidance: string[];
  openQuestions: string[];
  nextTests: string[];
  downstreamPrompt: string;
}
```

## Scaffold objects

```ts
interface PreGrowScaffoldResponse {
  carryForwardCardIds: string[];
  directionalNote: string;
  rejectedCardIds?: string[];
  mostDistinctiveCardIds?: string[];
  mostUsableCardIds?: string[];
  preservedTension?: string | null;
  avoidNote?: string | null;
}

interface CompactRoundHistory {
  roundId: string;
  roundNumber: number;
  stage: RoundStage;
  summary: string;
}
```
