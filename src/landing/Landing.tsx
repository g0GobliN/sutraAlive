import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { Faq } from "./Faq";
import { Features } from "./Features";
import { Hero } from "./Hero";
import { Plans } from "./Plans";
import { Portal } from "./Portal";
import { Surfaces } from "./Surfaces";

export function Landing() {
  return (
    <div className="site">
      <a className="skip" href="#main">
        Skip to content
      </a>

      <SiteHeader />
      <main id="main">
        <Hero />
        <Surfaces />
        <Features />
        <Faq />
        <Plans />
        <Portal />
      </main>
      <SiteFooter />
    </div>
  );
}
