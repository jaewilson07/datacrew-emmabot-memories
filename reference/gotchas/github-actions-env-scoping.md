---
description: GitHub Actions job-level env cannot reference the env context (actionlint-enforced) — Infisical secrets-action exports via $GITHUB_ENV surface ONLY in step-scoped env, so secrets can only be renamed/mapped in later STEP-level env blocks, never at job level.
---
# GitHub Actions env scoping (actionlint-enforced)

- **Job-level `env:` cannot reference the `env` context** — actionlint rejects it: "context env is not allowed here". Job-level `env:` may only use the `github`, `inputs`, `matrix`, `needs`, `secrets`, `strategy`, and `vars` contexts.
- **Infisical secrets-action exports via `$GITHUB_ENV`** — those values surface ONLY in the **step-scoped** env context (available to later steps), never in the job-level env context.
- **Consequence:** a secret fetched in one step can only be renamed/mapped in later **STEP-level** `env:` blocks, never at job level. If a consumer expects a specific var name, set that name in the step-level `env:` of the step that needs it (or export the expected name directly from the fetch step).
- Cost one CI round-trip on datacrew-site#257 (2026-10-15). Related: [[reference/gotchas/datacrew-site-build-regeneration.md]].
