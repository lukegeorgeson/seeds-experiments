# Layout System

## Purpose

Define the spatial system that keeps the workspace legible.

## Layout model

Seeds uses a structured canvas layout composed of:

- fixed workspace chrome
- a centered prompt surface in the empty state
- horizontal round zones
- optional bridge zones between rounds
- a horizontal band of columns
- vertically stacked cards within each column

## Recommended v1 decisions

- `recommended v1 decision`: use consistent column widths across a round.
- `recommended v1 decision`: center the active board within the available viewport before horizontal pan becomes necessary.
- `recommended v1 decision`: keep generous gutters between columns so clusters remain readable.
- `recommended v1 decision`: keep sidebar overlap from obscuring workspace identity or main canvas content.

## Primary measurements

The exact numbers can evolve in implementation, but the system should include:
- one base spacing unit
- one prompt-panel width
- one default card width
- one default column width
- one standard gutter
- one standard card stack gap
- one standard inter-round gap

## Behavior rules

- cards align to a clear vertical rhythm
- columns maintain readable headers once the board exists
- side panels should not collapse the canvas into unusable density
- the empty-state prompt should feel visually centered whether or not the sidebar is open

## Responsiveness

- desktop is primary in v1
- tablet should remain functional
- mobile editing can be limited or deferred

## Non-goals for v1

- full mobile parity
- endlessly adaptive card sizing
- complex masonry layouts

## Future-facing notes

- alternate view densities can later be added for power users
