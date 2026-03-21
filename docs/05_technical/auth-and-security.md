# Auth and Security

## Purpose

Define the current and intended authentication, authorization, and data protection model for Seeds.

## Current implementation status

Seeds is currently running as a closed alpha with stub auth. This is acceptable for the current build phase, but it is not the final production-ready state.

Current reality:

- the deployed app can operate under a seeded test user
- ownership is still modeled in the database
- workspace data should still be treated as private-by-default product data

## Intended production stance

Seeds may be single-user oriented in product behavior, but production deployment should still use real authentication, explicit ownership, and default-private data handling.

## Firm decisions

- every workspace is private by default
- uploaded files are stored in private buckets and accessed only through signed URLs or server-side reads
- OpenAI and Supabase service credentials live only on the server
- the domain model should remain auth-ready even while stub auth is active

## Current recommended v1 decision

Use stub auth during the current closed-alpha period, while keeping Supabase Auth as the intended production path.

Recommended transition target:

- Supabase Auth with email-based sign-in

## Implementation phase mode

- closed-alpha builds may run with a seeded test user and a bypassed auth shim
- all ownership should still be modeled as if real auth exists
- the eventual production path should switch the session source, not the domain model

## Ownership model

- one user owns one workspace
- all child objects inherit access from the parent workspace
- no shared workspaces in v1

Implication:

- authorization checks should usually resolve at the workspace boundary

## Production-hardening checklist

Before wider release, complete these:

1. enable real Supabase Auth
2. enforce ownership checks on all workspace routes
3. enable and verify RLS for all user data tables
4. remove any stub-user fallback from production environments
5. add request-level rate limits on generation endpoints

## Storage security

- use a private storage bucket for source files
- store storage paths, not public URLs
- issue signed URLs only when direct client download is needed
- prefer server-side file reads for ingestion jobs

## Secret handling

- never expose service-role keys to the browser
- keep OpenAI API keys server-only
- use environment variables managed by the deployment platform
- rotate secrets if they are ever exposed in logs, commits, or chat transcripts

## Logging and privacy

- avoid logging raw source files in application logs
- avoid logging full prompts or model outputs in plaintext request logs by default
- store structured generation metadata in the database for debugging instead
- redact secrets and signed URLs from logs

## Threats to cover in v1

- unauthorized access to another user's workspace once real auth is enabled
- accidental public exposure of uploaded files
- duplicate generation caused by client retries
- unbounded generation abuse
- prompt or model metadata leakage into logs

## Security non-goals for v1

- SSO
- enterprise SCIM
- fine-grained collaborative permissions
- customer-managed encryption keys

## Future-facing notes

- team sharing can later layer on top of the workspace ownership model
- audit logs can later expand from `interaction_events` and auth logs
