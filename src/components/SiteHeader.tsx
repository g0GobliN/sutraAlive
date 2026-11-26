import { useEffect, useRef, useState } from "react";
import { DOCS_LINKS, GITHUB, PYPI, NAV_LINKS } from "../data";
import { Mark } from "./Mark";

type Props = { docs?: boolean; legal?: boolean };

type MenuLink = { label: string; note: string; href: string; external?: boolean };

type Menu = { title: string; kicker: string; links: MenuLink[] };

const DOCS_NAV = [
  { href: "#quickstart", label: "quickstart" },
  { href: "#install", label: "install" },
  { href: "#configuration", label: "configure" },
  { href: "#recovery", label: "recovery" },
];

const MOBILE_GROUPS: { title: string; links: MenuLink[] }[] = [
  {
    title: "Documentation",
    links: [
      { label: "overview", note: "", href: "/docs#overview" },
      { label: "quickstart", note: "", href: "/docs#quickstart" },
      { label: "integration matrix", note: "", href: "/integrations" },
      { label: "modes", note: "", href: "/docs#modes" },
      { label: "recovery", note: "", href: "/docs#recovery" },
      { label: "troubleshooting", note: "", href: "/docs#troubleshooting" },
    ],
  },
  {
    title: "The project",
    links: [
      { label: "features", note: "", href: "/#features" },
      { label: "faq", note: "", href: "/#faq" },
      { label: "install targets", note: "", href: "/#surfaces" },
      { label: "source on github", note: "", href: GITHUB, external: true },
      { label: "package on pypi", note: "", href: PYPI, external: true },
    ],
  },
];

const MENUS: Record<string, Menu> = {
  features: {
    kicker: "the layer",
    title: "Features",
    links: [
      { label: "the cut", note: "head, tail, marker", href: "#features" },
      { label: "install targets", note: "six hosts, one core", href: "#surfaces" },
      { label: "modes", note: "off · balanced · aggressive · beast", href: "#modes" },
      { label: "the full path", note: "mechanism, step by step", href: "/docs#overview" },
    ],
  },
  faq: {
    kicker: "evidence",
    title: "Answers",
    links: [
      { label: "faq", note: "cut, restore, patches, models", href: "#faq" },
      { label: "evidence & limits", note: "what was measured", href: "/docs#evidence" },
      { label: "troubleshooting", note: "not_found, stale copies", href: "/docs#troubleshooting" },
      { label: "security model", note: "store, telemetry", href: DOCS_LINKS.security },
      { label: "MIT license", note: "what it permits", href: DOCS_LINKS.license },
    ],
  },
  modes: {
    kicker: "one switch",
    title: "Modes",
    links: [
      { label: "off", note: "base compression only", href: "#modes" },
      { label: "balanced", note: "the default", href: "#modes" },
      { label: "aggressive", note: "more passes, ordered pairs", href: "#modes" },
      { label: "beast", note: "widest bounded search", href: "#modes" },
      { label: "mode reference", note: "resolution order", href: "/docs#modes" },
    ],
  },
  install: {
    kicker: "five minutes",
    title: "Install",
    links: [
      { label: "quickstart", note: "pip, mode, detect", href: "/docs#quickstart" },
      { label: "integration matrix", note: "every host, one page", href: "/integrations" },
      { label: "deepseek harness", note: "sutra install --client dsh", href: "/docs#deepseek" },
      { label: "uninstall", note: "removes only its own entries", href: "/docs#uninstall" },
      { label: "package on pypi", note: "sutra-agent", href: PYPI, external: true },
    ],
  },
};

export function SiteHeader({ docs = false, legal = false }: Props) {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setMenu(null);
      }
    };
    const onResize = () => {
      setOpen(false);
      setMenu(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(".hdr")) setMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const close = () => {
    setOpen(false);
    setMenu(null);
  };

  const openMenu = (label: string) => {
    window.clearTimeout(timer.current);
    setMenu(label);
  };

  const scheduleClose = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMenu(null), 160);
  };

  const leftLinks = docs ? DOCS_NAV.slice(0, 2) : legal ? [] : NAV_LINKS.slice(0, 2);
  const rightLinks = docs ? DOCS_NAV.slice(2) : legal ? [] : NAV_LINKS.slice(2);

  const renderNav = (links: typeof NAV_LINKS) =>
    links.map((link) => {
      const entry = !docs && !legal ? MENUS[link.label] : undefined;

      if (!entry) {
        return (
          <a key={link.href} href={link.href} onClick={close}>
            {link.label}
          </a>
        );
      }

      const isOpen = menu === link.label;

      return (
        <div
          className="hdr__item"
          key={link.label}
          onMouseEnter={() => openMenu(link.label)}
          onMouseLeave={scheduleClose}
        >
          <button
            type="button"
            className={`hdr__trigger${isOpen ? " is-open" : ""}`}
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-controls={`menu-${link.label}`}
            onClick={() => openMenu(link.label)}
            onFocus={() => openMenu(link.label)}
          >
            {link.label}
          </button>

          <div className={`mega${isOpen ? " is-open" : ""}`} id={`menu-${link.label}`}>
            <div className="mega__inner">
              <div className="mega__head">
                <p className="mega__kicker">{entry.kicker}</p>
                <p className="mega__title">{entry.title}</p>
              </div>
              <ul className="mega__list">
                {entry.links.map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <a
                      href={item.href}
                      onClick={close}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <span className="mega__link">{item.label}</span>
                      <span className="mega__note">{item.note}</span>
                      <span className="mega__arrow" aria-hidden="true">
                        {item.external ? "↗" : "→"}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    });

  return (
    <>
      <header className="hdr">
      <div className="hdr__inner">
        <nav className="hdr__nav hdr__nav--left" aria-label="Sections">
          {renderNav(leftLinks)}
        </nav>

        <a className="hdr__brand" href={docs || legal ? "/" : "#top"} aria-label="SUTRA home">
          <span className="hdr__mark">
            <Mark />
          </span>
          <span className="hdr__word">SUTRA</span>
          {docs ? <span className="hdr__tag">docs</span> : null}
          {legal ? <span className="hdr__tag">legal</span> : null}
        </a>

        <div className="hdr__end">
          <nav className="hdr__nav hdr__nav--right" aria-label="More">
            {renderNav(rightLinks)}
            <a
              className="hdr__gh"
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
            >
              github <span aria-hidden="true">↗</span>
            </a>
          </nav>

          <a className="hdr__cta" href={docs || legal ? "/" : "/docs"} onClick={close}>
            {docs || legal ? "back to site" : "install"}
          </a>

          <button
            className="hdr__toggle"
            type="button"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className={`hdr__bars${open ? " is-open" : ""}`} aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>
      </header>

      <div
        id="site-nav"
        className={`menu${open ? " is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="menu__top">
          <a className="menu__brand" href={docs || legal ? "/" : "#top"} onClick={close}>
            SUTRA
            <em>{docs ? "field manual" : legal ? "legal" : "signal layer"}</em>
          </a>
          <div className="menu__actions">
            <a className="menu__cta" href={docs || legal ? "/" : "/docs"} onClick={close}>
              {docs || legal ? "back to site" : "install"}
            </a>
            <button
              className="menu__close"
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
        </div>

        <nav className="menu__body" aria-label="Mobile">
          {MOBILE_GROUPS.map((group) => (
            <section className="menu__group" key={group.title}>
              <p className="menu__label">{group.title}</p>
              {group.links.map((link) => (
                <a
                  key={`${group.title}-${link.href}-${link.label}`}
                  href={link.href}
                  onClick={close}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span>{link.label}</span>
                  <span className="menu__arrow" aria-hidden="true">
                    {link.external ? "↗" : "→"}
                  </span>
                </a>
              ))}
            </section>
          ))}
        </nav>

        <div className="menu__foot">
          <a href="/privacy" onClick={close}>
            privacy
          </a>
          <a href="/terms" onClick={close}>
            terms
          </a>
          <a href="/contact" onClick={close}>
            contact
          </a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" onClick={close}>
            github ↗
          </a>
        </div>
      </div>
    </>
  );
}
