---
description: cboti library gotchas — batch update methods, table blocks, and path issues.
---
# cboti Patterns Gotchas

- **`GoogleSheets.batch_update()` ≠ `batch_update_values()`** — the former is spreadsheet-level metadata/formatting; the latter is for cell content
- **TableBlock cells must be `ContentBlock`, not `str`** — if you pass raw strings, rendering breaks silently
- **cboti path mismatches** — when importing cboti with a direct python binary (not via the package install), add `sys.path.insert(0, '../libraries/cboti/src')` to find the source. Path issues were common in the old Docker container; on bonker, check the actual install location.
- **Working interpreter on bonker (verified 2026-10-14, task_6):** `/home/jaewilson07/GitHub/simpleDiscordBot/libraries/cboti/.venv/bin/python` — the simpleDiscordBot SUBMODULE clone's venv (python 3.14.4, google-api-python-client 2.198.0, google-auth 2.56.2; declared in pyproject + uv.lock, standard `uv sync`). Use it with `PYTHONPATH=/home/jaewilson07/GitHub/simpleDiscordBot/libraries/cboti/src`. TRAP: `~/GitHub/cboti` is a SEPARATE standalone clone of the same repo whose `.venv` is BARE (python3.13, no google modules; `uv sync` there fails on python resolution) — same repo, two clones, only the submodule one works. CAVEAT: the venv's bin/python symlinks to /usr/bin/python3 — a system python upgrade silently retargets the venv and orphans its site-packages.
