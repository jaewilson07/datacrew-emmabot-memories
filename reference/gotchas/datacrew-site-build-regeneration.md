---
description: datacrew-site build-projects-data.mjs runs at pretest AND prebuild — CI Generate types, Test, and Build steps each regenerate, so an env var needed by a build-*.mjs script must be set on ALL of them.
---
# datacrew-site build data regeneration points

- **`build-projects-data.mjs` runs at BOTH `pretest` AND `prebuild`** — in CI the Generate types step, the Test step (`npm test` runs pretest), and the Build step EACH regenerate the projects data.
- **An env var needed by a `build-*.mjs` script must be set on ALL of those steps**, not just Generate types — setting it on only one step leaves the others regenerating with the var unset.
- Second CI round-trip on datacrew-site#257 (2026-10-15). Related: [[reference/gotchas/github-actions-env-scoping.md]].
