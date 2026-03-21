# Interaction Patterns

## Purpose

Translate product interactions into reusable UI patterns.

## Core patterns

### Click-to-select

Clicking a card should toggle selection directly without requiring a visible checkbox.

### Inline card actions

Cards reveal lightweight actions on hover or focus:

- `Lock`
- `Thumbs down`

### Empty-state prompt panel

The prompt surface should feel like a first-class canvas object, not a modal or form page.

### Growth bar

When the user has meaningful signal, show a persistent but quiet growth bar with:

- selected count
- locked count
- rejected count
- primary `Grow round n` action

### Debug overlay

Open an overlay for deeper generation inspection without displacing the board itself.

## Recommended v1 decisions

- `recommended v1 decision`: primary actions should be one click away from the card.
- `recommended v1 decision`: use overlays or secondary surfaces for advanced inspection rather than permanent side panels.
- `recommended v1 decision`: keep confirmation dialogs rare and reserved for destructive actions.

## Pattern distinctions

- `Grow` should feel global and workspace-level
- `Lock` should feel preservational, not merely decorative
- `Thumbs down` should feel like steering away, not deletion
- `Debug` should feel inspectable, not scary or overly technical

## Keyboard guidance

- support escape to close transient UI
- support enter to confirm future inline edits
- support delete for safe removable transient items only when it is clearly scoped

## Future-facing notes

- richer keyboard support, riffing, and inline editing can expand over time, but the mouse-first flow must already feel excellent in v1
