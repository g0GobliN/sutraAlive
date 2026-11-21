import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "../lib/scroll";

const GLYPHS = "0123456789%./×";
const DURATION = 950;

function noise(length: number) {
  let out = "";
  for (let index = 0; index < length; index += 1) {
    out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  return out;
}

export function ScrambleText({
  text,
  delay = 0,
  trigger = "mount",
}: {
  text: string;
  delay?: number;
  trigger?: "mount" | "view";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const reduced = reducedMotion();
  const [display, setDisplay] = useState(() => (reduced ? text : noise(text.length)));
  const [active, setActive] = useState(trigger === "mount");

  useEffect(() => {
    if (trigger !== "view" || reduced) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5) {
          setActive(true);
        } else if (!entry.isIntersecting) {
          setActive(false);
          setDisplay(noise(text.length));
        }
      },
      { threshold: [0, 0.5] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, trigger]);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setDisplay(text);
      return;
    }

    let interval: number | undefined;
    const wait = started.current ? 0 : delay;
    const timer = window.setTimeout(() => {
      started.current = true;
      const start = performance.now();
      interval = window.setInterval(() => {
        const progress = Math.min(1, (performance.now() - start) / DURATION);
        const locked = Math.floor(progress * text.length);

        if (progress >= 1) {
          setDisplay(text);
          if (interval) window.clearInterval(interval);
          return;
        }

        let next = text.slice(0, locked);
        for (let index = locked; index < text.length; index += 1) {
          next += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setDisplay(next);
      }, 45);
    }, wait);

    return () => {
      window.clearTimeout(timer);
      if (interval) window.clearInterval(interval);
    };
  }, [active, delay, reduced, text]);

  return (
    <span ref={ref} className="scramble">
      <span className="visually-hidden">{text}</span>
      <span className="scramble__ghost" aria-hidden="true">
        {text}
      </span>
      <span className="scramble__live" aria-hidden="true">
        {display}
      </span>
    </span>
  );
}
