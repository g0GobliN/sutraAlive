import { GITHUB, PYPI } from "../data";

export function Portal() {
  return (
    <section className="portal" id="install" aria-labelledby="install-title">
      <div className="shell">
        <h2 id="install-title">One install. Then normal work.</h2>
        <p>
          The installer detects supported clients, backs up every file it edits, and removes only its
          own entries on uninstall. The original bytes stay local the whole time.
        </p>

        <div className="portal__actions">
          <a className="btn btn--paper" href={PYPI} target="_blank" rel="noopener noreferrer">
            install from pypi <span aria-hidden="true">↗</span>
          </a>
          <a className="btn btn--ghost" href="/docs">
            read the manual
          </a>
          <a className="btn btn--ghost" href={GITHUB} target="_blank" rel="noopener noreferrer">
            source <span aria-hidden="true">↗</span>
          </a>
        </div>

        <p className="portal__meta">Python 3.11+ · MIT · no model calls</p>
      </div>
    </section>
  );
}
