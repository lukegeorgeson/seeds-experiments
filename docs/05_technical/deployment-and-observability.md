# Deployment and Observability

## Purpose

Define the minimum production deployment, runtime, and observability standards for Seeds v1.

## Deployment goals

- predictable releases
- safe secret handling
- enough visibility to debug generation and ingestion issues
- enough guardrails to avoid silent data loss

## Recommended v1 deployment shape

- one web application deployable for frontend and backend routes
- one Supabase project per environment
- one private storage bucket for source files
- one OpenAI project and API key per environment set

Firm deployment target:
- Vercel for the web application
- Supabase for database, storage, and future auth

Recommended environments:
- local
- preview
- production

Recommended v1 decision:

- treat the initial release as a closed alpha
- add a lightweight access gate or allowlist before opening access broadly

## Environment separation

- never share production secrets with preview or local
- use separate Supabase projects for preview and production
- use separate storage buckets or bucket prefixes per environment

## Release process

Recommended v1 decision:

- require CI on every main-branch change
- run migrations before or during deploy in a controlled step
- block production release if migrations or smoke tests fail

## Minimum CI checks

- typecheck
- lint
- unit tests for domain and prompt assembly logic
- migration validation
- smoke test for core API routes

## Observability goals

- identify failing generation requests quickly
- trace a workspace action through API, generation, and persistence
- diagnose prompt regressions without exposing sensitive user content broadly

## Logging

Recommended v1 decision:

- use structured JSON logs in server code
- attach a `request_id` and, where relevant, `generation_request_id`
- log lifecycle boundaries, not excessive raw payloads

Log these events:
- auth failure
- workspace create
- source input upload accepted
- ingestion started/completed/failed
- generation started/completed/failed
- export started/completed/failed

## Metrics

Track at minimum:
- request latency by route
- generation latency by request type
- ingestion failure rate
- model error rate
- workspace creation count
- round generation count
- export count

## Error monitoring

Recommended v1 decision:

- use an error monitoring product from day one
- capture unhandled exceptions in client and server
- attach environment, request id, workspace id, and generation request id where safe

## Health and smoke checks

Recommended v1 checks:

- app boot health endpoint
- database connectivity
- storage connectivity
- ability to create and complete a dummy generation request in non-production environments

## Reliability controls

- enforce request timeouts
- enforce upload size limits
- use idempotency for generation
- keep generation job records durable
- retry only clearly transient external failures

## Backups and recovery

- rely on managed Postgres backups from Supabase
- retain uploaded source files in storage unless explicitly deleted
- keep generation metadata so failed work can be diagnosed

## Operational non-goals for v1

- multi-region deployment
- autoscaled worker fleet
- complicated service mesh or queue infrastructure

## Future-facing notes

- if generation volume grows, dedicated worker services can be added without changing the core deployment contract
- if collaboration arrives, observability should expand to include realtime connection health
