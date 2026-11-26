import { useState } from "react";
import { CopyButton } from "../components/CopyButton";
import { Retro } from "../components/Retro";
import { SPRITE_HERO } from "../sprites";

const INSTALLERS = [
  { id: "pip", label: "pip", command: "python -m pip install sutra-agent" },
  { id: "uv", label: "uv", command: "uv pip install sutra-agent" },
  { id: "pipx", label: "pipx", command: "pipx install sutra-agent" },
] as const;

type InstallerId = (typeof INSTALLERS)[number]["id"];

export function Hero() {
  const [installer, setInstaller] = useState<InstallerId>("pip");
  const command =
    INSTALLERS.find((item) => item.id === installer)?.command ?? INSTALLERS[0].command;

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="shell hero__inner">
        <div>
          <h1 id="hero-title">
            Less output.
            <br />
            <em>More signal.</em>
          </h1>

          <p className="hero__lede">
            A deterministic optimization layer for AI coding agents. SUTRA cuts oversized tool
            output before the model reads it, labels every omitted byte, and keeps the original one{" "}
            <code>sutra_restore</code> call away.
          </p>

          <div className="hero__actions">
            <a className="btn btn--paper" href="#install">
              install sutra <span aria-hidden="true">→</span>
            </a>
            <a className="btn btn--dark" href="/docs">
              read the docs
            </a>
          </div>

          <p className="hero__label">Install via terminal</p>

          <div className="term">
            <div className="term__tabs" role="tablist" aria-label="Install method">
              {INSTALLERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={installer === item.id}
                  className={installer === item.id ? "is-on" : ""}
                  onClick={() => setInstaller(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="term__cmd">
              <code>$ {command}</code>
              <CopyButton text={command} />
            </div>
          </div>
        </div>

        <div className="hero__art">
          <Retro
            sprite={SPRITE_HERO}
            title="the cut"
            meta="result → core → model → store"
            note="One ordered pass. The marker names what left, how much, and the exact call that returns it."
            seed="hero"
            variant="hero"
          />
        </div>
      </div>
    </section>
  );
}
