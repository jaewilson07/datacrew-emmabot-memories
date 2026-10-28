---
description: DataCrew MCP Server (wiki) — connection details, toolsets, collection routing model (domo-official-documentation / domo-curated / domo-community-forums; 2026-10-28 cleanup plan), REST API constraints (X-DC-Token vs Bearer auth), move dependency guard (#1222), and known issues.
---
# DataCrew MCP Server (wiki)

- **URL:** `https://wiki.datacrew.space/mcp/` (note: `wiki` not `wikki` or `mdrag` — old `mdrag.datacrew.space` 301-redirects to `wiki.datacrew.space`)
- **Auth:** `X-DC-Token: $DATACREW_API_TOKEN` header (DataCrew JWT from Infisical `/datacrew` path)
- **Protocol:** MCP Streamable HTTP (JSON-RPC over HTTP with SSE responses). Requires `Accept: application/json, text/event-stream` header. Session ID returned in `Mcp-Session-Id` header on `initialize`.
- **Connection flow:** `initialize` → `notifications/initialized` → `reveal_toolset(name)` → `tools/call`
- **Toolsets are lazy-loaded** — call `list_capabilities` to see all toolsets, then `reveal_toolset(name)` to access tools
- **Key toolsets:**
  - `rag` — `query_rag`, `save_text_to_knowledge`, `save_url_to_knowledge`, `save_audio_to_knowledge`
  - `web` — `search_web`, `crawl_url`, `crawl_site`
  - `graph` — `add_episode`, `search_graph`, `ingest_structured_data`, etc.
  - `wiki` — `query_wiki`, `compile_wiki`, `detect_gaps`, etc.
  - `browser` — `start_browser_session`, `fetch_authenticated`, `capture_linkedin_page`
  - `learn` — `create_lesson`, `create_reference`, `add_learning_record`, etc.
- **Use wiki first** for Domo questions — it has verified Domo content indexed
- **Known issue:** `save_url_to_knowledge` returns 401 (internal auth forwarding bug). Use `save_text_to_knowledge` instead — it works fine.
- **Ingestion script:** `/home/jaewilson07/GitHub/knowledge-base/ingest_to_mdrag.py` — Python script that connects to MCP and ingests markdown files via `save_text_to_knowledge`

## Collections & Routing Model

**Status (2026-10-28):** The `domo` collection is being reorganized — official Domo sources should reside in `domo-official-documentation`, while YouTube videos, learning annotations, and DataCrew analysis belong in `domo-curated`, and community content in `domo-community-forums`. The cleanup plan (2,660 docs classified, awaiting execution) → [[reference/mcp-server.md#collection-cleanup-plan]].

Three collections handle Domo-related documents, each with a clear content boundary:

| Collection | ID | Visibility | Content scope | Example sources |
|---|---|---|---|---|
| `domo-official-documentation` | `6a34c9220c958fca1b9df8a3` | public | Only Domo official sources + annotations of them | domo.com/docs, Domo Support KB articles, domo.com API reference, official Domo blog |
| `domo-curated` | `6add6bb1b6d85a2e772d7aff` | public | DataCrew's own analysis, guidance, community captures | YouTube videos (Jae's), learning annotations (domo_doc_learning), cross-link annotations, gotcha docs, `item_concept` seeds |
| `domo-community-forums` | *exists (check list)* | public | Domo community-forums.domo.com posts | VanillaForums threads scraped from community-forums.domo.com |

**Old name:** `domo-official-docs` was MERGED/renamed to `domo` (same collection_id `6a34c9220c958fca1b9df8a3`). The capture tool default is still correct.

**Visibility:** Collections have a `visibility` field — `public` vs `private`. The `datacrew` collection is private (internal use only).

**Routing principle:** `query_rag` / `domo_rag_query` uses the `domo` collection by default. Other collections require explicit targeting.

### Collection cleanup plan (created 2026-10-28, awaiting Jae's approval)

The `domo` collection (2,660 docs) contains mixed official and unofficial content that should be redistributed:

| What | Count | Destination |
|---|---|---|
| Official DomoDocs/GitHub (DomoApps + domo.com/docs) | ~1,923 | STAY in `domo-official-documentation` |
| YouTube videos (Jae's Domo content) | 225 | → `domo-curated` |
| Auto-summaries of YouTube videos | 219 | → `domo-curated` (must move BEFORE parents; dependency guard) |
| `item_concept` pipeline seeds | 212 | → `domo-curated` (auto-extraction artifacts, not real annotations) |
| Learning annotations (domo_doc_learning) | 5 | → `domo-curated` |
| Cross-link annotations | 1 | → `domo-curated` |
| KB gotcha docs (dug-community uploads) | ~20 | → `domo-curated` |
| DUG Slack thread captures | 1 | → `domo-curated` |
| Community-forums thread (VanillaForums) | 1 | → `domo-community-forums` |
| Project doc (crew-dcs) | 1 | → private `datacrew` collection |
| Test doc | 1 | Archive |

**Key discovery:** Moving a parent document with `confirm=true` does NOT cascade dependent annotations — the move returns 409 with a dependency list instead (mdrag #1222). Annotations must be moved BEFORE their parents.

**Total moves:** ~685 docs → `domo-curated`, 1 → `domo-community-forums`, 1 → `datacrew`, 1 archive. **Rename:** `domo` → `domo-official-documentation` (not a reserved name).

## REST API Access Constraints

**Two auth patterns on wiki.datacrew.space REST API:**

- **`Authorization: Bearer $DATACREW_API_TOKEN`** — limited access. Works for `/health`, MCP `tools/call`, and `POST /api/v1/ingest/text`.
- **`X-DC-Token: $DATACREW_API_TOKEN`** — broader access. Discovered 2026-10-28. Works for `/api/v1/collections`, `/api/v1/documents`, move/archive endpoints where Bearer fails. **Use this for document enumeration, moves, and collection management.**

> ⚠️ Both headers carry the same token value but grant different access levels. The `X-DC-Token` header is the one used by MCP server auth; it extends to REST endpoints that Bearer token cannot reach.

| Endpoint | Access | Notes |
|---|---|---|
| `GET /api/v1/health` | ✅ Bearer | Returns `{"status":"healthy","mongodb":"connected"}` |
| MCP `tools/call` | ✅ Bearer | `save_text_to_knowledge`, `save_url_to_knowledge`, `query_rag` all work |
| `POST /api/v1/ingest/text` | ✅ Bearer | For raw text ingestion |
| `GET /api/v1/collections` | ✅ X-DC-Token | Full list with `visibility` field (⚠️ Bearer fails — returns 401) |
| `GET /api/v1/documents` | ✅ X-DC-Token | Can enumerate/search docs (⚠️ Bearer fails — Wikki-session gated) |
| `POST /api/v1/search` | ✅ Bearer | Semantic search works (keyword listing may be degraded) |
| `POST /api/v1/documents/{uid}/move` | ✅ X-DC-Token | Move between collections; dependency guard returns 409 if dependents exist |
| `POST /api/v1/documents/{uid}/archive` | ✅ X-DC-Token | Soft-delete with reason |
| `PATCH /api/v1/collections/{id}` | ✅ X-DC-Token | Rename a collection |
| `PUT /api/v1/documents/{uid}` | ✅ Bearer/X-DC-Token | Version a doc (content update) |

**Cloudflare WAF note:** `curl` to wiki.datacrew.space may need a browser User-Agent (`-A "Mozilla/5.0 ..."`) if the default UA is blocked (error 1010). Python `urllib` is blocked; `httpx` and `requests` may pass.

**Move endpoint dependency guard:** `POST /documents/{uid}/move` with `confirm=true` does NOT cascade dependent annotations — returns 409 with dependency list. Move annotations BEFORE parents.

## Collection Management

- **Targeting collections:** MCP ingestion tools (`save_text_to_knowledge`, `save_url_to_knowledge`) target collections by **name**, not ID
- **Moving documents:** `POST /api/v1/documents/{document_uid}/move` with body `{"target_collection_id":"...","confirm":true}` — where `document_uid` is the stable Mongo `_id` (not the content-volatile document UUID). **Use `X-DC-Token` header, not Bearer.**
- **Move dependency guard (2026-10-28):** Moving a parent document does NOT cascade dependent annotations — instead returns HTTP 409 with the dependency list. **Always move annotations/children BEFORE parents.** This is mdrag #1222.
- **Renaming collections:** `PATCH /api/v1/collections/{id}` with `{"name": "new-name"}` — use `X-DC-Token`. Only `personal:` and `learn:` prefixes are reserved.
- **Archive:** `POST /api/v1/documents/{uid}/archive` with `{"reason": "..."}` — use `X-DC-Token`
- **Creating documents:** MCP tools create with `document_uid` from response
- **Provenance tracking:** Use `source_label` in ingestion tools to track where content came from (e.g., `"dug-community"`, `"api-reference"`)
- **Enumerating documents:** Use `X-DC-Token` for `/api/v1/documents?search=` and `GET /api/v1/collections` — no longer need Wikki session or local file inventory
- **Collection IDs (2026-10-28):**
  - `domo-official-documentation` (was `domo`): `6a34c9220c958fca1b9df8a3`
  - `domo-curated`: `6add6bb1b6d85a2e772d7aff`
