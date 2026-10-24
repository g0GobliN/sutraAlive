import { useMemo, useState } from "react";
import rawDemo from "../demo-data.json";
import { CopyButton } from "./CopyButton";

type Demo = {
  fixture: string;
  tool: string;
  generatedWith: string;
  originalBytes: number;
  visibleBytes: number;
  elidedBytes: number;
  id: string;
  start: number;
  end: number;
  retentionHours: number;
  marker: string;
  restoreCall: string;
  original: string;
  headPreview: string[];
  tailPreview: string[];
};

const demo = rawDemo as Demo;
const PAGE_BYTES = 8_192;

function formatBytes(value: number) {
  return `${value.toLocaleString("en-US")} B`;
}

export function MarkerDemo() {
  const [cursor, setCursor] = useState<number | null>(null);
  const bytes = useMemo(() => new TextEncoder().encode(demo.original), []);
  const pageEnd = cursor === null ? 0 : Math.min(demo.end, cursor + PAGE_BYTES);
  const page = useMemo(() => {
    if (cursor === null) return "";
    return new TextDecoder("utf-8").decode(bytes.slice(cursor, pageEnd));
  }, [bytes, cursor, pageEnd]);

  const complete = cursor !== null && pageEnd >= demo.end;
  const pageBytes = cursor === null ? 0 : pageEnd - cursor;
  const pageNumber = cursor === null ? 0 : Math.floor((cursor - demo.start) / PAGE_BYTES) + 1;
  const pageCount = Math.ceil(demo.elidedBytes / PAGE_BYTES);

  const onRestore = () => {
    if (cursor === null) {
      setCursor(demo.start);
      return;
    }
    if (!complete) {
      setCursor(pageEnd);
      return;
    }
    setCursor(null);
  };

  return (
    <div
      className="marker-demo"
      aria-label="Recorded SUTRA run: the marker and the exact bytes it points to"
    >
      <div className="marker-demo__bar">
        <span>
          Recorded run / {demo.tool} / {demo.fixture}
        </span>
        <span>No model call · no network</span>
      </div>

      <div className="marker-demo__stats">
        <span>
          <b>{formatBytes(demo.originalBytes)}</b> original
        </span>
        <span>
          <b>{formatBytes(demo.visibleBytes)}</b> visible
        </span>
        <span>
          <b>{formatBytes(demo.elidedBytes)}</b> elided
        </span>
        <span>
          <b>{demo.retentionHours} h</b> retained
        </span>
      </div>

      <div className="marker-demo__grid">
        <div className="marker-demo__source">
          <div className="marker-demo__head">
            <span>Compressed result · excerpt</span>
            <span>id={demo.id.slice(0, 15)}…</span>
          </div>
          <pre aria-label="Excerpt of the recorded compressed deploy log">
            <code>{demo.headPreview.join("\n")}</code>
            <span className="marker-demo__gap">
              {"\n"}… {formatBytes(demo.elidedBytes)} elided; the marker is the receipt …
              {"\n"}
            </span>
            <code>{demo.tailPreview.join("\n")}</code>
          </pre>
          <div className="marker-demo__marker">
            <span>Marker</span>
            <code>{demo.marker}</code>
          </div>
        </div>

        <div className="marker-demo__restore">
          <div className="marker-demo__head">
            <span>sutra_restore</span>
            <span>bytes · end-exclusive</span>
          </div>
          <div className="marker-demo__call">
            <code>{demo.restoreCall}</code>
            <CopyButton text={demo.restoreCall} />
          </div>

          <div className="marker-demo__control">
            <button className="marker-demo__button" type="button" onClick={onRestore}>
              {cursor === null
                ? "Read the first 8 KiB"
                : complete
                  ? "Restart restore"
                  : "Read the next page"}
              <span aria-hidden="true">{cursor === null || complete ? "→" : "↓"}</span>
            </button>
            <p aria-live="polite">
              {cursor === null
                ? "The original is retained locally. No page is fetched until you ask."
                : `status: ok · page ${pageNumber} of ${pageCount} · ${formatBytes(pageBytes)} returned · complete: ${complete}`}
            </p>
          </div>

          <div className="marker-demo__page" aria-live="polite">
            {cursor === null ? (
              <p>
                The exact page is decoded from the recorded UTF-8 bytes at the marker’s offsets —
                not a summary, and not a model output.
              </p>
            ) : (
              <pre>
                <code>{page}</code>
              </pre>
            )}
          </div>

          <p className="marker-demo__note">
            {demo.generatedWith}. The fixture store is replayed in the browser; the id is from the
            recorded run.
          </p>
        </div>
      </div>
    </div>
  );
}
