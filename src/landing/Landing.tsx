import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { Closing } from "./Closing";
import { Cost } from "./Cost";
import { CutDemo } from "./CutDemo";
import { Hero } from "./Hero";
import { Install } from "./Install";
import { Clients } from "./Clients";
import { Modes } from "./Modes";
import { Passage } from "./Passage";
import { Proof } from "./Proof";

export function Landing() {
  return (
    <div className="site">
      <a className="skip" href="#main">
        Skip to content
      </a>

      <div className="rail" aria-hidden="true">
        <span className="rail__word">SUTRA</span>
        <span className="rail__meta">less output · more signal</span>
      </div>

      <SiteHeader />
      <main id="main">
        <Hero />
        <CutDemo />
        <Cost />
        <Passage />
        <Modes />
        <Proof />
        <Clients />
        <Install />
        <Closing />
      </main>
      <SiteFooter />
    </div>
  );
}
