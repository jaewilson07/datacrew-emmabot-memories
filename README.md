# EmmaBot Memory Repository

Memory for **EmmaBot** (DataCrew community bot for DUG Slack). Previously shared a GitHub remote with DataCrew and IdrisBot; now uses a dedicated repo.

## Structure

```
├── system/              # Always-on context (system prompt blocks)
│   ├── persona.md       # Who I am and how I show up
│   ├── identity.md      # Who I represent and my boundaries
│   ├── human.md         # The community I serve
│   ├── priorities.md    # My mission
│   ├── platform.md      # Where I run and what tools I have (compact routing layer)
│   ├── gotchas.md       # Compact index of gotchas (links to reference/gotchas/)
│   └── patterns.md      # Compact index of patterns (links to reference/patterns/)
├── reference/           # On-demand knowledge (loaded when relevant)
│   ├── gotchas/         # Detailed gotchas split by topic — facts
│   ├── patterns/        # Diagnostic patterns split by question shape — procedures
│   ├── agentic-patterns/ # Claude API patterns from Anthropic cookbooks
│   ├── mcp-server.md    # DataCrew MCP server connection details
│   ├── platform-skills.md # Available skills listing
│   ├── domo-doc-references.md # Verified Domo doc links
│   ├── domo-embed-docs.md    # Domo App Studio embedding docs
│   ├── domo-python-sdks.md   # crew-dcs and domolibrary reference
│   ├── domo-sftp-pgp.md      # SFTP PGP support — import-side decryption only
│   ├── community-contacts.md # DUG members I've interacted with
│   └── ezra-memory-architecture.md # Ezra's patterns I adopted
├── skills/              # Agent-owned skills (travel with the agent)
│   ├── letta-self-update/
│   └── teach/
├── archives/            # Deduplicated/outdated content kept for reference
└── .gitignore           # Privacy-first exclusions
```

## Architecture Principles

Adopted from [Ezra's memory architecture](https://github.com/letta-ai/ezra):

1. **Aggressive progressive disclosure** — `system/` files are compact routing layers; details live in `reference/`
2. **Placement test** — before adding to `system/`: is it durable, frequently needed, and global? If no → `reference/`
3. **Archive, don't delete** — when deduplicating or removing outdated content, move to `archives/`
4. **One focused purpose per file** — each memory file has a single topic
5. **Frontmatter descriptions** — every file has `---description: ...---` for discoverability
6. **Privacy-first** — `.gitignore` excludes users/, conversations, secrets, .letta/
7. **Correction as system design** — when I get something wrong, convert it into a positive
   procedure: what to check, what to do next time, and where the rule belongs. Corrections
   become patterns, not shame narratives. See [[reference/patterns/README.md]]

## Sync

- **Primary remote (origin):** Letta Cloud git — used by the Letta Code harness
- **This remote (github):** Dedicated EmmaBot repo (`datacrew-emmabot-memories.git`) — separate from DataCrew and IdrisBot
- Push to both: `git push origin HEAD && git push github HEAD:master`
