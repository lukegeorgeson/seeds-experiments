# Frontend Architecture

## Purpose

Define the frontend structure for the Seeds workspace experience.

## Current stack

Use a Next.js application with React Flow as the canvas engine and a structured layout layer on top.

Current implementation shape:

- server-rendered route entry points
- client-side `WorkspaceStudio` shell for active interaction
- React Flow for spatial layout and viewport control
- streamed fetch responses for round generation

## Frontend responsibilities

- workspace list and workspace routes
- canvas rendering and interaction handling
- prompt-panel flow
- card state toggles for select, lock, and reject
- streamed Round 1 and Round 2 rendering
- debug overlay
- theme persistence

## Key frontend modules

### Workspace shell

Owns:

- route-level data loading
- workspace chrome
- round navigation
- sidebar visibility
- theme mode

### Canvas engine

Owns:

- React Flow integration
- round-zone positioning
- prompt node rendering
- card node rendering
- bridge node rendering
- viewport repositioning

### Interaction state

Owns:

- current active round
- current card state overrides
- optimistic local UI state
- local fallback rejection state when persistence is unavailable

### Stream coordinator

Owns:

- receiving generation stream events
- inserting pending skeletons
- merging streamed cards into provisional boards
- reconciling final persisted state

## Recommended v1 decisions

- `recommended v1 decision`: treat columns as layout containers generated into React Flow, not as a side effect of arbitrary node positions.
- `recommended v1 decision`: keep persisted server state in route data and local transient streaming state in the studio shell.
- `recommended v1 decision`: allow local state overrides when needed to preserve a good alpha UX without compromising the authoritative server model.

## React Flow usage guidance

- use React Flow for pan, zoom, node placement, and viewport animation
- disable or hide graph-editor affordances that suggest freeform diagramming
- use visible edges only where they serve a narrative purpose, such as between-round bridge connections
- keep board nodes non-draggable during normal round viewing

## Performance concerns

- streaming insertion should be incremental
- provisional cards and persisted cards should reconcile cleanly
- large boards should avoid unnecessary full-canvas recalculation where possible

## Future-facing notes

- collaboration can later add presence overlays
- branch comparison views can later reuse the same canvas primitives
