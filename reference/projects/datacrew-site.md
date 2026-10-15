---
description: datacrew-site repo — Next.js blog, package index management, and gated distribution for crew-dcs and other DataCrew packages. CI/CD with GitHub Actions → Cloudflare Pages, package-tier resolution, and the Oct 12 private-gate incident.
---
# datacrew-site

## Overview

- **Stack:** Next.js, mdx-bundler, wrangler (Cloudflare Pages deploy)
- **Public URL:** `datacrew.space`
- **Package index:** `packages.datacrew.space` (R2-backed, dual-tier: public + gated private)
- **Local checkout:** `/home/jaewilson07/GitHub/datacrew/website` (nested git repo within monorepo)
- **Repo:** `jaewilson07/datacrew-site` (upstream)

## Blog

- **MDX format:** `content/blog/{date}-{slug}/index.mdx`
- **Frontmatter:** title, date, slug, topic, audience, excerpt, tags
- **Live URL pattern:** `datacrew.space/blog/{slug}` (e.g., `datacrew.space/blog/retiring-workbench-stream-api-migration`)
- **Build process:** mdx-bundler compiles MDX; `npm run build` generates static pages
- **Article workflow:** doc review → upsert → write MDX → PR → merge → auto-deploy → verify live URL
- **Article authoring convention (2026-10-15):** Community-origin articles written bot first-person (\"my name is Emmabot, Jae asked me...\"). NOT first-person-as-human. Frame as modernization/story, NOT pain/admin-nightmare narratives.

## CI/CD

### Workflows

- **`ci.yml`** — runs on PRs: lint (prettier + actionlint), Generate types, tsc, npm test (runs pretest → build-*.mjs), build (next build). Job: `site`
- **`deploy.yml`** — fires on push to main: `pages:build` (wrangler pages build) → wrangler deploy to Cloudflare Pages. Job: `pages`

### Secrets

- **Infisical:** `secret-path: \"/datacrew\"` fetches all /datacrew keys (including `DATACREW_API_TOKEN`). Keys exported to step-level env via secrets-action `$GITHUB_ENV`.
- **Cloudflare:** project 3fbb4296 `/infrastructure` — `CF_API_TOKEN`, `CF_ACCOUNT_ID`, `CF_ZONE_ID`
- **GitHub PAT:** `JAEWILSON07_GH_PAT` or `HECTOR_GH_PAT` (Infisical secrets)
- **Google OAuth:** fetched from Infisical for doc operations

### GitHub Actions Gotchas (discovered 2026-10-15)

1. **`env` context is NOT allowed in job-level `env:`** — only `github/inputs/matrix/needs/secrets/strategy/vars`. The `env` context only exists at the **step level** (carries workflow/job env + step-level exports via `$GITHUB_ENV`). Infisical secrets-action exports to step-level only.
2. **Fix pattern:** map tokens at the step level: `PACKAGES_INDEX_TOKEN: ${{ env.DATACREW_API_TOKEN }}` on steps that need them (Generate types, Test, Build). Do NOT attempt job-level env mapping for env context values.
3. **Actionlint catches this:** Husky pre-commit runs actionlint on YAML changes. Failures on env scoping are REAL errors, not false positives.
4. **Pretest chains:** `npm test` runs `pretest` which triggers `build-*.mjs` scripts. If a script needs the token, the Test step also needs the env mapping — not just Build.

### Build Pipeline (as of 2026-10-15)

The entire CI/deploy pipeline was **broken since 2026-10-12** when crew-dcs was made private (gating all anonymous access). Root causes:
- `build-projects-data.mjs` fetches packages without auth → 403 on `packages.datacrew.space/crew-dcs/`
- No per-package tier awareness — script assumed a single public index
- Fix: per-package tier fallback (public-first, authed private on 401/403) with `PACKAGES_INDEX_TOKEN`
- PR #257 squash-merged the fix alongside the article

## Package Index Integration

### Scripts

- **`scripts/build-projects-data.mjs`** — resolves project package data for the index. Fetches from package index, builds data files. Needs `PACKAGES_INDEX_TOKEN` for gated packages.
- **`scripts/build-content-data.mjs`** — generates content data files

### Tier Resolution Pattern (implemented PR #257)

Each package must resolve against the right tier:
1. Try the **public index** first (public access)
2. On 401/403, retry with **authed** request using `PACKAGES_INDEX_TOKEN`
3. Public packages (`cl`, `dc-auth`, `crew-logger-ts`) resolve against public index; `crew-dcs` requires authed private path

### Package Tiers

- **Public (anonymous access):** `cl`, `dc-auth`, `crew-logger-ts` — served from `packages.datacrew.space/<pkg>/`
- **Gated (requires `dc_` token + `packages-private` entitlement):** `crew-dcs` — served from `packages.datacrew.space/packages/private/` (via site Function proxy, ADR-038)

### 2026-10-12 Migration (ADR-039)

- Public index served from R2 on `packages.datacrew.space` (PR #242)
- Public package tier as static assets (PR #243)
- Private tier gated via site Function (`app/packages/[[...path]]/route.ts`)
- WAF rules block `/crew-dcs` and `/_index/crew-dcs` on the raw host

## Key Files

- `ci.yml` — PR CI pipeline
- `deploy.yml` — Deploy on main push
- `scripts/build-projects-data.mjs` — Package index data resolver
- `scripts/build-content-data.mjs` — Content data generator
- `package.json` — Dependencies (including jsdom declared but previously missing from node_modules)
- `content/blog/` — Blog post MDX files
- `.agents/skills/` — Agent skills for site management

## Common Pitfalls

- **jsdom stale:** `npm i --no-save jsdom @types/jsdom` may be needed after sandbox migrations (jsdom declared in package.json but node_modules out of sync)
- **Rebase conflicts:** Scripts touched by ADR changes may conflict with feature branches; use `GIT_EDITOR=true git rebase --continue` to bypass editor prompts during rebase
- **Build regeneration timing:** `npm run build` regenerates content data from scratch — any missing secrets or broken scripts will fail the full build, not just individual steps
- **Pages deploy is automatic** on push to main — no manual trigger needed. Watch deploy.yml run, then verify live URL
