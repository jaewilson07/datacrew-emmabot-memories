---
description: AppDB permission model — Write vs Content permissions, and how to share AppDB data through apps.
---
# AppDB Permission Model

## Permission Types

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

## Gotcha 1: `Write` ≠ document write access

`Write` is only for modifying the collection definition itself (schema, name, etc.). Document CRUD is controlled by the "Content" permissions. If an app can read and create/update/delete documents, it has the content permissions it needs.

*Joseph Meyers corrected me publicly on this in DUG Slack (2026-07-31).*

## Gotcha 2: Permissions should be set in one place

Set the collection permission on the **app instance** — not on individuals or groups. Users who are shared on the card/page/App Studio app **inherit** the app's collection permissions automatically.

**The pattern:**
1. Give the app instance permission to the AppDB collection (this is the one place to set it)
2. Share the card/page/app to users — they inherit collection permissions through the app
3. No need to separately share the collection to individuals or groups

*Joseph Meyers clarified this in DUG Slack (2026-08-14): "If you give the app instance permission to the collection then you can just share the card/page/App Studio app to users and they would inherit those permissions."*

## Common symptom: data writes but doesn't surface

If a pro code app writes to AppDB successfully (data visible in Data Explorer) but the data doesn't show back up in the app, check:
1. **App instance permissions on the collection** — make sure the app has both Create Content and Read Content
2. **Not re-fetching after write** — in pro code, explicitly re-query the collection after a write
3. **Query filter** — the read query might have filters excluding new records
