---
description: crew-dcs repo facts and Jae's agent-delegation issue workflow (labels, house style) — where "file a ticket on crew-dcs" goes.
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

## Distribution (verified 2026-10-12)

- **Public wheel index:** `pip install crew-dcs --extra-index-url https://datacrew.space/packages/` → `packages.datacrew.space` (PEP 503, no auth). `crew_dcs-2.4.4` live, `cl` dep also published. Project page: datacrew.space/projects/domolibrary.
- **External access:** sharing the *library* = zero setup (public index, Apache-2.0). Sharing the *repo* (issues/PRs) = GitHub collaborator invite on `hector-dcs/crew-dcs`.
- **Python >=3.13 floor** — flag when recommending externally.

## Package index architecture (verified 2026-10-12)

- **Serving:** Cloudflare R2 bucket `datacrew-packages` via datacrew-site route `app/packages/[[...path]]/route.ts` (ADR-038). Index rendered per-request from bucket listing.
- **Two halves:** `/packages/<pkg>/` PUBLIC by design (ADR-029 — cl, dc-auth, crew-logger-ts needed anonymous for mdrag CI; "do not add auth"); `/packages/private/<pkg>/` gated by dc_ token + `packages-private` entitlement (pip Basic `__token__:<dc_...>`).
- **2026-10-12 finding:** crew-dcs 2.4.4 wheel was anonymously downloadable (Jae: "it should not be" — forgotten ADR-029 decision, not a leak). Fix = move R2 keys to `private/crew-dcs/`, update README + domolibrary site page. Blast radius ≈ 0: domo-mcp vendors its own wheel, gateway only pulls dc-auth.
- **AJ access path:** dc_ token + packages-private entitlement (ACCESS_KV system already built).
- **Index hygiene:** non-explicit uv index / extra-index-url against datacrew.space exhausted CF Workers quota 2026-09-29 (datacrew-site#241) — use `--find-links .../index.html` or explicit uv index + sources pin. Guard: `scripts/check_datacrew_index.py` in homeserver.
