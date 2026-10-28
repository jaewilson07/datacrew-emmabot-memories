---
description: Procedure for capturing Domo doc learnings — knowledge-base doc, mdrag annotation with Annotation_Support citing the Slack thread, and crew-dcs/domolibrary route updates.
---

# Procedure: Capturing Domo Doc Learnings (Document → Annotation → Annotation_Support)

**Trigger**: any conversation where we learn something new about Domo API/doc behavior — a gotcha confirmed live, a correction from a community member, an undocumented param, a recovery path pieced together from multiple sources.

## The procedure (all four steps, every time)

### 1. Document — write the knowledge-base doc
`reference/domo/gotchas/<topic>.md` in the **real repo** (`~/GitHub/datacrew-private-memories`) — NOT the facade (`~/GitHub/knowledge-base/`, wiped 2026-10-25). If a doc gap exists, `flag_doc_gap` → write doc → `resolve_doc_gap` (auto-ingests to mdrag). **NOTE (2026-10-26 → 2026-10-28):** `resolve_doc_gap` auto-ingest was broken but FIXED (deployed 2026-10-26 23:17 UTC) — `MDRAG_COLLECTION` updated from `'domo-official-docs'` to `'domo'`. KB root still points at facade; set `export KNOWLEDGE_BASE_DIR=~/GitHub/datacrew-private-memories` before running `resolve_doc_gap` to avoid empty-path skips. Manual ingest fallback: `POST https://wiki.datacrew.space/api/v1/ingest/text` with `{"content": <full markdown>, "source_title", "source_url", "collection_id": "6a34c9220c958fca1b9df8a3"}`.

### 2. Annotation — use the `capture_domo_doc_learning` mod tool (preferred)

There's a mod tool for this: `capture_domo_doc_learning` (in `~/.letta/mods/mdrag-annotation.ts`). Two-phase:
1. Call with `learning`, `slack_thread`, `quotation`, `document_query` (no `document_id`) → returns candidate subject docs (Mongo _id | title | collection). Pick the right one.
2. Re-call with `document_id` → posts the annotation with Annotation_Support.

If no candidate doc exists, write the knowledge-base doc + `resolve_doc_gap` first (auto-ingests to mdrag), then annotate THAT doc.

The tool reads `DATACREW_API_TOKEN` from the service env (fallback: infra-bonker/.env) — no more infisical CLI wrangling. It derives `annotator_id` from the calling agent's name. Annotations work even when the embedding gateway is down (Neo4j traversal edges only).

Raw curl equivalent (for reference / if the tool is unavailable):
```bash
**Annotation_summary (findability row)**: when Jae asks for "annotation + annotation_summary", mint a second annotation with `kind: "summary"` via the same `/api/v1/ingest/annotation` endpoint, keyed on the LEARNING annotation's stable Mongo `_id` (not its content-volatile document_uid — mdrag#662/#677): `source_url: "annotation:summary:<learning_mongo_id>"`, title `"Summary — <learning title>"`, annotates → the learning annotation with a verbatim quotation from its body. Content = 1-paragraph summary + "## Key points" bullets (mirrors `SummaryAnnotationService._render_markdown`). Rationale: with the embedding gateway down, learning annotations stay out of semantic search — the summary row gives full-text/browse a compact hit. The auto `SummaryAnnotationService` refuses to summarize annotation subjects (mdrag#1227), so this must be minted by hand. Get the learning annotation's Mongo _id via the direct-Mongo recipe below (document_uid from the capture tool → `_id`).
curl -X POST "http://localhost:8017/api/v1/ingest/annotation" \
  -H "Authorization: Bearer $DATACREW_API_TOKEN" \
  -H "Content-Type: application/json" -d '{
  "kind": "domo_doc_learning",
  "provenance": "ai_assisted",
  "annotator_id": "emmabot",
  "annotator_version": "1.0.0",
  "session_id": "emmabot-dug-community-<date>",
  "payload": { "learning": "...", "slack_thread": "<permalink>", "code_changes": ["<PR urls>"], "knowledge_base_doc": "<path>" },
  "annotates": [{
    "document_uid": "<subject doc Mongo _id as string>",
    "polarity": "supports",
    "quotation": "<verbatim quote from the Slack thread>",
    "locator": "<Slack reply ts or section>"
  }]
}'
```

Key facts:
- **Token**: `DATACREW_API_TOKEN` from Infisical `/datacrew` path (NOT `MDRAG_TOKEN` — that one gets "Invalid or expired token"). mdrag at `http://localhost:8017` on bonker.
- **Token source gotcha (confirmed 2026-09-17)**: the fallback `infra-bonker/.env` copy of DATACREW_API_TOKEN can go STALE (829 chars vs 864 in the service env) — manual curl with it returns 401. Prefer the service env (`$DATACREW_API_TOKEN` in the letta-datacrew environment); only use the .env fallback if the env var is unset.
- **Subject doc not in mdrag?** `/api/v1/documents?q=` ignores the query when the embedding gateway is down. Query Mongo by title regex instead (see below). If the doc truly isn't indexed (e.g. a domo.com/docs API reference page not in vendor-docs-sync), ingest a snapshot with `POST /api/v1/ingest/text` (fields: `content` required, `title`, `collection`) — its title will show as "Slack message" (provider_type quirk) but it's annotatable and searchable by content. Note in your report that the canonical version should replace it on next crawl.
- **`document_uid` in annotates = the subject doc's stable Mongo `_id` as string** (NOT its content-volatile `document_uid` UUID). Find it: `GET /api/v1/documents?q=<search>` → `id` field, or query Mongo directly (MONGODB_HOST=atlas-local inside the mdrag-local container).
- **Mongo direct query gotcha (confirmed 2026-09-17)**: building the URI from `MONGODB_HOST`/`MONGODB_PASSWORD` env vars alone fails auth — the app's real connection string adds `?directConnection=true&authSource=admin`. Get it via `docker exec mdrag-local python -c "from mdrag.config import load_settings; s=load_settings(); print(s.mongodb_connection_string)"`. Also: when the embedding gateway is down, `GET /api/v1/documents?q=` ignores the query (returns unrelated docs) — filter with `?collection=` or query Mongo by title regex instead.
- Required fields: `kind`, `provenance` (reproducible|ai_assisted|human), `annotator_id`, `annotator_version`.
- Annotations **work even when the embedding gateway is down** (they stay out of semantic search — Neo4j traversal edges only).
- `kind: "domo_doc_learning"` is the established slug for this pattern.

### 3. Slack thread as source — get the permalink
- **Slack API ts format**: permalinks embed `p<ts with no dot>` but the API needs the dotted form — convert `p1789575456132139` → `1789575456.132139` (insert dot 6 digits from the right) or `conversations.replies` returns `thread_not_found`.
- `chat.getPermalink` (form-encoded: `channel=...&message_ts=...`) with `PUBLIC_DATACREW_SLACK_BOT_TOKEN`.
- Fetch thread content: `conversations.replies?channel=...&ts=...` — use verbatim quotes for `quotation`.
- **Referencing the Slack chat** = permalink in payload + verbatim quotation + locator in Annotation_Support. (Ingesting the thread itself as a mdrag document via `/ingest/text` currently FAILS when embeddings are down — the workflow dies before document save and misleadingly returns `document_uid: null`. Retry when cubby's vLLM embedding model is fixed.)

### 4. crew-dcs routes — update as appropriate
If the learning affects API behavior crew-dcs wraps (e.g. an undocumented param):
- Route layer: `src/crew_dcs/routes/<entity>/core.py` — add the param, pass via `params=` to `gd.get_data`.
- Class layer: `src/crew_dcs/classes/Domo*.py` — pass through.
- **crew-dcs rule**: claims about Domo's API need a runnable proof cited in the docstring, or an honest "confirmed via live testing in <Slack thread link>; runnable proof pending" marker. Work in a worktree (`.letta/worktrees/`), branch `emmabot/<topic>`, PR to `hector-dcs/crew-dcs`.
- Also check domolibrary (nbdev! edit `nbs/*.ipynb` then `nbdev_export`; working env: `uv tool install "nbdev==2.3.31" --with "execnb==0.1.4" --with "setuptools<81" --with "fastcore==1.7.29"`).
