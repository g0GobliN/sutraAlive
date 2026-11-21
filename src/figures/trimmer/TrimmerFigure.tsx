import * as React from "react";
import { Dots, FaceText, IsoFigure, Line, Solid } from "../../iso/react/draw";
import { useInView, useLoop, useStillness } from "../../iso/react/live";
import { iso, segment, translateAlong } from "../../iso/iso-kit";
import {
  BASE_ART,
  BEAM_ART,
  DIAL_ART,
  DRAWER_ART,
  HEAD_LEFT,
  HEAD_RIGHT,
  PORTAL_ART,
  SHEET_ART,
  TAPE_ART,
  cutArt,
  needleFor,
  spring,
} from "./geometry";
import {
  BEAM_STROKE,
  HEIGHT,
  P,
  POST_Z,
  TAPE_STROKE,
  TOTAL_BYTES,
  WIDTH,
  WINDOW_DEFAULT,
  WINDOW_MAX,
  WINDOW_MIN,
  bytesFor,
} from "./view";
import "./trimmer.css";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const span = (value: number, from: number, to: number) => clamp((value - from) / (to - from), 0, 1);
const ease = (value: number) => (value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2);
const fmt = (value: number) => Math.round(value).toLocaleString("en-US");

const READ_LABEL = "Isometric bench trimmer cutting an adjustable middle window from a sheet, with a splice marker and a store drawer.";

export function TrimmerFigure() {
  const root = React.useRef<HTMLDivElement>(null);
  const full = React.useRef<SVGGElement>(null);
  const head = React.useRef<SVGGElement>(null);
  const tail = React.useRef<SVGGElement>(null);
  const label = React.useRef<SVGGElement>(null);
  const band = React.useRef<SVGGElement>(null);
  const blade = React.useRef<SVGGElement>(null);
  const tape = React.useRef<SVGGElement>(null);
  const springL = React.useRef<SVGPathElement>(null);
  const springR = React.useRef<SVGPathElement>(null);
  const ram = React.useRef<SVGPathElement>(null);
  const needle = React.useRef<SVGPathElement>(null);
  const readout = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(root);
  const still = useStillness();
  const [window, setWindow] = React.useState(WINDOW_DEFAULT);
  const windowRef = React.useRef(window);
  const cycle = React.useRef({ t: -1 });
  const drag = React.useRef({ active: false, x: 0, moved: false });
  const idle = React.useRef(0);
  const shown = React.useRef("");
  const snapped = React.useRef(false);
  const art = React.useMemo(() => cutArt(window), [window]);

  const put = React.useCallback((element: SVGGElement | null, x = 0, z = 0, opacity = 1) => {
    if (!element) return;
    element.setAttribute("transform", translateAlong(P, [x, 0, z]));
    element.style.opacity = `${opacity}`;
  }, []);

  const say = React.useCallback((text: string) => {
    if (shown.current === text) return;
    shown.current = text;
    if (readout.current) readout.current.textContent = text;
  }, []);

  const idleText = React.useCallback((value: number) => {
    const bytes = bytesFor(value);
    return `${fmt(bytes)} B elided · ${((bytes / TOTAL_BYTES) * 100).toFixed(1)}% · window ${Math.round(value)}`;
  }, []);

  const cutNow = React.useCallback(() => {
    if (cycle.current.t >= 0) return;
    idle.current = 0;
    if (still) {
      snapped.current = true;
      cycle.current.t = -1;
      const value = windowRef.current;
      put(full.current, 0, 0, 0);
      put(head.current, value / 2, 0, 1);
      put(tail.current, -value / 2, 0, 1);
      put(label.current, 0, 0, 1);
      put(band.current, 0, 0, 0);
      say(`filed · ${fmt(bytesFor(value))} B · su_c9bb`);
      return;
    }
    snapped.current = false;
    cycle.current.t = 0;
  }, [put, say, still]);

  React.useEffect(() => {
    windowRef.current = window;
    if (snapped.current && still) {
      put(head.current, window / 2, 0, 1);
      put(tail.current, -window / 2, 0, 1);
      put(label.current, 0, 0, 1);
      say(`filed · ${fmt(bytesFor(window))} B · su_c9bb`);
    }
  }, [window, still, put, say]);

  const tick = React.useCallback(
    (dt: number, calm: boolean) => {
      const value = windowRef.current;
      if (needle.current) needle.current.setAttribute("d", needleFor(value));

      if (calm) {
        if (snapped.current) return true;
        say(idleText(value));
        return true;
      }

      if (cycle.current.t < 0) {
        idle.current += dt;
        if (idle.current > 7.2 && inView) {
          idle.current = -2;
          cycle.current.t = 0;
        } else {
          put(full.current, 0, 0, 0);
          put(head.current, 0, 0, 1);
          put(tail.current, 0, 0, 1);
          put(label.current, 0, 0, 0);
          put(band.current, 0, 0, 1);
          put(blade.current, 0, 0, 1);
          put(tape.current, 0, 0, 1);
          if (springL.current) springL.current.setAttribute("d", spring(-40, 0, 4.2, 110, POST_Z));
          if (springR.current) springR.current.setAttribute("d", spring(40, 0, 4.2, 110, POST_Z));
          if (ram.current) ram.current.setAttribute("d", segment([0, 0, 90], [0, 0, POST_Z], P));
          say(idleText(value));
          return true;
        }
      }

      const t = cycle.current.t;
      const down = ease(span(t, 0.1, 0.26));
      const up = ease(span(t, 0.34, 0.44));
      const stroke = -BEAM_STROKE * Math.max(0, Math.min(down, 1 - up));
      const slide = ease(span(t, 0.42, 0.64)) * (value / 2);
      const drop = ease(span(t, 0.36, 0.58));
      const fall = -10 * drop;
      const fadeBand = 1 - ease(span(t, 0.38, 0.47));
      const splice = t >= 0.75 ? 1 : 0;
      const tapeDown = ease(span(t, 0.6, 0.76));
      const tapeUp = ease(span(t, 0.78, 0.84));
      const tapeStroke = -TAPE_STROKE * Math.max(0, Math.min(tapeDown, 1 - tapeUp));
      const exit = ease(span(t, 0.9, 0.97)) * 270;
      const exitFade = 1 - ease(span(t, 0.93, 0.975));
      const feed = ease(span(t, 0.92, 1));
      const feedOpacity = ease(span(t, 0.92, 0.97));

      put(blade.current, 0, stroke, 1);
      put(tape.current, 0, tapeStroke, 1);
      if (springL.current) springL.current.setAttribute("d", spring(-40, 0, 4.2, 110 + stroke, POST_Z));
      if (springR.current) springR.current.setAttribute("d", spring(40, 0, 4.2, 110 + stroke, POST_Z));
      if (ram.current) ram.current.setAttribute("d", segment([0, 0, 90 + tapeStroke], [0, 0, POST_Z], P));

      if (t < 0.9) {
        put(full.current, 0, 0, 0);
        put(head.current, slide, 0, 1);
        put(tail.current, -slide, 0, 1);
        put(band.current, 0, fall, fadeBand);
        put(label.current, 0, 0, splice ? 1 : 0);
      } else {
        put(full.current, -270 + feed * 270, 0, feedOpacity);
        put(head.current, slide + exit, 0, exitFade);
        put(tail.current, -slide + exit, 0, exitFade);
        put(label.current, exit, 0, splice * exitFade);
        put(band.current, 0, fall, 0);
      }

      if (t < 0.1) say(idleText(value));
      else if (t < 0.36) say(`trimming · ${fmt(bytesFor(value))} B`);
      else if (t < 0.76) say(`offcut filed · ${fmt(bytesFor(value))} B`);
      else if (t < 0.9) say(`spliced · su_c9bb`);
      else say("feeding the next sheet");

      cycle.current.t += dt / 11.2;
      if (cycle.current.t >= 1) {
        cycle.current.t = -1;
        idle.current = 0;
        snapped.current = false;
        put(full.current, 0, 0, 0);
        put(head.current, 0, 0, 1);
        put(tail.current, 0, 0, 1);
        put(label.current, 0, 0, 0);
        put(band.current, 0, 0, 1);
        put(blade.current, 0, 0, 1);
        put(tape.current, 0, 0, 1);
        if (ram.current) ram.current.setAttribute("d", segment([0, 0, 90], [0, 0, POST_Z], P));
        say(idleText(value));
      }
      return true;
    },
    [idleText, inView, put, say],
  );

  useLoop(tick, inView);

  const setFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (cycle.current.t >= 0) return;
    const svg = root.current?.querySelector<SVGSVGElement>("svg");
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const sx = point.matrixTransform(matrix.inverse()).x;
          const originX = iso([0, 0, 0], P)[0];
      const perUnit = iso([1, 0, 0], P)[0] - originX;
      const worldX = (sx - originX) / perUnit;
    const next = Math.round(clamp(Math.abs(worldX) * 2, WINDOW_MIN, WINDOW_MAX));
    windowRef.current = next;
    setWindow(next);
  };

  const adjust = (delta: number) => {
    if (cycle.current.t >= 0) return;
    const next = Math.round(clamp(windowRef.current + delta, WINDOW_MIN, WINDOW_MAX));
    windowRef.current = next;
    setWindow(next);
    idle.current = 0;
    if (snapped.current && still) return;
    snapped.current = false;
    put(full.current, 0, 0, 0);
    put(head.current, 0, 0, 1);
    put(tail.current, 0, 0, 1);
    put(label.current, 0, 0, 0);
    put(band.current, 0, 0, 1);
    say(idleText(next));
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      adjust(-(event.shiftKey ? 14 : 5));
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      adjust(event.shiftKey ? 14 : 5);
    } else if (event.key === "Home") {
      event.preventDefault();
      adjust(WINDOW_MIN - windowRef.current);
    } else if (event.key === "End") {
      event.preventDefault();
      adjust(WINDOW_MAX - windowRef.current);
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      cutNow();
    }
  };

  return (
    <div
      ref={root}
      className="trimmer iso"
      role="slider"
      tabIndex={0}
      aria-label="Bench trimmer. Set the middle window, then press to cut."
      aria-valuemin={Math.round(WINDOW_MIN)}
      aria-valuemax={Math.round(WINDOW_MAX)}
      aria-valuenow={Math.round(window)}
      aria-valuetext={`${fmt(bytesFor(window))} bytes elided, ${((bytesFor(window) / TOTAL_BYTES) * 100).toFixed(1)} percent`}
      onPointerDown={(event) => {
        root.current?.focus();
        drag.current = { active: true, x: event.clientX, moved: false };
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!drag.current.active) return;
        if (Math.abs(event.clientX - drag.current.x) > 3) drag.current.moved = true;
        if (drag.current.moved) setFromPointer(event);
      }}
      onPointerUp={(event) => {
        if (!drag.current.active) return;
        const moved = drag.current.moved;
        drag.current.active = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        if (!moved) cutNow();
      }}
      onPointerCancel={() => {
        drag.current.active = false;
      }}
      onClick={() => {
        if (!drag.current.moved) cutNow();
      }}
      onKeyDown={onKeyDown}
    >
      <div className="trimmer__corners" aria-hidden="true">
        <span>Fig 7</span>
        <span>trim and splice</span>
      </div>

      <IsoFigure width={WIDTH} height={HEIGHT} label={READ_LABEL} className="trimmer__figure">
        <g key="base">
          <path className="iso-halo" d={BASE_ART.halo} />
          {BASE_ART.feet.map((parts, index) => (
            <g key={index}>
              {parts.map((paths, part) => (
                <Solid key={part} paths={paths} tone={part ? "mid" : "lo"} crease="none" />
              ))}
            </g>
          ))}
          <Solid paths={BASE_ART.slab} tone="mid" crease="faint" />
          <Solid paths={BASE_ART.bed} tone="mid" crease="faint" />
          <Solid paths={BASE_ART.slot} tone="lo" crease="none" flat />
          <Line d={BASE_ART.slotLine} tone="lo" />
          <Line d={BASE_ART.bedGroove} tone="lo" />
          <Line d={BASE_ART.screwRings} tone="lo" />
          <Dots points={BASE_ART.screws} size={0.6} tone="mid" />
          <Solid paths={BASE_ART.ruler} tone="lo" crease="none" />
          <Line d={BASE_ART.rulerBase} tone="lo" />
          <Line d={BASE_ART.ticksMinor} tone="lo" />
          <Line d={BASE_ART.ticksMajor} tone="mid" />
          <Solid paths={BASE_ART.plate} tone="lo" crease="none" />
          <Line d={BASE_ART.plateLine} tone="faint" />
          <Dots points={BASE_ART.plateScrews} size={0.5} tone="mid" />
          <FaceText transform={BASE_ART.plateText} size={4.4} tone="lo" anchor="middle">
            SUTRA
          </FaceText>
        </g>

        <g key="portal-back">
          <Solid paths={PORTAL_ART.backPad} tone="lo" crease="faint" />
          <Solid paths={PORTAL_ART.backPost} tone="mid" crease="faint" />
          <Line d={PORTAL_ART.backLine} tone="lo" />
        </g>

        <g key="bridge">
          <Solid paths={PORTAL_ART.bridge} tone="mid" crease="faint" />
          <Line d={PORTAL_ART.bridgeLine} tone="faint" />
          <Solid paths={PORTAL_ART.mount} tone="lo" crease="none" />
          <Solid paths={PORTAL_ART.arm} tone="lo" crease="none" />
          <Dots points={PORTAL_ART.bridgeScrews} size={0.55} tone="mid" />
          <Dots points={PORTAL_ART.padScrews} size={0.45} tone="mid" />
        </g>

        <g key="tape-reel">
          <Solid paths={TAPE_ART.bracket} tone="lo" crease="none" />
          <Solid paths={TAPE_ART.roll} tone="mid" crease="faint" />
          <Line d={TAPE_ART.rollLine} tone="lo" />
          <Solid paths={TAPE_ART.rollCap} tone="mid" crease="faint" />
          <Solid paths={TAPE_ART.rollHub} tone="hi" crease="none" />
        </g>

        <g key="dial">
          <Solid paths={DIAL_ART.stand} tone="lo" crease="faint" />
          <Dots points={DIAL_ART.standScrews} size={0.45} tone="mid" />
          <Solid paths={DIAL_ART.body} tone="mid" crease="faint" />
          <Line d={DIAL_ART.bezel} tone="lo" />
          <Line d={DIAL_ART.face} tone="faint" />
          <Line d={DIAL_ART.ticksMinor} tone="lo" />
          <Line d={DIAL_ART.ticksMajor} tone="mid" />
          <path ref={needle} className="iso-line" data-tone="lit" d={needleFor(window)} />
          <Solid paths={DIAL_ART.hub} tone="hi" crease="none" />
          <FaceText transform={DIAL_ART.label} size={2.6} tone="lo" anchor="middle">
            elided
          </FaceText>
        </g>

        <g ref={full} className="trimmer__sheet trimmer__stock" style={{ opacity: 0 }}>
          <Solid paths={SHEET_ART.slab} tone="hi" crease="faint" />
          <Line d={SHEET_ART.lines} tone="mid" free />
          <Line d={SHEET_ART.edge} tone="mid" />
        </g>

        <g key="sheet-cut">
          <g ref={head} className="trimmer__stock">
            <Solid paths={art.head} tone="hi" crease="faint" />
            <Line d={art.headLines} tone="mid" free />
            <Line d={art.headEdge} tone="mid" />
          </g>
          <g ref={tail} className="trimmer__stock">
            <Solid paths={art.tail} tone="hi" crease="faint" />
            <Line d={art.tailLines} tone="mid" free />
            <Line d={art.tailEdge} tone="mid" />
          </g>
          <g ref={band}>
            <Solid paths={art.band} tone="hi" crease="faint" lit />
            <Line d={art.bandLines} tone="mid" free />
            <Line d={art.bandEdge} tone="lit" />
          </g>
          <g ref={label} style={{ opacity: 0 }}>
            <Solid paths={art.label} tone="hi" crease="none" lit />
            <FaceText transform={art.labelText} size={2.2} tone="hi" anchor="middle">
              su_c9bb
            </FaceText>
          </g>
        </g>


        <path ref={ram} className="iso-line" data-tone="mid" d={segment([0, 0, 90], [0, 0, POST_Z], P)} />

        <g key="guides">
          {BEAM_ART.rods.map((paths, index) => (
            <Solid key={index} paths={paths} tone="lo" crease="none" />
          ))}
          <path ref={springL} className="iso-line" data-tone="lo" d={spring(-40, 0, 4.2, 110, POST_Z)} />
          <path ref={springR} className="iso-line" data-tone="lo" d={spring(40, 0, 4.2, 110, POST_Z)} />
        </g>

        <g key="blades" ref={blade}>
          <Solid paths={BEAM_ART.beam} tone="mid" crease="faint" />
          <Line d={BEAM_ART.beamLine} tone="faint" />
          <Dots points={BEAM_ART.beamScrews} size={0.5} tone="mid" />
          <Solid paths={BEAM_ART.screw} tone="lo" crease="none" />
          <Solid paths={BEAM_ART.knobBlock} tone="lo" crease="faint" />
          <Solid paths={BEAM_ART.knob} tone="mid" crease="faint" />
          <Line d={BEAM_ART.knobLine} tone="lo" />
          <Solid paths={BEAM_ART.knobCap} tone="hi" crease="faint" />
          {BEAM_ART.ends.map((paths, index) => (
            <Solid key={index} paths={paths} tone="mid" crease="faint" />
          ))}
          {[
            { x: -window / 2, art: HEAD_LEFT },
            { x: window / 2, art: HEAD_RIGHT },
          ].map(({ x, art: headArt }, index) => (
            <g key={index} transform={translateAlong(P, [x, 0, 0])}>
              <Solid paths={headArt.block} tone="mid" crease="faint" />
              <Line d={headArt.blockLine} tone="faint" />
              <Dots points={headArt.screws} size={0.45} tone="mid" />
              <Solid paths={headArt.blade} tone="mid" crease="none" />
              <Line d={headArt.edge} tone="hi" />
              <Solid paths={headArt.shoe} tone="mid" crease="faint" />
              <Line d={headArt.shoeLine} tone="faint" />
              <Solid paths={headArt.arm} tone="lo" crease="none" />
            </g>
          ))}
        </g>

        <g key="tape-head" ref={tape}>
          <Solid paths={TAPE_ART.head.block} tone="mid" crease="faint" />
          <Line d={TAPE_ART.head.blockLine} tone="faint" />
          <Dots points={TAPE_ART.head.screws} size={0.45} tone="mid" />
          <Solid paths={TAPE_ART.head.pad} tone="lo" crease="none" />
          <Line d={TAPE_ART.head.padLine} tone="faint" />
        </g>

        <g key="drawer">
          <Solid paths={DRAWER_ART.front} tone="mid" crease="faint" />
          <Line d={DRAWER_ART.faceLine} tone="faint" />
          <Solid paths={DRAWER_ART.handle} tone="lo" crease="none" />
          <Solid paths={DRAWER_ART.label} tone="lo" crease="none" />
          <Line d={DRAWER_ART.labelRules} tone="lo" />
          <Dots points={DRAWER_ART.labelScrews} size={0.4} tone="mid" />
          <Solid paths={DRAWER_ART.access} tone="lo" crease="faint" />
          <Line d={DRAWER_ART.accessRules} tone="lo" />
          <Dots points={DRAWER_ART.accessScrews} size={0.4} tone="mid" />
        </g>
      </IsoFigure>

      <div className="trimmer__hint" aria-hidden="true">
        drag to set · press to trim
      </div>
      <div className="trimmer__readout">
        <span ref={readout} data-readout="">{idleText(WINDOW_DEFAULT)}</span>
      </div>
    </div>
  );
}
