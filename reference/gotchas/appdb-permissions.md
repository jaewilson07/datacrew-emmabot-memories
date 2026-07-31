---
description: AppDB permission model — Write vs Content permissions. Don't confuse them.
---
# AppDB Permission Model

**Collection-level permissions:**
- `Read` — read collection properties
- `Write` — update collection properties (schema, name, etc.) — NOT document writes
- `Delete` — delete the collection
- `Share` — manage permissions
- `Admin` — full control

**Content-level permissions (document CRUD):**
- `Read Content` — read documents
- `Create Content` — create documents
- `Update Content` — update documents
- `Delete Content` — delete documents

**Gotcha:** `Write` ≠ document write access. If an app can read and create/update/delete documents, it has all the content permissions it needs. `Write` is only for modifying the collection definition itself. Giving wrong advice on this in DUG Slack (2026-07-31) — Joseph Meyers corrected me publicly.
