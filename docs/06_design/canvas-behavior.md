# Canvas Behavior

## Purpose

Define how the workspace canvas should behave using React Flow without feeling like a graph editor.

## Core behavior

- the canvas supports pan and modest zoom
- the landing state centers a draggable prompt panel on the canvas
- once a round exists, the board becomes the primary structure and prompt mode disappears
- columns occupy fixed horizontal bands
- cards stack within columns using deterministic vertical spacing
- rounds occupy separate horizontal zones on the same canvas

## Current zone model

- Round 1 sits in the first board zone
- later rounds sit to the right in subsequent zones
- a bridge node sits between source and target rounds
- round tabs reposition the viewport rather than remounting a different page

## React Flow constraints

- hide or neutralize graph-editor affordances that imply freeform diagramming
- board cards are not freely draggable across the canvas in the current alpha
- visible edges are allowed only for round-to-bridge relationships
- prevent freeform node drift outside structured zones

## Recommended v1 decisions

- `recommended v1 decision`: open each active round at a comfortable zoom that frames the board well.
- `recommended v1 decision`: use smooth viewport animation when jumping between rounds.
- `recommended v1 decision`: keep the dotted grid background subtle and non-competitive with the cards.
- `recommended v1 decision`: hide column titles until board generation begins.

## Streaming behavior on canvas

- show skeleton placeholders immediately when generation starts
- reveal real cards progressively as they arrive
- use subtle blur-in or manifestation motion rather than hard pops

## Anti-patterns

- visible edge spaghetti
- arbitrary free placement
- excessive zoom dependence for normal use
- physics-like card motion

## Future-facing notes

- branch overlays or provenance traces can later be selectively revealed, but should remain off by default
