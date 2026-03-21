# Context Interpretation

> Raw vs interpreted signals, anti-reference mechanics, and how the generation model treats vessel content.

---

## Overview

In v1, vessel content is passed **raw** to the generation model as structured text. There is no separate interpretation layer — no intermediary model call to extract themes, no embedding-based similarity computation, no signal preprocessing. The generation model receives vessel content directly and is instructed via the system prompt how to treat it.

This document specifies the interpretation contract: what the model sees, how it should reason about different vessel types, and how anti-references work.

See [context-assembly.md](context-assembly.md) for the assembly pipeline and [context-vessels.md](../02_ux/context-vessels.md) for vessel mechanics.

---

## Raw Signal Approach (v1)

### What the model receives

The generation model sees vessel content as structured text blocks within the user prompt:

```
Active context vessels:

[brand_inspo] "Reference brands I like the vibe of": Quiet luxury, editorial clarity
- Wales Bonner
- Jil Sander
- The Row

Anti-references (avoid these directions):

[custom, anti] "Territory to stay away from":
- generic wellness startup
- fake futurism
```

### What the model does NOT receive

- Embedding vectors derived from vessel items
- Pre-extracted themes or keywords
- Similarity scores between vessels and board state
- Interpreted summaries from a separate model call
- Vessel metadata (IDs, timestamps, activation state)

### Why raw in v1

1. **Simplicity**: No additional model calls, no embedding pipeline, no latency overhead
2. **Transparency**: What the user types is what the model sees — no lossy interpretation
3. **Sufficient for v1 scope**: Modern LLMs handle directional taste cues effectively when given clear system instructions
4. **Testable**: Easy to verify what the model received by inspecting `input_snapshot`

---

## Interpretation Instructions

The system prompt instructs the generation model how to interpret different signal types. These instructions are added to `buildRoundSystemPrompt()`:

### Brand references

**Instruction**: Reference brands indicate a quality, sensibility, or standard to channel — not a template to copy or a competitor to benchmark against.

**Expected model behavior**:
- Extract the aesthetic and quality signal from brand names
- Channel the *vibe* without mimicking the brand's actual products or language
- Use brand references to calibrate the level of sophistication, restraint, or boldness
- Never mention brand names in generated card text

**Example**: If vessel contains "Wales Bonner, Jil Sander, The Row" → model should channel quiet luxury, editorial precision, deliberate understatement — not literally reference these brands.

### Tone and vibe signals

**Instruction**: Tone/vibe vessels set the emotional register for card language and framing.

**Expected model behavior**:
- Adjust card voice and word choice to match vibe cues
- Use vibe terms as constraints on expression, not as content topics
- "Ceremonial" means the cards should feel considered and weighty, not that cards should be about ceremonies

### Audience cues

**Instruction**: Audience cue vessels anchor relevance and specificity.

**Expected model behavior**:
- Ground ideas in the audience's perspective, vocabulary, and concerns
- Use audience specificity to filter out ideas that wouldn't land with that group
- Avoid generic "target audience" language — treat as real people with taste

### Visual and material references

**Instruction**: Visual reference and material/texture vessels inform aesthetic and sensory qualities.

**Expected model behavior**:
- Use visual/material cues to shape descriptive language and conceptual framing
- When text items describe visuals ("matte textures, no gloss"), treat as aesthetic constraints
- File items are noted as references but not analyzed in v1 (image analysis deferred)

### Custom vessels

**Instruction**: Custom vessels carry user-defined context. Interpret the title as the semantic frame.

**Expected model behavior**:
- Use the title to understand intent
- Treat items as examples or specifics under that frame
- No special handling beyond what the title suggests

---

## Anti-Reference Mechanics

### Core mechanism

`is_anti: boolean` on the vessel is the **sole mechanism** for negative steering via vessels. Anti is a flag, not a kind. Any vessel kind can be toggled anti.

### How anti-references route in prompt

Anti vessels render in a separate prompt section:

```
Anti-references (avoid these directions):

[custom, anti] "Territory to stay away from":
- generic wellness startup
- fake futurism

[brand_inspo, anti] "Brands whose vibe to avoid":
- WeWork
- Goop
```

### System prompt instruction

```
Anti-reference vessels define territory to actively avoid — steer away from these qualities,
aesthetics, and associations. Do not produce the simplistic opposite of anti-references.
Instead, understand what they represent and navigate away from that territory while
maintaining the positive direction established by other vessels and the user prompt.
```

### Expected model behavior

| Anti-reference | What to avoid | What NOT to do |
|---------------|---------------|----------------|
| "generic wellness startup" | Bland, interchangeable, pastel-gradient aesthetic | Generate aggressive/dark aesthetic as simplistic opposite |
| "fake futurism" | Surface-level tech utopianism, meaningless jargon | Reject all future-oriented thinking |
| "WeWork" (brand anti) | Hollow community narrative, manufactured belonging | Avoid all community themes |
| "corporate motivational" (tone anti) | Empty encouragement, buzzword-heavy language | Use cynical or nihilistic tone |

**Key rule**: Anti-references shape avoidance territory. They do not invert to produce the opposite. The model should understand the *quality being rejected* and steer around it while maintaining its own positive direction.

### Anti + positive interaction

When both positive and anti vessels exist, the model should:

1. Establish direction from positive vessels
2. Use anti vessels as boundary constraints
3. Navigate the space between inspiration and avoidance
4. Not let anti vessels override positive direction — anti is a guardrail, not a steering wheel

---

## Signal Decay by Round

### Round 1

Vessel signals are **fresh and primary**. The model has no board state to draw from, so vessels (along with the prompt) are the main creative input.

**Interpretation strength**: High — vessels directly shape the creative territory, tone, and aesthetic of generated cards.

### Round 2

Vessel signals begin to **decay toward background**. Board state (selections, edits, locks, groups) becomes primary. Vessels provide consistency and grounding.

**Interpretation strength**: Medium — vessels maintain taste consistency but don't override user's board-level decisions.

### Round 3+

Vessel signals are **background context**. The accumulated board state is the authoritative expression of user intent. Vessels prevent drift but don't actively steer.

**Interpretation strength**: Low — vessels are a taste anchor. The model should not re-center on vessel content if the board has evolved in a different direction.

### Why decay matters

The user's board actions (selecting, editing, locking, grouping, rejecting) are a higher-fidelity signal of intent than their initial vessel setup. As the session progresses, the board IS the context. Vessels prevent the session from losing its initial taste coordinates, but they don't override learned intent.

---

## Edge Cases

### Contradictory signals

**Vessel says "quiet luxury" but user selects bold/loud cards**:
- Board state wins. The model should follow the user's selections, using vessel context only as mild grounding.

**Positive vessel and anti vessel overlap** (e.g., "minimalist" appears in both):
- Anti vessel takes precedence for the overlapping signal. The model should avoid that specific quality even if a positive vessel also mentions it.

### Vessel content that's too vague

**Vessel titled "Vibes" with items "good", "cool", "nice"**:
- Model treats as low-signal. Vague items add minimal directional value. The system prompt does not instruct the model to reject vague vessels — it simply won't get much signal from them.

### All vessels are anti

**No positive vessels, only anti-references**:
- Valid state. Model uses anti vessels to define avoidance territory and generates freely within the remaining space, guided by the prompt.

### Empty description with meaningful title

**Title "Quiet luxury, editorial clarity" with no description**:
- Title alone is semantic signal. The items provide specificity; the title provides the interpretive frame. This is the expected pattern — most vessels won't have descriptions.

---

## Future Interpretation Layer (Deferred)

In a future version, an interpretation layer could:

1. **Extract themes** from vessel items via a lightweight model call
2. **Compute embeddings** for vessel items to enable similarity matching
3. **Detect tensions** between vessels or between vessels and board state
4. **Dynamically weight** vessels based on how much the board has diverged from initial context
5. **Analyze images** in visual reference vessels

These are explicitly deferred from v1. The raw signal approach is the implementation target.

---

## v1 Scope

### Included
- Raw vessel content passed as structured text
- System prompt interpretation instructions per vessel kind
- Anti-reference routing to avoidance section
- Anti-reference instruction (avoid territory, don't invert)
- Signal decay by round (primary → background)
- No literal brand/reference mentions in generated cards

### Deferred
- Separate interpretation model call
- Embedding-based vessel similarity
- Theme extraction from vessel items
- Image analysis for visual references
- Link content fetching and summarization
- Dynamic vessel weighting based on board convergence
- Cross-vessel tension detection
