---
description: Pattern — when asked to look up / check / find a person or bot by an informal name, run the nickname test against accounts already in context BEFORE hunting for a separate entity. Born from a 2026-10-15 incident.
---
# Pattern: nickname test before search

## Symptom

> "check Elibots profile"

The general shape: "look up / check / find <name>" where <name> is an informal name —
a nickname, pluralized variant, or casual label — not a verified handle. The phrasing
sounds like a lookup request for a new entity, so the temptation is to go hunt for that
entity.

## Mechanism

People refer to accounts by informal names, and the target is often already in context:
a thread participant, a known member, or the very account just at-mentioned. A nickname
applied to a known account ("Ellibot" for Elliott's own account) looks identical in text
to the name of a separate entity that should be searched for. If the resolution step is
skipped, the search runs against directories and sources for an entity that does not
exist, and returns "not found" — a wrong answer delivered with confidence, after real
work.

## Diagnostic sequence

1. **Notice the shape.** A lookup request naming a person or bot by a name that isn't a
   confirmed handle — especially one resembling a known account's name with a twist.
2. **Run the nickname test FIRST.** Compare the name against accounts already in context:
   the thread's participants, known members, the account just at-mentioned or whose
   profile was just pulled. Allow for pluralization, possessives, and pet-name variants.
3. **Only then search externally.** If no in-context account matches, hunt directories,
   member lists, and other sources for the separate entity.
4. **On "not found," loop back.** Re-examine whether the target was hiding in plain sight
   under an informal name before reporting the miss.

## Support rule

Nickname test before search: resolve the name against the accounts already in context
FIRST, then hunt for a separate entity. If a lookup returns "not found," re-examine
whether the target was hiding in plain sight under an informal name before reporting
not-found.

**This pattern exists because of a worked incident (2026-10-15):** Jae said "check
Elibots profile"; "Ellibot" was his nickname for Elliott Leonard's own account
(U02A66525ND / egleonard88) — the exact profile I had already pulled. I ran a two-agent,
four-source hunt for a nonexistent separate bot and reported "not found." Jae was amused,
not angry, but the correct first move was resolving the name against the thread's known
accounts.

The nickname test costs one comparison and prevents a multi-source wild goose chase plus
a confident wrong "not found." Generalize: any "look up <informal name>" — resolve
against context first, search second.
