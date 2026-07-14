---
description: Domo Python SDKs and libraries (crew-dcs, domolibrary) with dataflow API capabilities and programmatic dataflow creation reference.
---

# Domo Python SDKs & Libraries

Reference for Domo Python libraries that come up in DUG Slack questions.

## crew-dcs (DataCrew SDK)

- **What:** DataCrew's open-source Python SDK that wraps the Domo API
- **Maintained by:** Jae Wilson / DataCrew
- **Install:** `pip install crew-dcs --index-url https://datacrew.space/packages/` (NOT on standard PyPI — uses DataCrew's custom package index)
- **Package index:** `https://datacrew.space/packages/`
- **Blog post with examples:** `datacrew.space/blog/trigger-report-builder-from-domo-workflows` (Scheduled Reports API examples)
- **Notes:** Newer SDK. Documented examples mainly cover Scheduled Reports API so far. May have broader Domo API coverage since it wraps the API generally.

## domolibrary

- **What:** Well-established Python library for Domo API interaction
- **Maintained by:** Jae Wilson
- **Install:** `pip install domolibrary` (standard PyPI)
- **GitHub:** `jaewilson07/domo_library`
- **Dataflow capabilities (documented routes):**
  - `get_dataflows` — list dataflows
  - `get_dataflow_by_id` / `DomoDataflow.get_by_id()` — get by ID
  - `update_dataflow_definition` / `domo_dataflow.get_definition()` — get/update definition
  - `execute_dataflow` / `domo_dataflow.execute()` — run a dataflow
  - `get_dataflow_execution_history` / `domo_dataflow.History.get_execution_history()` — execution history
  - `get_dataflow_execution_by_id` — specific execution
  - `get_dataflow_versions` / `get_dataflow_by_id_and_version` — versioning
  - `get_dataflow_tags_by_id` / `put_dataflow_tags_by_id` — tags
  - `domo_dataflow.Lineage.get()` — lineage
  - `DomoDataflow_Action` / `DomoDataflow_ActionResult` — per-tile actions and results
  - `search_datacenter()` with `Datacenter_Enum.DATAFLOW` — search/filter
- **NO `create_dataflow` function** — can get, update, execute, and inspect dataflows but cannot create new ones via the library
- **Blog post:** DataCrew has a post on bulk-updating Magic ETLs to use Canvas Grids using domolibrary

## Creating a Dataflow Programmatically

- **Domo API endpoint:** `POST /api/dataprocessing/v1/dataflows` — exists but is **undocumented/private** (not in Domo's public API docs)
- **Other dataflow API endpoints:**
  - Execute: `POST /api/dataprocessing/v1/dataflows/{id}/executions`
  - Update: `PUT /api/dataprocessing/v1/dataflows/{id}`
- **Best approach: "Clone and modify"** — get an existing dataflow's definition using `domo_dataflow.get_definition()`, modify it (name, inputs, actions), and POST it to the create endpoint using raw API calls
- **Dataflow definition structure:** JSON with `name`, `description`, `actions` array (each with `id`, `type`, `name`, `dependsOn`, `gui`, type-specific fields), `inputs`, `outputs`
- **Action types:** `LoadFromVault`, `Filter`, `GroupBy`, `Constant`, `MergeJoin`, `PublishToVault`, etc.
- **Caveat:** Using undocumented APIs carries risk — Domo may change them without notice
- **Common DUG question:** Users frequently ask about creating dataflows via Python/API (e.g., community forum post "Do we have any API for creating a SQL Dataflow in DOMO through python?")
