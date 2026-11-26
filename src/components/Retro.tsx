const NOISE_CHARS = "+x*#%=\"'~^:,;.x*#+";
const cache = new Map<string, string>();

function noise(seed: string, cols = 160, rows = 40) {
  const key = `${seed}:${cols}x${rows}`;
  const hit = cache.get(key);
  if (hit) return hit;

  let state = 0;
  for (let i = 0; i < seed.length; i++) state = (state * 31 + seed.charCodeAt(i)) % 233280;

  const random = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };

  const lines: string[] = [];
  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < cols; x++) {
      line += random() < 0.16 ? " " : NOISE_CHARS[Math.floor(random() * NOISE_CHARS.length)];
    }
    lines.push(line);
  }

  const art = lines.join("\n");
  cache.set(key, art);
  return art;
}

type Props = {
  sprite: string;
  title: string;
  meta?: string;
  note?: string;
  seed?: string;
  variant?: "default" | "hero";
};

/** A 1-bit sprite on a field of characters, in the arcade-poster style. */
export function Retro({ sprite, title, meta, note, seed = title, variant = "default" }: Props) {
  return (
    <figure className={`retro retro--${variant}`}>
      <figcaption className="retro__bar">
        <span className="retro__title">{title}</span>
        {meta ? <span className="retro__meta">{meta}</span> : null}
      </figcaption>
      <div className="retro__stage">
        <pre className="retro__noise" aria-hidden="true">
          {noise(seed)}
        </pre>
        <pre className="retro__sprite" aria-hidden="true">
          {sprite}
        </pre>
      </div>
      {note ? <p className="retro__note">{note}</p> : null}
    </figure>
  );
}
