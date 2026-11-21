import { DOCS_LINKS, GITHUB, PYPI } from "../data";
import { Logo } from "./Logo";
import { Version } from "./Version";

export function SiteFooter({ root = false }: { root?: boolean }) {
  const hash = (value: string) => (root ? `/${value}` : value);

  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <div className="footer__lockup">
            <Logo size={28} />
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
            <a href={DOCS_LINKS.recovery} target="_blank" rel="noopener noreferrer">
              recovery protocol
            </a>
          </div>
          <div>
            <span className="footer__label">the fine print</span>
            <a href="/privacy">privacy</a>
            <a href="/terms">terms</a>
            <a href="/contact">contact</a>
            <a href={DOCS_LINKS.security} target="_blank" rel="noopener noreferrer">
              security model
            </a>
            <a href={DOCS_LINKS.license} target="_blank" rel="noopener noreferrer">
              MIT license
            </a>
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

      <div className="footer__fade" aria-hidden="true">
        SUTRA
      </div>
    </footer>
  );
}
