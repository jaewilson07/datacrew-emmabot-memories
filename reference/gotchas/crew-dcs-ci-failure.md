---
description: crew-dcs CI failure patterns — zero-step, 1-2s jobs, CI_RUNS_ON repo variable pointing to offline self-hosted runner.
---
# crew-dcs CI Failure Patterns

## Symptom

All GitHub Actions jobs on a PR (or repo-wide) fail in **1-2 seconds** with:
- **Zero steps executed** (no log output — jobs die before logging)
- Empty annotations
- Multiple workflows affected simultaneously (CI + monitors + etc.)
- **No tests ran** — infrastructure-level failure, not test failure

## Mechanism

The crew-dcs repo uses a repo variable (`CI_RUNS_ON`) to control GitHub Actions runners:

```yaml
runs-on: ${{ fromJSON(vars.CI_RUNS_ON || '"ubuntu-latest"') }}
```

If `CI_RUNS_ON` is set to a self-hosted runner label that doesn't exist (or an invalid value), jobs fail instantly with zero steps.

### Common Causes

1. **Offline self-hosted runner**: Someone set `CI_RUNS_ON` to a self-hosted runner label (e.g., for private-index access via PR #1772 CI validation work), but the runner is offline/unreachable.
2. **Billing/spending limit reached**: GitHub Actions minutes exhausted on a private repo — produces jobs failing instantly with a "billing-block" signature.
3. **Workflow file error**: Rare, but a workflow-level error at job-setup can also produce zero steps (check if only affected workflows fail).

## Diagnostic Steps

1. **Verify repo-wide**: Check if other PRs and `main` scheduled runs also fail (`gh run list --repo hector-dcs/crew-dcs`)
2. **Check timing**: When did it start? Find last successful run (`gh run list --status success --repo hector-dcs/crew-dcs`)
3. **Check runner status**: Verify self-hosted runners (`gh api repos/hector-dcs/crew-dcs/actions/runners`), GitHub status page (all operational = not a GitHub incident)
4. **Check the `CI_RUNS_ON` variable**: `gh variable list --repo hector-dcs/crew-dcs`
5. **Check billing**: If CI_RUNS_ON is correct, it could be GitHub Actions spending limit — only human can check hector-dcs billing

## What to Avoid

- Don't debug test code or workflow YAML when jobs never execute
- Don't blame your changes if CI was already broken before you opened the PR
- Don't merge unverified PRs without checking their last known green state first
