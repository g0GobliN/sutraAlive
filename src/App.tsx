import { useEffect } from "react";
import { Docs } from "./docs/Docs";
import { LegalPage, type LegalKind } from "./legal/LegalPage";
import { Landing } from "./landing/Landing";
import { refreshScroll } from "./lib/scroll";

const LEGAL_PAGES: Record<string, LegalKind> = {
  "/privacy": "privacy",
  "/terms": "terms",
  "/contact": "contact",
};

const currentPath = () => {
  const path = window.location.pathname.replace(/\/+$/, "");
  return path === "" ? "/" : path;
};

const isDocsPath = () => /^\/docs(?:\/.*)?$/.test(currentPath());

const TITLES = {
  site: "SUTRA — Less output. More signal.",
  docs: "Documentation — SUTRA",
  privacy: "Privacy — SUTRA",
  terms: "Terms of use — SUTRA",
  contact: "Contact — SUTRA",
};

const DESCRIPTIONS = {
  site: "SUTRA is a deterministic optimization layer for AI coding agents. Cut oversized tool output, reuse exact repeats, and keep every omitted byte restorable — with no summarizer in the loop.",
  docs: "Install and operate SUTRA: Hermes Agent, Claude Code, OpenCode, OpenClaw, Codex CLI, DeepSeek Harness, MCP clients and the CLI. Mechanisms, request-stage proxy, commands, limits and recovery.",
  privacy:
    "How SUTRA handles data: a static site without analytics, local-only processing in the package, and contact details for privacy questions.",
  terms:
    "Terms for the SUTRA website and the open-source package, including the MIT license, benchmark limits and acceptable use.",
  contact: "Contact SUTRA by email, Instagram or GitHub for support, licensing, commercial use and security reports.",
};

export function App() {
  const docs = isDocsPath();
  const legal = LEGAL_PAGES[currentPath()] ?? null;

  useEffect(() => {
    document.title = legal ? TITLES[legal] : docs ? TITLES.docs : TITLES.site;
    const description = legal ? DESCRIPTIONS[legal] : docs ? DESCRIPTIONS.docs : DESCRIPTIONS.site;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
    document.documentElement.dataset.page = legal ? "legal" : docs ? "docs" : "site";
    if (!window.location.hash) {
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      root.style.scrollBehavior = previous;
    }
    const timer = window.setTimeout(refreshScroll, 320);
    return () => window.clearTimeout(timer);
  }, [docs, legal]);

  if (legal) return <LegalPage page={legal} />;
  return docs ? <Docs /> : <Landing />;
}
