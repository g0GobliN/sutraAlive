import { motion } from "motion/react";
import { GITHUB, METRICS } from "../data";
import { MarkerDemo } from "./MarkerDemo";
import { SignalField } from "./SignalField";

const spring = { type: "spring", stiffness: 380, damping: 28 } as const;

export function Hero() {
  return (
    <section className="hero" id="top">
      <SignalField />
      <div className="hero__beam" aria-hidden="true" />

      <div className="wrap hero__meta">
        <span>SUTRA / v0.2.0</span>
        <span>The signal survives</span>
        <span>A stone gate for the context window</span>
      </div>

      <div className="wrap hero__stage">
        <figure className="hero__emblem">
          <picture>
            <source srcSet="/assets/sutra-mark.webp" type="image/webp" />
            <img
              className="hero__mark"
              src="/assets/sutra-mark.png"
              alt="The SUTRA arch mark: a stone gate with debris on the left and a single beam passing through to the right."
              width={780}
              height={559}
              decoding="async"
            />
          </picture>
          <figcaption>Remove · label · retain.</figcaption>
        </figure>

        <h1>
          <span className="hero__line">Keep the evidence.</span>
          <span className="hero__line hero__line--dim">Cut the noise.</span>
        </h1>

        <p className="hero__lede">
          Tool output is re-sent on every turn. SUTRA sits in the tool path and cuts it before the
          model reads it, names every byte it removes, and keeps the original in a bounded local
          store — a <code>sutra_restore</code> call away.
        </p>

        <div className="hero__actions">
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

        <p className="hero__oath">
          No model calls. No invented content. Every retained byte has an id.
        </p>

        <MarkerDemo />
      </div>

      <div className="wrap hero__ledger">
        <dl className="metrics" aria-label="Measured results across eight fixtures">
          {METRICS.map((metric) => (
            <div className="metric" key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>
                {metric.value}
                {metric.unit ? <span>{metric.unit}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
        <p className="metrics__note">
          Eight generated fixtures. The token column is a <code>tiktoken o200k_base</code> count,
          not a provider bill. <a href="#proof">Method and limits</a>.
        </p>
      </div>
    </section>
  );
}
