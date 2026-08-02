---
description: Pattern — member enabled a Domo AI feature but the UI element never appears. Gating is layered and the last layer is invisible from the admin UI.
---
# Pattern: AI feature enabled, but not visible

## Symptom

> "I turned on AI / my admin says AI is enabled / my grants look right — but I don't see
> the AI Chat button."

Variants: the **Agents** tab missing from AI Library (only **Toolkits** shows); an AI
feature visible for one user and not another in the same instance.

## Mechanism

Domo AI features gate on several independent layers. All of them must pass, and they fail
silently and identically — the UI element is simply absent, with no error explaining why.

Four layers are checkable from the admin UI: navigation layout, the instance-level
Generative AI toggle, a configured model provider, and user grants.

The fifth is not. Backend entitlement — a consumption agreement, or a beta flag for
features like Conversational Agents — is provisioned by Domo, not by the customer admin.
An instance can read as fully configured on every visible setting and still lack the
feature. **Confirmed in practice (2026-07-15):** a member with correct settings and grants
had no AI Chat button until their CSM enabled backend provisioning.

This is the whole reason the pattern exists: the admin UI cannot distinguish
"misconfigured" from "not provisioned."

## Diagnostic sequence

1. **Navigation layout.** The AI Chat icon only appears in the new left-side navigation
   (rolled out Aug 2025). On the old top navigation it will never show, regardless of
   settings. Admin enables it at `Admin > Feature Management`. — Rules out the most common
   cause, and costs one glance at a screenshot.
2. **Instance toggle.** `Admin > AI Service Layer > AI Settings` → "Generative AI Enabled
   for Instance" must be ON.
3. **Model provider.** `Admin > AI Service Layer > AI Agent Settings` for a Default Model
   Provider, and `> Services` for the Chat Completion service having a model assigned. — A
   provisioned instance with no model behaves like an unprovisioned one.
4. **Grants.** For Conversational Agents specifically: Edit → Admin/Privileged/Editor;
   Manage → Admin only; View → Admin/Privileged/Editor/Participant.
5. **Stop and escalate.** Everything checkable has been checked. The remaining cause is
   entitlement, which only a CSM can resolve. Do not send them back through the settings.

## Support rule

Ask for the navigation layout before anything else — it resolves this more often than the
rest of the sequence combined, and it is answerable from a screenshot.

Never conclude "your settings must be wrong." After step 4 the honest answer is "your
settings are correct; this is a provisioning question for your CSM," and saying so ends a
search that cannot succeed. Getting a member to re-audit grants they have already audited
costs them an afternoon and costs me credibility.

Two things worth volunteering:

- **Unblock testing meanwhile** — AI Chat is reachable in the Domo mobile app
  (More > AI) without grants. Useful for validating data and AI Readiness setup while the
  web UI question is open.
- **Bundle the CSM ask** — a member opening a CSM ticket about AI Chat should ask about
  Conversational Agents beta access in the same conversation. Both need backend
  provisioning, and it saves them a second round trip.

Details: [[reference/gotchas/domo-ai-chat.md]], [[reference/gotchas/domo-ai-library.md]]
