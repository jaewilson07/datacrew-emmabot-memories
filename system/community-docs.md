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
- **Cloud Amplifier schema changes**: NOT fully automatic — Data Freshness checks are **disabled by default** and integration-level; without them schema changes go undetected. Use "Sync with Cloud" button per-DataSet when iterating → `knowledge-base/domo/gotchas/cloud-amplifier-schema-changes.md`
- **Workbench de-auth causes**: password change is only ONE cause — also refresh token limit (50/client/user), Workbench updates, network/SSL changes, admin revocation → `knowledge-base/domo/gotchas/workbench-deauth-causes.md`
- **API versioning strategy**: version numbers are per-endpoint-family, not platform-wide; no documented migration path; param names change between versions (sendInvite → sendNotification) → `knowledge-base/domo/gotchas/api-versioning-strategy.md`
- **API auth — access token vs Client ID/Secret**: access tokens for `<instance>.domo.com` product APIs; client credentials for `api.domo.com` platform APIs; both often share one Developer Portal client → `knowledge-base/domo/gotchas/api-auth-access-token-vs-client-secret.md`
- **Reassign DataSet account via API**: connector DataSet accounts live on the stream config (not the DataSet) — swap `account.id` via stream get/update endpoints for selective reassignment → `knowledge-base/domo/gotchas/reassign-dataset-account-api.md`
- **DataSet Alert → Workflow action**: all four action types (Webhook, Task, **Workflow**, Scheduled Report) work on DataSet AND Card alerts — Workflow is just missing from the DataSet Alert article; multi-row alerts arrive as **lists** (type start params as lists or only the first row processes) → `knowledge-base/domo/gotchas/dataset-alert-workflow-action.md`
