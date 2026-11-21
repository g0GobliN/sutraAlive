import { useEffect, useRef } from "react";
import { MODES } from "../data";

export function Modes() {
  const track = useRef<HTMLDivElement>(null);
  const centered = useRef(false);

  useEffect(() => {
    const node = track.current;
    if (!node) return;

    const cards = Array.from(node.querySelectorAll<HTMLElement>(".arc__card"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const box = node.getBoundingClientRect();
      const middle = box.left + box.width / 2;
      const span = Math.max(box.width * 0.62, 1);
      let closest = -1;
      let distance = Infinity;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const delta = Math.max(-1.4, Math.min(1.4, (center - middle) / span));
        const absolute = Math.abs(center - middle);

        if (absolute < distance) {
          distance = absolute;
          closest = index;
        }

        if (reduced.matches || window.innerWidth < 760) {
          card.style.transform = "";
          card.style.opacity = "1";
        } else {
          card.style.transform = `translateY(${absolute === 0 ? 0 : Math.abs(delta) * 54}px) rotate(${delta * 4.5}deg)`;
          card.style.opacity = String(1 - Math.abs(delta) * 0.22);
        }
      });

      cards.forEach((card, index) => card.classList.toggle("is-center", index === closest));
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    if (!centered.current && cards.length > 1) {
      centered.current = true;
      const nodeRect = node.getBoundingClientRect();
      const cardRect = cards[1].getBoundingClientRect();
      const target =
        node.scrollLeft +
        cardRect.left -
        nodeRect.left -
        (node.clientWidth - cardRect.width) / 2;
      node.scrollLeft = Math.max(0, Math.min(target, node.scrollWidth - node.clientWidth));
    }

    update();
    node.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      node.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const move = (direction: number) => {
    const node = track.current;
    if (!node) return;
    const card = node.querySelector<HTMLElement>(".arc__card");
    const gap = Number.parseFloat(getComputedStyle(node).columnGap) || 24;
    const step = card ? card.offsetWidth + gap : node.clientWidth * 0.7;
    const max = node.scrollWidth - node.clientWidth;

    if (direction > 0 && node.scrollLeft >= max - 80) {
      node.scrollTo({ left: 0, behavior: "auto" });
      return;
    }

    if (direction < 0 && node.scrollLeft <= 80) {
      node.scrollTo({ left: max, behavior: "auto" });
      return;
    }

    node.scrollBy({ left: step * direction, behavior: "auto" });
  };

  return (
    <section className="section modes" id="modes" aria-labelledby="modes-title">
      <div className="wrap modes__head">
        <div>
          <p className="kicker">the effort</p>
          <h2 id="modes-title">
            Choose a mode.
            <br />
            <span className="soft">Keep the contract.</span>
          </h2>
        </div>
        <p className="modes__aside">
          A mode changes how much bounded search SUTRA may spend. It does not change what can be
          accepted: every candidate must be smaller and preservation-clean.{" "}
          <code>balanced</code> is the default.
        </p>
      </div>

      <div
        className="arc"
        ref={track}
        tabIndex={0}
        role="group"
        aria-label="SUTRA optimization modes. Scroll horizontally to compare."
      >
        {MODES.map((mode) => (
          <article className={`arc__card arc__card--${mode.id}`} key={mode.id}>
            <div className="arc__top">
              <h3>{mode.name}</h3>
              <span>{mode.role}</span>
            </div>
            <p className="arc__body">{mode.body}</p>
            <dl className="arc__specs">
              <div>
                <dt>plans</dt>
                <dd>{mode.plans}</dd>
              </div>
              <div>
                <dt>passes</dt>
                <dd>{mode.passes}</dd>
              </div>
              <div>
                <dt>reuse</dt>
                <dd>{mode.reuse}</dd>
              </div>
              <div>
                <dt>bound</dt>
                <dd>{mode.bound}</dd>
              </div>
            </dl>
            <p className="arc__cmd">sutra mode {mode.id}</p>
          </article>
        ))}
      </div>

      <div className="wrap arc__foot">
        <div className="arc__controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous mode">
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Next mode">
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <p>
          The bound is an effort ceiling, not a deadline. The pass count is the deterministic stop.
          Larger modes are not guaranteed to save more; they explore more candidates and still
          return the original when none pass.
        </p>
      </div>
    </section>
  );
}
