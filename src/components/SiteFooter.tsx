import { DOCS_LINKS, GITHUB, PYPI } from "../data";
import { Mark } from "./Mark";
import { Version } from "./Version";

export function SiteFooter({ root = false }: { root?: boolean }) {
  const hash = (value: string) => (root ? `/${value}` : value);

  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <div className="footer__lockup">
            <span className="footer__mark">
              <Mark />
            </span>
            <span className="footer__word">SUTRA</span>
          </div>
          <p>Less output. More signal.</p>
          <p className="footer__mono">deterministic · local · recoverable</p>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <div>
            <span className="footer__label">the site</span>
            <a href={hash("#top")}>top</a>
            <a href={hash("#install")}>install</a>
            <a href="/docs">documentation</a>
          </div>
          <div>
            <span className="footer__label">the repository</span>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer">
              source
            </a>
            <a href={PYPI} target="_blank" rel="noopener noreferrer">
              pypi
            </a>
            <a href={DOCS_LINKS.recovery}>recovery protocol</a>
          </div>
          <div>
            <span className="footer__label">the fine print</span>
            <a href="/privacy">privacy</a>
            <a href="/terms">terms</a>
            <a href="/contact">contact</a>
            <a href={DOCS_LINKS.security}>security model</a>
            <a href={DOCS_LINKS.license}>MIT license</a>
          </div>
        </nav>
      </div>

      <div className="wrap footer__meta">
        <Version link />
        <span>no model calls</span>
        <span>MIT · 2026</span>
        <a className="footer__back" href={hash("#top")}>
          back to top <span aria-hidden="true">↑</span>
        </a>
      </div>

      <div className="footer__plate" aria-hidden="true">
        <img className="footer__plate-mark" src="/assets/mark.png" alt="" loading="lazy" decoding="async" />
        <span className="footer__plate-word">SUTRA</span>
      </div>
    </footer>
  );
}
