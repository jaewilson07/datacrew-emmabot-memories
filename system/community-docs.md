---
description: Cross-link index to Domo community docs in knowledge-base/domo/.
---
# Community Docs Index

Docs created from DUG Slack community questions. Full content in `knowledge-base/domo/`.
Also ingested into mdrag — query via `domo_rag_query` to find them.

## Domo Events

- **Connections Tour 2026**: partial confirmed dates (Austin, Dallas, SLC, LA) — pages are JS-rendered, individual city pages on `domo-webflow.domo.com` are more reliable → [[reference/domo-events.md]]

## Gotchas

- **File upload dataset recovery**: overwritten File Upload DataSets — recovery via Vault data versions (Dataset History API + Magic ETL Load from Vault), downstream DataFlow copies, or Domo Support; no self-serve restore endpoint → `knowledge-base/domo/gotchas/file-upload-dataset-recovery.md`
- **Field-level usage tracking**: for field rename impact analysis, DomoStats only exposes field detail via "Columns used in Beast Modes"; card fields need the **Governance** connector's "Card Fields and Beast Modes" report; filters need Content API. Full workflow in `knowledge-base/domo/gotchas/domostats-field-level-usage-tracking.md`
- **Full page card**: how to make a card fill the full page — depends on page type (dashboard, Standard Page, Stories, Custom App) → `knowledge-base/domo/gotchas/full-page-card.md`
- **User API v1 vs v3**: v1 uses `sendInvite`, v3 uses `sendNotification` — different param names for same feature → `knowledge-base/domo/gotchas/user-api-v1-vs-v3-params.md`
- **JSON No-Code connector POST/body**: HTTP Method dropdown (GET/POST) controls the verb — Add Body only supplies a static payload; async export APIs (e.g. Braze) return receipts, not data — use the S3 handoff pattern → `knowledge-base/domo/gotchas/json-no-code-connector-post-body.md`
