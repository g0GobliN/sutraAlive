import { MODES } from "../data";

export function Plans() {
  return (
    <section className="sec sec--panel" id="modes" aria-labelledby="modes-title">
      <div className="shell">
        <div className="sec__title">
          <h2 id="modes-title">Modes</h2>
          <Glyph />
        </div>

        <p className="sec__intro">
          A mode bounds how much search SUTRA may spend, not what it may accept. Every candidate
          still has to be smaller and preservation-clean, and{" "}
          <code>balanced</code> is what an installation gets when it sets nothing.
        </p>

        <p className="plans__hint" aria-hidden="true">
          swipe to compare <span>→</span>
        </p>

        <div className="plans-wrap" tabIndex={0} role="region" aria-label="SUTRA modes compared">
        <div className="plans" role="table" aria-label="SUTRA modes compared">
          <div className="plans__cell plans__cell--label">mode</div>
          {MODES.map((mode) => (
            <div
              className={`plans__cell plans__cell--head${mode.id === "balanced" ? " plans__cell--accent" : ""}`}
              key={`head-${mode.id}`}
              role="columnheader"
            >
              <span className="plans__tier">{mode.name}</span>
              <span className="plans__role">{mode.role}</span>
            </div>
          ))}

          <div className="plans__cell plans__cell--label">plans</div>
          {MODES.map((mode) => (
            <div className="plans__cell" key={`plans-${mode.id}`}>
              {mode.plans}
            </div>
          ))}

          <div className="plans__cell plans__cell--label">passes</div>
          {MODES.map((mode) => (
            <div className="plans__cell" key={`passes-${mode.id}`}>
              {mode.passes}
            </div>
          ))}

          <div className="plans__cell plans__cell--label">reuse</div>
          {MODES.map((mode) => (
            <div className="plans__cell" key={`reuse-${mode.id}`}>
              {mode.reuse}
            </div>
          ))}

          <div className="plans__cell plans__cell--label">bound</div>
          {MODES.map((mode) => (
            <div className="plans__cell" key={`bound-${mode.id}`}>
              {mode.bound}
            </div>
          ))}

          <div className="plans__cell plans__cell--label">select</div>
          {MODES.map((mode) => (
            <div className="plans__cell" key={`cta-${mode.id}`}>
              <span className="plans__cta">
                <code>sutra mode {mode.id}</code>
              </span>
            </div>
          ))}
        </div>
        </div>

        <div className="plans__foot">
          <p>
            The bound is an effort ceiling, not a deadline. The pass count is the deterministic stop.
          </p>
          <a className="btn btn--ghost" href="/docs#modes">
            mode reference <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Glyph() {
  return (
    <svg className="sec__glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M2 14h4v8H2zM9 9h4v13H9zM16 8h4v14h-4zM16 2h4v3h-4z" />
    </svg>
  );
}
