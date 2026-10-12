# Pattern Hunter Oversight (Jae directive, 2026-10-04)

EmmaBot owns **merges + live testing** for `jaewilson07/pattern-hunter` (plugin rebuild of the Pattern Hunter research skill; spec mdrag#1922). The Claude crew on cubby (coordinator session `3735f6f5-f530-4033-8628-078f1721b3a7` in `~/GitHub/simpleDiscordBot`) dispatches builders; opus runs antagonistic `/improve-codebase-architecture` reviews at milestones (blocking); crew does NOT merge.

## Mechanics
- Daily wake `pattern-hunter-pr-check` (id 4884f841, cron 0 14 * * * UTC = 2pm MDT): dispatch subagent to cubby → check open PRs → squash-merge CI-green + adversarial-review-complete ones (comment: "Merged by EmmaBot per Jae's directive") → live-test completed milestones.
- Main checkout on cubby: `~/GitHub/mdrag-research` (NOT pattern-hunter-wt-3 anymore). Worktrees: `~/GitHub/pattern-hunter-wt-*`.
- Merge convention: squash. Tests: `uv run pytest` (uv at `~/.local/bin/uv`); Postgres via docker (`postgres:16`, DSN env `PATTERN_HUNTER_TEST_POSTGRES_DSN`, use `PATTERN_HUNTER_REQUIRE_POSTGRES=1` to forbid silent skips).
- Headless claude launches on cubby need `CLAUDE_CODE_TMPDIR=~/tmp/claude-tmp` (tmp ownership issue).

## State log
- 2026-10-04: PR #12 (identity) merged by me (`37744dc`). Crew blocked on headless write perms under pattern-hunter-wt-*.
- 2026-10-05/06: Blocker cleared (interactive runs, Jae's gh auth). 13 PRs merged. **M1 complete** (#4 orientation reads, #5 agent tools + drift test).
- 2026-10-09: M1 live test PASS (742 passed @ CI parity w/ Postgres 16). Open: #6, #7, #8 (blocked by #40 — engine writes have no authz path), #9. #10 + #29 = ready-for-human (Jae).
- Milestones: M1 = #4+#5 ✅ | M2 = #6+#7 | M3 = #8+#9.
- 2026-10-10: Daily check — no change since Oct 9. Queue empty since Oct 6; no crew output on #6–#9 in 4 days (possible dispatch stall); #40 still blocks #8. Flagged to Jae, offered coordinator nudge.
- 2026-10-11: Stall root cause found — crew hit Claude weekly quota Oct 10 ~12:48 MDT, resets Oct 14 1am MDT. Before the wall, crew was on other priorities (datacrew journals, crew-dcs #1769/#1770, redaction MVP #2446); PH commits silent since Oct 5. Needs Jae: hector-dcs GH Actions billing failure (blocks crew-dcs CI); gh auth on cubby expired (401 — my merges degrade to SSH-only, no CI/review check or comments). Main still 310f7dd.
- 2026-10-12: Lightweight SSH check — no change (main 310f7dd, highest PR #60). Quota wall until Oct 14 1am MDT; switching to lightweight checks until reset. No Jae reply yet on billing/gh-auth items.
