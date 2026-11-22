export const GITHUB = "https://github.com/g0GobliN/sutra";
export const PYPI = "https://pypi.org/project/sutra-agent/";
export const RELEASES = `${GITHUB}/releases`;
export const README = `${GITHUB}#readme`;
export const HERMES = "https://hermes-agent.nousresearch.com";

export const DOCS_LINKS = {
  integrations: `${GITHUB}/blob/main/docs/integrations.md`,
  modes: `${GITHUB}/blob/main/docs/modes.md`,
  configuration: `${GITHUB}/blob/main/docs/configuration.md`,
  recovery: `${GITHUB}/blob/main/docs/recovery.md`,
  troubleshooting: `${GITHUB}/blob/main/docs/troubleshooting.md`,
  benchmark: `${GITHUB}/blob/main/docs/benchmark.md`,
  contract: `${GITHUB}/blob/main/docs/contract.md`,
  universal: `${GITHUB}/blob/main/docs/universal-integration.md`,
  proxy: `${GITHUB}/blob/main/docs/integrations.md#running-the-proxy`,
  optimization: `${GITHUB}/blob/main/docs/optimization-model.md`,
  abBenchmark: `${GITHUB}/blob/main/docs/ab-benchmark.md`,
  accounting: `${GITHUB}/blob/main/docs/accounting.md`,
  security: `${GITHUB}/blob/main/SECURITY.md`,
  contributing: `${GITHUB}/blob/main/CONTRIBUTING.md`,
  license: `${GITHUB}/blob/main/LICENSE`,
};

export type Metric = {
  value: string;
  unit: string;
  label: string;
  note: string;
};

export const METRICS: Metric[] = [
  { value: "54.3", unit: "%", label: "fewer bytes", note: "1.63 MB → 742.7 kB across eight fixtures" },
  { value: "55.2", unit: "%", label: "fewer o200k tokens", note: "585,977 → 262,517, tokenizer count" },
  { value: "8", unit: "/8", label: "clues recovered", note: "planted in the omitted middle" },
  { value: "0", unit: "", label: "diff bytes changed", note: "patches returned byte-identical" },
];

export type Fixture = {
  payload: string;
  rule: string;
  bytesBefore: string;
  bytesAfter: string;
  tokensBefore: string;
  tokensAfter: string;
  saved: string;
  width: number;
  zero?: boolean;
};

export const FIXTURES: Fixture[] = [
  {
    payload: "12,000-line command output",
    rule: "head-tail",
    bytesBefore: "60.9 kB",
    bytesAfter: "18.6 kB",
    tokensBefore: "35,000",
    tokensAfter: "10,149",
    saved: "71.0%",
    width: 71,
  },
  {
    payload: "JSON tool envelope",
    rule: "json-fields",
    bytesBefore: "85.9 kB",
    bytesAfter: "19.2 kB",
    tokensBefore: "26,012",
    tokensAfter: "5,670",
    saved: "78.2%",
    width: 78.2,
  },
  {
    payload: "Test run, 2,000 cases",
    rule: "head-tail",
    bytesBefore: "99.8 kB",
    bytesAfter: "18.6 kB",
    tokensBefore: "29,998",
    tokensAfter: "5,529",
    saved: "81.6%",
    width: 81.6,
  },
  {
    payload: "3,000-frame traceback",
    rule: "traceback",
    bytesBefore: "359.4 kB",
    bytesAfter: "10.3 kB",
    tokensBefore: "126,015",
    tokensAfter: "3,680",
    saved: "97.1%",
    width: 97.1,
  },
  {
    payload: "600 KB patch",
    rule: "diff-kept",
    bytesBefore: "432.1 kB",
    bytesAfter: "432.1 kB",
    tokensBefore: "120,039",
    tokensAfter: "120,039",
    saved: "0.0%",
    width: 0,
    zero: true,
  },
  {
    payload: "900-row SQL result",
    rule: "head-tail",
    bytesBefore: "46.6 kB",
    bytesAfter: "18.5 kB",
    tokensBefore: "18,906",
    tokensAfter: "7,543",
    saved: "60.1%",
    width: 60.1,
  },
  {
    payload: "8,000-line build log",
    rule: "head-tail",
    bytesBefore: "334.9 kB",
    bytesAfter: "18.6 kB",
    tokensBefore: "127,005",
    tokensAfter: "6,905",
    saved: "94.6%",
    width: 94.6,
  },
  {
    payload: "8,000-item JSON array",
    rule: "json-kept",
    bytesBefore: "206.9 kB",
    bytesAfter: "206.9 kB",
    tokensBefore: "103,002",
    tokensAfter: "103,002",
    saved: "0.0%",
    width: 0,
    zero: true,
  },
];

export type Mode = {
  id: string;
  name: string;
  role: string;
  body: string;
  plans: string;
  passes: string;
  reuse: string;
  bound: string;
};

export const MODES: Mode[] = [
  {
    id: "off",
    name: "off",
    role: "the opt-out",
    body: "No optimization plans run. Base head/tail compression, retention and recovery stay on.",
    plans: "none",
    passes: "0",
    reuse: "off",
    bound: "none",
  },
  {
    id: "balanced",
    name: "balanced",
    role: "the default",
    body: "Formatting and wording plans with safe exact reuse. The mode an installation gets when it sets nothing.",
    plans: "formatting + caveman",
    passes: "2",
    reuse: "safe only",
    bound: "50 ms nominal",
  },
  {
    id: "aggressive",
    name: "aggressive",
    role: "the explorer",
    body: "More passes and ordered pairs, with reuse that must be revalidated before it is served.",
    plans: "balanced + pairs",
    passes: "4",
    reuse: "revalidate",
    bound: "150 ms nominal",
  },
  {
    id: "beast",
    name: "beast",
    role: "the largest bound",
    body: "The widest bounded search, including triple combinations. Still only validated, smaller candidates win.",
    plans: "balanced + triples",
    passes: "8",
    reuse: "revalidate",
    bound: "400 ms nominal",
  },
];

export type Client = {
  id: string;
  name: string;
  tier: string;
  automatic: boolean;
  mechanism: string;
  install: string;
  restart: string;
  verify: string;
  limit: string;
  docs: string;
};

export const CLIENTS: Client[] = [
  {
    id: "hermes",
    name: "Hermes Agent",
    tier: "automatic",
    automatic: true,
    mechanism: "native tool_execution middleware",
    install: "sutra install --client hermes",
    restart: "restart the Hermes gateway",
    verify: "sutra doctor",
    limit: "Verified against Hermes v0.22.2+3030.g4d04303. Enable the sutra toolset for recovery.",
    docs: "/docs#hermes",
  },
  {
    id: "claude-code",
    name: "Claude Code",
    tier: "automatic",
    automatic: true,
    mechanism: "PostToolUse hook + MCP recovery",
    install: "sutra install --client claude",
    restart: "start a new Claude Code session",
    verify: "sutra doctor",
    limit: "Hook and MCP must share a store. Large Bash output is read from persistedOutputPath after checks; a Read result is trimmed in file.content.",
    docs: "/docs#claude-code",
  },
  {
    id: "opencode",
    name: "OpenCode",
    tier: "automatic",
    automatic: true,
    mechanism: "tool.execute.after plugin + built-in restore",
    install: "sutra install --client opencode",
    restart: "restart OpenCode",
    verify: "sutra doctor",
    limit: "One short-lived process per oversized result, 2.5 s timeout, fail-open.",
    docs: "/docs#opencode",
  },
  {
    id: "openclaw",
    name: "OpenClaw",
    tier: "automatic",
    automatic: true,
    mechanism: "generated tool.execute.after plugin + MCP",
    install: "sutra install --client openclaw",
    restart: "restart OpenClaw",
    verify: "sutra doctor",
    limit: "Verified on OpenClaw 0.1.0. Config directory overridable with SUTRA_OPENCLAW_CONFIG.",
    docs: "/docs#openclaw",
  },
  {
    id: "codex",
    name: "Codex CLI",
    tier: "after /hooks trust",
    automatic: true,
    mechanism: "PostToolUse feedback hook + MCP",
    install: "sutra install --client codex",
    restart: "new session, then run /hooks once",
    verify: "sutra doctor --client codex",
    limit: "Codex truncates very large output before the hook; only the supplied text is compressible.",
    docs: "/docs#codex",
  },
  {
    id: "deepseek",
    name: "DeepSeek Harness",
    tier: "automatic",
    automatic: true,
    mechanism: "host bundle: tools/post-execute + MCP recovery",
    install: "sutra install --client dsh",
    restart: "restart the harness",
    verify: "sutra doctor --client dsh",
    limit: "Needs a Python that can import SUTRA; 4 s timeout, fail-open. No request hook — point a provider at sutra proxy.",
    docs: "/docs#deepseek",
  },
  {
    id: "mcp",
    name: "Other MCP clients",
    tier: "explicit",
    automatic: false,
    mechanism: "MCP server: sutra_compress + sutra_restore",
    install: "python -m sutra.mcp",
    restart: "reload the client's MCP servers",
    verify: "tools/list, then sutra_compress",
    limit: "Registration is not interception. Cursor and Windsurf cannot replace built-in tool output.",
    docs: "/docs#mcp",
  },
];

export type Step = {
  number: string;
  title: string;
  body: string;
  meta: string;
};

export const STEPS: Step[] = [
  {
    number: "01",
    title: "The host runs the tool",
    body: "SUTRA does not wrap, delay or re-run the command. The adapter hands the finished result to the shared core.",
    meta: "tool output → core.process_result",
  },
  {
    number: "02",
    title: "The core checks eligibility",
    body: "Size, payload shape, tool type and protection rules decide whether the result is touched at all.",
    meta: "size · shape · tool · protection",
  },
  {
    number: "03",
    title: "Candidates must survive",
    body: "Every rewrite is validated against paths, URLs, numbers, identifiers, commands, negations and error terms. A candidate must be smaller and preservation-clean.",
    meta: "preserve.preservation_ok",
  },
  {
    number: "04",
    title: "The original is filed",
    body: "An id is written only after the original is on disk. The model sees a smaller result and a marker naming what left and how to get it back.",
    meta: "store → marker → sutra_restore",
  },
];

export const QUICKSTART: { label: string; code: string; note: string }[] = [
  {
    label: "install",
    code: "python -m pip install sutra-agent",
    note: "Python 3.11 or newer.",
  },
  {
    label: "choose effort",
    code: "sutra mode balanced",
    note: "balanced is the default. Modes ship on main ahead of the next PyPI release.",
  },
  {
    label: "look around",
    code: "sutra detect",
    note: "Read-only. Reports clients, mechanisms and capability tiers.",
  },
  {
    label: "preview, then install",
    code: "sutra install --dry-run\nsutra install",
    note: "Backs up every file it edits. Auto-detects supported clients.",
  },
  {
    label: "prove the path",
    code: "sutra doctor",
    note: "Executes each installed path, including host limits.",
  },
];

export type ConfigRow = { name: string; value: string; meaning: string };

export const CONFIG_ROWS: ConfigRow[] = [
  { name: "SUTRA_MODE", value: "balanced", meaning: "off · balanced · aggressive · beast" },
  { name: "SUTRA_ENABLED", value: "1", meaning: "0 disables compression and retention" },
  { name: "SUTRA_MAX_BYTES", value: "24576", meaning: "results at or below this size are untouched" },
  { name: "SUTRA_HEAD_BYTES", value: "12288", meaning: "bytes kept from the start" },
  { name: "SUTRA_TAIL_BYTES", value: "6144", meaning: "bytes kept from the end" },
  { name: "SUTRA_STORE", value: "1", meaning: "0 stops retaining originals" },
  { name: "SUTRA_STORE_DIR", value: "$HERMES_HOME/cache/sutra-store", meaning: "where originals are retained" },
  { name: "SUTRA_STORE_TTL_HOURS", value: "168", meaning: "retention lifetime (7 days)" },
  { name: "SUTRA_STORE_MAX_BYTES", value: "134217728", meaning: "128 MiB total store" },
  { name: "SUTRA_STORE_MAX_ENTRY_BYTES", value: "33554432", meaning: "32 MiB per retained original" },
  { name: "SUTRA_STORE_MAX_ENTRIES", value: "2000", meaning: "most originals retained" },
  { name: "SUTRA_RECOVERY_MAX_BYTES", value: "8192", meaning: "default response cap; 64 KiB hard maximum" },
  { name: "SUTRA_RECOVERY_MAX_MATCHES", value: "5", meaning: "default search matches; 20 hard maximum" },
  { name: "SUTRA_REUSE", value: "1", meaning: "replace an exact repeat with a marker quoting the earlier id" },
  { name: "SUTRA_REUSE_MIN_BYTES", value: "4096", meaning: "smallest output eligible for exact reuse" },
  { name: "SUTRA_REPLAY", value: "1", meaning: "pre-dispatch reuse where the host asks first" },
  { name: "SUTRA_PROMPT", value: "0", meaning: "opt-in request-stage trimming (Hermes or OpenCode)" },
  { name: "SUTRA_PROMPT_KEEP_LAST", value: "6", meaning: "newest messages never trimmed" },
  { name: "SUTRA_PROMPT_MIN_SAVING_PERCENT", value: "0", meaning: "refuse a trim below this share of the request" },
  { name: "SUTRA_PROMPT_STORE_HOST", value: "1", meaning: "store a host result before shortening it" },
  { name: "SUTRA_POLICY", value: "off", meaning: "optional Hermes session guidance" },
  { name: "SUTRA_TELEMETRY", value: "0", meaning: "opt-in OpenTelemetry export" },
];

export const RECORDED = {
  fixture: "deploy.log",
  tool: "terminal",
  originalBytes: 32084,
  visibleBytes: 18607,
  elidedBytes: 13716,
  id: "su_c9bb4087c079f4427bc570c506050dfa",
  start: 12288,
  end: 26004,
  retentionHours: 168,
  marker:
    '[sutra: partial · 13,716 bytes elided (large output) · id=su_c9bb4087c079f4427bc570c506050dfa · original 32,084 B retained 168h · retrieve: sutra_restore(id="su_c9bb4087c079f4427bc570c506050dfa", mode="bytes", start=12288, end=26004)]',
};

export const TOTALS = {
  bytesBefore: "1.63 MB",
  bytesAfter: "742.7 kB",
  tokensBefore: "585,977",
  tokensAfter: "262,517",
};

export const NAV_LINKS = [
  { href: "#cost", label: "cost" },
  { href: "#passage", label: "passage" },
  { href: "#modes", label: "modes" },
  { href: "#proof", label: "proof" },
  { href: "#clients", label: "clients" },
  { href: "#install", label: "install" },
];
