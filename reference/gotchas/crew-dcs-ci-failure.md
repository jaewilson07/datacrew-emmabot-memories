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

1. **Billing/spending limit reached (VERIFIED, ~Oct 10 2026)**: GitHub Free tier has **2,000 monthly Actions minutes** on private repos. The hector-dcs/crew-dcs repo exhausted these ~Oct 10 during an ownership sprint (PR #1731 + daily scheduled postman-monitor). Signature: no payment method ever on file → GitHub's $0-limit refusal, jobs die before step 1. **Always check billing FIRST** before chasing runner config.
2. **Offline self-hosted runner**: Someone set `CI_RUNS_ON` to a self-hosted runner label (e.g., for private-index access via PR #1772 CI validation work), but the runner is offline/unreachable.
3. **Workflow file error**: Rare, but a workflow-level error at job-setup can also produce zero steps (check if only affected workflows fail).

## Diagnostic Steps

1. **Check billing FIRST**: `gh run list --repo hector-dcs/crew-dcs` — if every run has the same billing annotation, it's the 2,000 monthly Actions minutes cap (GitHub Free, private repos). No payment method = $0 limit. **This is the most common cause** (verified ~Oct 10 2026). Only a human can fix billing.
2. **Verify repo-wide**: Check if other PRs and `main` scheduled runs also fail (`gh run list --repo hector-dcs/crew-dcs`). Note which workflows are affected.
3. **Check timing**: When did it start? Find last successful run (`gh run list --status success --repo hector-dcs/crew-dcs`). If billing is the cause, look for runs right before the monthly cycle boundary.
4. **Check runner status**: If NOT billing, verify self-hosted runners (`gh api repos/hector-dcs/crew-dcs/actions/runners`), GitHub status page (all operational = not a GitHub incident)
5. **Check the `CI_RUNS_ON` variable**: `gh variable list --repo hector-dcs/crew-dcs`. If set, verify the runner label matches an online runner.
6. **If billing is resolved but CI still broken**: Check `CI_RUNS_ON` → runner status → workflow files (in that order).

## Known Mitigations (2026-10-12)

- **5 workflows disabled**: CI, Postman Monitor, Upload Python Package, Release wheel, Auto-Tag. Copilot left active (event-rare). Use `gh workflow enable <id>` to re-enable when billing is sorted.
- **PR #1772 held**: CI infra validation for private-index end-to-end testing. Waits on billing/CI direction.
- **`operate-without-ci` skill**: Available in crew-dcs repo (`.agents/skills/operate-without-ci/`) — covers local gating + manual deploy for CI-less landing.

## What to Avoid

- Don't debug test code or workflow YAML when jobs never execute
- Don't blame your changes if CI was already broken before you opened the PR
- Don't merge unverified PRs without checking their last known green state first
