---
description: crew-dcs repo facts, distribution/access model (private since 2026-10-12), package-index architecture, and Jae's agent-delegation issue workflow.
---
# crew-dcs Repo & Agent-Delegation Workflow

## Repo

- **GitHub:** `hector-dcs/crew-dcs` — org/user is `hector-dcs`, NOT `jaewilson07`. Private repo.
- **Local checkout:** `/home/jaewilson07/GitHub/crew-dcs`
- **Stack:** Python, src layout, `uv`, mkdocs. Repo self-described as "domolibrary2".
- SDK/API details → [[reference/domo-python-sdks.md]]; Code Engine gotchas → [[reference/gotchas/crew-dcs-code-engine.md]]

## Agent-Delegation Issue Workflow

Jae's recurring pattern: "file a GitHub issue so I can delegate a Claude/another agent to build it." When Jae says "create a ticket on crew-dcs" or "file a ticket for another agent," use this repo and these conventions:

- **Labels:** `ready-for-agent` (PRD ready for agent implementation), `agent-reported` (filed by an agentic developer), `agent-in-progress` (a routine claimed it), `ready-for-human` (needs human decision first)
- **House style:** `## What to build`, `## Acceptance criteria` (checkboxes), `## Blocked by` sections

## Filed 2026-10-12

- crew-dcs issue #1771 — IaC change pattern (build out domo-iac-changes skill), labeled `ready-for-agent` + `agent-reported`
- letta-datacrew-memories PR #37 — domo-iac-changes skill stub + scheduled-report-private-dataset gotcha

## Distribution (as of 2026-10-12 — crew-dcs now PRIVATE)

- **crew-dcs is token-gated.** Public copies deleted + edge-blocked 2026-10-12 (Jae: downloads must be attributable — "the whole point was to make it private so we could know who's downloading the library").
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
