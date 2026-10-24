import { useEffect, useRef } from "react";

type Trace = {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
  width: number;
};

type Mote = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  drift: number;
  phase: number;
};

const MAX_DPR = 2;

export function SignalField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let visible = true;
    let last = 0;
    let traces: Trace[] = [];
    let motes: Mote[] = [];

    const build = () => {
      const count = Math.max(12, Math.floor(width / 52));
      traces = Array.from({ length: count }, () => ({
        x: Math.random() * (width + 220) - 220,
        y: Math.random() * height,
        speed: 0.18 + Math.random() * 0.55,
        length: 32 + Math.random() * 150,
        opacity: 0.05 + Math.random() * 0.15,
        width: Math.random() > 0.82 ? 1.2 : 0.6,
      }));
      motes = Array.from({ length: Math.max(20, Math.floor(width / 34)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.5 + Math.random() * 1.2,
        opacity: 0.08 + Math.random() * 0.3,
        drift: 0.04 + Math.random() * 0.14,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduced) draw(0);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      context.lineCap = "round";
      for (const trace of traces) {
        const gradient = context.createLinearGradient(
          trace.x - trace.length,
          trace.y,
          trace.x,
          trace.y,
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.6, `rgba(255, 255, 255, ${trace.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(230, 230, 230, ${trace.opacity})`);
        context.strokeStyle = gradient;
        context.lineWidth = trace.width;
        context.beginPath();
        context.moveTo(trace.x - trace.length, trace.y);
        context.lineTo(trace.x, trace.y);
        context.stroke();

        if (!reduced) {
          trace.x += trace.speed;
          if (trace.x > width + trace.length) {
            trace.x = -trace.length;
            trace.y = Math.random() * height;
          }
        }
      }

      for (const mote of motes) {
        const pulse = 0.55 + Math.sin(time * 0.00035 + mote.phase) * 0.45;
        context.fillStyle = `rgba(230, 230, 230, ${mote.opacity * pulse})`;
        context.beginPath();
        context.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
        context.fill();
        if (!reduced) {
          mote.x += mote.drift;
          if (mote.x > width + 4) mote.x = -4;
        }
      }
    };

    const tick = (time: number) => {
      if (!running) return;
      const delta = Math.min(48, time - last);
      last = time;
      draw(time + delta);
      frame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduced || !visible) return;
      running = true;
      last = performance.now();
      frame = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );

    resize();
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    if (reduced) draw(0);
    else start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="signal-field" aria-hidden="true" />;
}
