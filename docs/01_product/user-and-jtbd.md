# Users and Jobs To Be Done

## Purpose

Define the primary v1 users, what they are trying to achieve, and how that should shape product and implementation decisions.

## Primary v1 user

The primary user is a solo creative professional working upstream of polished deliverables.

Typical roles:
- strategist
- brand designer
- creative director
- innovation or concept lead
- independent consultant

Common working conditions:
- starts from ambiguity
- needs multiple strong paths, not one quick answer
- values authorship and editorial control
- often works under time pressure
- wants a useful output for later deck-building or concept development

## Secondary v1 user

A generalist founder, marketer, or operator who is comfortable with loose briefs and wants structured ideation.

This user matters for adoption, but the product should not optimize itself around beginner education at the expense of expert flow.

## Core JTBD

When I have a brief, fragment, or vague hunch and need to shape it into strong strategic or creative directions, help me generate multiple structured paths and iteratively sharpen them without losing my own judgement.

## Supporting JTBDs

- When I am staring at a blank page, help me start with credible raw material.
- When I can sense a direction but cannot articulate it yet, help me externalize and refine it.
- When several partial ideas exist, help me combine them into stronger hybrids.
- When AI outputs feel generic, help me steer the system with my edits and selections.
- When I need to hand the work downstream, help me export a clean markdown artifact.

## User motivations

- move faster without accepting shallow output
- see paths they would not have produced alone
- compare strategic shapes side by side
- maintain control over language and framing
- preserve work over multiple sessions

## User frustrations with existing tools

- chat tools produce long undifferentiated blocks
- one-shot deck generators converge too early
- whiteboards are flexible but not generative
- templates force a framework before the idea is ready
- AI tools often ignore user edits in later outputs

## Product implications

- The system must foreground curation, not prompting skill.
- Canvas actions must be first-class signals in generation logic.
- Workspaces must persist and reopen cleanly.
- Card writing must stay concise enough for fast scanning.
- Export should emphasize structure and usefulness over polish.

## Non-goals for v1

- teaching strategic frameworks
- facilitating real-time collaboration
- being a universal document repository
- replacing final presentation tools
- optimizing for highly regulated research workflows

## Recommended v1 decisions

- `recommended v1 decision`: design for one expert user working alone on a laptop.
- `recommended v1 decision`: optimize the default flow for a 20 to 45 minute session.
- `recommended v1 decision`: assume the user wants a small number of high-quality rounds, not infinite exploration.
- `recommended v1 decision`: prioritize side-by-side comparison and reuse of ideas over chat-style back-and-forth.

## Future-facing notes

- Collaboration should layer onto the existing workspace and round model, not replace it.
- Team workflows will likely require comments, presence, and shareable exports, but none are required for v1.
- Different professions may later want tailored starting structures, but v1 should keep one strong default flow.
