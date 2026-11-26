import { Retro } from "../components/Retro";
import {
  SPRITE_CUT,
  SPRITE_LABEL,
  SPRITE_MEASURE,
  SPRITE_MODES,
  SPRITE_RETAIN,
  SPRITE_REUSE,
} from "../sprites";

type Feature = {
  index: string;
  title: string;
  body: string;
  sprite: string;
  artTitle: string;
  artMeta: string;
};

const FEATURES: Feature[] = [
  {
    index: "#1 Cut",
    title: "The middle leaves.",
    body: "Size, payload shape, tool type and protection rules decide whether a result is touched. The head and the tail stay; the middle is elided only when the result is large enough to pay for its own marker.",
    sprite: SPRITE_CUT,
    artTitle: "one result, cut",
    artMeta: "head · middle · tail",
  },
  {
    index: "#2 Label",
    title: "Every omission is signed.",
    body: "The model does not receive a summary. It receives a marker naming how many bytes left, the id they were filed under, their lifetime, and the exact call that returns them.",
    sprite: SPRITE_LABEL,
    artTitle: "the marker",
    artMeta: "id · bytes · ttl · restore",
  },
  {
    index: "#3 Retain",
    title: "The original is filed first.",
    body: "An id is written only after the original is on disk. The store is bounded by time, entry count and total size, so retention cannot grow without a ceiling.",
    sprite: SPRITE_RETAIN,
    artTitle: "the receipt",
    artMeta: "store · marker · restore",
  },
  {
    index: "#4 Reuse",
    title: "Exact repeats cost nothing.",
    body: "When a host asks for the same output again, the repeat is replaced by a marker quoting the earlier id. Nothing is re-sent, and nothing is lost: the bytes are still on disk.",
    sprite: SPRITE_REUSE,
    artTitle: "the repeat",
    artMeta: "same bytes, second time",
  },
  {
    index: "#5 Modes",
    title: "Effort is a switch.",
    body: "A mode bounds how much search SUTRA may spend. It never changes what can be accepted: every candidate must be smaller and preservation-clean, or the original is returned.",
    sprite: SPRITE_MODES,
    artTitle: "four modes",
    artMeta: "plans · passes · bound",
  },
  {
    index: "#6 Measure",
    title: "Eight shapes. Two zeroes.",
    body: "Bytes and o200k tokens are counted on eight generated payloads with one planted clue each. The patch and the JSON array save nothing on purpose — when a rewrite could hide a change, SUTRA returns the original.",
    sprite: SPRITE_MEASURE,
    artTitle: "the assay",
    artMeta: "bytes · tokens · clues",
  },
];

export function Features() {
  return (
    <section className="sec sec--panel" id="features" aria-labelledby="features-title">
      <div className="shell">
        <div className="sec__title">
          <h2 id="features-title">Features</h2>
          <Glyph />
        </div>

        <div className="features">
          {FEATURES.map((feature) => (
            <article className="feat" key={feature.index}>
              <p className="feat__index">{feature.index}</p>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
              <div className="feat__art">
                <Retro
                  sprite={feature.sprite}
                  title={feature.artTitle}
                  meta={feature.artMeta}
                  seed={feature.index}
                />
              </div>
            </article>
          ))}
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
