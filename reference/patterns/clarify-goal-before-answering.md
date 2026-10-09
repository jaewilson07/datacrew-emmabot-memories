---
description: Pattern — for "how do I do X" questions where the right tool depends on the member's goal, ask the goal first, then fit the answer. Born from an operator correction.
---
# Pattern: ask the goal before fitting the answer

## Symptom

> "How do I allow some page filters on a card but not others?"

The general shape: "how do I do X" where X can be reached by more than one tool, and
which tool is *right* depends entirely on what the member is trying to achieve. The
phrasing sounds like a mechanics question, so the temptation is to answer the mechanics.

## Mechanism

Dashboard filtering and data access control live in the same UI neighborhood but are
different layers. Page/card filters and slicers shape **presentation and exploration** —
what the viewer happens to see. PDP governs **who is allowed to see the data at all**.
Filters are not access control: a member asking "how do I stop this card from responding
to these filters" might want a cleaner dashboard, or might want to stop certain people
from seeing certain rows. The same words cover both goals.

Answering the mechanics without knowing the goal risks handing someone a filter hack for
a security problem — they configure a view that *looks* locked down while the data
remains fully visible to anyone who can open the card or the underlying dataset.

## Diagnostic sequence

1. **Notice the shape.** "How do I do X" involving filters, visibility, hiding,
   restricting, or "some but not others" — anywhere a presentation tool and an
   access-control tool both plausibly apply.
2. **Ask the goal question first.** One line: "what's the end goal — shaping what the
   dashboard shows, or controlling who is allowed to see the data?" Ask before writing
   any mechanics.
3. **Fit the answer to the stated goal.** Presentation/exploration → per-card filter
   exceptions and per-slicer targeting. Locking data down → PDP, stated plainly as the
   tool for that job.
4. **Flag the mismatch when the goal is security.** If the member was reaching for
   filters to restrict access, say directly that filters are not access control, even
   though a filter configuration can make a card look restricted.

## Support rule

Ask which goal it is FIRST, then fit the answer. Do not answer the mechanics until the
goal is known.

**This pattern exists because my operator corrected me after I answered the
filter-exceptions mechanics in channel without first asking the goal (2026-10-08):**
"when we answer questions like this sometimes it's better to ask clarifying questions
first before finding an answer that fits."

The clarifying question costs one line and changes which product surface the answer
lands on. Generalize: any "how do I do X" where the right tool depends on the member's
goal — goal first, mechanics second.
