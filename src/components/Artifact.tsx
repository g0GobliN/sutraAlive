import { useReducedMotion } from "motion/react";
import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ArtifactOverlay } from "./ArtifactScene";

const ArtifactScene = lazy(() => import("./ArtifactScene"));

type Callout = {
  index: number;
  numeral: string;
  key: string;
  title: string;
  detail: string;
  side: "left" | "right";
};

const CALLOUTS: Callout[] = [
  {
    index: 3,
    numeral: "01",
    key: "result",
    title: "Tool result",
    detail: "untrusted bytes enter",
    side: "right",
  },
  {
    index: 1,
    numeral: "02",
    key: "rules",
    title: "Six rules",
    detail: "deterministic cut",
    side: "left",
  },
  {
    index: 2,
    numeral: "03",
    key: "marker",
    title: "Marker",
    detail: "id · offsets · call",
    side: "right",
  },
  {
    index: 0,
    numeral: "04",
    key: "store",
    title: "Local store",
    detail: "bounded · 168 h",
    side: "left",
  },
];

const REDUCED = "(prefers-reduced-motion: reduce)";

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function StaticArtifact({ message }: { message: string }) {
  return (
    <div className="artifact__fallback">
      <div className="artifact__fallback-stack" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <p>{message}</p>
    </div>
  );
}

export function Artifact() {
  const stageRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const linesRef = useRef<(SVGPathElement | null)[]>([]);
  const dotsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const reduced = useReducedMotion() ?? false;

  const overlay = useMemo<ArtifactOverlay>(
    () => ({
      stage: stageRef,
      labels: labelsRef,
      lines: linesRef,
      dots: dotsRef,
    }),
    [],
  );

  const open = pinned || hovered;

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "260px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const context =
        canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl");
      setWebgl(Boolean(context));
    } catch {
      setWebgl(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(REDUCED);
    const onChange = () => {
      if (media.matches) setHovered(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <section className="section artifact" id="artifact">
      <div className="wrap">
        <div className="section__head section__head--split artifact__head">
          <div>
            <p className="section__index">The artifact / interactive</p>
            <h2>
              A gate,
              <br />
              in layers.
            </h2>
          </div>
          <p className="section__aside">
            Four physical stages of the real path: raw output enters, six rules cut it, a marker
            signs the omission, and the original stays in a bounded local store. The object is a
            schematic, not a simulation.
          </p>
        </div>

        <div
          ref={stageRef}
          className={`artifact__stage${open ? " is-open" : ""}`}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={() => setPinned((value) => !value)}
          role="group"
          aria-label="Interactive schematic of the SUTRA gate. Use the button below to open or close the layers."
        >
          <div className="artifact__canvas">
            {!visible || webgl === null ? (
              <StaticArtifact message="The artifact is being prepared." />
            ) : webgl ? (
              <SceneBoundary
                fallback={<StaticArtifact message="WebGL is unavailable. The four layers are listed below." />}
              >
                <Suspense fallback={<StaticArtifact message="The artifact is being prepared." />}>
                  <ArtifactScene open={open} reduced={reduced} overlay={overlay} />
                </Suspense>
              </SceneBoundary>
            ) : (
              <StaticArtifact message="WebGL is unavailable. The four layers are listed below." />
            )}
          </div>

          <div className="artifact__labels" aria-hidden="true">
            {CALLOUTS.map((callout) => (
              <div
                key={callout.key}
                className={`artifact__label artifact__label--${callout.key}`}
                data-side={callout.side}
                ref={(element) => {
                  labelsRef.current[callout.index] = element;
                }}
              >
                <span className="artifact__numeral">{callout.numeral}</span>
                <b>{callout.title}</b>
                <small>{callout.detail}</small>
              </div>
            ))}
          </div>

          <svg className="artifact__connectors" aria-hidden="true">
            {CALLOUTS.map((callout) => (
              <path
                key={callout.key}
                pathLength={1}
                ref={(element) => {
                  linesRef.current[callout.index] = element;
                }}
              />
            ))}
          </svg>

          <div className="artifact__dots" aria-hidden="true">
            {CALLOUTS.map((callout) => (
              <span
                key={callout.key}
                className="artifact__dot"
                ref={(element) => {
                  dotsRef.current[callout.index] = element;
                }}
              />
            ))}
          </div>

          <span className="artifact__hint" aria-hidden="true">
            Hover / tap to separate
          </span>
        </div>

        <div className="artifact__controls">
          <button
            className="artifact__toggle"
            type="button"
            aria-pressed={pinned}
            onClick={() => setPinned((value) => !value)}
          >
            {pinned ? "Close the artifact" : "Open the artifact"}
            <span aria-hidden="true">{pinned ? "↑" : "↓"}</span>
          </button>
          <p>
            Hover, tap, or use the button.{" "}
            {reduced
              ? "Reduced motion is on; the layers switch without the tween."
              : "The layers separate along the signal spine and return on leave."}
          </p>
        </div>

        <ol className="artifact__legend" aria-label="The four layers">
          {CALLOUTS.map((callout) => (
            <li key={callout.key}>
              <span>{callout.numeral}</span>
              <div>
                <b>{callout.title}</b>
                <small>{callout.detail}</small>
              </div>
            </li>
          ))}
        </ol>

        <p className="artifact__note">
          Schematic only. The 3D object illustrates the four stages; it does not execute SUTRA, call
          a model, or read a live store.
        </p>
      </div>
    </section>
  );
}
