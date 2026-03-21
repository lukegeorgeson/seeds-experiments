# Context Architecture

> Frontend, backend, storage, and migration plan for the context vessel system.

---

## Overview

This document specifies the technical architecture for context vessels and the Start Zone. It covers database changes, API layer, data access functions, frontend state management, component structure, and migration path from the current `PromptSurface`.

See [context-model.md](../04_data/context-model.md) for data model, [context-vessels.md](../02_ux/context-vessels.md) for UX mechanics, [context-assembly.md](../03_ai/context-assembly.md) for prompt assembly, and [start-zone.md](../02_ux/start-zone.md) for canvas layout.

---

## Database Layer

### New migration

File: `supabase/migrations/202603180005_context_vessels.sql`

Creates two tables (`context_vessels`, `vessel_items`) and supporting indexes/triggers. Full DDL in [context-model.md](../04_data/context-model.md).

### Relationship to existing schema

- `context_vessels.workspace_id` → `workspaces.id` (cascade delete)
- `context_vessels.created_by_user_id` → `profiles.id`
- `vessel_items.source_input_id` → `source_inputs.id` (nullable, for file items)
- No changes to existing tables
- `generation_requests.input_snapshot` JSONB field gains a `vessels` array (schema-level, no migration needed — JSONB is schemaless)

### RLS policy (stub auth in v1)

```sql
-- Match existing workspace RLS pattern
alter table context_vessels enable row level security;
alter table vessel_items enable row level security;

-- Vessels accessible if workspace is accessible
create policy "vessel_workspace_access" on context_vessels
  for all using (
    workspace_id in (select id from workspaces)
  );

create policy "vessel_item_access" on vessel_items
  for all using (
    vessel_id in (select id from context_vessels)
  );
```

Follows existing stub auth pattern — production auth will tighten these policies.

---

## API Layer

### New endpoints

All endpoints follow patterns established in [api-contracts.md](api-contracts.md).

#### `GET /api/workspaces/:workspaceId/vessels`

List all vessels for a workspace, including items.

```typescript
// Route: apps/web/src/app/api/workspaces/[workspaceId]/vessels/route.ts

export async function GET(req, { params }) {
  const { workspaceId } = params;
  const vessels = await listVessels(workspaceId);
  return Response.json({ vessels });
}
```

**Response**: `{ vessels: ContextVessel[] }` — all vessels regardless of activation state, ordered by position. Each vessel includes its items.

#### `POST /api/workspaces/:workspaceId/vessels`

Create a new vessel.

```typescript
export async function POST(req, { params }) {
  const { workspaceId } = params;
  const session = await getSession(req);
  const body = await req.json();
  // body: { vesselKind, title, description?, isAnti? }
  const vessel = await createVessel(workspaceId, session.userId, body);
  return Response.json({ vessel }, { status: 201 });
}
```

#### `PATCH /api/workspaces/:workspaceId/vessels/:vesselId`

Update vessel properties (title, description, is_anti, activation_state, position).

```typescript
// Route: apps/web/src/app/api/workspaces/[workspaceId]/vessels/[vesselId]/route.ts

export async function PATCH(req, { params }) {
  const { workspaceId, vesselId } = params;
  const body = await req.json();
  const vessel = await updateVessel(workspaceId, vesselId, body);
  return Response.json({ vessel });
}
```

#### `DELETE /api/workspaces/:workspaceId/vessels/:vesselId`

Delete vessel and cascade-delete items.

```typescript
export async function DELETE(req, { params }) {
  const { workspaceId, vesselId } = params;
  await deleteVessel(workspaceId, vesselId);
  return new Response(null, { status: 204 });
}
```

#### `POST /api/workspaces/:workspaceId/vessels/:vesselId/items`

Add an item to a vessel.

```typescript
// Route: apps/web/src/app/api/workspaces/[workspaceId]/vessels/[vesselId]/items/route.ts

export async function POST(req, { params }) {
  const { vesselId } = params;
  const body = await req.json();
  // body: { itemType, textContent?, sourceInputId?, linkUrl? }
  const item = await addVesselItem(vesselId, body);
  return Response.json({ item }, { status: 201 });
}
```

#### `DELETE /api/workspaces/:workspaceId/vessels/:vesselId/items/:itemId`

Remove a single item from a vessel.

```typescript
// Route: apps/web/src/app/api/workspaces/[workspaceId]/vessels/[vesselId]/items/[itemId]/route.ts

export async function DELETE(req, { params }) {
  const { vesselId, itemId } = params;
  await removeVesselItem(vesselId, itemId);
  return new Response(null, { status: 204 });
}
```

### Modified endpoints

#### `POST /api/workspaces/:workspaceId/generate-round-one/stream`

**Change**: Before calling `createRoundResponse()`, load active vessels via `resolveVesselContextBlocks(workspaceId)` and include vessel text blocks in the generation context. Serialize active vessels into `input_snapshot`.

#### `POST /api/workspaces/:workspaceId/grow-next-round/stream`

**Change**: Same as above — load active vessels and include in context assembly. Vessel weight is lower (background context).

#### `POST /api/workspaces/:workspaceId/rounds/:roundId/riff/stream`

**Change**: Load active vessels and include at low weight in riff context assembly.

---

## Data Access Layer

### New functions in `workspaces.ts`

```typescript
// ─── Vessel CRUD ───

async function createVessel(
  workspaceId: string,
  userId: string,
  input: { vesselKind: VesselKind; title: string; description?: string; isAnti?: boolean }
): Promise<ContextVessel>

async function updateVessel(
  workspaceId: string,
  vesselId: string,
  patch: Partial<Pick<ContextVessel, 'title' | 'description' | 'isAnti' | 'activationState' | 'position'>>
): Promise<ContextVessel>

async function deleteVessel(workspaceId: string, vesselId: string): Promise<void>

async function addVesselItem(
  vesselId: string,
  input: { itemType: VesselItemType; textContent?: string; sourceInputId?: string; linkUrl?: string }
): Promise<VesselItem>

async function removeVesselItem(vesselId: string, itemId: string): Promise<void>

// ─── Vessel queries ───

async function listVessels(workspaceId: string): Promise<ContextVessel[]>
// Returns all vessels with items, ordered by position

async function listActiveVessels(workspaceId: string): Promise<ContextVessel[]>
// Returns vessels where activation_state='active' AND has ≥1 item, ordered by position

// ─── Prompt assembly ───

async function resolveVesselContextBlocks(workspaceId: string): Promise<{
  positiveBlock: string;
  antiBlock: string;
  includedVesselIds: string[];
  includedVessels: ContextVessel[];
  truncated: boolean;
}>
// Loads active vessels, formats as prompt text, enforces token budget
```

### Modification to `deriveRoundContext()`

Add vessel context to the return type:

```typescript
function deriveRoundContext(
  workspace: WorkspaceRow,
  sourceCanvas: WorkspaceCanvasModel | null,
  scaffold: PreGrowScaffoldResponse | null,
): {
  // ... existing fields ...
  vesselPositiveBlock: string;
  vesselAntiBlock: string;
  vesselIds: string[];
}
```

`deriveRoundContext()` calls `resolveVesselContextBlocks()` internally and includes vessel blocks in the returned context.

---

## Frontend Architecture

### State management

New state in `workspace-studio.tsx`:

```typescript
// Vessel state
const [vessels, setVessels] = useState<ContextVessel[]>([]);
const [vesselLoading, setVesselLoading] = useState(false);

// Start Zone state
const [startZoneExpanded, setStartZoneExpanded] = useState(true);
```

### Vessel loading

On workspace open (alongside existing round/canvas loading):

```typescript
useEffect(() => {
  if (workspaceId) {
    fetch(`/api/workspaces/${workspaceId}/vessels`)
      .then(res => res.json())
      .then(data => setVessels(data.vessels));
  }
}, [workspaceId]);
```

### CRUD handlers

Each handler calls the API, then updates local state on success:

```typescript
const handleCreateVessel = async (kind: VesselKind) => {
  const res = await fetch(`/api/workspaces/${workspaceId}/vessels`, {
    method: 'POST',
    body: JSON.stringify({ vesselKind: kind, title: defaultTitleForKind(kind) }),
  });
  const { vessel } = await res.json();
  setVessels(prev => [...prev, vessel]);
};

const handleUpdateVessel = async (vesselId: string, patch: Partial<ContextVessel>) => {
  const res = await fetch(`/api/workspaces/${workspaceId}/vessels/${vesselId}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  const { vessel } = await res.json();
  setVessels(prev => prev.map(v => v.id === vesselId ? vessel : v));
};

const handleDeleteVessel = async (vesselId: string) => {
  await fetch(`/api/workspaces/${workspaceId}/vessels/${vesselId}`, {
    method: 'DELETE',
  });
  setVessels(prev => prev.filter(v => v.id !== vesselId));
};
```

Item handlers follow the same pattern — API call, then local state update.

### Props flow

```
workspace-studio.tsx (state owner)
  └── workspace-canvas.tsx (layout + ReactFlow)
        └── StartZoneNode (ReactFlow node)
              ├── PromptTextarea (existing behavior, relocated)
              ├── FileDropZone (existing behavior, relocated)
              ├── GenerateButton (existing behavior, relocated)
              └── VesselToolbox
                    ├── Kind buttons (create vessels)
                    └── VesselCard[] (one per vessel)
                          └── VesselEditor (inline editing)
```

### Start Zone node data

```typescript
type StartZoneNodeData = {
  expanded: boolean;
  promptText: string;
  vessels: ContextVessel[];
  onPromptChange: (text: string) => void;
  onGenerate: () => void;
  onToggleExpanded: () => void;
  onCreateVessel: (kind: VesselKind) => void;
  onUpdateVessel: (id: string, patch: Partial<ContextVessel>) => void;
  onDeleteVessel: (id: string) => void;
  onAddItem: (vesselId: string, item: Partial<VesselItem>) => void;
  onRemoveItem: (vesselId: string, itemId: string) => void;
};
```

---

## Component Structure

### New files

| File | Component | Purpose |
|------|-----------|---------|
| `apps/web/src/components/workspace/start-zone.tsx` | `StartZoneNode` | ReactFlow node wrapping the entire Start Zone region |
| `apps/web/src/components/workspace/vessel-toolbox.tsx` | `VesselToolbox` | Kind buttons + existing vessel list |
| `apps/web/src/components/workspace/vessel-card.tsx` | `VesselCard` | Compact vessel display with toggle controls |
| `apps/web/src/components/workspace/vessel-editor.tsx` | `VesselEditor` | Inline editor for title, description, items |

### Modified files

| File | Change |
|------|--------|
| `workspace-canvas.tsx` | Remove `PromptSurface` component; add `startZone` to `nodeTypes`; adjust `buildLayoutMetrics` to reserve Start Zone space; shift round zone origins right by Start Zone width + gap |
| `workspace-studio.tsx` | Add vessel state, loading, CRUD handlers; pass vessels and handlers to canvas; adjust generation calls to include vessel context; manage `startZoneExpanded` state |

### Layout metrics change

In `buildLayoutMetrics()`:

```typescript
// Before:
const zoneOriginX = roundZoneIndex * (roundZoneWidth + ROUND_ZONE_GAP);

// After:
const START_ZONE_WIDTH = 480;
const startZoneReserved = START_ZONE_WIDTH + ROUND_ZONE_GAP;
const zoneOriginX = startZoneReserved + roundZoneIndex * (roundZoneWidth + ROUND_ZONE_GAP);
```

The Start Zone node itself is positioned at `x: 0`, and all round zones shift right.

---

## Migration from PromptSurface

### What moves

| Current location | New location |
|-----------------|--------------|
| `PromptSurface` textarea | `StartZoneNode` → `PromptTextarea` |
| `PromptSurface` example prompts | `StartZoneNode` → example prompts section |
| `PromptSurface` file drop | `StartZoneNode` → `FileDropZone` |
| `PromptSurface` generate button | `StartZoneNode` → `GenerateButton` |
| `CanvasMode` ("prompt" \| "board") | Replaced by `startZoneExpanded` boolean |

### What's deleted

- `PromptSurface` component (workspace-canvas.tsx, line 105)
- `CanvasMode` type and mode-switching logic
- Empty-state overlay logic (Start Zone IS the empty state)

### What's preserved

- All prompt textarea behavior (auto-grow, placeholder, Cmd+Enter)
- File drop behavior and `source_inputs` pipeline
- Example prompt cards and click-to-fill behavior
- Generate button disabled state logic
- Viewport transition on generation start

---

## Error Handling

### Vessel CRUD errors

- **Create fails**: Show toast, remove optimistic vessel from local state
- **Update fails**: Show toast, revert local state to pre-update
- **Delete fails**: Show toast, restore vessel in local state
- **Item add fails**: Show toast, remove optimistic item

In v1, vessel operations are simple CRUD with no complex failure modes. Network errors surface as toasts; retries are manual (user re-attempts the action).

### Generation with vessels

- If `resolveVesselContextBlocks()` fails, generation proceeds without vessels (graceful degradation). Log warning.
- If vessel content exceeds token budget, truncation is applied silently. `truncated: true` is recorded but not surfaced to user in v1.

---

## v1 Scope

### Included
- `context_vessels` and `vessel_items` tables with migration
- Full CRUD API (6 endpoints)
- Data access functions in workspaces.ts
- `resolveVesselContextBlocks()` for prompt assembly
- Frontend vessel state management
- Start Zone as ReactFlow node type
- Component structure (4 new components, 2 modified)
- Layout metrics adjustment for Start Zone
- PromptSurface → Start Zone migration

### Deferred
- Real-time vessel sync (Supabase Realtime)
- Optimistic updates with rollback
- Vessel reordering via drag-and-drop
- Vessel undo/redo
- Bulk vessel operations
- Vessel import/export
