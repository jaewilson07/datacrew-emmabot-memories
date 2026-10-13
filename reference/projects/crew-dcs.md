---
description: crew-dcs repo facts, distribution/access model (private since 2026-10-12), package-index architecture, and Jae's agent-delegation issue workflow.
---
# crew-dcs Repo & Agent-Delegation Workflow

## Repo

- **GitHub:** `hector-dcs/crew-dcs` — org/user is `hector-dcs`, NOT `jaewilson07`. Private repo.
- **Local checkout:** `/home/jaewilson07/GitHub/crew-dcs`
- **Stack:** Python, src layout, `uv`, mkdocs. Repo self-described as "domolibrary2".
- **Formerly domolibrary:** crew-dcs was formerly known as **domolibrary** — that's why the public docs site is domolibrary.datacrew.space. Jae (2026-10-12): this is "table stakes" context — every doc/page should assume readers may know either name.
- **Docs crosslink sources:** DataCrew's YouTube channel [youtube.com/@datacrew](https://www.youtube.com/@datacrew) has many Domo tutorial videos — use it as a crosslink source in crew-dcs docs/guides, alongside the `domo-documentation-hub` repo for official docs.
- SDK/API details → [[reference/domo-python-sdks.md]]; Code Engine gotchas → [[reference/gotchas/crew-dcs-code-engine.md]]

## Agent-Delegation Issue Workflow

Jae's recurring pattern: "file a GitHub issue so I can delegate a Claude/another agent to build it." When Jae says "create a ticket on crew-dcs" or "file a ticket for another agent," use this repo and these conventions:

- **Labels:** `ready-for-agent` (PRD ready for agent implementation), `agent-reported` (filed by an agentic developer), `agent-in-progress` (a routine claimed it), `ready-for-human` (needs human decision first)
- **House style:** `## What to build`, `## Acceptance criteria` (checkboxes), `## Blocked by` sections

## Filed 2026-10-12

- crew-dcs issue #1771 — IaC change pattern (build out domo-iac-changes skill), labeled `ready-for-agent` + `agent-reported`
- letta-datacrew-memories PR #37 — domo-iac-changes skill stub + scheduled-report-private-dataset gotcha

## CI & GitHub Actions (as of 2026-10-12)

- **GitHub Free tier, 2,000 monthly Actions minutes** — exhausted ~Oct 10 by ownership sprint (PR #1731) + daily scheduled postman-monitor. **No payment method on file** → GitHub $0-limit refusal. Jobs fail in 1-2s with zero steps before step 1. Signature: billing annotation in run list, not a card failure.
- **5 workflows disabled** (to preserve remaining minutes): CI, Postman API Register Monitor, Upload Python Package, Release wheel to the datacrew.space package index, Semantic Versioning Auto-Tag. Copilot left active (event-rare, not CI noise).
- **Re-enable**: `gh workflow enable <workflow-id>` (IDs documented in crew-dcs CI failure gotcha).
- **PR #1772 held**: CI infra validation for private-index end-to-end testing. Fate depends on billing/CI direction (fix billing vs. migrate to local CI).
- **`operate-without-ci` skill** (PR #1776, merged 2026-10-12): covers local gating + manual deploy for CI-less landing. Located in `.agents/skills/operate-without-ci/`.
- **PR #1773 merged**: Dribbble design tokens, auth + jupyter guides, architecture docstrings. Conflict was two doc-writing passes over the same docstrings (main's Sphinx→autorefs conversion vs branch's architecture docstrings).
- **PR #1769, #1770, #1774, #1775 merged**: design tokens, rebase verification, docs crosslinking.
- **Docs site**: domolibrary.datacrew.space uses mkdocs with theme on main (via PR #1774/1775). Deployed manually when CI is unavailable.

## Distribution (as of 2026-10-12 — crew-dcs now PRIVATE)

- **crew-dcs is token-gated.** Public copies deleted + edge-blocked 2026-10-12 (Jae: downloads must be attributable — "the whole point was to make it private so we could know who's downloading the library").
- **Community token policy (Jae, 2026-10-12):** 90-day TTL on issued dc_ tokens.
- **Install (entitled users):** `pip install crew-dcs --index-url "https://__token__:<dc_token>@datacrew.space/packages/private/"  (index URL = root; client appends /crew-dcs/ — validated end-to-end with uv 2026-10-12)` — needs dc_ token + `packages-private` entitlement (ACCESS_KV; Jae issues; site has `/api/library-access/request`).
- **Still public (intentional, mdrag CI installs anonymously):** `cl`, `dc-auth`, `crew-logger-ts` via `packages.datacrew.space/<pkg>/`.
- **Python >=3.13 floor** — flag when recommending externally.
- **domolibrary.datacrew.space** = public mkdocs docs site (separate Pages project) — SDK *docs* remain public even though wheels are gated; flagged to Jae, his call.
- **NOT on PyPI** (404) — the R2 index is the only distribution.

## Package index architecture (verified 2026-10-12, post-move)

- **Bucket:** Cloudflare R2 `datacrew-packages` (+ `-preview`). Public access policy `CnamesOnly: packages.datacrew.space`.
- **Serving layers (raw host):** transform rules rewrite `/`, `/<pkg>/`, `/<pkg>/index.html` → `/_index/...` BEFORE WAF; index pages are static objects under `_index/`; wheels served raw from bucket keys.
- **Redirect rule:** `datacrew.space/packages/*` 308 → `packages.datacrew.space/*` EXCEPT `/packages/private/*`, which falls through to the Next.js gated Function (`app/packages/[[...path]]/route.ts`, ADR-038; dc_ token + `packages-private` entitlement; pip Basic `__token__:<dc_...>` or Bearer; 401 + Basic challenge anonymous).
- **WAF (zone ruleset `http_request_firewall_custom`):** pre-existing rule blocks `private` on the raw host (2026-09-29, datacrew-site#241); my rule blocks `/crew-dcs` + `/_index/crew-dcs` via **raw.http.request.uri.path** — transforms run before WAF, so normalized-path rules miss rewritten index pages.
- **Object locks:** EVERY prefix locked "indefinitely" (lock-cl, lock-crew-dcs, lock-crew-logger-ts, lock-dc-auth, lock-private). **Deletes silently no-op — wrangler prints "Delete complete." regardless.** REST API DELETE reveals error 10069 "locked by the bucket policy." To actually delete: `wrangler r2 bucket lock remove <bucket> --name <rule>` → delete → `wrangler r2 bucket lock add <bucket> <name> <prefix>` to restore.
- **CF credentials:** Infisical project 3fbb4296 `/infrastructure` — CF_API_TOKEN, CF_ACCOUNT_ID, CF_ZONE_ID (works for wrangler, REST API, zone WAF). Authenticate per infisical-auth skill.
- **2026-10-12 the move:** wheel → `private/crew-dcs/` (sha256-verified), public object deleted (unlock → delete → relock), WAF block added, root `_index/index.html` cleaned of crew-dcs. Zero consumers broke (domo-mcp vendors its own wheel; gateway only pulls dc-auth).
- **Index hygiene:** non-explicit uv index / extra-index-url against datacrew.space exhausted CF Workers quota 2026-09-29 (datacrew-site#241) — use `--find-links .../index.html` or explicit uv index + sources pin. Guard: `scripts/check_datacrew_index.py` in homeserver.

## Access system (datacrew-site — how gated downloads authorize)

- **dc_ token** = RS256 JWT, `dc_` prefix, sub=email; valid iff signature ok AND `jti` present in ACCESS_KV `active-jti:{jti}` (revocation = delete that key; tokens are no-expiry by default so jti is the only bound).
- **Mint:** `datacrew-site/scripts/mint-service-token.mjs --sub <email> --scope <s> --ttl 1h|72h|90d|never`; reads `JWT_PRIVATE_KEY_PEM`/`JWT_PUBLIC_KEY_PEM` from **Infisical `/jwt`** (project 3fbb4296, prod).
- **Entitlement:** ACCESS_KV (namespace `ed1cccc8f38f41efb24ee6ae736797ff`): `access:{resource}:{email}` JSON record + `access-index:{resource}` string[]. Resource for crew-dcs = `packages-private`. Site admins (allowlist) bypass entitlement.
- **KV write trap:** CF REST `PUT /values/{key}` wants the RAW value as body. A form-field PUT (`data={"value": v}`) silently stores `value=<urlencoded>` and breaks JSON consumers (clobbered the index once this way).
- **CI validation:** `crew-dcs/scripts/validate_private_index.py` (PEP 723, `uv run`) — mint throwaway identity, negative control (no entitlement → refused), grant, install `crew-dcs==<ver>`, cleanup. Workflow `validate-private-index.yml` (release-wheel follow-on, dispatch, weekly). PR hector-dcs/crew-dcs#1772 (2026-10-12). Needs INFISICAL_CLIENT_ID/SECRET repo secrets.
- **Docs site (domolibrary.datacrew.space):** mkdocs with deliberate split — `apidocs/` (public, docs_dir) vs `docs/` (agent-facing, internal). API reference is build-generated by gen-files + `scripts/gen_ref_pages.py` (no drift). Runbooks live in `.agents/runbooks/*/SKILL.md` (agent-ops format). Guides section added 2026-10-12 (PR #1773: auth exemplar with token education + access-token-account best practices, jupyter). Phase 2 design: `gen_guide_pages.py` ingesting `public: true`-flagged runbooks at build time — awaiting Jae's taste review.
