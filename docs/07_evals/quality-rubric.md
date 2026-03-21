# Quality Rubric

## Purpose

Define how to judge whether Seeds is producing useful creative movement rather than just more output.

Use a 1 to 5 scale for each dimension:

- 1 = poor
- 3 = acceptable
- 5 = strong

## Rubric dimensions

| Dimension | 1 | 3 | 5 |
| --- | --- | --- | --- |
| Card quality | cards are vague, long, or multi-idea | cards are mostly atomic and usable | cards are sharp, atomic, legible, and combinable |
| Round progression quality | next round feels random or static | next round shows some learning | next round clearly advances the work's cognitive stage |
| Usefulness of category changes | categories are generic or stale | some categories fit the stage | category changes feel facilitative, explainable, and stage-appropriate |
| Distinctness of riff pockets | pockets feel redundant or board-like | pockets are somewhat local | pockets are clearly lineage-bound, distinct, and modular |
| Anti-fixation success | board collapses into safe repetition | some diversity remains | system actively keeps exploration alive without chaos |
| Sparring usefulness | challenge is absent or fake | some challenge is useful | sparring creates real, strategic friction that improves decisions |
| Export artifact quality | export is a raw dump | export is workable with cleanup | export is coherent, structured, and ready for downstream handoff |

## Dimension guidance

### Card quality

Check:

- atomicity
- specificity
- legibility
- non-overlap

### Round progression quality

Check:

- whether the round matches the intended stage
- whether it improves signal-to-noise ratio
- whether it feels shaped by user behavior

### Usefulness of category changes

Check:

- whether categories changed for a reason
- whether category names reflect user logic
- whether categories support the current cognitive job

### Distinctness of riff pockets

Check:

- whether the pocket remains local
- whether lineage to the source stays clear
- whether the pocket creates useful adjacent possibility

### Anti-fixation success

Check:

- whether semantic repetition is actively reduced
- whether safe-selection behavior is countered
- whether at least one useful diversity move survives when needed

### Sparring usefulness

Check:

- whether challenge cards introduce real tradeoffs
- whether sparring avoids generic negativity
- whether the friction improves direction quality

### Export artifact quality

Check:

- origin context is preserved
- chosen direction is clear
- surviving pillars are represented
- do and don't guidance is actionable
- downstream prompt is usable

## Pass bar for v1

V1 quality is acceptable when:

- Round 1 scores at least 4 on card quality and anti-fixation success
- Round 2 scores at least 4 on round progression quality and category usefulness
- Round 3 scores at least 4 on sparring usefulness and progression quality
- riff pockets score at least 4 on distinctness
- export scores at least 4 on artifact quality

## Automatic fail signals

- cards routinely exceed atomic card limits
- Round 2 ignores user edits, notes, groups, or locks
- category changes feel random rather than explainable
- sparring repeatedly agrees instead of challenging
- riff pockets behave like accidental mini-rounds
- export reads like generic summarization instead of process-shaped handoff
