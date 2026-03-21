# File Ingestion

## Purpose

Define how Seeds accepts and normalizes uploaded files in v1.

## Supported v1 input types

- prompt text
- `pdf`
- `docx`
- `md`
- `txt`

## Goals

- get useful text into the system quickly
- avoid turning ingestion into a heavy document platform
- preserve enough source metadata for debugging and later review

## Ingestion pipeline

1. user uploads file
2. file stored in Supabase Storage
3. ingestion service extracts raw text
4. raw text normalized and cleaned
5. brief summary created for downstream prompt use
6. source input record updated with parse status and extracted content

## Parsing rules by type

### `txt` and `md`

- read as text directly
- preserve headings where useful

### `docx`

- extract plain text from paragraphs and headings
- ignore complex layout fidelity in v1

### `pdf`

- extract text layer only in v1
- do not promise OCR for scanned PDFs in v1

## Recommended v1 decisions

- `recommended v1 decision`: store both full extracted text and a shorter normalized summary.
- `recommended v1 decision`: impose practical file size limits to protect latency and token budgets.
- `recommended v1 decision`: if parsing fails, keep the file attached but mark it unusable and let the user continue with other inputs.

## Normalization rules

- trim obvious boilerplate where possible
- collapse repeated whitespace
- preserve major section boundaries
- annotate source type and filename for debugging

## UX behavior

- parsing should begin immediately after upload
- the user should not have to manually approve parsed content before Round 1 generation
- the UI should show parsing state succinctly

## Non-goals for v1

- OCR pipelines
- image extraction
- semantic chunk libraries
- long-term knowledge-base indexing

## Future-facing notes

- OCR and richer parsing can be added later if real briefs require it
- reusable source libraries should remain a separate roadmap feature, not leak into core v1 ingestion
