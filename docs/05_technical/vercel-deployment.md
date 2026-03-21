# Vercel Deployment

## Purpose

Define the deployment setup for Seeds on Vercel and the expected git-based redeploy flow.

## Deployment target

Seeds should deploy to Vercel from the GitHub repo:

- `lukegeorgeson/seed`

Current state:

- this Git integration is already active
- pushes to `main` currently redeploy the live app automatically

Recommended v1 setup:

- one Vercel project
- connected directly to the GitHub repository
- automatic redeploy on pushes to `main`
- preview deployments on pull requests and branch pushes

## Firm decisions

- `firm decision`: Vercel should be connected through Git integration, not only CLI deploys.
- `firm decision`: pushes to `main` should trigger production redeploys.
- `firm decision`: preview deployments should remain enabled for branch-based testing.
- `firm decision`: the initial project uses a single Supabase project.

## Monorepo configuration

The app lives at:

- `apps/web`

Recommended Vercel project settings:

- Root Directory: `apps/web`
- Framework Preset: `Next.js`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: default

Repo-side config also exists in:

- [vercel.json](/Users/l/Documents/seeds/apps/web/vercel.json)

## Required environment variables

Set these in Vercel for all environments that should function fully:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `OPENAI_API_KEY`
- `SEEDS_AUTH_MODE`

Recommended initial value:

- `SEEDS_AUTH_MODE=stub`

Notes:

- one Supabase project is currently being used across the alpha setup
- OpenAI and Supabase keys must remain server-only except for publishable client keys

## Redeploy behavior

Expected behavior after Git integration is connected:

- push to `main` -> production deployment starts automatically
- push to feature branch -> preview deployment starts automatically
- pull request update -> preview deployment refreshes automatically

## Closed alpha guidance

Recommended v1 decision:

- keep the current live URL limited to closed-alpha use
- before wider sharing, replace stub auth with a real gate or real auth
- treat preview deployments as internal testing surfaces, not public launch surfaces

## Initial setup checklist

1. Sign into Vercel.
2. Import `lukegeorgeson/seed`.
3. Set Root Directory to `apps/web`.
4. Confirm install and build commands.
5. Add required environment variables.
6. Trigger first deployment.
7. Confirm future pushes to `main` redeploy automatically.

## Verification checklist

- homepage loads
- blank-canvas landing state loads
- workspace rail loads
- real workspace creation works when Supabase is configured
- Round 1 generation works against OpenAI and Supabase
- pushes to `main` create a fresh production deployment
- build logs show `apps/web` as the project root

## Future-facing notes

- when auth goes real, add the corresponding Supabase auth env values
- if a second Supabase project is introduced later, map preview and production separately
