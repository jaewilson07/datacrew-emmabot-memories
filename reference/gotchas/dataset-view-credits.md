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

## Bonus: Views Explorer — NO rank window button; use the Advanced SQL Editor

**Correction #2 (same thread):** I also claimed Views Explorer supports a "dynamic rank window."
Member couldn't find it — because it doesn't exist in today's UI. The claim comes from Domo's
**2021 release-marketing blog** ("Apply date windows and dynamic rank window"), which does not
match the current product. The current Manage DataSet Views doc (360046074774, updated Feb 2025)
lists only: Filter, Group, Sort, Limit, Joins, Unions, Calculated Columns, Add/Remove/Rename columns.

**The real dedupe-in-a-view path:** the **Advanced SQL Editor** (2024 Release 1,
https://www.domo.com/product/new-features/dataset-views-advanced-sql-editor-with-ai-assistant).
Views Explorer → SQL Editor → Enable (warns: discards existing view properties) → write SQL:

```sql
SELECT * FROM (
  SELECT t.*, ROW_NUMBER() OVER (PARTITION BY `grp` ORDER BY `ts` DESC) AS rn
  FROM `dataset` t
) ranked WHERE rn = 1
```

Requires Edit permission on the view; the AI Assistant additionally needs the "Use AI Services"
grant (and OpenAI models enabled in the AI Service Layer).

## Lessons

1. Before making a credit/cost claim, check domo.com/consumption-terms — it's the contract-level
   source and it's short. "Virtual" ≠ "free."
2. **Release-marketing pages ≠ product docs.** Domo's /blog and /product/new-features pages
   describe capabilities at announcement time and go stale (or never shipped as described).
   Verify against the current Knowledge Base article (domo-support.domo.com) before telling a
   member a button exists — and describe WHERE in the UI it lives, because that's exactly what
   a member will go looking for.
