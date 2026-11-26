import { useEffect } from "react";
import { Docs } from "./docs/Docs";
import { Integrations } from "./integrations/Integrations";
import { LegalPage, type LegalKind } from "./legal/LegalPage";
import { Landing } from "./landing/Landing";
import { refreshScroll } from "./lib/scroll";

const LEGAL_PAGES: Record<string, LegalKind> = {
  "/privacy": "privacy",
  "/terms": "terms",
  "/contact": "contact",
  "/security": "security",
  "/mit-license": "license",
  "/recovery": "recovery",
};

const currentPath = () => {
  const path = window.location.pathname.replace(/\/+$/, "");
  return path === "" ? "/" : path;
};

const isDocsPath = () => /^\/docs(?:\/.*)?$/.test(currentPath());

const TITLES = {
  site: "SUTRA — Less output. More signal.",
  docs: "Documentation — SUTRA",
  integrations: "Integrations — SUTRA",
  privacy: "Privacy — SUTRA",
  terms: "Terms of use — SUTRA",
  contact: "Contact — SUTRA",
  security: "Security model — SUTRA",
  license: "MIT license — SUTRA",
  recovery: "The recovery protocol — SUTRA",
};

const DESCRIPTIONS = {
  site: "SUTRA is a deterministic optimization layer for AI coding agents. Cut oversized tool output, reuse exact repeats, and keep every omitted byte restorable — with no summarizer in the loop.",
  docs: "Install and operate SUTRA: Hermes Agent, Claude Code, OpenCode, OpenClaw, Codex CLI, DeepSeek Harness, MCP clients and the CLI. Mechanisms, request-stage proxy, commands, limits and recovery.",
  integrations:
    "The full SUTRA integration matrix: Hermes Agent, DeepSeek Harness, OpenCode, OpenClaw, Codex CLI, Claude Code, MCP clients and the CLI — mechanism, automatic or explicit, install command, host limits and recorded evidence.",
  privacy:
    "How SUTRA handles data: a static site without analytics, local-only processing in the package, and contact details for privacy questions.",
  terms:
    "Terms for the SUTRA website and the open-source package, including the MIT license, benchmark limits and acceptable use.",
  contact: "Contact SUTRA by email, Instagram or GitHub for support, licensing, commercial use and security reports.",
  security:
    "The SUTRA security model: local-only processing, the retained-original store and its limits, the preservation gate, fail-open behaviour, host configuration changes, telemetry and how to report a vulnerability.",
  license:
    "The SUTRA MIT license in plain language and in full: what you may do, what you must keep, and what the license does not promise.",
  recovery:
    "The SUTRA recovery protocol: ids, markers, sutra_restore arguments and modes, response fields and statuses, the failure matrix, storage layout, security rules and compatibility.",
};

export function App() {
  const path = currentPath();
  const docs = isDocsPath();
  const integrations = path === "/integrations";
  const legal = LEGAL_PAGES[path] ?? null;

  useEffect(() => {
    const key: keyof typeof TITLES = legal ?? (integrations ? "integrations" : docs ? "docs" : "site");
    document.title = TITLES[key];
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", DESCRIPTIONS[key]);
    document.documentElement.dataset.page = legal ? "legal" : integrations || docs ? "docs" : "site";
    if (!window.location.hash) {
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      root.style.scrollBehavior = previous;
    }
    const timer = window.setTimeout(refreshScroll, 320);
    return () => window.clearTimeout(timer);
  }, [docs, integrations, legal]);

  if (legal) return <LegalPage page={legal} />;
  if (integrations) return <Integrations />;
  return docs ? <Docs /> : <Landing />;
}
