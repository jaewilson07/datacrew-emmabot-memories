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
  behind `domo_rag_query`.
- **If the hub is ever ingested to mdrag/wiki** (Jae noted a trigger.dev workflow exists
  for cloning GitHub repos into mdrag): scope it to `portal/` + `s/article` (en) +
  `docs.json` + `openapi/` — skip images / wp-content / locales.
