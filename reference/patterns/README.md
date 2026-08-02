---
description: How to write a diagnostic pattern — the Symptom → Mechanism → Diagnostic → Support rule format, and how patterns differ from gotchas.
---
# Diagnostic Patterns

A **pattern** is a recurring question shape and the procedure for working it. Not a fact — a
method. Adopted from [[reference/ezra-memory-architecture.md]] (principle 3).

## Pattern vs. gotcha — don't blur these

| | `reference/gotchas/` | `reference/patterns/` |
|---|---|---|
| Holds | facts and traps | procedures |
| Answers | "what is true?" | "how do I work this out?" |
| Shape | a list of statements | four fixed sections |
| Scope | one product surface | one *question shape*, across surfaces |
| Written when | I learned something | I answered the same shape three times |

Patterns cite gotchas. Gotchas never cite patterns. If a thing is a single fact, it is a
gotcha — do not inflate it into a pattern.

## The four sections

Every pattern file has exactly these, in this order:

### Symptom
What the member actually says, in their words. Not the diagnosis. Members do not report
"my instance lacks backend provisioning" — they report "I don't see the button." Write the
sentence I will pattern-match against.

### Mechanism
Why it happens. The layer or model that makes the symptom possible. This is the part that
generalizes — a member who understands the mechanism can diagnose the next variant alone.

### Diagnostic sequence
Ordered, cheapest-and-most-reversible first. Each step states what to check and what the
result rules out. The sequence must terminate — the last step is what to do when everything
checkable has been checked, which is often "escalate," not "keep looking."

### Support rule
The standing instruction for me. What I do, what I do not do, and what I say when the
sequence runs out. This is where a past correction becomes a positive procedure rather than
a note about a mistake.

## When to write one

Three signals, any one is enough:

1. **Third time** — I have answered this shape three times for different members.
2. **Public correction** — I gave wrong advice in channel and someone corrected me. The
   correction becomes the Support rule. Convert it into what to check next time; do not
   write a shame narrative.
3. **Dead end** — a member spent real time chasing something that could not have worked.
   The pattern exists to end that search on the first reply next time.

## Rules

- **Strip identifying information.** Extract the lesson, discard who and which instance.
  Names, instance IDs, and workspace URLs belong in neither this directory nor a commit
  message. The detailed gotcha file may keep a dated attribution; the pattern must not.
- **One question shape per file.** If the Symptom section needs "or", it is two patterns.
- **Cite, don't restate.** Link the gotcha or doc reference with `[[path]]`. When a Domo
  fact changes, the gotcha file is the single place to fix it.
- **Only verified facts.** Every Domo claim traces to a doc link, a gotcha file, or an
  observation I confirmed in practice. Mark confirmations with a date. If I am reasoning
  rather than reporting, say so in the text — do not launder a guess into a procedure.
- **Add a line to [[system/patterns.md]]** when adding a file here, or it will never load.
