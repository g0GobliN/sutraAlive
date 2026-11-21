import { GITHUB } from "../data";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export type LegalKind = "privacy" | "terms" | "contact";

const EMAIL = "hello@vishalgurung.com.np";
const INSTAGRAM = "https://instagram.com/goblin01_";
const UPDATED = "21 November 2026";

const KICKERS: Record<LegalKind, string> = {
  privacy: "legal",
  terms: "legal",
  contact: "contact",
};

const TITLES: Record<LegalKind, string> = {
  privacy: "Privacy",
  terms: "Terms of use",
  contact: "Contact",
};

function Privacy() {
  return (
    <>
      <p className="legal__lede">
        SUTRA is a local-first tool. This page explains what this website and the open-source
        package do with data, in plain language.
      </p>

      <h2>This website</h2>
      <p>
        This site is static. It has no accounts, no sign-in, no cookies of its own, no analytics and
        no advertising trackers. Nothing you read here is tied to a profile of you.
      </p>
      <p>
        The provider that hosts the site may keep standard request logs — IP address, user agent,
        requested URL and timestamp — for delivery, security and abuse prevention. Those logs are
        kept by the host under its own policy, not used by SUTRA for marketing.
      </p>

      <h2>When you contact us</h2>
      <p>
        If you email, message on Instagram or open a GitHub issue, we receive what you choose to
        send: your address or handle, the message and any attachments. We use it to reply and to
        keep a record of the conversation. It is not sold and not added to a mailing list. Ask us to
        delete it and we will, unless we are required to keep it.
      </p>

      <h2>The SUTRA package</h2>
      <p>
        The package runs on your machine. There is no hosted SUTRA service and no account. Output
        you process is not sent to us.
      </p>
      <ul>
        <li>
          Telemetry is off by default (<code>SUTRA_TELEMETRY=0</code>). If you enable OpenTelemetry
          export, it goes to the endpoint you configure.
        </li>
        <li>
          Retained originals are written to a local store you control (<code>SUTRA_STORE_DIR</code>),
          with a 7-day default lifetime and configurable size limits.
        </li>
        <li>
          Recovery, markers and compression decisions are made locally; no model is called by SUTRA
          itself.
        </li>
      </ul>

      <h2>Links to other sites</h2>
      <p>
        This site links to GitHub, PyPI, Instagram and documentation hosted elsewhere. Those
        services have their own privacy policies; what happens after you follow a link is governed
        by them.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask what correspondence we hold about you, ask for a copy, or ask us to delete it by
        writing to the address below. You can also use the package without contacting us at all.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes, the date at the top of the page changes with it. Material changes
        will be noted on the site.
      </p>
    </>
  );
}

function Terms() {
  return (
    <>
      <p className="legal__lede">
        These terms cover this website. The software itself is open source and licensed under the
        MIT license; that license governs your use of the code.
      </p>

      <h2>The website</h2>
      <p>
        The content here is provided for information. You may read it, quote it with attribution and
        link to it. Don&apos;t present it as your own documentation or imply that SUTRA endorses a
        product it has not reviewed.
      </p>

      <h2>The software</h2>
      <p>
        SUTRA is distributed under the MIT license. It is provided &ldquo;as is&rdquo;, without
        warranty of any kind, express or implied, including fitness for a particular purpose. The
        license text in the repository is the authoritative terms for the code.
      </p>
      <p>
        If you need a separate agreement for procurement or commercial support, write to the address
        below and we can discuss one.
      </p>

      <h2>Benchmarks and claims</h2>
      <p>
        The figures on this site are offline fixture measurements on generated tool output, measured
        on payload text with a local tokenizer. They are not provider bills and not a promise that
        your workload will see the same reduction. Test against your own traffic.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Don&apos;t interfere with the site or its hosting, attempt to overload it, or use it to
        distribute malware or unlawful content. Don&apos;t misrepresent the project or its origin.
      </p>

      <h2>Third-party links</h2>
      <p>
        Links to GitHub, PyPI and Instagram are provided for convenience. We don&apos;t control those
        services and aren&apos;t responsible for their content or availability.
      </p>

      <h2>Changes</h2>
      <p>
        These terms may be updated as the project grows. The date at the top of the page shows the
        current version.
      </p>
    </>
  );
}

function Contact() {
  return (
    <>
      <p className="legal__lede">
        Questions about SUTRA, licensing, a commercial deployment or a security report? Use whichever
        channel suits you.
      </p>

      <div className="legal__channels">
        <a href={`mailto:${EMAIL}`}>
          <span>email</span>
          <strong>{EMAIL}</strong>
        </a>
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
          <span>instagram</span>
          <strong>@goblin01_</strong>
        </a>
        <a href={GITHUB} target="_blank" rel="noopener noreferrer">
          <span>github</span>
          <strong>g0GobliN/sutra</strong>
        </a>
      </div>

      <h2>What to use where</h2>
      <ul>
        <li>
          <strong>Bugs and feature requests:</strong> open an issue on GitHub so the discussion stays
          with the code.
        </li>
        <li>
          <strong>Security:</strong> email first rather than opening a public issue, so there is time
          to ship a fix.
        </li>
        <li>
          <strong>Licensing, support or commercial use:</strong> email with a little context about
          your deployment.
        </li>
        <li>
          <strong>Everything else:</strong> Instagram is fine for a short question.
        </li>
      </ul>
      <p>
        These channels are read by the maintainer. Replies are best effort; there is no support
        contract unless we have signed one.
      </p>
    </>
  );
}

export function LegalPage({ page }: { page: LegalKind }) {
  return (
    <div className="legal-page" id="top">
      <a className="skip" href="#legal-body">
        Skip to content
      </a>

      <SiteHeader legal />

      <main className="legal" id="legal-body">
        <div className="wrap legal__inner">
          <p className="kicker">{KICKERS[page]}</p>
          <h1>{TITLES[page]}</h1>
          <p className="legal__updated">Last updated {UPDATED}</p>

          {page === "privacy" ? <Privacy /> : page === "terms" ? <Terms /> : <Contact />}

          <p className="legal__contact">
            Contact: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
        </div>
      </main>

      <SiteFooter root />
    </div>
  );
}
