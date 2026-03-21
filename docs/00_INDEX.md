# Seeds Documentation Index

This documentation set defines the current product, UX, AI, data, and technical foundation for Seeds.

Seeds is a browser-based creative sparring tool for strategists, designers, and idea-makers. It helps a user move from a blank brief into sharpened strategic and creative directions through short atomic cards arranged on a structured React Flow canvas. The user curates those cards, and the system re-synthesizes future rounds around the signals created by selection, locking, rejection, and later edits.

Unless a document says otherwise, statements marked as `recommended v1 decision` should be treated as the default build direction.

## Documentation tree

```text
/docs
  00_INDEX.md

  /01_product
    product-overview.md
    product-principles.md
    user-and-jtbd.md
    v1-scope.md
    roadmap.md

  /02_ux
    ux-overview.md
    information-architecture.md
    core-user-flows.md
    workspace-and-rounds.md
    columns-and-cards.md
    interactions.md
    naming-and-ux-copy.md
    context-vessels.md          ← vessel concept, interaction, visual treatment
    inspo-packs.md              ← pack creation, editing, influence on generation
    start-zone.md               ← blank project experience, layout, transition

  /03_ai
    ai-overview.md
    generation-philosophy.md
    round-generation-logic.md
    local-riff-logic.md
    prompting-strategy.md
    card-writing-rules.md
    synthesis-rules.md
    context-assembly.md         ← how vessels feed into generation prompts
    context-interpretation.md   ← raw vs interpreted signals, anti-reference

  /04_data
    domain-model.md
    round-state-model.md
    object-schemas.md
    database-schema.md
    context-model.md            ← vessel domain entities, tables, relationships

  /05_technical
    technical-architecture.md
    frontend-architecture.md
    backend-architecture.md
    auth-and-security.md
    api-contracts.md
    file-ingestion.md
    async-jobs-and-streaming.md
    storage-model.md
    vercel-deployment.md
    deployment-and-observability.md
    context-architecture.md     ← frontend/backend/storage/migration for vessels

  /06_design
    visual-direction.md
    layout-system.md
    interaction-patterns.md
    card-component-spec.md
    canvas-behavior.md

  /07_evals
    quality-rubric.md
    test-briefs.md
    generation-failure-modes.md
    round-improvement-checklist.md
    context-feature-quality.md  ← quality criteria, test scenarios for vessels
```

## Current implementation snapshot

The current build direction is no longer only conceptual. The live app now includes:

- a canvas-native Start Zone replacing the floating prompt panel, with vessel toolbox for contextual input
- context vessels (Inspo Packs) for brand references, vibes, anti-references, audience cues
- a structured React Flow board with five fixed column kinds
- workspaces merged into a left project rail
- card-by-card streaming into the canvas for Round 1 and Round 2
- smooth viewport shifts between round zones on the same canvas
- selection, locking, and negative steering through `Thumbs down`
- bridge nodes between rounds summarizing `Kept`, `Avoided`, and `Became`
- a toggleable debug overlay backed by stored generation metadata plus a secondary inferred explanation run
- light and dark modes
- git-connected Vercel deployment on `main`
- stub auth for the current closed-alpha phase

The product adaptation spec in this docs tree now extends that baseline with:

- explicit X-axis round progression and Y-axis riff pockets
- dynamic visible categories that change by round
- richer user-signal interpretation including edits, notes, groups, blends, and promotions
- anti-fixation and sparring rules for later-round quality
- a fuller round state, pocket, lineage, and export model
- context vessel system for structured creative context (brand refs, vibes, anti-references)
- Start Zone as canvas-native ReactFlow node replacing the floating prompt surface

## Reading order

1. [Product overview](/Users/l/Documents/seeds/docs/01_product/product-overview.md)
2. [Product principles](/Users/l/Documents/seeds/docs/01_product/product-principles.md)
3. [V1 scope](/Users/l/Documents/seeds/docs/01_product/v1-scope.md)
4. [UX overview](/Users/l/Documents/seeds/docs/02_ux/ux-overview.md)
5. [Workspace and rounds](/Users/l/Documents/seeds/docs/02_ux/workspace-and-rounds.md)
6. [Interactions](/Users/l/Documents/seeds/docs/02_ux/interactions.md)
7. [Columns and cards](/Users/l/Documents/seeds/docs/02_ux/columns-and-cards.md)
8. [AI overview](/Users/l/Documents/seeds/docs/03_ai/ai-overview.md)
9. [Round generation logic](/Users/l/Documents/seeds/docs/03_ai/round-generation-logic.md)
10. [Local riff logic](/Users/l/Documents/seeds/docs/03_ai/local-riff-logic.md)
11. [Domain model](/Users/l/Documents/seeds/docs/04_data/domain-model.md)
12. [Round state model](/Users/l/Documents/seeds/docs/04_data/round-state-model.md)
13. [Object schemas](/Users/l/Documents/seeds/docs/04_data/object-schemas.md)
14. [Database schema](/Users/l/Documents/seeds/docs/04_data/database-schema.md)
15. [Technical architecture](/Users/l/Documents/seeds/docs/05_technical/technical-architecture.md)
16. [Frontend architecture](/Users/l/Documents/seeds/docs/05_technical/frontend-architecture.md)
17. [API contracts](/Users/l/Documents/seeds/docs/05_technical/api-contracts.md)
18. [Async jobs and streaming](/Users/l/Documents/seeds/docs/05_technical/async-jobs-and-streaming.md)
19. [Auth and security](/Users/l/Documents/seeds/docs/05_technical/auth-and-security.md)
20. [Vercel deployment](/Users/l/Documents/seeds/docs/05_technical/vercel-deployment.md)

### Context vessel feature (read after core docs)

21. [Context model](04_data/context-model.md) — data model first, all other vessel docs reference it
22. [Context vessels](02_ux/context-vessels.md) — vessel concept, interaction, CRUD
23. [Inspo packs](02_ux/inspo-packs.md) — pack patterns and usage
24. [Start zone](02_ux/start-zone.md) — canvas-native landing experience
25. [Context assembly](03_ai/context-assembly.md) — how vessels feed into prompts
26. [Context interpretation](03_ai/context-interpretation.md) — raw signals, anti-reference mechanics
27. [Context architecture](05_technical/context-architecture.md) — frontend/backend/storage implementation
28. [Context feature quality](07_evals/context-feature-quality.md) — test scenarios and eval rubric

## Notes on decision strength

- `Firm decision`: treat as required for v1 unless there is a compelling implementation blocker.
- `Recommended v1 decision`: default to this for implementation; can be revisited if real usage or engineering constraints prove otherwise.
- `Future-facing note`: not required for v1, but shape the system so this path stays open.

## Current product constraints

- Use React Flow from the start.
- Do not make the UI feel like a chaotic freeform graph editor.
- The canvas should feel like a structured snap-to-column environment between Figma/FigJam and a refined kanban.
- Build as a full-stack app from the start.
- Use OpenAI Responses API.
- Optimize for fast, lightweight, streaming generation over deep orchestration.
- Use Supabase/Postgres unless a strong reason emerges not to.
- Closed alpha can use stub auth, but the model should stay ownership-ready.
- Support prompt text first; uploaded `pdf`, `docx`, `md`, and `txt` remain part of v1 scope but are not yet the primary quality focus.
- Persist projects like reopenable chats or workspaces.
- Export markdown only in v1.

## Foundation docs derived from source

These docs were split from the original monolithic foundation markdown and should still be treated as the conceptual baseline:

- [Product overview](/Users/l/Documents/seeds/docs/01_product/product-overview.md)
- [Product principles](/Users/l/Documents/seeds/docs/01_product/product-principles.md)
- [Core user flows](/Users/l/Documents/seeds/docs/02_ux/core-user-flows.md)

## Future docs to consider

The current tree is enough for v1 implementation. Additional docs that may be useful later:

- round-state fixtures and reference payloads
- markdown export examples
- collaboration and branching UX
- access gating and invite flow design
