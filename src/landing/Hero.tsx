import { useLayoutEffect, useRef } from "react";
import { GITHUB, METRICS } from "../data";
import { gsap, reducedMotion } from "../lib/scroll";
import { ScrambleText } from "../components/ScrambleText";

const LAYERS: string[][] = [
  [
    "INFO  deploy step 0412  worker heartbeat ok  latency=18ms",
    "INFO  deploy step 0413  queue depth 0  inflight 4",
    "DEBUG cache hit ratio 0.981  entries 14,208",
    "INFO  build artifact sha 9f2c41  size 18.4 MB",
    "INFO  deploy step 0414  worker heartbeat ok",
    "DEBUG pool-7  connections 12/64  waiting 0",
    "INFO  deploy step 0415  health check 200",
  ],
  [
    "FAILED tests/test_recovery.py::test_page_bounds - AssertionError",
    "E   assert 8192 <= 65536",
    "E   where 8192 = page_bytes(start=12288, end=26004)",
    "------------------------- Captured log -------------------------",
    "INFO  sutra.store  wrote su_c9bb… 13,716 B",
    "INFO  sutra.core   marker emitted, id retained",
    "1 failed, 727 passed, 16 skipped in 42.18s",
  ],
  [
    "> grep -c ERROR deploy.log",
    "1",
    "> tail -n 3 deploy.log",
    "2026-11-20T09:42:11Z ERROR rollout stalled: probe timeout",
    "2026-11-20T09:42:12Z INFO  rollback armed",
    "2026-11-20T09:42:12Z INFO  rollout resumed",
  ],
];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const context = gsap.context(() => {
      gsap.set(".hero__line-inner", { yPercent: 118 });
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .to(".hero__line-inner", { yPercent: 0, duration: 1.15, stagger: 0.1 })
        .from(".hero__meta span", { opacity: 0, y: 10, duration: 0.7, stagger: 0.06 }, 0)
        .from(".hero__lede", { opacity: 0, y: 20, duration: 0.9 }, 0.34)
        .from(".hero__actions > *", { opacity: 0, y: 16, duration: 0.7, stagger: 0.08 }, 0.48)
        .from(".ruler__cell", { opacity: 0, y: 18, duration: 0.8, stagger: 0.07 }, 0.52)
        .fromTo(".hero__blade", { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: "power2.inOut" }, 0.2);

      gsap.to(".hero__layer--back", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero__layer--mid", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero__layer--front", {
        yPercent: 22,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero__title", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={root} aria-labelledby="hero-title">
      <div className="hero__layers" aria-hidden="true">
        {LAYERS.map((lines, index) => (
          <div
            key={index}
            className={`hero__layer hero__layer--${["back", "mid", "front"][index]}`}
          >
            {lines.map((line, n) => (
              <span key={`${index}-${n}`}>{line}</span>
            ))}
          </div>
        ))}
      </div>

      <div className="wrap hero__inner">
        <div className="hero__meta">
          <span>deterministic optimization layer</span>
          <span>python 3.11+ · no compression model</span>
        </div>

        <h1 className="hero__title" id="hero-title">
          <span className="hero__line">
            <span className="hero__line-inner">Less output.</span>
          </span>
          <span className="hero__line hero__line--signal">
            <span className="hero__line-inner">More signal.</span>
          </span>
        </h1>
        <span className="hero__blade" aria-hidden="true">
          <i>cut</i>
        </span>

        <div className="hero__body">
          <p className="hero__lede">
            Tool output is re-sent on every turn. SUTRA cuts it before the model reads it, labels
            every omitted byte, and keeps the original in a bounded local store — a{" "}
            <code>sutra_restore</code> call away.
          </p>
          <div className="hero__actions">
            <a className="btn btn--fill" href="#install">
              install sutra <span aria-hidden="true">→</span>
            </a>
            <a className="btn" href="/docs">
              read the docs
            </a>
            <a className="link-quiet" href={GITHUB} target="_blank" rel="noopener noreferrer">
              source <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <dl className="ruler" aria-label="Measured results across eight fixtures">
          {METRICS.map((metric, index) => (
            <div className="ruler__cell" key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>
                <ScrambleText text={metric.value} delay={640 + index * 80} trigger="view" />
                {metric.unit ? <span className="ruler__unit">{metric.unit}</span> : null}
              </dd>
              <p>{metric.note}</p>
            </div>
          ))}
          <p className="ruler__note">
            Offline fixture measurements, not provider bills.{" "}
            <a href="#proof">method and limits</a>.
          </p>
        </dl>
      </div>
    </section>
  );
}
