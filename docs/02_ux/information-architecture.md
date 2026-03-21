# Information Architecture

## Purpose

Define the primary screens, regions, and object hierarchy for v1.

## Top-level object hierarchy

1. workspace
2. round
3. bridge interpretation
4. column
5. card
6. debug metadata

## Primary application areas

### 1. Landing canvas

Responsibilities:

- act as the default entry point
- show the prompt-start experience
- allow immediate session creation without a separate setup page

### 2. Workspace canvas

Responsibilities:

- display the active round
- host core card interactions
- host round growth
- provide access to prior rounds, debug, and export

This is the primary product surface.

### 3. Debug overlay

Responsibilities:

- show generation metadata
- show inferred explanation
- remain secondary to the canvas

### 4. Export surface

Responsibilities:

- preview markdown output
- copy or download markdown
- preserve export history metadata

V1 guidance:

- this can remain lightweight and secondary

## Workspace canvas regions

### Left rail

- project list
- active project highlight
- `New project`

### Top-left bar

- sidebar toggle
- workspace title

### Top-center bar

- round tabs such as `R1`, `R2`

### Top-right bar

- debug
- theme toggle
- export

### Main canvas

- prompt node in prompt mode
- ordered columns in board mode
- cards within columns
- bridge node between rounds

### Bottom growth bar

- selected, locked, and rejected counts
- primary `Grow round n` action

## Navigation model

- `/` is the blank-canvas start state
- the project rail is the primary way to reopen workspaces
- inside a workspace, switch rounds without leaving the workspace
- debug and export should not break canvas context

## URL model

Recommended v1 decision:

- `/` landing canvas
- `/workspaces/:workspaceId` active workspace
- direct round restore can remain internal state for now

## IA non-goals

- deep nested navigation
- separate list page plus workspace page as the main mental model
- separate chat and canvas sections competing for focus

## Future-facing notes

- branch navigation can fit alongside round navigation
- team mode can introduce shared activity regions without changing the main hierarchy
