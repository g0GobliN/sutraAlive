import { useEffect, useState } from "react";
import { GITHUB, NAV_LINKS } from "../data";

type Props = { docs?: boolean; legal?: boolean };

const DOCS_LINKS = [
  { href: "#quickstart", label: "quickstart" },
  { href: "#install", label: "install" },
  { href: "#configuration", label: "configure" },
  { href: "#recovery", label: "recovery" },
];

export function SiteHeader({ docs = false, legal = false }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onResize = () => setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const links = docs
    ? DOCS_LINKS
    : legal
      ? NAV_LINKS.map((link) => ({ ...link, href: `/${link.href}` }))
      : NAV_LINKS;

  return (
    <header className="site-header">
      <div className="wrap header">
        <a className="brand" href={docs || legal ? "/" : "#top"} aria-label="SUTRA home">
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
          <span className="brand__name">SUTRA</span>
          {docs ? <span className="brand__meta">docs</span> : null}
          {legal ? <span className="brand__meta">legal</span> : null}
        </a>

        <button
          className="header__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className={`header__bars${open ? " is-open" : ""}`} aria-hidden="true">
            <i />
            <i />
          </span>
          <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
        </button>

        <nav id="site-nav" className={`nav${open ? " is-open" : ""}`} aria-label="Primary">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a className="nav__docs" href={docs ? "/" : "/docs"} onClick={() => setOpen(false)}>
            {docs ? "back to site" : "docs"}
          </a>
          <a
            className="nav__gh"
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            github <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
