# UX Overview

## Purpose

Define the interaction model for Seeds at a system level.

## UX thesis

Seeds should feel like a calm, structured creative canvas where the user is arranging and shaping possibilities, not chatting with a bot and not wrangling a graph editor.

The experience should sit between:

- the spatial openness of Figma or FigJam
- the clarity and order of a refined kanban

It should not inherit the messiness of either extreme.

## Current workspace shape

The live UX now behaves like this:

- the landing page is itself a workspace-like blank canvas
- a floating prompt panel sits inside the canvas as the starting object
- the project list lives in a left rail, not a separate page
- once generation starts, the prompt panel disappears and the board becomes the focus
- rounds live on one horizontal canvas and the viewport shifts between them
- a compact top bar holds project name, round tabs, debug, theme toggle, and export affordance

## Primary UX goals

- make Round 1 feel immediate
- support fast scanning and comparison
- make user curation visibly matter
- keep the difference between local card actions and global round growth clear
- preserve history without making the current canvas feel cluttered

## UX non-goals

- freeform infinite-canvas experimentation for its own sake
- heavy inspector-driven editing
- long prompt engineering workflows
- chat-centric interaction

## Core UX objects

- workspace: the persistent container for a creative effort
- round: one full board state within a workspace
- column: a structured lane for a type of card
- card: a short atomic idea
- bridge: a between-round interpretation layer
- debug overlay: a secondary inspection surface for generation metadata

## Recommended v1 decision

Show one round as the active focus at a time, but keep neighboring rounds on the same underlying canvas so the user feels continuity rather than page switching.

## Experience principles

### 1. The canvas is the product

The main screen should open directly into the workspace canvas. Setup should feel native to the board, not like a form page before the product starts.

### 2. Structure should be felt, not over-explained

Columns, alignment, and spacing should keep the board orderly without making the interface feel rigid or admin-like.

### 3. Speed matters more than ceremony

Most actions should be click, drag, type, or stream-in-place. Avoid modal-heavy flows.

### 4. Feedback should feel alive

Streaming, skeleton placeholders, blur-in reveals, and subtle viewport movement should show progress without turning the UI into a loading screen.

### 5. History should stay legible

Rounds should be easy to revisit through round tabs and smooth repositioning, not through a complex version manager.

## Layout responsibilities

- left rail: projects and `New project`
- top-left bar: workspace identity and sidebar toggle
- top-center bar: round navigation
- top-right bar: debug, theme, export
- main canvas: prompt node, columns, cards, bridge nodes
- overlay layer: debug inspection only

## Data and behavior implications

- the frontend needs stable layout rules that sit on top of React Flow
- rounds should be modeled as distinct zones with deterministic x positions
- bridge content can be derived from stored generation metadata rather than manually authored objects
- interaction telemetry should capture meaning, not just pointer events

## Future-facing notes

- branching can later become a visible navigation pattern
- collaboration can later add cursors and comments without changing the core canvas model
