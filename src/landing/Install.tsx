import { CopyButton } from "../components/CopyButton";
import { Version } from "../components/Version";
import { CLIENTS, QUICKSTART } from "../data";

export function Install() {
  return (
    <section className="section install" id="install" aria-labelledby="install-title">
      <div className="wrap install__grid">
        <div className="install__copy">
          <p className="kicker">the ritual</p>
          <h2 id="install-title">
            One install.
            <br />
            <span className="soft">Then normal work.</span>
          </h2>
          <p>
            SUTRA runs on the tool path, not as a proxy. The installer detects supported clients,
            backs up every file it edits, and removes only its own entries on uninstall.
          </p>
          <p className="install__note">
            Python 3.11 or newer. Restart the host after installing. Codex additionally needs a
            one-time <code>/hooks</code> trust review.
          </p>
          <p className="install__version">
            PyPI <code>sutra-agent</code> <Version />. The four-mode switch is on <code>main</code>{" "}
            and documented ahead of the next release.
          </p>
        </div>

        <div className="install__panel">
          <div className="install__bar">
            <span>quickstart</span>
            <span>6 commands</span>
          </div>
          <ol className="install__steps">
            {QUICKSTART.map((step, index) => (
              <li key={step.label}>
                <span className="install__num">{String(index + 1).padStart(2, "0")}</span>
                <div className="install__step">
                  <span className="install__label">{step.label}</span>
                  <div className="install__code">
                    <pre>
                      <code>{step.code}</code>
                    </pre>
                    <CopyButton text={step.code} />
                  </div>
                  <p>{step.note}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="install__foot">
            Every client path, host limit and configuration variable is in{" "}
            <a href="/docs">the documentation</a>.
          </p>
        </div>
      </div>

      <div className="wrap install__clients">
        <span>install by surface</span>
        <ul>
          {CLIENTS.map((client) => (
            <li key={client.id}>
              <a href={client.docs}>
                {client.name} <span aria-hidden="true">↗</span>
              </a>
              <code>{client.install.split(" ").slice(-1)[0]}</code>
            </li>
          ))}
          <li>
            <a href="/docs#cli">
              CLI <span aria-hidden="true">↗</span>
            </a>
            <code>sutra compress</code>
          </li>
        </ul>
      </div>
    </section>
  );
}
