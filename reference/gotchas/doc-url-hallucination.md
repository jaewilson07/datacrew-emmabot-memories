---
description: Gotcha — fabricating developer.domo.com portal permalinks; verify doc URLs before posting them.
---
# Doc URL Hallucination

**Incident (2026-09-17/18):** Answering Ellibot's Code Engine auth question, I cited
`https://developer.domo.com/portal/e5c86ff43ec92-code-engine-api` — a permalink I
*constructed* from the portal's URL pattern, not one I verified. Joseph Meyers (Domo)
corrected me publicly: "that link to documentation isn't correct" and gave the real one:
<https://www.domo.com/docs/portal/API-Reference/app-framework-apis/Code-Engine-API>.

## Rules

1. **Never construct doc URLs from URL patterns.** developer.domo.com permalinks use
   opaque hashes (`/portal/<hash>-<slug>`) that cannot be guessed. Same class of error
   as hallucinating Beast Mode function names — I pattern-match a plausible-looking
   artifact and present it as real. (Slugs can't be *guessed*, but they can now be
   *looked up* deterministically — see the hub repo section below.)
2. **Only cite URLs that came from a tool result** (RAG source citation, fetch, search
   result). If the RAG source is `portal/API-Reference/...md` (a repo path, not a URL),
   either resolve it to the canonical public URL or describe the location by name
   ("developer portal → API Reference → Product APIs → Code Engine") instead of
   inventing a link.
3. **Portal moved hosts**: developer.domo.com content now lives under
   `https://www.domo.com/docs/portal/...`. Old developer.domo.com permalinks may not
   resolve. (Related: developer.domo.com is WAF-protected/JS-rendered — see
   [[reference/gotchas/domo-developer-docs.md]].)
4. If a member corrects a link, own it in-thread and fix the knowledge-base doc that
   carried the wrong URL.

## Deterministic slug lookup: `domo-documentation-hub` (discovered 2026-10-12)

`github.com/DomoApps/domo-documentation-hub` is the public source for BOTH
developer.domo.com AND the Domo KB — a Mintlify site, actively maintained. This turns
rule 1 from "can't guess" into "grep the repo":

- **URL slugs are the .mdx FILENAMES.** E.g. `portal/1845fc11bbe5d-api-authentication.mdx`
  → canonical slug `1845fc11bbe5d-api-authentication`. To resolve a doc topic to its
  permalink, grep the clone for a matching filename instead of constructing a URL.
- **Repo layout:** `portal/` = developer portal .mdx content; `s/article/` = KB articles;
  `openapi/` = OpenAPI specs (platform / product / framework / automated-action);
  `docs.json` = Mintlify nav config (deterministic page→URL mapping); plus `de/es/fr/ja`
  locale dirs. ~16k files total, mostly images.
- **Local shallow clone (depth 1): `~/GitHub/domo-documentation-hub` on bonker** — use it
  as an authoring-time URL resolver for docs work. It is NOT an ingestion.
- **RAG side is already covered separately:** crew-dcs
  `scripts/setup_github_fileset_sync_accounts.py` sets up a Domo GitHub connector account
  named `github-domo-documentation-hub` (SHA-tracked via Infisical
  `DOMO_DOCS_LAST_PROCESSED_SHA`) — that's what feeds the 1078-doc Domo AI Search fileset
  behind `domo_rag_query`. It is NOT an mdrag ingestion, so it does not collide with
  the feed→mdrag path below.
- **If the hub is ever ingested to mdrag/wiki** (Jae noted a trigger.dev workflow exists
  for cloning GitHub repos into mdrag): scope it to `portal/` + `s/article` (en) +
  `docs.json` + `openapi/` — skip images / wp-content / locales. **Duplicate-ingestion
  risk flagged to the factory (2026-10-12):** that trigger.dev workflow needs
  confirmation it isn't also targeting this repo alongside the feed→mdrag path.

## Change detection: rss-feed-factory Feed #2 (binding rule from Jae, 2026-10-12)

Relayed by the rss-feed-factory project agent (rss-feed-factory GitHub issue #16).
Jae greenlit the GitHub provider for rss-feed-factory; `DomoApps/domo-documentation-hub`
becomes **Feed #2** (`commits/main.atom`, backfill 20). Binding convergence rule:

- **The factory Sweep is the ONE monitor of that repo.** My May 2026
  `sync_domo_docs.py` SHA-polling is retired as a *detector* — its re-ingest logic
  becomes a *consumer* of the feed signal.
- **Do NOT revive or re-cron any repo-watching of domo-documentation-hub.** The Sweep
  emits commit Feed_Items and the factory's ingest stage hands them to mdrag.
- **Path filtering is emit-time config in the factory** (`portal/**` globs); the GitHub
  Atom feed itself carries no file paths — per-sha GitHub API enrichment happens only
  when configured.
- EmmaBot is the **named consumer reference case** for Feed #2; the factory agent will
  ping when the feed is live.
- **2026-10-13 adversarial review (PR #22, extract stage):** I reviewed rss-feed-factory
  PR #22 (agent-fix/issue-6, extract stage), delegated by IdrisBot on Jae's instruction —
  verdict **BLOCK with 7 blockers**. S1 blocker: letta extractor missing
  `streaming: false` → SSE response → `JSON.parse` throws → every extraction fails on
  first production run. PRs #14–#22 were merged overnight Oct 12→13 by an **unattributed
  actor** (not me — my review was read-only); if #22 merged after my 05:37 UTC BLOCK,
  the extract stage may be broken in production. **When Feed #2 goes live and I consume
  it, verify the extract stage works before trusting Feed_Items.** Also: builder
  subagents on that project died on "daily model inference quota" errors Oct 12→13 —
  not a wall I have hit; concurrent quota events that week were the Claude Code crew's
  weekly limit (reset Oct 14 1am MDT) and GitHub Actions free minutes exhaustion.
