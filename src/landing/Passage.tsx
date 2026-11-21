import { useLayoutEffect, useRef } from "react";
import { STEPS } from "../data";
import { gsap, reducedMotion } from "../lib/scroll";

export function Passage() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const context = gsap.context(() => {
      gsap.to(".passage__marquee-inner", {
        xPercent: -22,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        ".passage__edge",
        { yPercent: 18 },
        {
          yPercent: -26,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      gsap.from(".passage__step", {
        y: 46,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".passage__steps", start: "top 82%", once: true },
      });

      gsap.from(".passage__head > *", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".passage__head", start: "top 84%", once: true },
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section className="section passage" id="passage" ref={root} aria-labelledby="passage-title">
      <div className="passage__marquee" aria-hidden="true">
        <div className="passage__marquee-inner">
          <span>omit</span>
          <i>·</i>
          <span>label</span>
          <i>·</i>
          <span>retain</span>
          <i>·</i>
          <span>restore</span>
          <i>·</i>
          <span>omit</span>
          <i>·</i>
          <span>label</span>
          <i>·</i>
        </div>
      </div>

      <span className="passage__edge" aria-hidden="true">
        omission is not deletion
      </span>

      <div className="wrap passage__inner">
        <header className="passage__head">
          <p className="kicker">the passage</p>
          <h2 id="passage-title">
            It does not summarize.
            <br />
            <span className="soft">It signs the omission.</span>
          </h2>
          <p className="passage__lede">
            One ordered pass. A result enters with every byte present, meets a fixed set of rules,
            and leaves smaller — carrying a marker that names what left, how much, and the exact
            call that returns it.
          </p>
        </header>

        <ol className="passage__steps">
          {STEPS.map((step) => (
            <li className="passage__step" key={step.number}>
              <span className="passage__num">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <code>{step.meta}</code>
            </li>
          ))}
        </ol>

        <div className="passage__foot">
          <p>
            <strong>The zero rows are the point.</strong> A patch is returned byte-identical; a
            JSON document keeps its shape. When a rewrite could hide a change, SUTRA returns the
            original.
          </p>
          <a className="link-quiet" href="#proof">
            see the assay <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
