---
description: GitHub PR head sync lag after force-push — PR head stuck at old SHA, no CI triggered, empty commit nudge to unstick.
---
# GitHub PR Sync Lag

After force-pushing a rebased branch to a PR, the PR head can get stuck at the old SHA with no CI triggered. The `gh pr view` command reports the old commit, and `mergeable_state` stays `CONFLICTING`/`DIRTY` for minutes.

**Symptoms:**
- `gh pr view` shows old HEAD commit
- Remote ref is at the new commit (verified via `git ls-remote`)
- `gh pr checks` shows nothing new
- `gh pr mergeable` reports `CONFLICTING` or `DIRTY`
- This often coincides with a GitHub incident (check status.github.com)

**Diagnosis:**
- Verify the branch ref with `git ls-remote origin <branch>` to confirm it updated
- Compare with `gh api repos/{owner}/{repo}/pulls/{number}` to check PR head
- Check status.github.com for active incidents (performance disruptions often delay background sync)

**Fix:**
Push an empty commit to the branch to force a fresh push event:
```
git commit --allow-empty -m "chore: re-trigger PR sync"
git push --force
```
Wait for CI to run on the new head, then squash-merge (the empty commit is absorbed).

**Root cause:** GitHub's PR background sync (updating PR head from branch ref) stalls during performance disruptions. The push updates the branch ref but the webhook/PR sync job doesn't fire.

**Related:** This is most likely during active GitHub incidents. If the empty commit doesn't work either, wait longer or contact GitHub support.
