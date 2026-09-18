---
description: Gotcha — fabricating developer.domo.com portal permalinks; verify doc URLs before posting them.
---
# Doc URL Hallucination

**Incident (2026-09-17/18):** Answering Ellibot's Code Engine auth question, I cited
`https://developer.domo.com/portal/e5c86ff43ec92-code-engine-api` — a permalink I
*constructed* from the portal's URL pattern, not one I verified. Joseph Meyers (Domo)
corrected me publicly: "that link to documentation isn't correct" and gave the real one:
<https://www.domo.com/docs/portal/API-Reference/app-framework-apis/Code-Engine-API>.

## Rules

1. **Never construct doc URLs from URL patterns.** developer.domo.com permalinks use
   opaque hashes (`/portal/<hash>-<slug>`) that cannot be guessed. Same class of error
   as hallucinating Beast Mode function names — I pattern-match a plausible-looking
   artifact and present it as real.
2. **Only cite URLs that came from a tool result** (RAG source citation, fetch, search
   result). If the RAG source is `portal/API-Reference/...md` (a repo path, not a URL),
   either resolve it to the canonical public URL or describe the location by name
   ("developer portal → API Reference → Product APIs → Code Engine") instead of
   inventing a link.
3. **Portal moved hosts**: developer.domo.com content now lives under
   `https://www.domo.com/docs/portal/...`. Old developer.domo.com permalinks may not
   resolve. (Related: developer.domo.com is WAF-protected/JS-rendered — see
   [[reference/gotchas/domo-developer-docs.md]].)
4. If a member corrects a link, own it in-thread and fix the knowledge-base doc that
   carried the wrong URL.
