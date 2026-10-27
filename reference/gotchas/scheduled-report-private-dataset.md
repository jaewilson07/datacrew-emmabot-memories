---
description: Scheduled report 'Private Dataset' placeholder — culprit is the per-recipient access stack (Page → Card → Dataset → PDP); card-level sharing is the hidden layer; API-recreated cards lose shares.
---

# Gotcha — Scheduled report shows "Private Dataset" (missing access layer)

**Symptom**: a scheduled report worked before, now recipients see **"Private Dataset"** in the report email — even though they still have page access and dataset access.

**What it actually means**: "Private Dataset" in a scheduled report means the *recipient's render* hit a missing access layer — **not necessarily the dataset**. Domo renders scheduled reports per-recipient, gated by the recipient's FULL access stack:

```
Page access → Card access → Dataset access → PDP policies
```

Any broken layer produces the "Private Dataset" placeholder. The Scheduled Reports doc says reports render "in the context of the owner unless PDP is involved" but never spells out the per-recipient layer stack, and no doc enumerates **card-level access** as a possible failure layer.

## The card-level layer (the one nobody checks first)

- Page sharing normally **cascades to the cards on the page** — unless individual cards have been restricted (card-level sharing).
- If a card on the page has card-level restrictions that exclude the report recipient, the report renders that card as "Private Dataset" even when page + dataset access are fine.

## API changes can silently strip card sharing

⚠️ **Updating or recreating cards via the API can reset card-level sharing** — e.g. swapping a card's datasource, or deleting/recreating the card (some ETL/automation flows do this in place of an update). The recreated card loses the individually-granted shares it had, so a scheduled report that worked last week suddenly shows "Private Dataset" to the same recipients, with no visible change to page or dataset permissions.

## Diagnostic checklist (in order)

1. Page access for the recipient? (page share settings)
2. **Card-level restrictions on any card in the report?** (card → Share → check the recipient isn't excluded) ← start here if it worked before
3. Was any card recently updated/recreated via API or dataflow-driven card tooling? (recreated cards lose card shares)
4. Dataset access for the recipient?
5. PDP policies filtering them out?

Source: DUG #dug-community thread (AJ Hopkins), 2026-10-12 — assembled from Scheduled Reports doc + Sharing Cards/Dashboards doc + Page API content-management doc + prior community thread; no single Domo doc covers the layer stack or the API-resets-card-sharing behavior.
