---
description: DataCrew MCP Server (wiki) — connection details, toolsets, collection routing model, REST API constraints, and known issues.
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

Three collections handle Domo-related documents, each with a clear content boundary:

| Collection | ID | Content scope | Example sources |
|---|---|---|---|
| `domo` | `6a34c9220c958fca1b9df8a3` | Only Domo official sources + annotations of them | domo.com/docs, Domo Support KB articles, domo.com API reference, official Domo blog/YouTube |
| `domo-curated` | TBD (create if needed) | DataCrew's own analysis, guidance, internal docs | crew-dcs templates, codeengine workflows, DataCrew methodology docs |
| `domo-community-forums` | TBD (create if needed) | DUG Slack threads, domo community-forums.domo.com posts | DUG Slack questions, community forum discussions |

**Old name:** `domo-official-docs` was MERGED/renamed to `domo` (same collection_id `6a34c9220c958fca1b9df8a3`). The capture tool default is still correct.

**Routing principle:** `query_rag` / `domo_rag_query` uses the `domo` collection by default. Other collections require explicit targeting.

## REST API Access Constraints

The `dc_` Bearer token (`$DATACREW_API_TOKEN`) has **limited access** to the mdrag REST API:

| Endpoint | Access | Notes |
|---|---|---|
| `GET /api/v1/health` | ✅ Bearer token | Returns `{"status":"healthy","mongodb":"connected"}` |
| MCP `tools/call` | ✅ Bearer token | `save_text_to_knowledge`, `save_url_to_knowledge`, `query_rag` all work |
| `POST /api/v1/ingest/text` | ✅ Bearer token | For raw text ingestion |
| `GET /api/v1/collections` | ❌ Wikki-session gated | Requires signed-in browser session, not Bearer token |
| `GET /api/v1/documents` | ❌ Wikki-session gated | Cannot enumerate documents via REST with Bearer token alone |
| `POST /api/v1/search` | ✅ Bearer token | Semantic search works (keyword listing may be degraded) |
| `POST /api/v1/documents/{uid}/move` | ✅ Bearer token | Move between collections (see below) |

**Implication:** You cannot enumerate what documents exist in a collection via REST with the Bearer token. Use MCP tools (`query_rag`) or Wikki session auth instead.

## Collection Management

- **Targeting collections:** MCP ingestion tools (`save_text_to_knowledge`, `save_url_to_knowledge`) target collections by **name**, not ID
- **Moving documents:** `POST /api/v1/documents/{document_uid}/move` with body `{"target_collection_id":"...","confirm":true}` — where `document_uid` is the stable Mongo `_id` (not the content-volatile document UUID)
- **Creating documents:** MCP tools create with `document_uid` from response
- **Provenance tracking:** Use `source_label` in ingestion tools to track where content came from (e.g., `"dug-community"`, `"api-reference"`)
- **Wikki session gap:** To enumerate collection contents (e.g., audit what's in `domo`), you need either a Wikki browser session cookie or an MCP listing tool — neither is currently available with Bearer token alone. Workarounds: read from local file inventory (private repo), or use semantic search (`POST /api/v1/search`) to probe for documents
