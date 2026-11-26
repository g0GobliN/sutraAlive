import { useEffect, useRef } from "react";

/*
 * The page's engraving, in its second life.
 *
 * At the top of the page the art sits in the hero as a foreground plate and
 * stays put — it is the figure, not a scroll toy. As the reader scrolls, this
 * layer eases in: it descends from above the fold, slides to rest and settles at
 * the background weight, so the same engraving appears again behind the page
 * rather than switching on.
 *
 * The progress is published once on the root as `--art-p`, so any other consumer
 * reads the same value from one loop.
 *
 * The value is a 0–1 progress, not a threshold, and it is lerped toward the
 * scroll target inside one rAF loop — so a flick of the wheel still reads as the
 * art travelling, never as a fade snapping on. On small screens the hero plate
 * is hidden and this layer is the only art, still starting hidden and arriving
 * on scroll.
 */
const START = 140; // px of scroll before the art begins to arrive
const RANGE = 620; // px over which it reaches full background weight

export function PageArt({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let target = 0;
    let current = 0;
    let frame = 0;

    const progress = () => {
      const y = window.scrollY;
      return Math.min(1, Math.max(0, (y - START) / RANGE));
    };

    const tick = () => {
      frame = 0;
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.002) current = target;
      document.documentElement.style.setProperty("--art-p", current.toFixed(3));
      if (current !== target) frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = progress();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    current = 0;
    target = progress();
    document.documentElement.style.setProperty("--art-p", target.toFixed(3));
    if (target > 0) {
      current = 0;
      frame = requestAnimationFrame(tick);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="page-art" ref={ref} aria-hidden="true">
      <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
    </div>
  );
}
