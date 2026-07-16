---
description: crew-dcs Code Engine gotchas — create, from_dict, type annotations, deployment, and input type support.
---
# crew-dcs Code Engine Gotchas

- **`create()` doesn't re-fetch after creation** — The API response from `POST /api/codeengine/v2/packages` doesn't include `versions`, so `current_version` is always `None` after creating a package. Fix: re-fetch via `get_by_id()` after `create()`. (Found 2026-07-14, fix pushed to crew-dcs `main` as commit `4b08d19`)
- **`from_dict()` version timing bug** — `versions` is set AFTER `__post_init__` runs, but `_set_current_version()` is only called in `__post_init__`. So `current_version` stays `None` even when versions are present. Fix: call `_set_current_version()` after versions are populated in `from_dict()`.
- **Return type annotation extraction broken** — `from_ast_function_return_arg()` passes `ast_fn.returns` (an `ast.Name` node) to `extract_ast_arg_type_annotation()` which expects an `ast.arg` with `.annotation` attr. All return types default to `"object"` instead of the correct type. Fix: use `ast.unparse(ast_fn.returns)` directly. Now `-> str` maps to `text` and `-> int` maps to `number`.
- **Version must be deployed before functions run** — after `upsert()`, call `deploy_release()` to deploy the version. Functions cannot be called until the version is released.
- **Code Engine input type support is incomplete** — Tested all Python type mappings live on domo-community (2026-07-14):
  - `str` → `text` ✅, `int` → `number` ✅, `float` → `decimal` ✅, `bool` → `boolean` ✅, `dict` → `object` ✅
  - `list` → `object` with `isList=True` ⚠️ — lists of dicts work, but lists of primitives (strings) fail with HTTP 400
  - Python default values are NOT applied by Code Engine — functions receive `None` instead of the default. All inputs must be explicitly passed
  - `str | None` (union type) maps to `object` and fails at runtime — avoid union types in Code Engine function signatures
  - Functions without type annotations get `object` type but may fail at runtime — always annotate
  - `from typing import Any` import caused `TypeError: 'type' object is not subscriptable` in Code Engine runtime — avoid importing from `typing` in Code Engine packages
- **Sample project exists in crew-dcs** — `projects/sample-codeengine-functions/` contains `sample_utils.py`, `type_test.py`, `upload.py`, and `README.md` documenting the Code Engine upload workflow and type test results
