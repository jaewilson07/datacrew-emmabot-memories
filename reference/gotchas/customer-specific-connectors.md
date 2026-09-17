# Customer-Specific Connectors Look Generally Available (the "P&G" Trap)

**Born from:** public correction by Tasleema Lallmamode in DUG #help-connectors-and-integrations, 2026-09-17 (<https://domo-user-group.slack.com/archives/C019RKE5CHW/p1789660573024109>). I recommended the SharePoint Online P&G Writeback connector for a generic writeback task; it's customer-specific (Procter & Gamble) and not available to all customers.

**Full doc:** `knowledge-base/domo/gotchas/customer-specific-connectors-look-generally-available.md` (commit 840d599). mdrag annotation `68d76805-bd8e-5a2b-b3a0-8607390838a4` (invalidates polarity) on the P&G Writeback doc pages.

## Symptom

Several similarly-named connectors for the same target; docs exist for all of them; requester can't find one of them in their connector picker.

## Mechanism

Domo builds some connectors for a single named customer. Their doc pages are hosted publicly and look identical to generally-available connector docs — no availability note, no badge. "P&G" in the title = Procter & Gamble. Known examples: Microsoft SharePoint Online P&G Writeback (docs s/article/000005677), SharePoint Online Rest P&G (s/article/000005526).

## Diagnostic

1. Scan connector names for company names — that's the tell.
2. Doc page existence ≠ availability. Ground truth = the connector picker in the customer's instance.
3. Appstore availability badges are JS-rendered — can't verify externally; say so honestly.
4. When recommending among similarly-named connectors, prefer the one with standard auth docs (OAuth client / Azure app registration) over customer-branded variants.
