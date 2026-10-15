---
description: Pattern — when Elliott Leonard (@egleonard88) asks a tactical question in DUG, backward-engineer the hidden customer pain, propose an article angle to Jae before drafting, then write business-pressure-first (never clickbait).
---
# Pattern: Elliott question → inferred pain → article pipeline

## Symptom

Elliott Leonard (@egleonard88, "Ellibot") posts a tactical how-to question in DUG.
The question reads as a standalone mechanics question, but it never is one.

## Mechanism

Elliott is a Solutions Consultant at Domo. When he builds something, it is for a
customer with a need — "because he NEVER tells us" the underlying pain. The tactical
question is the visible tip of a customer engagement: some business pressure pushed a
customer to ask Elliott, and Elliott's DUG question is that pressure, stripped of its
context. Answering only the mechanics wastes the signal; the pain behind the question
is the article topic.

## Diagnostic sequence

1. **Recognize the asker.** Question comes from @egleonard88 — trigger this pipeline,
   not a plain mechanics answer.
2. **Infer the customer pain, explicitly.** Write the inference down in words: what
   business problem or pressure would make a customer ask Elliott this?
3. **Propose before drafting.** Take the inferred pain + a candidate article angle to
   Jae, in-thread or DM. This is a cheap checkpoint — the Workbench article needed
   heavy editorial iteration, so propose before writing, not after.
4. **On green light, draft** per the upsert-article rules.
5. **Publish with Elliott editor-shared** on the working doc. His email is in his
   users/ profile.

## Support rule

Backward-engineer the customer need from the question, then "write a fuller article
or brief around the topic." Framing rule, verbatim: "the goal is never to write
anything click-baity, it's more ... hey 'here's a business problem or pressure a
small team using Domo or wanting to use domo is facing, how can we devise a solution
(ideally powered by domolibrary'". So: business-pressure-first, solution-oriented,
domolibrary/crew-dcs showcased where natural, never clickbait. Always propose the
inferred pain + angle to Jae before drafting.

## Instances

- **Proven (2026-10-15):** Workbench → Stream API question → inferred pain:
  "established customer modernizing pipelines into an orchestration stack, needs
  dataset continuity" → article "Retiring Workbench (Without Starting Over)", live
  2026-10-15 at datacrew.space/blog/retiring-workbench-stream-api-migration.
  Gate outcome (IdrisBot, verified against live text): Jae's pre-publish editing
  pass removed both flagged items (strong takeover claim, invented deauth
  anecdote); footer attribution "The bots wrote it; Jae reviewed it" is the
  validated honest-origin pattern.
- **Next candidate:** App Studio AI-chat button + sessionId/history questions →
  candidate pain: "customer wants conversational AI embedded in their Domo app for
  end users; what does Domo give you vs build-your-own."

---

Source: Jae's spec, 2026-10-15, DUG thread 1791994555.561209. Elliott is named in
this file deliberately, against the usual strip-identifying-info rule — the asker's
identity is the trigger for this pattern, and he is already tracked in
[[reference/community-contacts.md]].
