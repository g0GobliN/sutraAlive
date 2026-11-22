import { useLayoutEffect, useRef } from "react";
import { RECORDED } from "../data";
import { gsap, ScrollTrigger } from "../lib/scroll";

const HEAD = [
  "2026-11-20T09:00:01Z INFO  deploy step 0001: worker heartbeat ok",
  "2026-11-20T09:00:02Z INFO  deploy step 0002: worker heartbeat ok",
  "2026-11-20T09:00:03Z INFO  deploy step 0003: worker heartbeat ok",
  "2026-11-20T09:00:04Z INFO  deploy step 0004: worker heartbeat ok",
  "2026-11-20T09:00:05Z INFO  deploy step 0005: worker heartbeat ok",
  "2026-11-20T09:00:06Z INFO  deploy step 0006: worker heartbeat ok",
];

const NOISE = Array.from({ length: 10 }, (_, index) => {
  const n = String(index + 7).padStart(4, "0");
  return `2026-11-20T09:00:${String(index + 7).padStart(2, "0")}Z INFO  deploy step ${n}: worker heartbeat ok  pool-${(index % 4) + 1}`;
});

const TAIL = [
  "2026-11-20T09:04:31Z ERROR rollout stalled: probe timeout after 30s",
  "2026-11-20T09:04:32Z INFO  rollback armed; previous revision kept warm",
  "2026-11-20T09:04:33Z INFO  rollout resumed from step 1,912",
];

export function CutDemo() {
  const section = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: "+=150%",
            scrub: 0.7,
            pin: pin.current,
            anticipatePin: 1,
          },
        });

        timeline
          .fromTo(
            ".cut__noise",
            { height: "17em", opacity: 1 },
            { height: 0, opacity: 0, duration: 1, ease: "none" },
            0,
          )
          .fromTo(".cut__slice", { opacity: 0.2 }, { opacity: 1, duration: 0.3 }, 0.1)
          .fromTo(
            ".cut__marker",
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
            0.55,
          )
          .fromTo(".cut__receipt", { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.7);
      }, section);

      return () => context.revert();
    });

    mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const timeline = gsap
          .timeline({ paused: true })
          .to(".cut__noise", { height: 0, opacity: 0, duration: 0.7, ease: "none" }, 0)
          .to(".cut__slice", { opacity: 1, duration: 0.3 }, 0)
          .fromTo(
            ".cut__marker",
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
            0.2,
          )
          .fromTo(".cut__receipt", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.45);

        ScrollTrigger.create({
          trigger: ".cut__frame",
          start: "top 82%",
          onEnter: () => timeline.restart(),
          onEnterBack: () => timeline.restart(),
          onLeaveBack: () => timeline.pause(0),
        });
      }, section);

      return () => context.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="cut" ref={section} aria-labelledby="cut-title">
      <div className="cut__pin" ref={pin}>
        <div className="wrap cut__grid">
          <div className="cut__copy">
            <p className="kicker">scroll to cut</p>
            <h2 id="cut-title">
              One result.
              <br />
              One receipt.
            </h2>
            <p className="cut__lede">
              The pass is deterministic: keep the head, keep the tail, elide the middle, write the
              original to disk, emit an id. No sentence is rewritten and no model is called.
            </p>
            <dl className="cut__facts">
              <div>
                <dt>original</dt>
                <dd>{RECORDED.originalBytes.toLocaleString("en-US")} B</dd>
              </div>
              <div>
                <dt>model sees</dt>
                <dd>{RECORDED.visibleBytes.toLocaleString("en-US")} B</dd>
              </div>
              <div>
                <dt>elided</dt>
                <dd>{RECORDED.elidedBytes.toLocaleString("en-US")} B</dd>
              </div>
            </dl>
            <p className="cut__hint">
              Scroll. The middle collapses; the marker stays. The figures are the recorded{" "}
              <code>deploy.log</code> fixture.
            </p>
          </div>

          <div className="cut__frame">
            <div className="cut__bar">
              <span>deploy.log</span>
              <span>terminal · utf-8 · {RECORDED.originalBytes.toLocaleString("en-US")} B</span>
            </div>

            <div className="cut__tape">
              <pre className="cut__head" aria-hidden="true">
                {HEAD.join("\n")}
              </pre>
              <div className="cut__noise" aria-hidden="true">
                {NOISE.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
              <div className="cut__slice" aria-hidden="true">
                <span>cut</span>
              </div>
              <div className="cut__marker">
                <span className="cut__marker-label">marker</span>
                <code>{RECORDED.marker}</code>
              </div>
              <pre className="cut__tail" aria-hidden="true">
                {TAIL.join("\n")}
              </pre>
            </div>

            <div className="cut__receipt">
              <span>id {RECORDED.id.slice(0, 20)}…</span>
              <span>retained {RECORDED.retentionHours} h</span>
              <span>
                restore bytes {RECORDED.start.toLocaleString("en-US")}–
                {RECORDED.end.toLocaleString("en-US")}
              </span>
            </div>

            <p className="cut__sr">
              A deploy log is cut from 32,084 bytes to 18,607 bytes. 13,716 bytes are elided and
              retained locally. The marker names the id and the exact sutra_restore call.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
