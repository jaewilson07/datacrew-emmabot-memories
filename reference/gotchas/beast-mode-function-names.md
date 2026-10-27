---
description: Beast Mode function-name verification — verify against the Functions Reference Guide before citing; userAttribute() doesn't exist in Domo (Tableau's USERATTRIBUTE).
---

# Gotcha: Function Name Hallucination (Beast Mode / Domo functions)

## What Happened

In a DUG thread about conditional Column PDP (2026-09-14), I suggested "you can even use
`userAttribute()` in a Beast Mode." Elliott then asked what `userAttribute()` is — and it
doesn't exist in Domo. I had conflated Domo with Tableau's `USERATTRIBUTE()` /
`USERATTRIBUTEINCLUDES()` functions. I had to correct myself in-thread.

## The Rule

**Never cite a Domo function name from memory alone.** Before naming a function in an
answer, verify it against the official reference:

- Beast Mode functions: https://www.domo.com/docs/s/article/360043429933 (Functions
  Reference Guide)
- If the function isn't in the reference guide, it doesn't exist — say so plainly.

## Why the Confusion Happens

- Other BI tools DO have user-context functions (Tableau's USERATTRIBUTE, Omni's
  `{{omni_attributes.*}}` mustache syntax). Cross-tool pattern-matching makes these feel
  like they "should" exist in Domo.
- Domo's answer to "read user context at view time" is architectural, not a function:
  user context is evaluated in the **policy layer** (Dynamic PDP, dynamic groups, Column
  PDP masking) — Beast Mode only ever sees the already-filtered data. There is no
  Beast Mode equivalent of Tableau's USERATTRIBUTE.
- Community has asked for it (community-forums.domo.com/main/discussion/64741) with no
  authoritative doc answer — a flagged doc gap.

## If a Member Genuinely Needs Per-User Logic in a Card

- Security use case → policy layer: Dynamic PDP / dynamic groups / Column PDP.
- Non-security presentation logic → "user context" dataset (user → attribute table)
  joined in, filtered at page level — but be clear it's bypassable and not a security
  control.
