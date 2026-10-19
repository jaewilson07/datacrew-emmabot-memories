# Scheduled Reports + PDP: The Render Context Switch That Breaks Emails

**Source:** DUG Slack thread, 2026-09-16 — Marirose Mazza's "Private Dataset" in scheduled
report emails (<https://domo-user-group.slack.com/archives/C012H05RWTC/p1789575456132139>)
**Status:** Doc gap resolved (gap-1789593069895-zf8kvp) — pieced together from a docs
performance caveat + the member's evidence; **fix confirmed 2026-09-17**: sharing the
page with recipients restored their emails. No single Domo doc covers the switch.

## The Question Shape

> "Our scheduled report emails worked fine for weeks. The moment we enabled PDP on the
> dataset, recipients started getting 'Private Dataset' instead of the report. The
> recipients are in an 'All Rows' policy and the masked columns aren't even on the cards.
> Why did enabling PDP break emails for people who already had access?"

## TL;DR

Enabling PDP flips scheduled reports from **render-once** to **render-per-recipient**.
Before PDP, one copy of the report is rendered and emailed to everyone — recipients'
own page/dataset access does **not** gate the email content. After PDP, each recipient's
email is rendered under **their** access stack (page share → dataset access → PDP
policies). A participant user with no page share goes from "gets the report fine" to
"Private Dataset" overnight — even if their PDP policy grants all rows.

## The Mechanism

| | PDP off | PDP on (any policy, incl. column masking only) |
|---|---|---|
| Render passes | **1** — one copy for all recipients | **N** — one per recipient |
| Rendered as | The scheduler owner's context | **Each recipient's own** context |
| Recipient's page share gates content? | ❌ No | ✅ Yes |
| Recipient's dataset access gates content? | ❌ No | ✅ Yes |
| Recipient's PDP policies gate content? | n/a | ✅ Yes |

Domo docs only mention per-recipient rendering as a *performance caveat* for scheduled
reports ("each recipient requires a unique version" when PDP is enabled). The security
implication — that the render context switches from the owner to the recipient, and
therefore the recipient's **entire access stack** starts gating the email — is not
documented anywhere.

## Why the Failure Is Confusing

1. **The PDP policy isn't the thing that fails.** The user can be in an "All Rows"
   policy, and the masked columns may not even appear on any card. The failure is
   usually *upstream* of PDP: no page share, or no dataset access.
2. **It worked before.** Pre-PDP, the report rendered once under the owner's context and
   nobody checked recipients' shares. Enabling PDP retroactively changes the rules for
   an email distribution that was never validated against them.
3. **Column masking counts.** You don't need row-level security for the switch to
   happen — enabling *any* PDP, including column masking only, flips the render mode.

## Diagnostic / Fix

For each broken recipient, walk the access stack top-down — the email is gated by the
**first** missing layer:

1. **Page share** — is the recipient shared (directly or via group) on the page the
   report's cards live on? This is the most common miss.
2. **Dataset access** — does the recipient have access to the backing datasets
   (again, group-based access counts)?
3. **PDP policies** — is the recipient included in a policy (ideally "All Rows" for
   the general population)?

If the distribution list includes people who *shouldn't* have page/dataset access but
*should* get the numbers, that's a design conflict: with PDP on, you cannot email
content a recipient can't see. Options: share the page/dataset at "Participant" level,
or send the report as an exported file from a context that isn't user-gated.

## Support Rule

When a scheduled report breaks right after a PDP change, don't debug the PDP policy
first — audit the **recipients' page shares and dataset access**. PDP didn't break the
report; it exposed that the distribution list was never access-validated.
