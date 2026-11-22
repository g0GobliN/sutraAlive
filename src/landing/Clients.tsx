import { TrimmerFigure } from "../figures/trimmer/TrimmerFigure";
import { CLIENTS, DOCS_LINKS } from "../data";

export function Clients() {
  return (
    <section className="section clients" id="clients" aria-labelledby="clients-title">
      <div className="wrap">
        <div className="clients__head">
          <div>
            <p className="kicker">the surfaces</p>
            <h2 id="clients-title">
              One core.
              <br />
              <span className="soft">Six automatic paths.</span>
            </h2>
          </div>
          <p className="clients__aside">
            Automatic means the host replaces the result before the model reads it. MCP registration
            alone is an explicit tool, not interception. The gate stays fixed while the surfaces
            scroll.
          </p>
        </div>

        <div className="clients__grid">
          <div className="clients__stage">
            <div className="gate">
              <TrimmerFigure />
            </div>
            <div className="clients__caption">
              <span>the shared core</span>
              <span>cut · label · retain</span>
              <p>
                Schematic: two blades cut the middle band, the offcut drops into the store, a
                marker splice joins the kept ends.
              </p>
            </div>
          </div>

          <ul className="clients__list">
            {CLIENTS.map((client) => (
              <li className="client" key={client.id}>
                <div className="client__top">
                  <h3>{client.name}</h3>
                  <span className={`tag ${client.automatic ? "tag--on" : "tag--off"}`}>
                    {client.tier}
                  </span>
                </div>
                <p className="client__mech">{client.mechanism}</p>
                <code className="client__cmd">{client.install}</code>
                <dl className="client__meta">
                  <div>
                    <dt>after install</dt>
                    <dd>{client.restart}</dd>
                  </div>
                  <div>
                    <dt>verify</dt>
                    <dd>{client.verify}</dd>
                  </div>
                </dl>
                <p className="client__limit">{client.limit}</p>
                <a className="client__link" href={client.docs}>
                  install notes <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="clients__foot">
          <p>
            Cursor and Windsurf / Cascade are MCP-only: neither host documents a hook that can
            replace built-in tool output, so SUTRA does not claim one.
          </p>
          <a className="link-quiet" href={DOCS_LINKS.integrations} target="_blank" rel="noopener noreferrer">
            full integration matrix <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
