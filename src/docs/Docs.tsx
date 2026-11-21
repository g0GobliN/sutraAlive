import { useEffect, useState, type ReactNode } from "react";
import { CodeBlock } from "../components/CodeBlock";
import { SiteHeader } from "../components/SiteHeader";
import { Version } from "../components/Version";
import {
  CLIENTS,
  CONFIG_ROWS,
  DOCS_LINKS,
  GITHUB,
  MODES,
  PYPI,
  QUICKSTART,
  RECORDED,
} from "../data";

const NAV = [
  {
    group: "start",
    items: [
      { id: "overview", label: "overview" },
      { id: "quickstart", label: "quickstart" },
      { id: "modes", label: "optimization modes" },
    ],
  },
  {
    group: "install",
    items: [
      { id: "install", label: "integrations" },
      { id: "hermes", label: "Hermes Agent" },
      { id: "claude-code", label: "Claude Code" },
      { id: "opencode", label: "OpenCode" },
      { id: "openclaw", label: "OpenClaw" },
      { id: "codex", label: "Codex CLI" },
      { id: "mcp", label: "MCP clients" },
      { id: "cli", label: "CLI" },
    ],
  },
  {
    group: "operate",
    items: [
      { id: "verify", label: "verify & diagnose" },
      { id: "configuration", label: "configuration" },
      { id: "recovery", label: "recovery" },
      { id: "troubleshooting", label: "troubleshooting" },
      { id: "uninstall", label: "uninstall" },
    ],
  },
  {
    group: "evidence",
    items: [{ id: "evidence", label: "evidence & limits" }],
  },
];

const SECTION_IDS = NAV.flatMap((group) => group.items.map((item) => item.id));

function useActiveSection() {
  const [active, setActive] = useState(() => {
    const hash = window.location.hash.slice(1);
    return SECTION_IDS.includes(hash) ? hash : SECTION_IDS[0];
  });

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => Boolean(element),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.15, 0.5] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return active;
}

function DocsNav({ active }: { active: string }) {
  return (
    <>
      {NAV.map((group) => (
        <div className="docs-nav__group" key={group.group}>
          <span className="docs-nav__label">{group.group}</span>
          <ul>
            {group.items.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className={active === item.id ? "is-active" : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function Section({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="doc-section" id={id} aria-labelledby={`${id}-title`}>
      <p className="kicker">{kicker}</p>
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
    </section>
  );
}

function Note({
  tone = "note",
  title,
  children,
}: {
  tone?: "note" | "warn";
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={`doc-note doc-note--${tone}`}>
      {title ? <strong>{title}</strong> : null}
      <div>{children}</div>
    </div>
  );
}

function Table({
  head,
  rows,
  caption,
}: {
  head: string[];
  rows: ReactNode[][];
  caption?: string;
}) {
  return (
    <div className="table-wrap">
      <table>
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) =>
                cellIndex === 0 ? (
                  <th key={cellIndex} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={cellIndex}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Docs() {
  const active = useActiveSection();

  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    const root = document.documentElement;

    const jump = () => {
      const target = document.getElementById(id);
      if (!target) return;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      target.scrollIntoView({ block: "start" });
      root.style.scrollBehavior = previous;
    };

    const timer = window.setTimeout(jump, 80);
    if (document.fonts?.ready) document.fonts.ready.then(jump).catch(() => undefined);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="docs-page" id="top">
      <a className="skip" href="#docs-body">
        Skip to documentation
      </a>
      <SiteHeader docs />

      <header className="docs-hero">
        <div className="wrap docs-hero__inner">
          <p className="kicker">documentation</p>
          <h1>
            Field manual.
            <br />
            <span className="soft">Every path, every limit.</span>
          </h1>
          <p className="docs-hero__lede">
            Install SUTRA into Hermes Agent, Claude Code, OpenCode, OpenClaw, Codex CLI, any MCP
            client or the CLI. Then verify the mechanism, tune the mode, and keep the recovery path
            honest.
          </p>
          <div className="docs-hero__meta">
            <span>python 3.11+</span>
            <span>main</span>
            <span>MIT</span>
          </div>
          <div className="docs-hero__actions">
            <a className="btn btn--fill" href="#quickstart">
              start here <span aria-hidden="true">→</span>
            </a>
            <a className="btn" href={GITHUB} target="_blank" rel="noopener noreferrer">
              repository <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </header>

      <div className="wrap docs-shell">
        <aside className="docs-rail" aria-label="Documentation index">
          <details className="docs-nav__mobile">
            <summary>documentation index</summary>
            <nav className="docs-nav">
              <DocsNav active={active} />
            </nav>
          </details>
          <nav className="docs-nav docs-nav--desktop">
            <DocsNav active={active} />
          </nav>
        </aside>

        <article className="docs-body" id="docs-body">
          <Section id="overview" kicker="start here" title="What SUTRA is">
            <p className="doc-lead">
              SUTRA is a deterministic optimization layer for AI coding agents. One shared core
              decides eligibility, validates every rewrite, retains the original and hands the model
              a smaller result with a recovery marker. Host adapters only translate each client's
              tool result into that core.
            </p>
            <p>
              It never asks a model to summarize a tool result. There is no second model in the loop,
              no paraphrase and no invented content. Unexpected payloads, parsing errors and internal
              failures fail open: the host receives the original result unchanged.
            </p>

            <div className="doc-facts">
              <div>
                <span>runtime</span>
                <strong>Python 3.11+</strong>
              </div>
              <div>
                <span>package</span>
                <strong>sutra-agent</strong>
              </div>
              <div>
                <span>license</span>
                <strong>MIT</strong>
              </div>
              <div>
                <span>store</span>
                <strong>local, bounded, unencrypted</strong>
              </div>
            </div>

            <h3>What it does</h3>
            <ul className="doc-list">
              <li>Reduces oversized tool results to a head and tail with a marker naming the omitted range.</li>
              <li>Reuses an exact repeat as a reference to the earlier id instead of re-sending it.</li>
              <li>Runs bounded formatting and wording plans selected by one mode: off, balanced, aggressive or beast.</li>
              <li>Validates every candidate against protected spans and requires it to be strictly smaller.</li>
              <li>Keeps the original recoverable through <code>sutra_restore</code> when local storage is enabled.</li>
              <li>Reports savings, recovery and configuration through one CLI.</li>
            </ul>

            <h3>What it refuses to break</h3>
            <ul className="doc-list">
              <li>Patches and diffs are never rewritten by the optimization layer.</li>
              <li>Structured JSON is never byte-sliced; a re-encoded document must remain valid and keep its shape.</li>
              <li>Paths, URLs, commands, identifiers, numbers, negations, error terms and security terms must survive.</li>
              <li>An id is emitted only after the original is actually stored.</li>
            </ul>

            <Note title="Version note">
              This page documents <code>main</code>. PyPI carries <Version />; the
              four-mode switch is on <code>main</code> and ships in the next release. Existing{" "}
              <code>SUTRA_SEARCH</code> and <code>SUTRA_LANGUAGE</code> settings remain supported on
              released versions.
            </Note>

            <p className="doc-links">
              <a href={DOCS_LINKS.contract} target="_blank" rel="noopener noreferrer">contract</a>
              <a href={DOCS_LINKS.security} target="_blank" rel="noopener noreferrer">security model</a>
              <a href={DOCS_LINKS.benchmark} target="_blank" rel="noopener noreferrer">benchmark method</a>
            </p>
          </Section>

          <Section id="quickstart" kicker="five minutes" title="Quickstart">
            <p>
              Install the package, choose an effort, preview the integration changes, then prove the
              installed paths. The installer backs up every file it edits and never overwrites a
              foreign file.
            </p>
            <CodeBlock
              label="quickstart"
              code={QUICKSTART.map((step) => step.code).join("\n")}
              note="balanced is the default. sutra install auto-detects supported clients; add --client <name> to configure one only."
            />
            <ol className="doc-steps">
              {QUICKSTART.map((step, index) => (
                <li key={step.label}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{step.label}</strong>
                    <p>{step.note}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Note title="After installing">
              Restart the relevant agent. Codex CLI additionally requires a one-time{" "}
              <code>/hooks</code> trust review before it will run the SUTRA hook. The installer
              prints that instruction; it never edits Codex's trust ledger.
            </Note>
          </Section>

          <Section id="modes" kicker="one switch" title="Optimization modes">
            <p>
              A mode is a resource and search-effort policy, not a different compression guarantee.
              Every candidate in every mode passes the same exact preservation check. The base
              head/tail compression and its recovery path run in every mode, including{" "}
              <code>off</code>.
            </p>
            <Table
              head={["mode", "plans", "passes", "reuse", "nominal bound"]}
              rows={MODES.map((mode) => [
                <span key={mode.id}>
                  <code>{mode.name}</code>
                  {mode.id === "balanced" ? <em className="doc-inline-tag">default</em> : null}
                </span>,
                mode.plans,
                mode.passes,
                mode.reuse,
                mode.bound,
              ])}
            />
            <CodeBlock
              label="mode commands"
              code={"sutra mode                 # show the resolved mode and its source\nsutra mode balanced        # write ~/.sutra/mode\nsutra mode aggressive\nsutra mode beast\nsutra mode off             # keep base compression and recovery\nsutra mode off --clear     # remove the saved selection"}
            />
            <h3>Resolution order</h3>
            <ol className="doc-list doc-list--numbered">
              <li><code>SUTRA_MODE</code> in the environment.</li>
              <li>The mode file at <code>~/.sutra/mode</code>, or <code>SUTRA_MODE_FILE</code>.</li>
              <li>Legacy <code>SUTRA_SEARCH</code> when the mode is unset.</li>
              <li><code>balanced</code>.</li>
            </ol>
            <p>
              The mode file is re-read on every call and written atomically. An unknown stored value
              falls through to the next source with a warning instead of forcing a mode.
            </p>
            <Note tone="warn" title="Effort is not a promise">
              A larger mode explores more bounded candidates; it does not guarantee a larger saving.
              If no candidate is smaller and preservation-clean, SUTRA returns the original. The
              nominal bound is not a deadline: the pass count is the deterministic stop.
            </Note>
          </Section>

          <Section id="install" kicker="install" title="Integrations at a glance">
            <p>
              Automatic means the host replaces the tool result before the model reads it. Manual
              means the agent must call <code>sutra_compress</code> explicitly; the original has
              already reached the model.
            </p>
            <Table
              head={["surface", "mechanism", "automatic", "install"]}
              rows={[
                ...CLIENTS.map((client) => [
                  <a key={client.id} href={`#${client.id}`}>
                    {client.name}
                  </a>,
                  client.mechanism,
                  client.tier,
                  <code key={`${client.id}-cmd`}>{client.install}</code>,
                ]),
                [
                  "Cursor",
                  "MCP only; postToolUse replaces MCP output only",
                  "no adapter",
                  <code key="cursor">manual mcp.json</code>,
                ],
                [
                  "Windsurf / Cascade",
                  "MCP only; no output-replacement hook",
                  "no adapter",
                  <code key="windsurf">manual mcp_config.json</code>,
                ],
              ]}
            />
            <Note title="MCP is not interception">
              Registering the SUTRA server gives the model two tools. It does not make another
              server's results pass through SUTRA. A host hook that replaces the result is the only
              automatic path.
            </Note>
            <p className="doc-links">
              <a href={DOCS_LINKS.integrations} target="_blank" rel="noopener noreferrer">
                full matrix, evidence and limits
              </a>
            </p>
          </Section>

          <Section id="hermes" kicker="install 01" title="Hermes Agent">
            <p>
              Hermes exposes a native <code>tool_execution</code> middleware and registers the
              recovery tool in the same plugin. The installer copies the plugin to{" "}
              <code>$HERMES_HOME/plugins/sutra</code> (or <code>~/.hermes/plugins/sutra</code>),
              validates it, and enables it.
            </p>
            <CodeBlock label="hermes" code={"sutra install --client hermes\nsutra doctor"} />
            <Table
              head={["step", "what happens"]}
              rows={[
                ["install", "Copies the generated plugin, backs up an existing SUTRA directory, refuses a foreign plugin or symlink."],
                ["enable", "Runs hermes plugins validate, then hermes plugins enable sutra. The previous directory is restored if either fails."],
                ["restart", "Restart the gateway so the middleware is loaded."],
                ["recovery", "Enable the SUTRA toolset in Hermes so sutra_restore is available to the model."],
                ["uninstall", "sutra uninstall --client hermes disables the plugin and removes only the generated directory."],
              ]}
            />
            <h3>Checkout fallback</h3>
            <p>
              The installer is the supported path. For a source checkout, clone the plugin directly
              and let Hermes validate it:
            </p>
            <CodeBlock
              label="hermes checkout"
              code={"git clone https://github.com/g0GobliN/sutra ~/.hermes/plugins/sutra\nhermes plugins validate ~/.hermes/plugins/sutra\nhermes plugins enable sutra\n# restart the gateway"}
            />
            <Note tone="warn" title="Host limit">
              Verified against Hermes <code>v0.22.2+3030.g4d04303</code>. Tool Search may defer the
              recovery tool; the marker remains valid and the tool can be enabled explicitly.
            </Note>
          </Section>

          <Section id="claude-code" kicker="install 02" title="Claude Code">
            <p>
              The installer writes a user-level <code>PostToolUse</code> hook that returns{" "}
              <code>hookSpecificOutput.updatedToolOutput</code>, and registers the MCP server for
              recovery. A new session picks both up.
            </p>
            <CodeBlock
              label="claude code"
              code={"sutra install --client claude\nsutra doctor"}
              note="Writes $CLAUDE_CONFIG_DIR/settings.json or ~/.claude/settings.json, then claude mcp add --scope user --transport stdio sutra."
            />
            <h3>What the installer changes</h3>
            <ul className="doc-list">
              <li>One PostToolUse group running <code>python -m sutra.hook</code> with a 60-second timeout.</li>
              <li>One user-scope MCP entry for <code>python -m sutra.mcp</code>.</li>
              <li>Timestamped backups, atomic writes, and a no-op on a second install.</li>
              <li>A different existing <code>sutra</code> MCP entry is refused, not overwritten.</li>
            </ul>
            <Note tone="warn" title="The 30,000-character host limit">
              Claude Code persists large Bash and PowerShell results and gives the hook a preview
              plus <code>persistedOutputPath</code>. SUTRA reads the full file only after path, size,
              type, symlink and session-tree checks pass. If any check fails, the result is left
              untouched — it never stores a compressed preview as the "original".
            </Note>
            <h3>Shared store requirement</h3>
            <p>
              The hook and the MCP server must resolve the same store. Set{" "}
              <code>SUTRA_STORE_DIR</code> in both environments (or set <code>HERMES_HOME</code> for
              both). Otherwise the marker's id is <code>not_found</code> in the other process.
            </p>
            <CodeBlock
              label="shared store"
              code={'export SUTRA_STORE_DIR="$HOME/.sutra/store"'}
            />
            <h3>Manual checkout</h3>
            <p>
              Without the installer, add the hook to project or user settings with an absolute path,
              and register the recovery server yourself. Both processes must share a store.
            </p>
            <CodeBlock
              label="claude settings.json"
              code={'{\n  "hooks": {\n    "PostToolUse": [\n      {"hooks": [{"type": "command",\n                  "command": "/home/you/.sutra-venv/bin/sutra-hook"}]}\n    ]\n  }\n}'}
              note="Checkout alternative: python3 /path/to/sutra/scripts/sutra-claude-code-hook.py"
            />
            <CodeBlock
              label="claude mcp"
              code={'{"mcpServers": {"sutra": {"command": "/home/you/.sutra-venv/bin/python",\n                          "args": ["-m", "sutra.mcp"]}}}'}
            />
          </Section>

          <Section id="opencode" kicker="install 03" title="OpenCode">
            <p>
              OpenCode loads plugins from its config tree. The installer writes a generated plugin
              at <code>~/.config/opencode/plugins/sutra.js</code> (or{" "}
              <code>$XDG_CONFIG_HOME/opencode/plugins/</code>) that replaces{" "}
              <code>tool.execute.after</code> output and registers <code>sutra_restore</code>.
            </p>
            <CodeBlock label="opencode" code={"sutra install --client opencode\nsutra doctor\n# restart OpenCode"} />
            <ul className="doc-list">
              <li>One short-lived Python process per oversized result; no daemon and no port.</li>
              <li>The interpreter and a dedicated store home are baked into the generated file.</li>
              <li>If OpenCode's config exists, the installer also adds the MCP recovery entry; the plugin has its own restore tool either way.</li>
              <li>A foreign <code>sutra.js</code> is refused; a changed interpreter rewrites with a timestamped backup.</li>
            </ul>
            <Note tone="warn" title="Host limit">
              Verified on OpenCode 1.19.5. Each oversized result has a 2.5-second subprocess timeout
              and fails open. The configuring interpreter must remain available; Windows live-host
              runs are not claimed.
            </Note>
          </Section>

          <Section id="openclaw" kicker="install 04" title="OpenClaw">
            <p>
              OpenClaw uses its own generated plugin. The installer writes{" "}
              <code>&lt;config&gt;/plugins/sutra.js</code>, where the config directory defaults to{" "}
              <code>~/.openclaw</code> and honors <code>SUTRA_OPENCLAW_CONFIG</code>. No host process
              is needed to write the file.
            </p>
            <CodeBlock
              label="openclaw"
              code={"sutra install --client openclaw\nsutra doctor\n# restart OpenClaw"}
              note="The plugin embeds the configuring interpreter and a dedicated store home. Reinstall updates only a SUTRA-generated file, with a backup."
            />
            <p>
              OpenClaw is detected from its executable, <code>&lt;config&gt;/openclaw.json</code>, or
              the generated plugin, so installation can happen before the host exists. Recovery uses
              the MCP server.
            </p>
            <Note tone="warn" title="Host limit">
              Verified on OpenClaw 0.1.0. One short-lived process per oversized result with a
              2.5-second timeout; a plugin failure leaves the original result in place.
            </Note>
          </Section>

          <Section id="codex" kicker="install 05" title="Codex CLI">
            <p>
              Codex 0.166.0 exposes lifecycle hooks. The installer writes a user-level{" "}
              <code>PostToolUse</code> handler to <code>$CODEX_HOME/hooks.json</code> and registers the
              MCP server for recovery.
            </p>
            <CodeBlock
              label="codex"
              code={"sutra install --client codex\ncodex mcp list --json\nsutra doctor --client codex"}
              note="Then run /hooks once in Codex to trust the SUTRA hook. The installer prints this; it does not edit the trust ledger."
            />
            <h3>Mechanism</h3>
            <ul className="doc-list">
              <li>The hook runs for Bash / exec_command and returns <code>{"{"}"continue": false, "stopReason": "&lt;compressed text + marker&gt;"{"}"}</code>.</li>
              <li>Codex replaces the model-visible result, records the hook as <code>Stopped</code> and continues the turn.</li>
              <li><code>codex mcp add sutra -- &lt;python&gt; -m sutra.mcp</code> supplies <code>sutra_restore</code>.</li>
              <li>Uninstall removes only the SUTRA handler and MCP entry; unrelated hooks are preserved.</li>
            </ul>
            <Note tone="warn" title="Trust and truncation">
              User hooks are skipped until the one-time <code>/hooks</code> review. Codex truncates
              very large tool output before the hook — the observed shape is roughly 10 KB — so only
              the text Codex supplies is compressible and restorable.
            </Note>
          </Section>

          <Section id="mcp" kicker="install 06" title="Other MCP clients">
            <p>
              The package ships the same server as <code>sutra-mcp</code> and{" "}
              <code>python -m sutra.mcp</code>. It exposes <code>sutra_compress</code> and{" "}
              <code>sutra_restore</code> over newline-delimited JSON-RPC 2.0 on stdio.
            </p>
            <CodeBlock
              label="mcp config"
              code={'{\n  "mcpServers": {\n    "sutra": {\n      "command": "python3",\n      "args": ["-m", "sutra.mcp"]\n    }\n  }\n}'}
              note="Checkout alternative: python3 /path/to/sutra/scripts/sutra-mcp-server.py. Point HERMES_HOME or SUTRA_STORE_DIR at a dedicated store to isolate the profile."
            />
            <Table
              head={["client", "config path", "automatic?"]}
              rows={[
                ["Claude Code (without hook)", "user or project MCP config", "no — explicit sutra_compress"],
                ["Cursor", "~/.cursor/mcp.json or .cursor/mcp.json", "no — only MCP tool output can be replaced"],
                ["Windsurf / Cascade", "~/.config/devin/mcp_config.json (macOS/Linux)", "no — no output-replacement hook"],
                ["Codex CLI", "$CODEX_HOME/config.toml", "hook only; MCP stays explicit"],
                ["OpenCode", "opencode config", "plugin installed separately"],
              ]}
            />
            <Note tone="warn" title="Registration is not interception">
              An MCP server sees only requests addressed to itself. It cannot compress another
              server's result before the model reads it. Use an automatic host hook where one
              exists; otherwise call <code>sutra_compress</code> explicitly.
            </Note>
          </Section>

          <Section id="cli" kicker="install 07" title="CLI">
            <p>
              The CLI is a subprocess filter: it compresses a stream or a file, not an agent's tool
              result in place. It emits one JSON object on stdout and uses exit codes{" "}
              <code>0</code> result produced, <code>1</code> internal failure, <code>2</code> usage
              error.
            </p>
            <CodeBlock
              label="cli"
              code={"sutra compress --file result.log\nsutra compress --tool bash < output.txt\nsutra restore --id su_… --mode search --query \"error\" --context 2\nsutra restore --id su_… --mode bytes --start 12288 --end 26004\nsutra config"}
              note="Checkout alternative: python3 scripts/sutra-cli.py <command>. Search is case-sensitive by default; --ignore-case opts out."
            />
            <ul className="doc-list">
              <li>Stdin is capped at 64 MiB and must be valid UTF-8; invalid bytes are rejected, never replaced with U+FFFD.</li>
              <li>A larger <code>--file</code> is read and returned unchanged with exit 0.</li>
              <li>One process per invocation; there is no daemon.</li>
            </ul>
          </Section>

          <Section id="verify" kicker="operate" title="Verify and diagnose">
            <p>
              <code>sutra detect</code> is read-only and reports concrete evidence and a capability
              tier per client. <code>sutra doctor</code> executes each installed path, including host
              limits, and uses temporary stores so it never reads or writes your recovery entries.
            </p>
            <CodeBlock
              label="diagnose"
              code={"sutra detect\nsutra detect --json\nsutra detect --client opencode\nsutra status\nsutra doctor\nsutra doctor --client codex\nsutra doctor --json"}
            />
            <Table
              head={["result", "meaning"]}
              rows={[
                ["pass", "the check ran and succeeded"],
                ["fail", "a real failure; doctor exits non-zero"],
                ["skip", "an optional check could not run (for example Node absent); exit 0"],
                ["partial", "a skipped optional check; exit 0"],
                ["not-installed", "the client was not found; reported, not hidden"],
                ["limited", "installed but host limits apply, such as untrusted Codex hooks"],
              ]}
            />
            <Note title="Evidence, not configuration">
              Doctor does not accept a config file as proof. It runs the hook path, starts the MCP
              server, restores a synthetic id through it, and verifies a protected diff stays
              byte-identical. A configured but unusable server is a failure.
            </Note>
          </Section>

          <Section id="configuration" kicker="operate" title="Configuration">
            <p>
              Every setting is an environment variable, read on each call. There is no configuration
              file and no second resolver; <code>sutra.configuration()</code> returns the resolved
              values.
            </p>
            <Table
              head={["variable", "default", "meaning"]}
              rows={CONFIG_ROWS.map((row) => [
                <code key={row.name}>{row.name}</code>,
                <code key={`${row.name}-default`}>{row.value}</code>,
                row.meaning,
              ])}
            />
            <h3>Store behaviour</h3>
            <p>
              Originals live under <code>$HERMES_HOME/cache/sutra-store/</code> or{" "}
              <code>SUTRA_STORE_DIR</code>. The directory is created <code>0700</code>, files are
              written atomically as <code>0600</code>, and retention is bounded by entry size, total
              size, count and age. The store is <strong>not encrypted</strong>: any process running
              as the same user can read it. Set <code>SUTRA_STORE=0</code> if that is unacceptable;
              compression still works, but markers quote no id.
            </p>
            <Note title="Mode is not policy">
              <code>SUTRA_MODE</code> selects optimization effort. <code>SUTRA_POLICY</code> is a
              separate, optional Hermes session-guidance section. The policy never overrides host or
              repository instructions and never permits skipping required work.
            </Note>
          </Section>

          <Section id="recovery" kicker="operate" title="Recovery">
            <p>
              The marker is the contract. It names how many bytes were elided, where they were, which
              id holds them, how long they are retained, and the exact call that returns them. If
              nothing was retained, the marker says that too and quotes no id.
            </p>
            <CodeBlock label="recorded marker" code={RECORDED.marker} />
            <Table
              head={["restore mode", "returns"]}
              rows={[
                ["bytes", "an exact byte range; pages are 8 KiB by default and concatenate byte-exactly"],
                ["lines", "numbered lines by start and end"],
                ["search", "matching lines with context; case-sensitive unless --ignore-case"],
                ["full", "the whole original, refused above the response cap"],
              ]}
            />
            <Table
              head={["status", "meaning"]}
              rows={[
                ["ok", "the requested content was returned"],
                ["not_found", "no entry for that id — often a different store between hook and MCP"],
                ["expired", "the entry outlived its TTL and was pruned"],
                ["too_large", "the request exceeds the response cap; page it explicitly"],
                ["unavailable", "storage is disabled or unreachable"],
                ["error", "a malformed request or internal failure; the reason is included"],
              ]}
            />
            <p>
              Responses are capped at <code>SUTRA_RECOVERY_MAX_BYTES</code> (8 KiB default, 64 KiB
              hard maximum) and search returns at most{" "}
              <code>SUTRA_RECOVERY_MAX_MATCHES</code> lines (5 default, 20 hard maximum). A single
              line longer than the cap is returned clipped.
            </p>
            <Note tone="warn" title="One store per recovery path">
              The process that writes the marker and the process that serves{" "}
              <code>sutra_restore</code> must use the same store. This is the most common cause of{" "}
              <code>not_found</code>.
            </Note>
          </Section>

          <Section id="troubleshooting" kicker="operate" title="Troubleshooting">
            <dl className="doc-trouble">
              <div>
                <dt>restore says <code>not_found</code></dt>
                <dd>Set <code>SUTRA_STORE_DIR</code> (or <code>HERMES_HOME</code>) identically for the hook and the MCP server, then run <code>sutra doctor</code>.</dd>
              </div>
              <div>
                <dt>Hermes has no recovery tool</dt>
                <dd>Enable the SUTRA toolset and restart the gateway. Tool Search may defer the tool until it is enabled.</dd>
              </div>
              <div>
                <dt>Codex shows <code>limited</code></dt>
                <dd>Run <code>/hooks</code> in a Codex session and trust the SUTRA hook. The installer cannot pre-record that decision.</dd>
              </div>
              <div>
                <dt>Claude Code leaves large output untouched</dt>
                <dd>The persisted-output path, size, type, symlink or session-tree check failed. SUTRA refuses to compress the preview; re-run the command or inspect the session's <code>tool-results</code> file.</dd>
              </div>
              <div>
                <dt>The OpenCode or OpenClaw plugin does nothing</dt>
                <dd>Restart the host and confirm the baked-in interpreter still exists. A missing interpreter fails open, so the original result reaches the model.</dd>
              </div>
              <div>
                <dt>Install refuses a file</dt>
                <dd>A foreign plugin or MCP entry already uses the SUTRA name. <code>sutra uninstall --client &lt;name&gt;</code> is the documented repair; backups are kept beside edited files.</dd>
              </div>
              <div>
                <dt>Windows hosts</dt>
                <dd>Core, CLI, wheel and adapter CI run on Windows; the live Claude, Codex and Hermes host probes are Linux-only and no Windows host claim is made.</dd>
              </div>
            </dl>
            <p className="doc-links">
              <a href={DOCS_LINKS.troubleshooting} target="_blank" rel="noopener noreferrer">
                troubleshooting guide
              </a>
            </p>
          </Section>

          <Section id="uninstall" kicker="operate" title="Uninstall">
            <p>
              Uninstall removes only entries SUTRA added. Other hooks, settings and MCP servers stay
              in place, and the installer's backups remain on disk.
            </p>
            <CodeBlock
              label="uninstall"
              code={"sutra uninstall\nsutra uninstall --client claude\nsutra uninstall --client opencode\nsutra uninstall --client openclaw\nsutra uninstall --client codex\nsutra uninstall --client hermes"}
              note="Remove retained originals separately: $HERMES_HOME/cache/sutra-store or SUTRA_STORE_DIR. No other SUTRA state is required to keep."
            />
          </Section>

          <Section id="evidence" kicker="evidence" title="Evidence and limits">
            <p>
              The baseline benchmark uses eight deterministic fixtures shaped like common tool
              results. It measures payload bytes and <code>o200k_base</code> tokenizer counts. It
              does not measure provider billing, live-model behaviour or task success.
            </p>
            <Table
              head={["measurement", "result"]}
              rows={[
                ["payload bytes", "54.3% reduction — 1.63 MB → 742.7 kB"],
                ["o200k tokens", "55.2% reduction — 585,977 → 262,517"],
                ["planted clues", "8/8 visible or recoverable"],
                ["patch bytes changed", "0"],
                ["JSON-array bytes changed", "0"],
              ]}
            />
            <h3>Mode benchmark</h3>
            <p>
              Eleven workloads, 830,619 input bytes, one host and commit. The table records bytes,
              tokens, and summed median time; it does not call a model.
            </p>
            <Table
              head={["mode", "bytes out", "byte cut", "tokens out", "token cut", "summed median"]}
              rows={[
                ["off", "570,668", "31.30%", "157,889", "33.15%", "0.64 s"],
                ["balanced", "569,837", "31.40%", "157,756", "33.20%", "0.82 s"],
                ["aggressive", "569,837", "31.40%", "157,746", "33.21%", "4.81 s"],
                ["beast", "569,837", "31.40%", "157,778", "33.19%", "21.06 s"],
              ]}
            />
            <Note title="How to read the mode table">
              The recorded corpus has no second applicable transformation, so the active modes
              produced the same bytes while spending more time. That is a statement about the corpus,
              not a guarantee. The token differences are search-order noise, not a ranking.
            </Note>
            <h3>What is not claimed</h3>
            <ul className="doc-list">
              <li>No live-model A/B result is published; protocol v1 (8 tasks) and v2 (30 tasks) are defined, not run.</li>
              <li>Host capabilities differ. Automatic replacement needs a documented host hook.</li>
              <li>Recovery is bounded by the store and response limits.</li>
              <li>The store is unencrypted and readable by the same user.</li>
              <li>Larger modes are not guaranteed to save more.</li>
            </ul>
            <p className="doc-links">
              <a href={DOCS_LINKS.benchmark} target="_blank" rel="noopener noreferrer">benchmark method</a>
              <a href={DOCS_LINKS.modes} target="_blank" rel="noopener noreferrer">mode design</a>
              <a href={PYPI} target="_blank" rel="noopener noreferrer">PyPI</a>
            </p>
          </Section>

          <div className="docs-end">
            <p>That is the whole path. If something disagrees with the repository, the repository wins.</p>
            <div>
              <a className="btn" href="/">
                back to the site
              </a>
              <a className="btn btn--fill" href={GITHUB} target="_blank" rel="noopener noreferrer">
                open the source <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </article>
      </div>

      <footer className="docs-footer">
        <div className="wrap docs-footer__inner">
          <span>SUTRA · field manual</span>
          <span>
            <Version link /> · <a href="/privacy">privacy</a> · <a href="/terms">terms</a> ·{" "}
            <a href="/contact">contact</a> · MIT ·{" "}
            <a href={PYPI} target="_blank" rel="noopener noreferrer">pypi</a> ·{" "}
            <a href={GITHUB} target="_blank" rel="noopener noreferrer">github</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
