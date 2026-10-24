import { Suspense, lazy, useEffect, useRef, useState } from "react";

const ClosingSealScene = lazy(() => import("./ClosingSealScene"));

function StaticSeal() {
  return (
    <picture>
      <source srcSet="/assets/sutra-mark.webp" type="image/webp" />
      <img
        className="closing__logo"
        src="/assets/sutra-mark.png"
        alt=""
        width={780}
        height={559}
        loading="lazy"
      />
    </picture>
  );
}

export function ClosingSeal() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMounted(true);
        setActive(entry.isIntersecting);
      },
      { rootMargin: "320px 0px", threshold: 0 },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setWebgl(
        Boolean(
          canvas.getContext("webgl2") ??
            canvas.getContext("webgl") ??
            canvas.getContext("experimental-webgl"),
        ),
      );
    } catch {
      setWebgl(false);
    }
  }, []);

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    update();
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return (
    <div ref={hostRef} className="closing__artifact" aria-hidden="true">
      {mounted && webgl ? (
        <Suspense fallback={<StaticSeal />}>
          <ClosingSealScene active={active && pageVisible} />
        </Suspense>
      ) : (
        <StaticSeal />
      )}
    </div>
  );
}
