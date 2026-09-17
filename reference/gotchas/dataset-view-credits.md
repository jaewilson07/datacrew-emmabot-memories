---
description: DataSet Views are NOT free — virtual rows consume storage credits at half the materialized rate. Plus Views Explorer rank-window capability.
---

# DataSet View Credits (member-corrected)

## The Mistake

I told a member views "only cost credits if you materialize them." **Wrong.** Grant Smith corrected
in-channel (2026-09-17, #dataflows): virtual rows via Views or Fusion consume credits —
**1 credit per 2M virtual storage rows per month** (vs 1 per 1M for materialized rows).

Source of truth: https://www.domo.com/consumption-terms (Storage table, "Virtual Storage Rows").
Last updated 7/1/2026.

## The Accurate Picture

| | DataSet View (virtual) | ETL output dataset |
|---|---|---|
| Storage credits | 1 per 2M rows/month | 1 per 1M rows/month |
| Execution credits | none (rides with source updates) | 1 per output table per run |
| Schedule to manage | none | yes |

- Both storage rates are calculated on the **3rd-lowest usage day** of the month, not peak.
- Materializing a view adds materialized-row credits on top (or instead).
- For small datasets the virtual-row cost rounds to zero, but never say "free" — the framing
  "views cost no credits unless materialized" is false.

## Bonus: Views Explorer window functions — supported, but UNDOCUMENTED and undiscoverable

**Final resolution (2026-09-17 #dataflows thread):** the Calculated Column editor in Views
Explorer **does accept window functions** — member Ellibot demonstrated
`rank() over (partition by \`region\` order by \`date_ymd\` desc)` working in it.

**Undocumented quirks:**
- The **FUNCTIONS autocomplete does not surface** window functions — typing "rank" gives no
  matches, but typing the full expression by hand works anyway. Supported by the engine,
  invisible to discovery. Jim's own words: "when I typed 'rank' it didn't give me any matches,
  so I assumed it wasn't supported." (Autocorrect behavior also seen in Beast Mode editor.)
- The Manage DataSet Views KB article (360046074774, updated Feb 2025) documents the Calculated
  Column editor but never mentions window function support.
- **Doc gap filed** — this needs to be in the KB article.

**Canonical dedupe-in-a-view recipe** (simplest path, no SQL editor):
1. Add Calculated Column: `rank() over (partition by \`region\` order by \`ts\` desc)`
   — use `row_number()` instead of `rank()` when ties must produce exactly one row
2. Filter the new column = 1 (steps are sequential)
3. Save As a DataSet View; swap downstream ETL inputs to the view

**The Advanced SQL Editor** (2024 Release 1) also works for this — Views Explorer → SQL Editor →
Enable (warns: discards existing view properties) — but it's the heavier path; only needed if the
formula editor's window support proves insufficient. Requires Edit permission; AI Assistant
additionally needs "Use AI Services" grant + OpenAI models enabled in the AI Service Layer.

**Corrections I made in-thread:**
1. Claimed views are credit-free unless materialized → WRONG (virtual rows: 1/2M per month).
2. Claimed a "dynamic rank window" button exists per 2021 marketing → no such button; then
   Ellibot showed window functions work in the Calculated Column editor itself. The 2021
   marketing phrase presumably referred to this formula support, not a dedicated UI tile.

## Lessons

1. Before making a credit/cost claim, check domo.com/consumption-terms — contract-level source.
   "Virtual" ≠ "free."
2. **Absence from the FUNCTIONS autocomplete ≠ unsupported.** Domo's formula engines (Beast Mode,
   Calculated Columns) accept functions the UI doesn't suggest. When a member says "I typed X
   and got no matches," that is NOT proof the function doesn't exist — test the full expression.
3. **Release-marketing pages ≠ product docs.** Verify features against the current KB article
   before telling a member a button exists — and describe WHERE in the UI it lives.
