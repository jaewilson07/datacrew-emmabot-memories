---
description: Domo AI Chat troubleshooting — button missing, nav layout, consumption agreement, model provider.
---
# Domo AI Chat Gotchas

- **AI Chat button missing is a common DUG question** — users frequently can't find the AI Chat button even after confirming AI is enabled and grants are correct. Root causes (in order of likelihood):
  1. **Old navigation layout** — AI Chat icon only appears in the new left-side navigation (rolled out Aug 2025). If instance is on old top navigation, the button won't show. Admin enables new nav via `Admin > Feature Management`
  2. **Consumption agreement required** — AI Chat and AI Readiness docs state: "available to users on a consumption agreement; non-consumption customers can request a trial via their CSM." If the instance is on traditional subscription, the feature isn't provisioned even with all settings/grants correct. CSM must enable it. **Confirmed in practice (2026-07-15):** a DUG member with all settings/grants correct still had no AI Chat button until their CSM enabled backend provisioning.
  3. **No model provider configured** — check `Admin > AI Service Layer > AI Agent Settings` for Default Model Provider, and `Admin > AI Service Layer > Services` for Chat Completion service having a model assigned
  4. **Generative AI not actually toggled on** — `Admin > AI Service Layer > AI Settings` > "Generative AI Enabled for Instance" must be ON
- **Troubleshooting order**: check nav layout → check AI Settings toggle → check model provider → check grants → escalate to CSM for entitlement/consumption agreement
- **Mobile app workaround** — AI Chat is available in the Domo mobile app (More > AI) without grants, good for testing data/AI Readiness setup while web UI issues are sorted
- **Key docs**: Use AI Chat (https://www.domo.com/docs/s/article/000005539), AI Readiness (https://www.domo.com/docs/s/article/000005561), AI Admin Settings (https://www.domo.com/docs/s/article/AI-Admin-Settings), AI Admin Agent Settings (https://www.domo.com/docs/s/article/AI-Admin-Agent-Settings)
