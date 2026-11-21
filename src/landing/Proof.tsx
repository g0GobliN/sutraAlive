import { useLayoutEffect, useRef, useState } from "react";
import { DOCS_LINKS, FIXTURES, RECORDED, TOTALS } from "../data";
import { gsap, reducedMotion } from "../lib/scroll";
import { ScrambleText } from "../components/ScrambleText";
import { FixtureCard } from "./FixtureCard";

const HEAD = [
  "2026-11-20T09:00:01Z INFO  deploy step 0001: worker heartbeat ok",
  "2026-11-20T09:00:02Z INFO  deploy step 0002: worker heartbeat ok",
  "2026-11-20T09:00:03Z INFO  deploy step 0003: worker heartbeat ok",
  "2026-11-20T09:00:04Z INFO  deploy step 0004: worker heartbeat ok",
];

const NOISE = Array.from({ length: 7 }, (_, index) => {
  const n = String(index + 5).padStart(4, "0");
  return `2026-11-20T09:00:${String(index + 5).padStart(2, "0")}Z INFO  deploy step ${n}: worker heartbeat ok`;
});

const TAIL = [
  "2026-11-20T09:04:31Z ERROR rollout stalled: probe timeout after 30s",
  "2026-11-20T09:04:32Z INFO  rollback armed; previous revision kept warm",
];

const MARKER_LINE = `[sutra: partial · 13,716 B elided · id=${RECORDED.id.slice(0, 14)}… · original retained 168h]`;

export function Proof() {
  const [position, setPosition] = useState(52);
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const context = gsap.context(() => {
      gsap.from(".fixture", {
        rotateX: 22,
        y: 64,
        opacity: 0,
        duration: 0.95,
        stagger: 0.055,
        ease: "power3.out",
        scrollTrigger: { trigger: ".fixtures", start: "top 84%", once: true },
      });

      gsap.from(".verdict", {
        y: 26,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".verdict", start: "top 88%", once: true },
      });

      gsap.from(".focus", {
        y: 34,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".focus", start: "top 84%", once: true },
      });
    }, root);

    return () => context.revert();
  }, []);

  const before = [...HEAD, ...NOISE, ...TAIL];
  const after = [...HEAD, MARKER_LINE, ...TAIL];

  return (
    <section className="section proof" id="proof" ref={root} aria-labelledby="proof-title">
      <div className="wrap">
        <div className="proof__head">
          <p className="kicker">the assay</p>
          <h2 id="proof-title">
            Measure the cut.
            <br />
            <span className="soft">Then measure the way back.</span>
          </h2>
          <p className="proof__aside">
            Eight generated tool-output shapes, one planted clue in each. Bytes are measured on the
            payload text; tokens are counted with <code>tiktoken o200k_base</code>. No live model was
            called.
          </p>
        </div>

        <div className="verdict">
          <strong>
            <ScrambleText text="54.3" trigger="view" delay={550} />
            <span className="verdict__unit">%</span>
          </strong>
          <p>fewer bytes than the raw payloads, with 8/8 clues recoverable and 0 diff bytes moved.</p>
          <div className="verdict__meta">
            <span>{TOTALS.bytesBefore} → {TOTALS.bytesAfter}</span>
            <span>{TOTALS.tokensBefore} → {TOTALS.tokensAfter} tokens</span>
          </div>
        </div>

        <figure className="focus-figure">
          <figcaption className="focus__caption">
            <div>
              <p className="kicker">the recorded fixture</p>
              <h3>Same failure. Smaller context.</h3>
            </div>
            <p>
              Drag the frame. Left is the raw deploy log; right is what the model reads. The marker
              names the elided range and the exact restore call.
            </p>
          </figcaption>

          <div className="focus">
            <div className="focus__labels" aria-hidden="true">
              <span>raw · {RECORDED.originalBytes.toLocaleString("en-US")} B</span>
              <span>cut · {RECORDED.visibleBytes.toLocaleString("en-US")} B</span>
            </div>
            <div className="focus__body">
              <div className="focus__pane focus__pane--raw" aria-hidden="true">
                <pre>{before.join("\n")}</pre>
              </div>
              <div
                className="focus__pane focus__pane--cut"
                style={{ clipPath: `inset(0 0 0 ${position}%)` }}
                aria-hidden="true"
              >
                <pre>{after.join("\n")}</pre>
              </div>
              <div className="focus__seam" style={{ left: `${position}%` }} aria-hidden="true" />
              <div className="focus__grip" style={{ left: `${position}%` }} aria-hidden="true">
                <span>↔</span>
              </div>
              <input
                className="focus__range"
                type="range"
                min="4"
                max="96"
                value={position}
                onChange={(event) => setPosition(Number(event.target.value))}
                aria-label="Compare the raw deploy log with the compressed result"
              />
            </div>
            <p className="focus__screen" aria-live="polite">
              {position < 50
                ? "Mostly raw output. The compressed copy is on the right."
                : "Mostly the compressed result. The raw output is on the left."}
            </p>
          </div>
        </figure>

        <div className="fixtures-head">
          <h3>Eight shapes. Two deliberate zeroes.</h3>
          <p>
            The patch and the JSON array save nothing on purpose. One protects a code change; the
            other protects a document's shape.
          </p>
        </div>

        <ol className="fixtures" aria-label="Measured savings across eight fixtures">
          {FIXTURES.map((fixture, index) => (
            <FixtureCard fixture={fixture} index={index} key={fixture.payload} />
          ))}
        </ol>

        <div className="proof__notes">
          <p>
            <strong>What this does not prove.</strong> No provider was billed and no task-success
            rate was measured. 8/8 means the clue is retrievable, not that an agent asked for it.
            The token column is a tokenizer count.
          </p>
          <div className="proof__links">
            <a className="link-quiet" href={DOCS_LINKS.benchmark} target="_blank" rel="noopener noreferrer">
              method and limits <span aria-hidden="true">↗</span>
            </a>
            <a className="link-quiet" href={DOCS_LINKS.recovery} target="_blank" rel="noopener noreferrer">
              recovery protocol <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
