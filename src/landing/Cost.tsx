import { DOCS_LINKS } from "../data";
import { ScrambleText } from "../components/ScrambleText";

const CARDS = [
  {
    turn: "turn 01",
    value: "60.9 kB",
    title: "The result arrives.",
    body: "One failing line inside twelve thousand. The agent needs the head, the tail, and a route back to the middle.",
    tag: "read once",
    width: 24,
  },
  {
    turn: "turn 05",
    value: "× 5",
    title: "It is sent again.",
    body: "Every later turn carries the earlier output. Cache reads lower the bill; they do not shrink what the model reads.",
    tag: "re-read",
    width: 58,
  },
  {
    turn: "turn 20",
    value: "× 20",
    title: "The session pays for it.",
    body: "Compressing the reply attacks the small number. Tool output is the part that grows without limit.",
    tag: "the compounding cost",
    width: 100,
  },
];

export function Cost() {
  return (
    <section className="section cost" id="cost" aria-labelledby="cost-title">
      <div className="wrap cost__grid">
        <div className="cost__sticky">
          <p className="kicker">the cost</p>
          <h2 id="cost-title">
            A tool result
            <br />
            is read once.
            <br />
            <span className="soft">Then forever.</span>
          </h2>
          <p className="cost__lede">
            A 2 MB log is not a 2 MB problem. It is 2 MB on this turn, and again on the next, and
            again in every context that follows it.
          </p>
          <p className="cost__source">
            One seven-agent fleet, two days, 486,503,074 cache-read tokens — 96.8% of all tokens in
            the recorded run. Not a universal benchmark.{" "}
            <a href={DOCS_LINKS.benchmark} target="_blank" rel="noopener noreferrer">
              method ↗
            </a>
          </p>
        </div>

        <ol className="cost__cards" aria-label="The compounding cost of one tool result">
          {CARDS.map((card, index) => (
            <li className="cost-card" key={card.turn}>
              <div className="cost-card__top">
                <span>{card.turn}</span>
                <span>{card.tag}</span>
              </div>
              <strong className="cost-card__value">
                <ScrambleText text={card.value} trigger="view" delay={index * 90} />
              </strong>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <div className="cost-card__track" aria-hidden="true">
                <i style={{ width: `${card.width}%` }} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
