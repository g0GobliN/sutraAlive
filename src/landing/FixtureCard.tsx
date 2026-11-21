import { useCallback, useEffect, useRef, useState } from "react";
import type { Fixture } from "../data";
import { SpecimenFigure } from "../figures/assay/SpecimenFigure";
import { gsap, reducedMotion } from "../lib/scroll";

const tokenCount = (value: string) => Number(value.replace(/,/g, ""));
const bytesUnit = (value: string) => value.replace(/^[\d.,\s]+/, "");

export function FixtureCard({ fixture, index }: { fixture: Fixture; index: number }) {
  const [lifted, setLifted] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const [trackVisible, setTrackVisible] = useState(false);
  const line = useRef<HTMLElement>(null);
  const percent = useRef<HTMLElement>(null);
  const bytes = useRef<HTMLElement>(null);
  const tokens = useRef<HTMLElement>(null);

  const play = useCallback(() => {
    if (fixture.zero || reducedMotion()) return;

    const saved = parseFloat(fixture.saved);
    const bytesFrom = parseFloat(fixture.bytesBefore);
    const bytesTo = parseFloat(fixture.bytesAfter);
    const unit = bytesUnit(fixture.bytesAfter);
    const tokensFrom = tokenCount(fixture.tokensBefore);
    const tokensTo = tokenCount(fixture.tokensAfter);
    const state = { saved: 0, bytes: bytesFrom, tokens: tokensFrom };

    if (line.current) {
      gsap.fromTo(
        line.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 1.15,
          ease: "power3.out",
          overwrite: true,
        },
      );
    }

    gsap.to(state, {
      saved,
      bytes: bytesTo,
      tokens: tokensTo,
      duration: 1.15,
      ease: "power2.out",
      overwrite: true,
      onUpdate: () => {
        if (percent.current) percent.current.textContent = `${state.saved.toFixed(1)}%`;
        if (bytes.current) bytes.current.textContent = `${state.bytes.toFixed(1)} ${unit}`;
        if (tokens.current) tokens.current.textContent = Math.round(state.tokens).toLocaleString("en-US");
      },
      onComplete: () => {
        if (percent.current) percent.current.textContent = fixture.saved;
        if (bytes.current) bytes.current.textContent = fixture.bytesAfter;
        if (tokens.current) tokens.current.textContent = fixture.tokensAfter;
      },
    });
  }, [fixture]);

  useEffect(() => {
    const node = track.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setTrackVisible(entry.isIntersecting && entry.intersectionRatio >= 0.99),
      { threshold: [0, 1] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (trackVisible) play();
  }, [trackVisible, play]);

  useEffect(() => {
    if (lifted) play();
  }, [lifted, play]);

  return (
    <li className={`fixture${fixture.zero ? " fixture--zero" : ""}`}>
      <SpecimenFigure index={index} lifted={lifted} onToggle={() => setLifted((value) => !value)} />
      <div className="fixture__top">
        <code>{fixture.rule}</code>
        <strong ref={percent}>{fixture.saved}</strong>
      </div>
      <h3>{fixture.payload}</h3>
      <div className="fixture__track" aria-hidden="true" ref={track}>
        <i ref={line} style={{ width: `${fixture.width}%` }} />
      </div>
      <dl className="fixture__meta">
        <div>
          <dt>bytes</dt>
          <dd>
            {fixture.bytesBefore} → <span ref={bytes}>{fixture.bytesAfter}</span>
          </dd>
        </div>
        <div>
          <dt>tokens</dt>
          <dd>
            {fixture.tokensBefore} → <span ref={tokens}>{fixture.tokensAfter}</span>
          </dd>
        </div>
      </dl>
    </li>
  );
}
