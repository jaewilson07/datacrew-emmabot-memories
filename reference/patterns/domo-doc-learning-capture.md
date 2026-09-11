---
description: Procedure for capturing Domo doc learnings — knowledge-base doc, mdrag annotation with Annotation_Support citing the Slack thread, and crew-dcs/domolibrary route updates. Requested by Jae 2026-09-09.
---

# Pattern: Capturing Domo Doc Learnings (Document → Annotation → Annotation_Support)

**Trigger**: any conversation where we learn something new about Domo API/doc behavior — a gotcha confirmed live, a correction from a community member, an undocumented param, a recovery path pieced together from multiple sources.

**Requested by Jae (2026-09-09, DM thread 1788919926.162829)**: "when we learn something new about domo documentation we are creating annotations with annotation_support referencing slack chat as well as updating crew-dcs routes as appropriate"

## The procedure (all four steps, every time)

### 1. Document — write the knowledge-base doc
`knowledge-base/domo/gotchas/<topic>.md` (see existing gotchas for format: Problem, TL;DR, Sources, Reported). If a doc gap exists, `flag_doc_gap` → write doc → `resolve_doc_gap` (auto-ingests to mdrag).

### 2. Annotation — use the `capture_domo_doc_learning` mod tool (preferred)

**As of 2026-09-11 there's a mod tool for this**: `capture_domo_doc_learning` (in `~/.letta/mods/mdrag-annotation.ts`, codified at Jae's request in DUG thread 1789147435.776269). Two-phase:
1. Call with `learning`, `slack_thread`, `quotation`, `document_query` (no `document_id`) → returns candidate subject docs (Mongo _id | title | collection). Pick the right one.
2. Re-call with `document_id` → posts the annotation with Annotation_Support.

If no candidate doc exists, write the knowledge-base doc + `resolve_doc_gap` first (auto-ingests to mdrag), then annotate THAT doc — worked this way for the Salesforce formula-field learning (2026-09-11).

The tool reads `DATACREW_API_TOKEN` from the service env (fallback: infra-bonker/.env) — no more infisical CLI wrangling. It derives `annotator_id` from the calling agent's name. Annotations work even when the embedding gateway is down (Neo4j traversal edges only).

Raw curl equivalent (for reference / if the tool is unavailable):
```bash
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
- **`document_uid` in annotates = the subject doc's stable Mongo `_id` as string** (e.g. `6aa044b86ea3a582f6363699`), NOT its content-volatile `document_uid` UUID. Find it: `GET /api/v1/documents?q=<search>` → `id` field, or query Mongo directly (MONGODB_HOST=atlas-local inside the mdrag-local container).
- Required fields: `kind`, `provenance` (reproducible|ai_assisted|human), `annotator_id`, `annotator_version`.
- Annotations **work even when the embedding gateway is down** (they stay out of semantic search — Neo4j traversal edges only).
- `kind: "domo_doc_learning"` is our established slug for this pattern.

### 3. Slack thread as source — get the permalink
- `chat.getPermalink` (form-encoded: `channel=...&message_ts=...`) with `PUBLIC_DATACREW_SLACK_BOT_TOKEN`.
- Fetch thread content: `conversations.replies?channel=...&ts=...` — use verbatim quotes for `quotation`.
- **Referencing the Slack chat** = permalink in payload + verbatim quotation + locator in Annotation_Support. (Ingesting the thread itself as a mdrag document via `/ingest/text` currently FAILS when embeddings are down — the workflow dies before document save and misleadingly returns `document_uid: null`. Retry when cubby's vLLM qwen3-embedding-8b is fixed.)

### 4. crew-dcs routes — update as appropriate
If the learning affects API behavior crew-dcs wraps (e.g. an undocumented param):
- Route layer: `src/crew_dcs/routes/<entity>/core.py` — add the param, pass via `params=` to `gd.get_data`.
- Class layer: `src/crew_dcs/classes/Domo*.py` — pass through.
- **crew-dcs rule**: claims about Domo's API need a runnable proof cited in the docstring, or an honest "confirmed via live testing in <Slack thread link>; runnable proof pending" marker. Work in a worktree (`.letta/worktrees/`), branch `emmabot/<topic>`, PR to `hector-dcs/crew-dcs`.
- Also check domolibrary (nbdev! edit `nbs/*.ipynb` then `nbdev_export`; working env: `uv tool install "nbdev==2.3.31" --with "execnb==0.1.4" --with "setuptools<81" --with "fastcore==1.7.29"`).

## Worked examples (2026-09-09)
- sendNotification learning → annotation uid `270bdcea-6038-5844-b014-d2e13c124b58` on doc `6aa044b86ea3a582f6363699`; domolibrary PR #294 + crew-dcs PR #1541
- file-upload recovery learning → annotation uid `d9208bb3-74a3-5865-995a-34b68628009a` on doc `6aa179a96ea3a582f636a9f4`; doc gap `gap-1788296062419-gymql1` resolved
