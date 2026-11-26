import type { ReactNode } from "react";
import { ArtPlate } from "../components/ArtPlate";
import { PageArt } from "../components/PageArt";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { CLIENTS, DOCS_LINKS, GITHUB, PYPI } from "../data";

type SectionProps = {
  id: string;
  kicker: string;
  title: string;
  children: ReactNode;
};

function Section({ id, kicker, title, children }: SectionProps) {
  return (
    <section className="doc-section" id={id} aria-labelledby={`${id}-title`}>
      <p className="kicker">{kicker}</p>
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
    </section>
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

const MANUAL = [
  [
    "Cursor",
    "MCP only; a postToolUse hook can replace MCP output, never built-in tool output",
    "no adapter",
    "manual mcp.json",
  ],
  [
    "Windsurf / Cascade",
    "MCP only; no output-replacement hook",
    "no adapter",
    "manual mcp_config.json",
  ],
  [
    "Claude Code without the hook",
    "MCP only; the model calls sutra_compress explicitly",
    "no — explicit tool",
    "mcp add or settings file",
  ],
  [
    "Codex CLI without /hooks trust",
    "MCP only until the hook is trusted",
    "no — limited",
    "sutra install --client codex",
  ],
  [
    "OpenCode without the plugin",
    "MCP tools only; no in-place replacement",
    "no — explicit tool",
    "plugin installed separately",
  ],
];

const REQUEST_STAGE = [
  ["Hermes Agent", "llm_request", "implemented; opt-in with SUTRA_PROMPT=1"],
  ["OpenCode 1.19.6", "experimental.chat.messages.transform", "implemented; opt-in"],
  ["Claude Code", "no request hook; point ANTHROPIC_BASE_URL at sutra proxy", "proxy implemented; live client not verified"],
  ["DeepSeek Harness", "no request hook; point a provider baseURL at sutra proxy", "proxy fallback"],
  ["Codex CLI / OpenClaw", "none", "not implemented"],
];

const EVIDENCE = [
  ["Hermes tool stage", "gateway on main, SUTRA_PROMPT=1", "1,893 rewrites; 76.7% of 127,784,080 B removed"],
  ["Hermes request stage", "same gateway, balanced", "19 rewrites across 10 sessions; 19.2% removed"],
  ["Claude Code 2.1.268", "installed hook + MCP, scripted provider", "70,888 B → 18,645 B; clue restored through MCP"],
  ["OpenCode 1.19.5 / OpenClaw 0.1.0", "scripted provider, real Bash tool", "48,436 B → 18,649 B; clue restored"],
  ["Codex CLI 0.166.0", "trusted hook, scripted Responses provider", "10,110 B → 4,837 B"],
  ["DeepSeek Harness", "host bundle, offline seam check", "53,890 B → 18,340 B with a restore id"],
];

export function Integrations() {
  return (
    <div className="docs-page integrations-page" id="top">
      <a className="skip" href="#matrix">
        Skip to the matrix
      </a>

      <PageArt src="/assets/art/clasp.png" />
      <SiteHeader docs />

      <header className="docs-hero">
        <div className="wrap docs-hero__inner">
          <div className="docs-hero__text">
          <p className="kicker">integrations</p>
          <h1>
            Every path in.
            <br />
            <span className="soft">One shared core.</span>
          </h1>
          <p className="docs-hero__lede">
            Six hosts replace a tool result before the model reads it, one MCP server covers the rest,
            and the CLI stays a plain filter. Every path calls the same core, and every path fails
            open — an unexpected payload reaches the model unchanged.
          </p>
          <div className="docs-hero__meta">
            <span>8 surfaces</span>
            <span>6 automatic</span>
            <span>fail-open</span>
            <span>no model calls</span>
          </div>
          <div className="docs-hero__actions">
            <a className="btn btn--fill" href="/docs#quickstart">
              install guide <span aria-hidden="true">→</span>
            </a>
            <a className="btn" href={GITHUB} target="_blank" rel="noopener noreferrer">
              repository <span aria-hidden="true">↗</span>
            </a>
          </div>
          </div>

          <ArtPlate
            className="docs-hero__art"
            src="/assets/art/clasp.png"
            caption="plate ii · the coupling"
          />
        </div>
      </header>

      <div className="wrap integrations-shell">
        <article className="docs-body integrations-body" id="matrix">
          <Section id="matrix-table" kicker="matrix" title="The full matrix">
            <p className="doc-lead">
              Automatic means the host hands SUTRA the result before the model sees it. Everything
              else is an explicit tool call: the original has already reached the model, so nothing
              can be replaced retroactively.
            </p>
            <Table
              head={["surface", "mechanism", "automatic", "install"]}
              rows={CLIENTS.map((client) => [
                <a key={client.id} href={`#${client.id}`}>
                  {client.name}
                </a>,
                client.mechanism,
                client.tier,
                <code key={`${client.id}-cmd`}>{client.install}</code>,
              ])}
              caption="six hosts, one MCP server, one CLI"
            />
            <Table
              head={["surface", "reach", "automatic", "setup"]}
              rows={MANUAL.map((row) => [row[0], row[1], row[2], <code key={row[0]}>{row[3]}</code>])}
              caption="hosts that never replace built-in tool output"
            />
            <Note tone="warn" title="MCP is not interception">
              Registering the SUTRA server gives the model two tools. It does not make another
              server's results pass through SUTRA. A host hook that replaces the result is the only
              automatic path.
            </Note>
          </Section>

          <Section id="automatic" kicker="automatic" title="Hosts that replace the result">
            <p>
              Each adapter is generated by <code>sutra install --client &lt;name&gt;</code>, backed up
              before every write, and refuses a file it did not create. Verify with{" "}
              <code>sutra doctor</code> after a restart.
            </p>
            <div className="intg-cards">
              {CLIENTS.filter((client) => client.automatic).map((client) => (
                <article className="intg-card" id={client.id} key={client.id}>
                  <div className="intg-card__head">
                    <h3>{client.name}</h3>
                    <span className="intg-card__tier">{client.tier}</span>
                  </div>
                  <p>{client.mechanism}</p>
                  <dl>
                    <div>
                      <dt>install</dt>
                      <dd>
                        <code>{client.install}</code>
                      </dd>
                    </div>
                    <div>
                      <dt>then</dt>
                      <dd>{client.restart}</dd>
                    </div>
                    <div>
                      <dt>verify</dt>
                      <dd>
                        <code>{client.verify}</code>
                      </dd>
                    </div>
                    <div>
                      <dt>limit</dt>
                      <dd>{client.limit}</dd>
                    </div>
                  </dl>
                  <a className="intg-card__link" href={client.docs}>
                    step-by-step ↗
                  </a>
                </article>
              ))}
            </div>
          </Section>

          <Section id="request" kicker="request stage" title="Before the request is sent">
            <p>
              The tool stage replaces a result after a tool returns. The request stage runs on the
              assembled request and shortens older tool results that already have a recoverable
              original. It is opt-in and refuses anything it cannot keep restorable.
            </p>
            <Table head={["host", "boundary", "status"]} rows={REQUEST_STAGE.map((row) => row.map((cell) => cell))} />
            <p>
              Enable the in-host stage with <code>SUTRA_PROMPT=1</code>; <code>off</code> mode always
              disables it. Only older tool results are touched — the newest six messages stay whole,
              and system, user and assistant text are never read for trimming.
            </p>
            <Note tone="warn" title="A rewrite can move the cached prefix">
              A 2×2 <code>trace-deep</code> trial removed about 63 KB per session and still billed
              50–52% more prompt tokens, because each rewrite moves the cached prefix and a restore
              can add a turn. <code>SUTRA_PROMPT_MIN_SAVING_PERCENT=25</code> refuses trims that do
              not pay for that move.
            </Note>
          </Section>

          <Section id="evidence" kicker="evidence" title="What was actually run">
            <p>
              Harness rows used scripted providers; the Hermes rows are from a real gateway. None are
              invoices, and no task-success or billing saving is claimed.
            </p>
            <Table head={["surface", "what ran", "result"]} rows={EVIDENCE.map((row) => row.map((cell) => cell))} />
          </Section>

          <Section id="next" kicker="next" title="Verify, then recover">
            <p>
              Install, restart the host, and prove the path with doctor. The recovery tool must resolve
              the same store as the process that wrote the marker.
            </p>
            <div className="codeblock">
              <div className="codeblock__bar">
                <span>check every installed path</span>
              </div>
              <pre>
                <code>{"sutra install --client hermes   # or opencode, openclaw, codex, dsh, claude\nsutra detect                     # read-only, capability tier per client\nsutra doctor                     # executes each path, temporary stores\nsutra status && sutra stats"}</code>
              </pre>
              <p className="codeblock__note">
                Doctor never reads or writes your recovery entries; it restores a synthetic id through
                a temporary store.
              </p>
            </div>
            <p className="doc-links">
              <a href="/docs#install">install reference</a>
              <a href="/docs#recovery">recovery</a>
              <a href="/docs#troubleshooting">troubleshooting</a>
              <a href={DOCS_LINKS.security}>security model</a>
              <a href={PYPI} target="_blank" rel="noopener noreferrer">
                package on PyPI
              </a>
            </p>
          </Section>
        </article>
      </div>

      <SiteFooter root />
    </div>
  );
}
