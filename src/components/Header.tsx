import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { GITHUB, NAV_LINKS } from "../data";

export function Header() {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.35,
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 901px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    if (desktop.addEventListener) desktop.addEventListener("change", onChange);
    else desktop.addListener(onChange);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (desktop.removeEventListener) desktop.removeEventListener("change", onChange);
      else desktop.removeListener(onChange);
    };
  }, []);

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
      <header className="site-header">
        <div className="wrap header-inner">
          <a className="brand" href="#top" aria-label="SUTRA, back to the top">
            <span className="brand__mark" aria-hidden="true">
              <picture>
                <source srcSet="/assets/sutra-mark.webp" type="image/webp" />
                <img
                  className="brand__logo"
                  src="/assets/sutra-mark.png"
                  alt=""
                  width={780}
                  height={559}
                />
              </picture>
            </span>
            <span className="brand__stack">
              <span className="brand__word">Sutra</span>
              <span className="brand__sub">A stone gate for the context window</span>
            </span>
          </a>

          <button
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="nav-toggle__bars" aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
          </button>

          <nav id="primary-nav" className={`nav${open ? " is-open" : ""}`} aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <a
              className="nav__github"
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </nav>

          <motion.a
            className="button button--small button--outline header-cta"
            href="#install"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            Install
          </motion.a>
        </div>
      </header>
    </>
  );
}
