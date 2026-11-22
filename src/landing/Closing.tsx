import { useLayoutEffect, useRef } from "react";
import { GITHUB } from "../data";
import { gsap, reducedMotion } from "../lib/scroll";

export function Closing() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const section = root.current;
    if (!section) return;
    let observer: IntersectionObserver | undefined;

    const context = gsap.context(() => {
      const timeline = gsap
        .timeline({ paused: true, defaults: { ease: "power2.out" } })
        .from(".closing__mark img", {
          clipPath: "inset(0 100% 0 0)",
          opacity: 0,
          duration: 0.65,
          ease: "power2.inOut",
        })
        .from(".closing__kicker", { y: 10, opacity: 0, duration: 0.3 }, 0)
        .from(".closing h2", { y: 26, opacity: 0, duration: 0.5 }, 0.04)
        .from(".closing__lede", { y: 14, opacity: 0, duration: 0.4 }, 0.16)
        .from(
          ".closing__actions > *",
          { y: 10, opacity: 0, duration: 0.35, stagger: 0.04 },
          0.24,
        )
        .from(".closing__sig", { opacity: 0, duration: 0.3 }, 0.38);

      // IntersectionObserver fires on observe when the section is already in
      // view, so a restored scroll position plays the reveal too.
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          timeline.play();
          observer?.disconnect();
        },
        { threshold: 0.1 },
      );
      observer.observe(section);

      gsap.to(".closing__mark img", {
        y: -7,
        duration: 6.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, root);

    return () => {
      observer?.disconnect();
      context.revert();
    };
  }, []);

  return (
    <section className="closing" ref={root} aria-labelledby="closing-title">
      <div className="wrap closing__grid">
        <div className="closing__copy">
          <p className="closing__kicker">the signal survives</p>
          <h2 id="closing-title">
            The original stays.
            <br />
            <em>The receipt travels.</em>
          </h2>
          <p className="closing__lede">
            No model calls. No invented content. Every retained byte has an id, a lifetime and a
            bounded store behind it.
          </p>
          <div className="closing__actions">
            <a className="btn btn--paper" href="#install">
              install sutra <span aria-hidden="true">→</span>
            </a>
            <a className="btn btn--paper-ghost" href="/docs">
              read the manual
            </a>
            <a className="link-inverse" href={GITHUB} target="_blank" rel="noopener noreferrer">
              source <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="closing__sig">A stone gate for the context window.</p>
        </div>

        <div className="closing__mark" aria-hidden="true">
          <img src="/assets/sutra-mark.png" alt="" width={780} height={559} loading="lazy" />
        </div>
      </div>
    </section>
  );
}
