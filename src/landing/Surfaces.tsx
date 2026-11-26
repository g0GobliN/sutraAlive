import { Retro } from "../components/Retro";
import { CLIENTS, DOCS_LINKS, type Client } from "../data";
import { SPRITE_SURFACES } from "../sprites";

const FEATURED: string[] = ["hermes", "deepseek", "opencode"];

const featured = FEATURED.map((id) => CLIENTS.find((client) => client.id === id)).filter(
  (client): client is Client => Boolean(client),
);

export function Surfaces() {
  return (
    <section className="sec" id="surfaces" aria-labelledby="surfaces-title">
      <div className="shell">
        <div className="sec__title">
          <h2 id="surfaces-title">Install targets</h2>
          <Glyph />
        </div>

        <p className="sec__intro">
          Available across the agents you already run. Automatic means the host replaces the result
          before the model reads it — MCP registration alone is an explicit tool, not interception.
        </p>

        <div className="surfaces">
          {featured.map((client) => (
            <article className="surface" key={client.id}>
              <span className="surface__meta">{client.tier}</span>
              <h3>{client.name}</h3>
              <p>{client.mechanism}</p>
              <code>{client.install}</code>
              <a href={client.docs}>install notes ↗</a>
            </article>
          ))}
        </div>

        <div className="surfaces__art">
          <Retro
            sprite={SPRITE_SURFACES}
            title="the surfaces"
            meta="six automatic paths, one core"
            note="Every adapter hands its finished result to the same core. Verification and limits live in the docs."
            seed="surfaces"
          />
        </div>

        <div className="sec__intro">
          <a className="surface__meta" href={DOCS_LINKS.integrations}>
            full integration matrix <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Glyph() {
  return (
    <svg className="sec__glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M2 14h4v8H2zM9 9h4v13H9zM16 8h4v14h-4zM16 2h4v3h-4z" />
    </svg>
  );
}
