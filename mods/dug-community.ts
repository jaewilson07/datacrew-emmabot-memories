/**
 * DUG Community mod — doc gap escalation + per-member continuity.
 *
 * Core loop: when I answer a Domo question and there's a gap in documentation
 * (I got it wrong, or the answer wasn't in the docs), I flag it immediately —
 * not after N occurrences. Every doc gap gets escalated to Jae with the thread
 * link, then we create or extend documentation in knowledge-base to close the gap.
 *
 * Tools (agent-callable):
 *   - flag_doc_gap         — flag a documentation gap immediately after encountering one
 *   - get_doc_gaps         — review all open doc gaps (unaddressed)
 *   - resolve_doc_gap      — mark a doc gap as resolved (documentation created)
 *   - get_user_profile     — read a community member's profile from users/
 *   - update_user_profile  — create or update a member's profile in users/
 *
 * Commands (human-invoked):
 *   - /docgaps             — show open documentation gaps
 *
 * Events:
 *   - turn_start           — surfaces unaddressed doc gaps as a system reminder
 *
 * State:
 *   ~/.letta/mods/dug-community-state.json — doc gap log
 *   $MEMORY_DIR/users/<handle>.md          — per-member profiles (git-ignored)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

// --- State management ----------------------------------------------------

const STATE_FILE = join(homedir(), ".letta", "mods", "dug-community-state.json");

interface DocGap {
  id: string;
  topic: string;
  questionShape: string;
  whatWasWrong: string;
  docGapDescription: string;
  threadLink: string | null;
  channel: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  status: "open" | "reviewing" | "resolved";
  resolutionPath: string | null;
  resolvedAt: string | null;
}

interface ModState {
  docGaps: DocGap[];
}

function loadState(): ModState {
  try {
    if (existsSync(STATE_FILE)) {
      const raw = readFileSync(STATE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return { docGaps: Array.isArray(parsed.docGaps) ? parsed.docGaps : [] };
    }
  } catch {
    // fall through to empty state
  }
  return { docGaps: [] };
}

function saveState(state: ModState): void {
  try {
    writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  } catch (err) {
    console.error("[dug-community] Failed to save state:", err);
  }
}

// --- User profile management ---------------------------------------------

function getUsersDir(memoryDir: string): string {
  return join(memoryDir, "users");
}

function getProfilePath(memoryDir: string, handle: string): string {
  const safe = handle.toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return join(getUsersDir(memoryDir), `${safe}.md`);
}

function readProfile(memoryDir: string, handle: string): string | null {
  const path = getProfilePath(memoryDir, handle);
  try {
    if (existsSync(path)) {
      return readFileSync(path, "utf-8");
    }
  } catch {
    // ignore
  }
  return null;
}

function writeProfile(memoryDir: string, handle: string, content: string): void {
  const dir = getUsersDir(memoryDir);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const path = getProfilePath(memoryDir, handle);
  writeFileSync(path, content);
}

// --- Helpers --------------------------------------------------------------

function getMemoryDir(): string {
  return process.env.MEMORY_DIR || join(homedir(), ".letta", "agents", "agent-5afcfa48-81d3-430f-87fe-0a814fecff7e", "memory");
}

function getKnowledgeBaseDir(): string {
  return process.env.KNOWLEDGE_BASE_DIR || "/home/jaewilson07/GitHub/knowledge-base";
}

function generateId(): string {
  return `gap-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getOpenGaps(state: ModState): DocGap[] {
  return state.docGaps.filter((g) => g.status === "open" || g.status === "reviewing");
}

// --- mdrag ingestion -------------------------------------------------------

const CREW_DCS_DIR = "/tmp/crew-dcs";
const ENV_FILE = "/home/jaewilson07/GitHub/homeserver/.env";
const MDRAG_COLLECTION = "domo-official-docs";

function loadEnv(): Record<string, string> {
  try {
    const content = readFileSync(ENV_FILE, "utf-8");
    const env: Record<string, string> = {};
    for (const line of content.split("\n")) {
      const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (match) {
        env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
    return env;
  } catch {
    return {};
  }
}

function loadRagConfig(): { mdrag_mcp_url: string } | null {
  try {
    const path = join(homedir(), ".letta", "mods", ".domo_rag_config.json");
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return null;
  }
}

async function ingestToMdrag(
  filePath: string,
  title: string,
  tags: string[],
): Promise<{ success: boolean; message: string }> {
  const env = loadEnv();
  const token = env["DATACREW_API_TOKEN"];
  if (!token) {
    return { success: false, message: "DATACREW_API_TOKEN not found in env" };
  }

  const config = loadRagConfig();
  const mcpUrl = config?.mdrag_mcp_url || "https://wiki.datacrew.space/mcp/";
  const fileContent = readFileSync(filePath, "utf-8");

  const script = `
import json, sys, httpx

TOKEN = "${token}"
MCP_URL = "${mcpUrl}"
TITLE = ${JSON.stringify(title)}
TEXT = ${JSON.stringify(fileContent)}
COLLECTION = "${MDRAG_COLLECTION}"
TAGS = ${JSON.stringify(tags)}

headers = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/event-stream",
    "X-DC-Token": TOKEN,
}

with httpx.Client(timeout=120) as client:
    init = {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "dug-community", "version": "1.0"}}}
    res = client.post(MCP_URL, headers=headers, json=init)
    session_id = res.headers.get("mcp-session-id", "")
    if not session_id:
        print(json.dumps({"success": False, "message": "mdrag session init failed"}))
        exit()
    headers["Mcp-Session-Id"] = session_id
    client.post(MCP_URL, headers=headers, json={"jsonrpc": "2.0", "method": "notifications/initialized"})
    # Reveal rag toolset
    client.post(MCP_URL, headers=headers, json={"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "reveal_toolset", "arguments": {"name": "rag"}}})
    call = {"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "save_text_to_knowledge", "arguments": {"text": TEXT, "title": TITLE, "collection": COLLECTION, "source_label": "dug-community", "tags": TAGS}}}
    res = client.post(MCP_URL, headers=headers, json=call)
    text = res.text
    for line in text.split("\\n"):
        if line.startswith("data: "):
            data = json.loads(line[6:])
            content = data.get("result", {}).get("content", [])
            for item in content:
                if isinstance(item, dict) and item.get("type") == "text":
                    msg = item.get("text", "")
                    if "Error" in msg:
                        print(json.dumps({"success": False, "message": msg[:200]}))
                    else:
                        print(json.dumps({"success": True, "message": msg[:200]}))
                    exit()
    print(json.dumps({"success": False, "message": "no response from mdrag"}))
`;

  try {
    const { stdout } = await execFileAsync(
      "uv",
      ["run", "--with", "httpx", "python", "-c", script],
      { timeout: 120000 },
    );
    const result = JSON.parse(stdout.trim());
    return result;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `mdrag ingestion failed: ${msg}` };
  }
}

// --- Mod ------------------------------------------------------------------

export default function activate(letta: {
  capabilities: {
    tools?: boolean;
    commands?: boolean;
    events?: {
      lifecycle?: boolean;
      tools?: boolean;
      turns?: boolean;
      compact?: boolean;
      llm?: boolean;
    };
  };
  tools: {
    register: (tool: {
      name: string;
      description: string;
      parameters: Record<string, unknown>;
      requiresApproval: boolean;
      parallelSafe: boolean;
      run: (ctx: {
        args: Record<string, unknown>;
        cwd: string;
      }) => Promise<unknown>;
    }) => () => void;
  };
  commands: {
    register: (command: {
      id: string;
      description: string;
      args?: string;
      run: (ctx: {
        args: string;
        cwd: string;
        agent: { id: string; name?: string };
        conversation: {
          id: string | null;
          getHistory: (opts?: {
            limit?: number;
            order?: string;
            includeErrors?: boolean;
          }) => Promise<Array<{ role: string; content: string }>>;
        };
      }) => Promise<
        | { type: "prompt"; content: string; systemReminder?: boolean }
        | { type: "output"; output: string }
        | { type: "handled" }
      >;
    }) => () => void;
  };
  events: {
    on: (event: string, handler: (event: any, ctx: any) => unknown) => () => void;
  };
}) {
  const disposers: (() => void)[] = [];

  // === TOOLS ===

  if (letta.capabilities.tools) {
    // --- flag_doc_gap -----------------------------------------------------
    disposers.push(
      letta.tools.register({
        name: "flag_doc_gap",
        description:
          "Flag a documentation gap immediately after encountering one. Call this when: (1) you answered a Domo question and the answer wasn't in Domo docs, (2) you got an answer wrong or incomplete, (3) you had to piece together information from multiple sources because no single doc covered it. Every gap gets escalated to Jae — do not wait for a pattern. Include the Slack thread link so Jae can review the conversation.",
        parameters: {
          type: "object",
          properties: {
            topic: {
              type: "string",
              description: "Short topic label (e.g., 'SFTP PGP encryption', 'AppDB permissions', 'Beast Mode NULL handling')",
            },
            questionShape: {
              type: "string",
              description: "The generalized question pattern (e.g., 'how to encrypt data over SFTP', 'what does AppDB Write permission actually grant')",
            },
            whatWasWrong: {
              type: "string",
              description: "What went wrong — did you get the answer wrong? Was it incomplete? Did docs not cover it at all? Be honest.",
            },
            docGapDescription: {
              type: "string",
              description: "What's missing from Domo docs? What should be documented that isn't?",
            },
            threadLink: {
              type: "string",
              description: "Slack thread permalink if available (e.g., 'https://domo-user-group.slack.com/archives/.../p...')",
            },
            channel: {
              type: "string",
              description: "Slack channel name where the question was asked",
            },
            senderId: {
              type: "string",
              description: "Slack user ID of the person who asked",
            },
            senderName: {
              type: "string",
              description: "Display name of the person who asked",
            },
          },
          required: ["topic", "questionShape", "whatWasWrong", "docGapDescription", "channel", "senderId", "senderName"],
          additionalProperties: false,
        },
        requiresApproval: false,
        parallelSafe: false,
        async run(ctx) {
          const state = loadState();
          const entry: DocGap = {
            id: generateId(),
            topic: String(ctx.args.topic ?? ""),
            questionShape: String(ctx.args.questionShape ?? ""),
            whatWasWrong: String(ctx.args.whatWasWrong ?? ""),
            docGapDescription: String(ctx.args.docGapDescription ?? ""),
            threadLink: ctx.args.threadLink ? String(ctx.args.threadLink) : null,
            channel: String(ctx.args.channel ?? ""),
            senderId: String(ctx.args.senderId ?? ""),
            senderName: String(ctx.args.senderName ?? ""),
            timestamp: new Date().toISOString(),
            status: "open",
            resolutionPath: null,
            resolvedAt: null,
          };
          state.docGaps.push(entry);
          saveState(state);

          const openCount = getOpenGaps(state).length;
          const link = entry.threadLink ? `\n\nThread: ${entry.threadLink}` : "";
          return `Doc gap flagged: "${entry.topic}"\nWhat went wrong: ${entry.whatWasWrong}\nDoc gap: ${entry.docGapDescription}\nStatus: open (escalate to Jae)${link}\n\nOpen doc gaps: ${openCount}\n\nNext steps: DM Jae with the thread link and gap description. After review, create or extend documentation in knowledge-base/, then call resolve_doc_gap.`;
        },
      }),
    );

    // --- get_doc_gaps ------------------------------------------------------
    disposers.push(
      letta.tools.register({
        name: "get_doc_gaps",
        description:
          "Review all open documentation gaps. Returns gaps that haven't been resolved yet — each one needs to be escalated to Jae and then documented in knowledge-base/. Use this to check what's still outstanding.",
        parameters: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Filter by status: 'open' (default), 'reviewing', 'resolved', or 'all'",
            },
          },
          additionalProperties: false,
        },
        requiresApproval: false,
        parallelSafe: true,
        async run(ctx) {
          const state = loadState();
          const filter = ctx.args.status ? String(ctx.args.status) : "open";
          const gaps = filter === "all"
            ? state.docGaps
            : state.docGaps.filter((g) => g.status === filter);

          if (gaps.length === 0) {
            return `No doc gaps with status '${filter}'.`;
          }

          const lines = gaps.map((g) => {
            const link = g.threadLink ? `\n  Thread: ${g.threadLink}` : "";
            const resolution = g.resolutionPath ? `\n  Resolved: ${g.resolutionPath}` : "";
            return `• [${g.status}] "${g.topic}" (id: ${g.id})\n  Shape: ${g.questionShape}\n  What went wrong: ${g.whatWasWrong}\n  Doc gap: ${g.docGapDescription}\n  Asked by: ${g.senderName} in #${g.channel}\n  Flagged: ${g.timestamp}${link}${resolution}`;
          });

          return `Doc gaps (${gaps.length}, filter: ${filter}):\n\n${lines.join("\n\n")}`;
        },
      }),
    );

    // --- resolve_doc_gap ---------------------------------------------------
    disposers.push(
      letta.tools.register({
        name: "resolve_doc_gap",
        description:
          "Mark a documentation gap as resolved. Call this after you've created or extended documentation in knowledge-base/ to address the gap. Records the file path where the documentation was added. Automatically ingests the doc into mdrag so all agents can find it via domo_rag_query.",
        parameters: {
          type: "object",
          properties: {
            gapId: {
              type: "string",
              description: "The doc gap ID returned by flag_doc_gap",
            },
            resolutionPath: {
              type: "string",
              description: "Path to the documentation file created or extended (e.g., 'domo/gotchas/full-page-card.md')",
            },
            notes: {
              type: "string",
              description: "Optional notes on what was documented",
            },
          },
          required: ["gapId", "resolutionPath"],
          additionalProperties: false,
        },
        requiresApproval: false,
        parallelSafe: false,
        async run(ctx) {
          const gapId = String(ctx.args.gapId ?? "").trim();
          if (!gapId) return { status: "error", content: "gapId is required" };

          const state = loadState();
          const gap = state.docGaps.find((g) => g.id === gapId);
          if (!gap) return { status: "error", content: `Doc gap ${gapId} not found` };

          gap.status = "resolved";
          gap.resolutionPath = String(ctx.args.resolutionPath);
          gap.resolvedAt = new Date().toISOString();
          saveState(state);

          // Ingest the doc into mdrag so all agents can find it via domo_rag_query
          const kbDir = getKnowledgeBaseDir();
          const fullPath = join(kbDir, gap.resolutionPath);
          let ingestionResult = "";
          try {
            if (existsSync(fullPath)) {
              const title = gap.topic;
              const tags = ["dug-community", "doc-gap", ...gap.topic.toLowerCase().split(/\s+/)];
              const result = await ingestToMdrag(fullPath, title, tags);
              ingestionResult = result.success
                ? `\nmdrag ingestion: success — ${result.message}`
                : `\nmdrag ingestion: failed — ${result.message}`;
            } else {
              ingestionResult = `\nmdrag ingestion: skipped (file not found at ${fullPath})`;
            }
          } catch (err) {
            ingestionResult = `\nmdrag ingestion: error — ${err instanceof Error ? err.message : String(err)}`;
          }

          const notes = ctx.args.notes ? `\nNotes: ${String(ctx.args.notes)}` : "";
          return `Doc gap resolved: "${gap.topic}"\nDocumentation: ${gap.resolutionPath}\nResolved at: ${gap.resolvedAt}${notes}${ingestionResult}`;
        },
      }),
    );

    // --- get_user_profile -------------------------------------------------
    disposers.push(
      letta.tools.register({
        name: "get_user_profile",
        description:
          "Read a DUG community member's profile from the users/ directory. Returns their profile markdown if it exists, or null if they don't have one yet. Use this at the start of a conversation with a community member to recall their context.",
        parameters: {
          type: "object",
          properties: {
            handle: {
              type: "string",
              description: "Slack handle/username of the community member (without the @)",
            },
          },
          required: ["handle"],
          additionalProperties: false,
        },
        requiresApproval: false,
        parallelSafe: true,
        async run(ctx) {
          const handle = String(ctx.args.handle ?? "").trim();
          if (!handle) return { status: "error", content: "handle is required" };

          const memoryDir = getMemoryDir();
          const profile = readProfile(memoryDir, handle);
          if (!profile) {
            return `No profile found for @${handle}. Use update_user_profile to create one.`;
          }
          return profile;
        },
      }),
    );

    // --- update_user_profile ---------------------------------------------
    disposers.push(
      letta.tools.register({
        name: "update_user_profile",
        description:
          "Create or update a DUG community member's profile in the users/ directory. Use this when you learn something new about a member — their name, what they're working on, skill level, preferences, or notable interactions. Files are git-ignored (private). Call this when: (1) a member asks their first question, (2) you learn new context about a member, (3) a member's focus or skill level changes.",
        parameters: {
          type: "object",
          properties: {
            handle: {
              type: "string",
              description: "Slack handle/username (without the @)",
            },
            name: {
              type: "string",
              description: "Real name (with spelling notes if tricky)",
            },
            domoFocus: {
              type: "string",
              description: "What they work on in Domo (datasets, projects, use cases)",
            },
            skillLevel: {
              type: "string",
              description: "new / intermediate / advanced",
            },
            knownContext: {
              type: "string",
              description: "What they've asked about, what they already know",
            },
            preferences: {
              type: "string",
              description: "How they like answers (code examples, prose, links, etc.)",
            },
            historyNote: {
              type: "string",
              description: "A notable interaction to log (will be appended to history)",
            },
          },
          required: ["handle"],
          additionalProperties: false,
        },
        requiresApproval: false,
        parallelSafe: false,
        async run(ctx) {
          const handle = String(ctx.args.handle ?? "").trim().toLowerCase();
          if (!handle) return { status: "error", content: "handle is required" };

          const memoryDir = getMemoryDir();
          const existing = readProfile(memoryDir, handle);

          const name = ctx.args.name ? String(ctx.args.name) : "";
          const domoFocus = ctx.args.domoFocus ? String(ctx.args.domoFocus) : "";
          const skillLevel = ctx.args.skillLevel ? String(ctx.args.skillLevel) : "";
          const knownContext = ctx.args.knownContext ? String(ctx.args.knownContext) : "";
          const preferences = ctx.args.preferences ? String(ctx.args.preferences) : "";
          const historyNote = ctx.args.historyNote ? String(ctx.args.historyNote) : "";

          if (existing && !historyNote) {
            const content = buildProfileContent(handle, name, domoFocus, skillLevel, knownContext, preferences, "");
            writeProfile(memoryDir, handle, content);
            return `Profile updated for @${handle}`;
          }

          if (existing && historyNote) {
            const timestamp = new Date().toISOString().slice(0, 10);
            const note = `- ${timestamp}: ${historyNote}`;
            const updated = existing.trimEnd() + "\n" + note + "\n";
            writeProfile(memoryDir, handle, updated);
            return `History note added to @${handle}'s profile`;
          }

          const content = buildProfileContent(handle, name, domoFocus, skillLevel, knownContext, preferences, historyNote ? `- ${new Date().toISOString().slice(0, 10)}: ${historyNote}` : "");
          writeProfile(memoryDir, handle, content);
          return `Profile created for @${handle}`;
        },
      }),
    );
  }

  // === COMMANDS ===

  if (letta.capabilities.commands) {
    // --- /docgaps ----------------------------------------------------------
    disposers.push(
      letta.commands.register({
        id: "docgaps",
        description: "Show open documentation gaps flagged from DUG Slack conversations",
        async run() {
          const state = loadState();
          const open = getOpenGaps(state);
          const resolved = state.docGaps.filter((g) => g.status === "resolved");

          if (open.length === 0) {
            return {
              type: "output",
              output: `No open doc gaps.\nTotal flagged: ${state.docGaps.length}\nResolved: ${resolved.length}`,
            };
          }

          const lines = open.map((g) => {
            const link = g.threadLink ? `\n    Thread: ${g.threadLink}` : "";
            return `  • [${g.status}] ${g.topic} (${g.id})\n    Gap: ${g.docGapDescription}\n    Asked by: ${g.senderName} in #${g.channel}\n    Flagged: ${g.timestamp}${link}`;
          });

          return {
            type: "output",
            output: `Open doc gaps (${open.length}):\n\n${lines.join("\n\n")}\n\nResolved: ${resolved.length} | Total: ${state.docGaps.length}`,
          };
        },
      }),
    );
  }

  // === EVENTS ===

  if (letta.capabilities.events?.turns) {
    disposers.push(
      letta.events.on("turn_start", (event: any, _ctx: any) => {
        const state = loadState();
        const openGaps = getOpenGaps(state);

        if (openGaps.length > 0) {
          const count = openGaps.length;
          const topGap = openGaps[0];
          const reminder = `[dug-community] ⚠️ ${count} open doc gap(s). Top: "${topGap.topic}" — ${topGap.docGapDescription}. Use get_doc_gaps to review, then DM Jae with the thread link and create documentation in knowledge-base/.`;

          const input = event.input;
          if (Array.isArray(input)) {
            for (const item of input) {
              if (item && item.role === "user" && Array.isArray(item.content)) {
                item.content.push({ type: "text", text: reminder });
              } else if (item && item.role === "user" && typeof item.content === "string") {
                item.content += `\n\n${reminder}`;
              }
            }
          }
        }
      }),
    );
  }

  return () => {
    for (const dispose of disposers.reverse()) dispose();
  };
}

// --- Profile builder ------------------------------------------------------

function buildProfileContent(
  handle: string,
  name: string,
  domoFocus: string,
  skillLevel: string,
  knownContext: string,
  preferences: string,
  history: string,
): string {
  const lines: string[] = [
    "---",
    `description: ${name || handle} — ${domoFocus || "DUG community member"}`,
    "---",
    `# ${name || handle}`,
    "",
    `- **Slack:** ${handle}`,
  ];
  if (name) lines.push(`- **Name:** ${name}`);
  if (domoFocus) lines.push(`- **Domo focus:** ${domoFocus}`);
  if (skillLevel) lines.push(`- **Skill level:** ${skillLevel}`);
  if (knownContext) lines.push(`- **Known context:** ${knownContext}`);
  if (preferences) lines.push(`- **Preferences:** ${preferences}`);
  if (history) {
    lines.push("", "## History", history);
  }
  lines.push("");
  return lines.join("\n");
}
