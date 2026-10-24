import { motion } from "motion/react";
import {
  CONTRIBUTING,
  DOCS_BENCHMARK,
  DOCS_RECOVERY,
  FEATURES,
  GITHUB,
  HERMES,
  INSTALL_BLOCKS,
  LICENSE,
  PROOF_ROWS,
  RELEASE,
  RULES,
  SECURITY,
  STEPS,
} from "../data";
import { ClosingSeal } from "./ClosingSeal";
import { CopyButton } from "./CopyButton";
import { GateDiagram } from "./GateDiagram";

const spring = { type: "spring", stiffness: 380, damping: 28 } as const;

export function Problem() {
  return (
    <section className="section problem" id="problem">
      <div className="wrap">
        <div className="section__head section__head--split">
          <div>
            <p className="section__index">I / The cost</p>
            <h2>
              A tool result is read once.
              <br />
              Then it is read <em>forever.</em>
            </h2>
          </div>
          <p className="section__aside">
            Every later turn carries the earlier output. The bill is not the size of the result;
            it is the size of the result multiplied by the rest of the session.
          </p>
        </div>

        <div className="problem__grid">
          <div className="problem__copy reveal">
            <p>
              A 2 MB log is not a 2 MB problem. It is 2 MB on this turn, and again on the next,
              and again in every context that follows it.
            </p>
            <p>
              Compressing the model’s replies attacks the small number. Tool output is the part
              that grows without limit. That is the part SUTRA cuts — and the part it keeps a
              receipt for.
            </p>
            <a className="text-link" href="#passage">
              Follow the passage <span aria-hidden="true">↓</span>
            </a>
          </div>

          <aside className="observation reveal" aria-label="Observed context re-read share">
            <div className="observation__label">
              <span>Field observation</span>
              <span>One fleet · two days</span>
            </div>
            <div className="observation__figure">
              96.8<span>%</span>
            </div>
            <p className="observation__caption">
              of input + cache-read tokens were context being re-read on the next turn.
            </p>
            <dl className="observation__rows">
              <div>
                <dt>input</dt>
                <dd>16,330,829</dd>
              </div>
              <div>
                <dt>output</dt>
                <dd>3,258,687</dd>
              </div>
              <div>
                <dt>cache read</dt>
                <dd>486,503,074</dd>
              </div>
            </dl>
            <p className="observation__source">
              One seven-agent fleet, as reported in the project README. Not a universal benchmark.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

export function Passage() {
  return (
    <section className="section passage" id="passage">
      <div className="wrap">
        <div className="section__head">
          <p className="section__index">II / The passage</p>
          <h2>
            It does not summarise.
            <br />
            <em>It omits, and signs the omission.</em>
          </h2>
          <p className="section__intro">
            One ordered pass. A tool result enters on the left, meets six rules, and leaves as a
            smaller result with a marker that names everything it left behind.
          </p>
        </div>

        <GateDiagram />

        <ol className="passage__legend">
          {STEPS.map((step) => (
            <li className="passage__step reveal" key={step.number}>
              <span className="passage__step-num">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <code>{step.meta}</code>
            </li>
          ))}
        </ol>

        <div className="rulelist" aria-label="Compression rules">
          {RULES.map((rule) => (
            <span key={rule}>{rule}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Canon() {
  return (
    <section className="section canon-section" id="features">
      <div className="wrap">
        <div className="section__head section__head--split">
          <div>
            <p className="section__index">III / The canon</p>
            <h2>
              What it refuses
              <br />
              to break.
            </h2>
          </div>
          <p className="section__aside">
            Six rules of restraint. The zero rows are the point: when a rewrite could hide a
            change or alter a shape, SUTRA returns the original.
          </p>
        </div>

        <div className="canon">
          {FEATURES.map((feature, index) => (
            <article
              className={`canon__item${"lead" in feature && feature.lead ? " canon__item--lead" : ""} reveal`}
              key={feature.title}
            >
              <span className="canon__num">{String(index + 1).padStart(2, "0")}</span>
              <div className="canon__copy">
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </div>
              <div className="canon__mark">
                <span aria-hidden="true">{feature.glyph}</span>
                <code>{feature.meta}</code>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Proof() {
  return (
    <section className="section proof" id="proof">
      <div className="wrap">
        <div className="section__head section__head--split">
          <div>
            <p className="section__index">IV / The assay</p>
            <h2>
              Measure the cut.
              <br />
              <em>Then measure the way back.</em>
            </h2>
          </div>
          <p className="section__aside">
            Eight generated tool-output shapes. One planted clue in each. Bytes measured on the
            payload text; tokens counted with <code>tiktoken o200k_base</code>.
          </p>
        </div>

        <div className="verdict reveal">
          <div className="verdict__lead">
            <span>Across eight fixtures</span>
            <strong>
              54.3<span>%</span>
            </strong>
            <p>fewer bytes than the raw payloads</p>
          </div>
          <dl className="verdict__rest">
            <div>
              <dt>o200k tokens</dt>
              <dd>55.2%</dd>
              <small>585,977 → 262,517</small>
            </div>
            <div>
              <dt>planted clues recovered</dt>
              <dd>8/8</dd>
              <small>returned by the real restore tool</small>
            </div>
            <div>
              <dt>diffs touched</dt>
              <dd>0</dd>
              <small>0.0% saved on the patch, by design</small>
            </div>
          </dl>
        </div>

        <p className="table-hint" aria-hidden="true">
          The track is the saved share. Zero-length tracks are protected shapes. ↔
        </p>

        <ol className="assay" aria-label="Measured savings across eight fixtures">
          {PROOF_ROWS.map((row, index) => {
            const zero = "zero" in row && row.zero;
            return (
              <li className={`assay__row${zero ? " assay__row--zero" : ""}`} key={row.payload}>
                <span className="assay__num">{String(index + 1).padStart(2, "0")}</span>
                <div className="assay__label">
                  <h3>{row.payload}</h3>
                  <code>{row.rule}</code>
                </div>
                <div className="assay__track" aria-hidden="true">
                  <i style={{ width: `${row.width}%` }} />
                </div>
                <strong className="assay__pct">{row.saved}</strong>
                <div className="assay__values">
                  <span>
                    {row.bytesBefore} <span aria-hidden="true">→</span> {row.bytesAfter}
                  </span>
                  <span>
                    {row.tokensBefore} <span aria-hidden="true">→</span> {row.tokensAfter} tok
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="assay__total">
          <span>Total</span>
          <strong>1.63 MB → 742.7 kB</strong>
          <strong>585,977 → 262,517 tokens</strong>
          <strong>54.3% / 55.2%</strong>
        </div>

        <div className="proof__notes">
          <p>
            <strong>Read the zero rows.</strong> The patch and the JSON array save nothing on
            purpose. One protects a code change; the other protects a JSON shape.
          </p>
          <p>
            <strong>What this does not prove.</strong> No live model was called; there is no
            provider cost or task-success rate here. 8/8 means the clue is retrievable, not that an
            agent asks for it. The token column is a tokenizer count, not a bill.
          </p>
        </div>

        <div className="proof__footer">
          <p>
            The way back: five cases needed one restore call, three were already visible. Median
            response ~710 B; worst 8.9 kB.
          </p>
          <div className="proof__links">
            <a
              className="text-link"
              href={DOCS_BENCHMARK}
              target="_blank"
              rel="noopener noreferrer"
            >
              Method and limits <span aria-hidden="true">↗</span>
            </a>
            <a
              className="text-link"
              href={DOCS_RECOVERY}
              target="_blank"
              rel="noopener noreferrer"
            >
              Recovery protocol <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Ritual() {
  return (
    <section className="section ritual-section" id="install">
      <div className="wrap ritual-section__grid">
        <div className="ritual-section__copy reveal">
          <p className="section__index">V / The ritual</p>
          <h2>
            Put it on
            <br />
            the tool path.
          </h2>
          <p className="ritual-section__lede">
            SUTRA ships today as a Hermes Agent plugin. It runs on the tool path, not as a proxy.
            The work it does — cut, label, retain — does not assume one host. Install it, enable the
            toolset, and the next tool result passes through the gate.
          </p>
          <p className="ritual-section__note">
            Current adapter: Hermes Agent. Verified against <code>v0.22.2+3030.g4d04303</code>.
          </p>
        </div>

        <div className="ritual reveal">
          <div className="ritual__head">
            <span>The ritual</span>
            <span>Three steps</span>
          </div>
          {INSTALL_BLOCKS.map((block, index) => (
            <div className="ritual__step" key={block.label}>
              <span className="ritual__num">0{index + 1}</span>
              <span className="ritual__label">{block.label}</span>
              <div className="ritual__code">
                <pre>
                  <code>{block.code}</code>
                </pre>
                <CopyButton text={block.code} />
              </div>
            </div>
          ))}
          <p className="ritual__caveat">
            Compression does not depend on the toolset. Recovery does: if the SUTRA toolset is
            disabled, the marker’s restore call fails and the model falls back to re-running the
            tool.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Closing() {
  return (
    <section className="closing">
      <div className="wrap closing__grid">
        <div className="closing__copy reveal">
          <p className="closing__kicker">The signal survives</p>
          <h2>
            Keep the evidence.
            <br />
            <em>Cut the noise.</em>
          </h2>
          <div className="closing__actions">
            <motion.a
              className="button button--primary"
              href="#install"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={spring}
            >
              Install SUTRA <span aria-hidden="true">→</span>
            </motion.a>
            <motion.a
              className="button button--ghost"
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={spring}
            >
              Inspect the source <span aria-hidden="true">↗</span>
            </motion.a>
          </div>
          <p className="closing__small">
            No model calls. No invented content. Every retained byte has an id.
          </p>
        </div>

        <div className="closing__seal" aria-hidden="true">
          <ClosingSeal />
          <span>MIT · 2026</span>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer__inner">
        <a className="brand brand--footer" href="#top" aria-label="SUTRA, back to the top">
          <picture>
            <source srcSet="/assets/sutra-mark.webp" type="image/webp" />
            <img
              className="brand__logo"
              src="/assets/sutra-mark.png"
              alt=""
              width={780}
              height={559}
              loading="lazy"
            />
          </picture>
          <span className="brand__word">Sutra</span>
        </a>
        <p>
          Current adapter:{" "}
          <a href={HERMES} target="_blank" rel="noopener noreferrer">
            Hermes Agent
          </a>
          . <a href={RELEASE} target="_blank" rel="noopener noreferrer">v0.2.0</a>.{" "}
          <a href={LICENSE} target="_blank" rel="noopener noreferrer">MIT licensed</a>.
        </p>
        <nav className="footer__nav" aria-label="Footer">
          <a href={GITHUB} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={`${GITHUB}#readme`} target="_blank" rel="noopener noreferrer">
            README
          </a>
          <a href={CONTRIBUTING} target="_blank" rel="noopener noreferrer">
            Contributing
          </a>
          <a href={DOCS_RECOVERY} target="_blank" rel="noopener noreferrer">
            Recovery
          </a>
          <a href={SECURITY} target="_blank" rel="noopener noreferrer">
            Security
          </a>
        </nav>
        <p className="footer__sig">A stone gate for the context window.</p>
      </div>
    </footer>
  );
}
