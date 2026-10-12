---
description: Distilled research (2026-10-12) on how Twilio builds developer documentation — docs-as-product principles, content-type discipline, page anatomy — for use when writing crew-dcs and other technical docs.
---
# Twilio Documentation Research (gathered 2026-10-12)

Distilled from Twilio's own blog + third-party analyses. Reference standard for writing crew-dcs / DataCrew technical docs. Related standing rule (Jae's define-before-use feedback) → [[system/gotchas.md]].

## Core principles

- **Docs are a PRODUCT, not a supplement** — docs-as-code workflow; copy-paste-run samples are tested; API reference is generated from OpenAPI spec so it never drifts.
- **CODE COMES FIRST** — developers come for executable solutions; narrative how-tos are the lowest-performing content model. Twilio measured **+30% tutorial completion** when completable in under 20 minutes, **+12% with less copy**.
- **EXPLICITNESS** — spell out every library, feature, and dependency; never assume reader knowledge.
- **CONTENT TYPES have distinct jobs — don't blend them:**
  - **quickstart** — fastest path to working code
  - **tutorial** — full sample app, contextual depth
  - **concept** — mental model
  - **API reference** — generated from spec
- **PREDICTABILITY** — same page structure across all products ("if you know one page, you know them all"); visible IA/nav; obvious "what to do next".

## Page anatomy (observed on Twilio product pages)

1. 2-sentence what + why
2. Immediate primary CTA
3. Runnable, annotated code sample
4. Numbered concrete benefits
5. "Get started" with 2 paths (hosted template vs local CLI)
6. Concepts AFTER doing
7. Related-products crosslinks at the bottom

## Details worth copying

- Code blocks carry a **one-line description attribute** stating the block's purpose.
- Feedback loop beyond GA metrics; performance/accessibility treated as features (Lighthouse 100).

## Sources

- twilio.com/en-us/blog/developers/new-era-for-twilio-documentation
- decibel.vc/articles/lessons-from-twilio-how-to-build-developer-loyalty-with-docs-and-dev-ed
- pronovix.com/blog/5-things-learn-twilios-documentation-overhaul
- document360.com/blog/twilio-knowledge-base-best-practices
- twilio.com/docs/serverless/functions-assets (page anatomy observed directly)
