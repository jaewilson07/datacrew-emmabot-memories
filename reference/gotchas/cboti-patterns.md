---
description: cboti library gotchas — batch update methods, table blocks, and path issues.
---
# cboti Patterns Gotchas

- **`GoogleSheets.batch_update()` ≠ `batch_update_values()`** — the former is spreadsheet-level metadata/formatting; the latter is for cell content
- **TableBlock cells must be `ContentBlock`, not `str`** — if you pass raw strings, rendering breaks silently
- **cboti path mismatches** — when importing cboti with a direct python binary (not via the package install), add `sys.path.insert(0, '../libraries/cboti/src')` to find the source. Path issues were common in the old Docker container; on bonker, check the actual install location.
