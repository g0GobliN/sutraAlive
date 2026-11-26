import type { ReactNode } from "react";
import { RECOVERY, type RecoveryBlock } from "./recovery-blocks";

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

function inline(text: string): ReactNode[] {
  const scanner = new RegExp(INLINE.source, "g");
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match = scanner.exec(text);

  while (match) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const token = match[0];

    if (token.startsWith("`")) {
      out.push(<code key={key++}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("**")) {
      out.push(<strong key={key++}>{inline(token.slice(2, -2))}</strong>);
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const [, label, href] = link;
        const external = href.startsWith("http");
        out.push(
          <a
            key={key++}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {label}
          </a>,
        );
      } else {
        out.push(token);
      }
    }

    last = match.index + token.length;
    match = scanner.exec(text);
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}

function renderBlock(block: RecoveryBlock, index: number) {
  if (block.t === "h2") return <h2 key={index}>{block.text}</h2>;
  if (block.t === "h3") return <h3 key={index}>{block.text}</h3>;
  if (block.t === "p") return <p key={index}>{inline(block.text)}</p>;
  if (block.t === "code")
    return (
      <pre className="legal__pre" key={index}>
        {block.text}
      </pre>
    );
  if (block.t === "img")
    return (
      <figure className="legal__figure" key={index}>
        <img src={block.src} alt={block.alt} loading="lazy" />
      </figure>
    );
  if (block.t === "table")
    return (
      <div className="legal__tablewrap" key={index}>
        <table className="legal__table legal__table--doc">
          <thead>
            <tr>
              {block.head.map((cell, column) => (
                <th key={column}>{inline(cell)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, line) => (
              <tr key={line}>
                {row.map((cell, column) => (
                  <td key={column}>{inline(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  const List = block.t === "ol" ? "ol" : "ul";
  return (
    <List key={index}>
      {block.items.map((item, line) => (
        <li key={line}>{inline(item)}</li>
      ))}
    </List>
  );
}

export function Recovery() {
  return (
    <>
      {RECOVERY.map(renderBlock)}
      <p className="legal__contact">
        This page reproduces{" "}
        <a
          href="https://github.com/g0GobliN/sutra/blob/main/docs/recovery.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          docs/recovery.md
        </a>{" "}
        from the repository. That file is the authoritative version.
      </p>
    </>
  );
}
