export const GITHUB = "https://github.com/g0GobliN/sutra";
export const RELEASE = "https://github.com/g0GobliN/sutra/releases/tag/v0.2.0";
export const DOCS_BENCHMARK = "https://github.com/g0GobliN/sutra/blob/main/docs/benchmark.md";
export const DOCS_RECOVERY = "https://github.com/g0GobliN/sutra/blob/main/docs/recovery.md";
export const CONTRIBUTING = "https://github.com/g0GobliN/sutra/blob/main/CONTRIBUTING.md";
export const SECURITY = "https://github.com/g0GobliN/sutra/blob/main/SECURITY.md";
export const LICENSE = "https://github.com/g0GobliN/sutra/blob/main/LICENSE";
export const HERMES = "https://hermes-agent.nousresearch.com";

export const NAV_LINKS = [
  { href: "#artifact", label: "Artifact" },
  { href: "#problem", label: "Problem" },
  { href: "#passage", label: "Passage" },
  { href: "#proof", label: "Assay" },
  { href: "#install", label: "Ritual" },
];

export const METRICS = [
  { value: "54.3", unit: "%", label: "fewer bytes" },
  { value: "55.2", unit: "%", label: "fewer o200k tokens" },
  { value: "8", unit: "/8", label: "planted clues recovered" },
  { value: "0", unit: "", label: "diffs touched" },
];

export const STEPS = [
  {
    number: "01",
    title: "The tool runs",
    body: "SUTRA registers a tool_execution middleware. The tool executes normally; the result is intercepted before the model sees it. No proxy, no wrapper around your agent.",
    meta: "tool_execution → result",
  },
  {
    number: "02",
    title: "The rules cut",
    body: "ANSI escapes are stripped. Identical lines collapse. Plain text keeps its head and tail. JSON string fields are decoded and trimmed. A traceback keeps the error end. A diff is returned byte-identical.",
    meta: "head + tail · json fields · traceback tail",
  },
  {
    number: "03",
    title: "The marker speaks",
    body: "Every removal is named: how many bytes, where they were, which id holds them, how long they are retained, and the exact call to get them back. If nothing was retained, the marker says that too.",
    meta: "id · offsets · retention · restore call",
  },
  {
    number: "04",
    title: "The agent asks",
    body: "sutra_restore returns bytes, lines, a literal search, or the full original. An optional JSON pointer scopes the request to one field. Pages are 8 KiB by default and concatenate byte-exactly.",
    meta: "bytes · lines · search · full",
  },
];

export const RULES = [
  "ANSI strip",
  "Repeat collapse",
  "Head + tail",
  "JSON fields",
  "Traceback tail",
  "Diff protection",
];

export const FEATURES = [
  {
    glyph: "≠",
    title: "Diffs stay byte-identical.",
    body: "A rewritten patch can hide a code change. The 600 KB patch fixture saves 0.0% — deliberately. SUTRA recognises diffs and returns them untouched.",
    meta: "diff-kept · 432.1 kB → 432.1 kB",
    lead: true,
  },
  {
    glyph: "{ }",
    title: "JSON keeps its shape.",
    body: "Arrays stay arrays. Objects keep their keys. Documents are decoded and re-encoded, never cut at a byte offset that lands inside an escape.",
    meta: "json-fields · 85.9 kB → 19.2 kB",
  },
  {
    glyph: "⌁",
    title: "The error end survives.",
    body: "A traceback keeps its tail, where the exception lives. The middle is what gets elided.",
    meta: "traceback · 359.4 kB → 10.3 kB",
  },
  {
    glyph: "∅",
    title: "No model in the loop.",
    body: "No summarising, no rewriting, no invented content. Deterministic rules. Any unexpected shape fails open to the original result.",
    meta: "0 model calls",
  },
  {
    glyph: "▣",
    title: "Bounded and local.",
    body: "Defaults: 128 MiB store, 32 MiB per entry, 2,000 entries, 168 hours. Directory 0700, files 0600, atomic writes, no symlink following. The store is not encrypted.",
    meta: "local · expiring · bounded",
  },
  {
    glyph: "↩",
    title: "A receipt, not a summary.",
    body: "The marker carries an id and the exact restore call, so the model can question the compression instead of trusting it. The original stays on disk until the TTL or quota says otherwise.",
    meta: "sutra_restore · bytes / lines / search / full",
  },
];

export const PROOF_ROWS = [
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

export const INSTALL_BLOCKS = [
  {
    label: "Clone",
    code: "git clone https://github.com/g0GobliN/sutra ~/.hermes/plugins/sutra",
  },
  {
    label: "Enable",
    code: "hermes plugins enable sutra\nhermes tools   # enable the SUTRA toolset",
  },
  {
    label: "Verify",
    code: "hermes plugins show sutra\nhermes plugins validate ~/.hermes/plugins/sutra",
  },
];
