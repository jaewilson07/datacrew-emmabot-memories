---
name: write-dev-docs
description: Plan and write developer documentation that developers actually finish reading. Load BEFORE writing or rewriting any technical doc — guides, tutorials, READMEs, module docstrings intended for publication. Encodes the Twilio docs research and Jae's define-before-use rule. NOT for internal agent-facing notes (AGENTS.md, runbooks) or Slack answers.
---

# Writing Developer Docs

Documentation is a **product**, not a supplement. Readers arrive mid-task, impatient, from Google — they skim for executable answers and leave if the page makes them work. Write for that reader.

## Step 0 — Plan before writing (mandatory)

Answer these in your head or in a scratch note BEFORE drafting. If you can't, stop and research first.

1. **Reader & entry state** — who lands on this page, what do they already know, what were they just trying to do? Never assume knowledge beyond the stated prerequisites.
2. **Page job** — pick ONE content type (below). A page that blends types does none well.
3. **Done state** — what can the reader DO after this page that they couldn't before?
4. **Concept inventory** — list every concept/term/tool the draft will reference. Each one must be defined, linked, or listed in prerequisites *before first use*.

## Content types — one job per page

| Type | Job | Shape |
|------|-----|-------|
| **Quickstart** | Fastest path to working code | install → minimal runnable example → expected output → "where next" |
| **How-to guide** | Solve one specific problem | problem statement → prerequisites → numbered steps → verification → troubleshooting |
| **Tutorial** | Teach by building something real | what we'll build → concepts introduced *as needed* → complete runnable code at every step |
| **Concept / explanation** | Build a mental model | what it is → why it exists → how it relates to siblings → when you'd care |
| **Reference** | Exhaustive lookup | generated from source/spec where possible; no narrative |

## The page anatomy (predictable = trustworthy)

Twilio's rule: if a developer knows one page, they know them all. Every guide follows this order:

1. **What + why, two sentences** — what this is, what problem it solves. No throat-clearing.
2. **Prerequisites** — exact dependencies, accounts, credentials, prior pages. Spell out every library and tool.
3. **The primary CTA / runnable example** — code comes first; a complete copy-paste-run example before any deep explanation. Each code block gets a one-line description of what it does.
4. **How it works** — the concepts, *after* the reader has seen the thing work.
5. **Verification** — how to confirm it worked (expected output, a `who_am_i()`-style check).
6. **Troubleshooting** — the 2-4 most likely failures, each with cause + fix.
7. **Where next** — explicit links, no dead ends.

## Hard rules

- **Define before use.** Never reference a concept before explaining WHAT it is and WHY it exists. (Jae's correction, 2026-10-12: "you talk about get_data ... before describing what get_data is, and why it exists.") If section 3 needs a concept, it gets defined in section 3's prerequisites or earlier — or the page reorders.
- **Code is the narrative.** Developers come for executable solutions; long narratives are the lowest-performing doc pattern (Twilio user research: +30% completion for sub-20-minute tutorials, +12% for less copy). Every claim that could be a runnable example should be one.
- **Explicitness over brevity.** Spell out dependencies, imports, auth requirements, file locations. Assumed knowledge is where readers silently bounce.
- **Examples must run.** Verify every code sample against the real API/signatures before shipping. An example that doesn't run is worse than none.
- **No dead ends, no orphan terms.** Every page links onward; every proper noun links or defines on first use.
- **Stable names.** crew-dcs was formerly **domolibrary** — mention once where relevant ("crew-dcs (formerly domolibrary)"), then use crew-dcs consistently.

## Crosslink sources (crew-dcs docs)

- **Official Domo docs**: resolve canonical URLs from the local clone `~/GitHub/domo-documentation-hub` — slugs are .mdx filenames (`portal/1845fc11bbe5d-api-authentication.mdx` → `...1845fc11bbe5d-api-authentication`). NEVER guess a developer.domo.com permalink. KB articles: `s/article/<id>.mdx`.
- **DataCrew YouTube**: youtube.com/@datacrew — link relevant tutorials from guides (check the video exists/topic matches first).
- **Internal**: link sibling guides and the API reference; the reference composes from module docstrings, so concept docs belong in docstrings, guides in apidocs/guides/.

## Final pass — read as the reader

Before shipping, re-read the draft AS the target reader:
- [ ] Every term defined/linked before first use?
- [ ] Could I run the first code block within 5 minutes of landing?
- [ ] Any paragraph that assumes context from another page without linking it?
- [ ] Sections in anatomy order — nothing "jumps around"?
- [ ] Every code block has its one-line purpose?

Detail: [[reference/twilio-docs-research.md]] for the full research digest.
