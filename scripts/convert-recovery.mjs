import fs from "node:fs";

const raw = fs.readFileSync(".tmp/recovery.md", "utf8").replace(/\r\n/g, "\n");
const lines = raw.split("\n");

const GITHUB_DOCS = "https://github.com/g0GobliN/sutra/blob/main/docs";

const fixLinks = (text) =>
  text
    .replace(/\]\(semantic-retrieval\.md\)/g, `](${GITHUB_DOCS}/semantic-retrieval.md)`)
    .replace(/\]\(\.\.\/SECURITY\.md\)/g, "](/security)")
    .replace(/\]\(recovery-flow\.svg\)/g, "](/assets/recovery-flow.svg)");

const cells = (row) =>
  row
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim().replace(/\s+/g, " "));

const blocks = [];
let paragraph = [];
let i = 0;

const flushParagraph = () => {
  if (paragraph.length) {
    blocks.push({
      t: "p",
      text: fixLinks(paragraph.join(" ")).replace(/\s+/g, " ").trim(),
    });
    paragraph = [];
  }
};

while (i < lines.length) {
  const line = lines[i];

  if (!line.trim()) {
    flushParagraph();
    i += 1;
    continue;
  }

  if (/^```/.test(line)) {
    flushParagraph();
    const code = [];
    i += 1;
    while (i < lines.length && !/^```/.test(lines[i])) {
      code.push(lines[i]);
      i += 1;
    }
    i += 1;
    blocks.push({ t: "code", text: code.join("\n") });
    continue;
  }

  const heading = line.match(/^(#{1,6})\s+(.*)$/);
  if (heading) {
    flushParagraph();
    const level = heading[1].length;
    if (level >= 2) blocks.push({ t: level === 2 ? "h2" : "h3", text: heading[2].trim() });
    i += 1;
    continue;
  }

  const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
  if (image) {
    flushParagraph();
    blocks.push({
      t: "img",
      alt: image[1],
      src: fixLinks(`](${image[2]})`).slice(2, -1),
    });
    i += 1;
    continue;
  }

  if (/^\|/.test(line)) {
    flushParagraph();
    const rawRows = [];
    while (i < lines.length) {
      const row = lines[i];
      if (!row.trim()) break;
      if (/^\|[\s:|-]+\|?$/.test(row)) {
        i += 1;
        continue;
      }
      if (/^\|/.test(row)) {
        rawRows.push(row);
        i += 1;
        continue;
      }
      const width = rawRows.length ? cells(rawRows[0]).length : 0;
      const last = rawRows.length ? cells(rawRows[rawRows.length - 1]).length : 0;
      if (rawRows.length && last < width) {
        rawRows[rawRows.length - 1] += ` ${row.trim()}`;
        i += 1;
        continue;
      }
      break;
    }
    const head = cells(rawRows[0] ?? "");
    const rows = rawRows.slice(1).map((row) => {
      const parts = cells(row);
      while (parts.length < head.length) parts.push("");
      return parts;
    });
    blocks.push({ t: "table", head, rows });
    continue;
  }

  if (/^[-*]\s/.test(line) || /^\d+\.\s/.test(line)) {
    flushParagraph();
    const ordered = /^\d+\.\s/.test(line);
    const items = [];
    let joining = -1;
    while (i < lines.length) {
      const row = lines[i];
      if (!row.trim()) {
        const next = lines[i + 1] ?? "";
        const continues =
          /^[-*]\s/.test(next) || /^\d+\.\s/.test(next) || /^\s{2,}\S/.test(next);
        if (continues) {
          i += 1;
          continue;
        }
        break;
      }
      if (/^[-*]\s/.test(row) || /^\d+\.\s/.test(row)) {
        items.push(row.replace(/^([-*]|\d+\.)\s*/, "").trim());
        joining = items.length - 1;
        i += 1;
        continue;
      }
      if (/^\s{2,}\S/.test(row) || items[joining] === "") {
        items[joining] = `${items[joining]} ${row.trim()}`.trim();
        i += 1;
        continue;
      }
      // duplicated rows from the upstream edit, prefixed with a stray pipe
      if (/^\|/.test(row)) {
        const text = row.replace(/^\|/, "").trim();
        const duplicate = items.some((item) =>
          item.toLowerCase().startsWith(text.toLowerCase().slice(0, 30)),
        );
        i += 1;
        if (duplicate) continue;
        items[joining] = `${items[joining]} ${text}`.trim();
        continue;
      }
      break;
    }
    blocks.push({
      t: ordered ? "ol" : "ul",
      items: items.map((item) => fixLinks(item).replace(/\s+/g, " ").trim()),
    });
    continue;
  }

  paragraph.push(line.trim());
  i += 1;
}

flushParagraph();

fs.writeFileSync(
  "src/legal/recovery-blocks.ts",
  `export type RecoveryBlock =
  | { t: "h2"; text: string }
  | { t: "h3"; text: string }
  | { t: "p"; text: string }
  | { t: "ul" | "ol"; items: string[] }
  | { t: "code"; text: string }
  | { t: "img"; src: string; alt: string }
  | { t: "table"; head: string[]; rows: string[][] };

export const RECOVERY: RecoveryBlock[] = ${JSON.stringify(blocks, null, 2)};
`,
);

console.log(blocks.length, "blocks");
console.log(
  blocks
    .map((b, n) => `${n} ${b.t}: ${(b.text ?? b.items?.[0] ?? b.head?.join("/") ?? "").slice(0, 60)}`)
    .join("\n"),
);
