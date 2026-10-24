import { useEffect, useRef, useState } from "react";

type CopyState = "idle" | "copied" | "failed";

type Props = {
  text: string;
};

async function writeClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const copied = document.execCommand("copy");
  area.remove();
  if (!copied) throw new Error("copy failed");
}

export function CopyButton({ text }: Props) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const label = state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy";

  return (
    <button
      className={`copy${state === "copied" ? " is-copied" : ""}`}
      type="button"
      onClick={async () => {
        window.clearTimeout(timer.current);
        try {
          await writeClipboard(text);
          setState("copied");
        } catch {
          setState("failed");
        }
        timer.current = window.setTimeout(() => setState("idle"), 1600);
      }}
      aria-live="polite"
    >
      {label}
    </button>
  );
}
