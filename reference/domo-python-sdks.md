---
description: Domo Python SDKs and libraries (crew-dcs, domolibrary) with dataflow API capabilities and programmatic dataflow creation reference.
---

# Domo Python SDKs & Libraries

Reference for Domo Python libraries that come up in DUG Slack questions.

## crew-dcs (DataCrew SDK)

- **What:** DataCrew's open-source Python SDK that wraps the Domo API
- **Maintained by:** Jae Wilson / DataCrew
- **GitHub:** `https://github.com/hector-dcs/crew-dcs.git`
- **Install:** `pip install crew-dcs --index-url https://datacrew.space/packages/` (NOT on standard PyPI — uses DataCrew's custom package index)
- **Package index:** `https://datacrew.space/packages/`
- **Blog post with examples:** `datacrew.space/blog/trigger-report-builder-from-domo-workflows` (Scheduled Reports API examples)
- **Notes:** Newer SDK. Documented examples mainly cover Scheduled Reports API so far. May have broader Domo API coverage since it wraps the API generally.

### crew-dcs Code Engine Support

crew-dcs includes Domo Code Engine integration via `crew_dcs.classes.DomoCodeEngine_Package`:

- **`DomoCodeEngine_Package.upsert(auth, package_name, file_path)`** — creates or updates a Code Engine package from a Python file. Auto-parses AST to build the manifest (functions, args, return types from type annotations + docstrings)
- **`DomoCodeEngine_Package.get_by_id(auth, package_id)`** — fetch a package by ID
- **`deploy_release()`** — deploys/releases a version (must be done before functions can run)
- **`run_function(function_name, args)`** — executes a function in the deployed package
- **API endpoint:** `POST /api/codeengine/v2/packages` (create), `GET /api/codeengine/v2/packages/{id}` (fetch)
- **Python type → Code Engine type mappings:** `str` → `text`, `int` → `number`, `float` → `decimal`, `bool` → `boolean`, `dict` → `object`, `list` → `object` (isList=True), `Any` → `object`
- **Workflow:** (1) Create .py file with type-annotated functions + docstrings → (2) `upsert()` to upload → (3) `deploy_release()` to deploy version → (4) `run_function()` to test
- **Sample project:** `projects/sample-codeengine-functions/` in crew-dcs repo — includes `sample_utils.py` (hello world), `type_test.py` (all type coverage), `upload.py` (upload+deploy+test script), and `README.md` with full docs
- **Bugs fixed 2026-07-14 (commit 4b08d19):** (1) `create()` now re-fetches via `get_by_id` after creation (POST response omits versions), (2) `from_dict()` calls `_set_current_version()` after versions are populated, (3) `from_ast_function_return_arg()` uses `ast.unparse()` directly instead of passing through `extract_ast_arg_type_annotation()` (which expects `ast.arg` not `ast.Name`)
- **Runtime type test results (domo-community, Python 3.13):**
  - `str` → text: WORKS
  - `int` → number: WORKS
  - `float` → decimal: WORKS
  - `bool` → boolean: WORKS
  - `dict` → object: WORKS
  - `list` → object (isList=True): PARTIAL — lists of dicts work, lists of strings return HTTP 400 (Code Engine expects list items to be objects, not primitives)
  - Python default values: NOT APPLIED — when input is omitted, function receives `None` not the default. Workaround: handle `None` in function body
  - Functions without type annotations: default to `object` but may fail at runtime

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
