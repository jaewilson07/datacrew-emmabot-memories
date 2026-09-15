# Summary Number Gotchas — COUNT vs SUM(1), Table-Card Diagnostic Rule, JOINed Facts

Born from DUG Slack thread 2026-09-14 (https://domo-user-group.slack.com/archives/C01AJCQRCR4/p1789417683274749). Full write-up lives in the knowledge base: `knowledge-base/domo/gotchas/summary-number-count-vs-sum1.md`.

## The three lessons (from Jae's post-mortem)

1. **Never use COUNT in Summary Numbers.** `COUNT(column)` counts non-null values — NULL rows silently excluded. Use `SUM(1)` for row counts, `SUM(CASE WHEN ... THEN 1 ELSE 0 END)` for conditional counts. No NULL ambiguity, filterable.
2. **Table-card diagnostic rule.** If the user can't reproduce the correct number in a plain table card, everything else (summary numbers, date grains, Analyzer settings) is guessing. Fix the data model first.
3. **JOINed facts = classic Domo anti-pattern** (Kimball). Column names like `EstimationEstimatedCost` (two metrics fused) are the tell. JOINing fact tables on non-unique axes causes row growth/duplication → inflated bars, mismatched summary date-slices. UNION the facts instead; use a metric-type CASE column or separate ActualAmount/EstimatedAmount columns.

## Summary Number "Use Current Value" behavior (undocumented)

- No grain selector exists in the UI. The grain is **inherited from the chart's date grain**. Docs imply you can pick a grouping dimension — you can't.
- "Last" returns the value for the last date bucket at that inherited grain, sliced from raw rows — it can diverge from any visible bar when the underlying data has duplicates or unexpected row growth.
- Doc gap flagged & resolved: gap-1789418797429-rp5790 → knowledge-base/domo/gotchas/summary-number-count-vs-sum1.md

## Debugging lesson for me

- **"Show chart data" is circular evidence.** It shows the chart's post-grouping query — it can never confirm/deny raw-data hypotheses (e.g., multiple distinct timestamps within a "weekly" bucket). Point users to the DataSet preview (Data Center → sort descending) or a `COUNT(DISTINCT col)` Beast Mode probe instead.
- In this thread I chased Analyzer settings (grain, sort, filters, format) for several rounds while the real suspect was upstream: the data model. **Lead with the table-card test next time** — it would have ended the guessing in round one.
