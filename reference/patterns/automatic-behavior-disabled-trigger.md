---
description: Pattern — docs say a behavior is "automatic," but its trigger is disabled by default. Automatic ≠ on by default. Born from a public correction.
---
# Pattern — "Automatic" Behavior With a Disabled-by-Default Trigger

## Symptom

Docs (or my answer) say something happens automatically — schema syncs,
features appear, data refreshes. The member reports it doesn't happen at all,
or only after they found a hidden setting. Someone in channel corrects the
"it's automatic" answer with the setting they had to flip.

## Mechanism

"Automatic" in Domo docs often means "no per-action user step required" — it
does NOT mean "works out of the box." The automatic process can still depend
on:

- A **trigger that's disabled by default** (e.g., Cloud Amplifier Data
  Freshness checks — schema/data change detection doesn't run until enabled)
- An **invisible provisioning layer** (e.g., AI features need CSM enablement
  even after admin toggles are on — see [[ai-feature-not-visible]])
- A **service-account prerequisite** (the automation can only see what its
  grants allow)

The docs describe the happy path of the automation and rarely state the
default state of its trigger.

## Diagnostic

Before saying "it's automatic":

1. Ask: **what triggers the automation, and is that trigger on by default?**
2. Check the *settings/config* doc for the feature, not just the overview doc —
   look for "disabled by default" language.
3. If the trigger is a setting, name it and where to enable it in the answer.
4. If the trigger's default state is undocumented, say so — don't assume
   enabled.

## Support rule

When answering "does X happen automatically?", always append the trigger
condition: "automatic *once Y is enabled/configured*." If unsure of Y's default
state, flag the doc gap — "automatic" without trigger documentation is itself a
gap.

Born from: Cloud Amplifier schema thread (2026-09-10) — I answered "it just
updates on its own"; Andrea Keating corrected that Data Freshness checks
(disabled by default, integration-level) are the actual trigger.
See [[../../knowledge-base/domo/gotchas/cloud-amplifier-schema-changes.md]].
