---
description: GitHub PR head can lag at the old SHA after a force-pushed rebase — check status page, verify with ls-remote, nudge with an empty push.
---
# GitHub PR Head Sync Lag After Force-Push

- After force-pushing a rebased PR branch, GitHub can lag showing the PR head at the **old SHA** — no CI triggered, `mergeable` stays `CONFLICTING`.
- Especially likely during a **GitHub incident** — check githubstatus.com first.
- The remote branch ref itself **IS** updated — verify with `git ls-remote` before assuming the push failed.
- **Fix that worked:** push an empty commit (`chore: retrigger PR sync`) to force a fresh push event; the PR head then updates and CI runs.
- The nudge commit disappears in a squash merge, so it's safe to use even on PRs that will be squashed.
