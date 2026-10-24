import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect } from "react";
import { Artifact } from "./components/Artifact";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import {
  Canon,
  Closing,
  Footer,
  Passage,
  Problem,
  Proof,
  Ritual,
} from "./components/Sections";

gsap.registerPlugin(ScrollTrigger);

const REDUCED = "(prefers-reduced-motion: reduce)";

function useChoreography() {
  useLayoutEffect(() => {
    const media = window.matchMedia(REDUCED);
    const context = gsap.context(() => {
      if (media.matches) {
        gsap.set(".reveal", { clearProps: "all" });
        gsap.set(".diagram__signal", { strokeDashoffset: 0 });
        return;
      }

      gsap.from(".hero__meta", {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      gsap.from(".hero__line", {
        y: 34,
        opacity: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.18,
      });

      gsap.from(".hero__lede", {
        y: 18,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.55,
      });

      gsap.from(".hero__actions", {
        y: 14,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.7,
      });

      gsap.fromTo(
        ".hero__beam",
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: "left center", duration: 1.8, ease: "power3.inOut", delay: 0.3 },
      );

      ScrollTrigger.batch(".reveal", {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { y: 26, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out", overwrite: true },
          ),
      });

      const diagram = gsap.timeline({
        scrollTrigger: {
          trigger: ".diagram",
          start: "top 82%",
          end: "bottom 58%",
          scrub: 0.6,
        },
      });

      diagram
        .from(".diagram__fragments", { opacity: 0, duration: 0.35 })
        .fromTo(
          ".diagram__signal",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.6, stagger: 0.15, ease: "none" },
        )
        .from(
          ".diagram__node, .diagram__output, .diagram__tag",
          { opacity: 0, scale: 0.94, transformOrigin: "center", duration: 0.35 },
          "-=0.2",
        );

      gsap.from(".observation__figure", {
        opacity: 0,
        y: 18,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".observation", start: "top 84%", once: true },
      });

      gsap.from(".assay__track i", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".assay",
          start: "top 82%",
          once: true,
        },
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => undefined);

    return () => context.revert();
  }, []);
}

export function App() {
  useChoreography();

  return (
    <div className="page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="grain" aria-hidden="true" />
      <Header />
      <main id="main">
        <Hero />
        <Artifact />
        <Problem />
        <Passage />
        <Canon />
        <Proof />
        <Ritual />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}
