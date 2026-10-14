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

## AI Services API — chat endpoints (verified from OpenAPI spec, 2026-10-14)

Verified from `openapi/product/AI-Services.yaml` in `~/GitHub/domo-documentation-hub` — the source for the published developer portal AI Services API reference (docs.json maps the yaml endpoints into portal navigation).

- `POST /api/ai/v1/messages/chat` (Chat Messages) and `POST /api/ai/v1/messages/tools` (Tool Calling) — the native multi-turn chat API. Auth: X-DOMO-Developer-Token (Product API, NOT OAuth client).
- Request: `input` = array of Message objects (role USER/ASSISTANT, content blocks: TEXT/IMAGE/DOCUMENT/TOOL_USE_REQUEST/TOOL_USE_RESULT), plus optional `sessionId`, `system` array, `model`, `temperature`, `maxTokens`, `responseFormat`, `reasoningConfig`.
- Response: `content` blocks, `modelId` (e.g. `domo.domo_ai.domogpt-medium-v1.2:anthropic`), `isCustomerModel`, `sessionId`, `requestId`, `stopReason` (TOOL_USE/MAX_TOKENS/STOP_SEQUENCE/END_TURN/CONTENT_FILTERED/SAFETY/UNKNOWN).
- `sessionId` = Domo's conversation-ID analog — "The unique identifier for the AI session associated with this request" — BUT the spec never documents whether the server recalls history by sessionId. The multi-turn tool-calling example resends the ENTIRE conversation in `input` each call → treat history as client-managed. Doc gap flagged 2026-10-14.
- Tool calling is Anthropic-style: tools array with name/description/parameters (JSON Schema), toolChoice AUTO; loop driven by stopReason TOOL_USE; client executes tools and sends back TOOL_USE_RESULT blocks.
- Custom chat-harness architecture for apps: Domo Brick/custom component UI → Code Engine package backend (in-app: `/domo/codeengine/v2/packages/{alias}`) → AI Services chat endpoint → persist history in AppDB keyed by user/session.
- Citable doc URL: https://www.domo.com/docs/portal/API-Reference/Product-APIs/AI-Services
- The local OpenAPI spec at `~/GitHub/domo-documentation-hub/openapi/product/AI-Services.yaml` is greppable ground truth for the full AI API surface (also: text generation, text-to-sql, text-to-beastmode, summarize, sentiment, classification, embeddings, image-to-text, data extraction beta).
