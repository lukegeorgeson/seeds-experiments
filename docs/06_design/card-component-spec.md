# Card Component Spec

## Purpose

Define the default card component behavior and anatomy.

## Card anatomy

- text body
- subtle origin marker
- inline action affordances
- lock control
- `Thumbs down` control

## States

- default
- hover
- selected
- locked
- rejected
- entering
- skeleton
- derived from riff or blend

## Current visual semantics

- selected: softly emphasized
- locked: stronger persistent emphasis
- rejected: red-tinted, slightly faded, still readable
- entering: blur-in plus subtle text manifestation
- skeleton: animated placeholder with activity cues

## Content rules

- text remains the primary content
- metadata should stay secondary
- avoid badges multiplying into visual noise

## Recommended v1 decisions

- `recommended v1 decision`: keep the default card compact and vertically stackable.
- `recommended v1 decision`: use one card component with state variants rather than separate visual systems per origin type.
- `recommended v1 decision`: keep the action row quiet until hover or focus.

## Accessibility guidance

- card text must remain readable at a glance
- selected state should not rely on color alone
- rejected state should not rely on color alone
- inline controls should be keyboard reachable

## Future-facing notes

- cards may later support richer media, notes, or tags, but v1 should preserve text-first clarity
