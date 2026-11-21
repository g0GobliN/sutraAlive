import { useEffect, useState } from "react";

export type ReleaseSnapshot = {
  tag?: string;
  version?: string;
  url?: string;
  publishedAt?: string | null;
};

let pending: Promise<ReleaseSnapshot | null> | null = null;

function load(): Promise<ReleaseSnapshot | null> {
  pending ??= fetch("/version.json", { cache: "no-store" })
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null);
  return pending;
}

/**
 * The latest SUTRA release, read from the snapshot that
 * scripts/sync-version.mjs writes from GitHub Releases before each build.
 * Renders nothing if the snapshot is unavailable; no tag is hand-written.
 */
export function useRelease(): ReleaseSnapshot | null {
  const [release, setRelease] = useState<ReleaseSnapshot | null>(null);

  useEffect(() => {
    let alive = true;
    load().then((value) => {
      if (alive) setRelease(value);
    });
    return () => {
      alive = false;
    };
  }, []);

  return release;
}
