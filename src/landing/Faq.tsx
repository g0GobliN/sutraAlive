const FAQ = [
  {
    q: "How does SUTRA decide what to cut?",
    a: "Size, payload shape, tool type and protection rules gate every result. A result at or below the byte threshold is untouched. Above it, the head and the tail are kept and the middle is elided — but only after a candidate proves it is smaller and preservation-clean.",
  },
  {
    q: "Can a restore return the exact original?",
    a: "Yes. The original bytes are written to the local store before the marker is emitted, and the marker carries the id and the elided range. sutra_restore(id, mode=\"bytes\", start=12288, end=26004) returns those bytes unchanged.",
  },
  {
    q: "What happens with a patch or a JSON document?",
    a: "A diff is returned byte-identical, and a JSON array keeps its shape. Rewriting either could hide a change the agent needs to see, so the measured saving for those two fixtures is deliberately zero.",
  },
  {
    q: "Does SUTRA call a model to compress?",
    a: "No. There is no summarizer and no compression model in the loop, so no tokens are spent on compressing tokens. The pass is deterministic: the same input and mode produce the same output.",
  },
];

export function Faq() {
  return (
    <section className="sec" id="faq" aria-labelledby="faq-title">
      <div className="shell">
        <div className="sec__title">
          <h2 id="faq-title">FAQs</h2>
          <Glyph />
        </div>

        <div className="faq">
          {FAQ.map((item) => (
            <details className="faq__item" key={item.q}>
              <summary className="faq__q">
                <span>{item.q}</span>
                <span className="faq__sign" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="faq__a">
                <p>{item.a}</p>
              </div>
            </details>
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
