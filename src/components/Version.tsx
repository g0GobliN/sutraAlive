import { RELEASES } from "../data";
import { useRelease } from "../lib/release";

export function Version({ link = false }: { link?: boolean }) {
  const release = useRelease();
  const version = release?.version ?? release?.tag?.replace(/^v/i, "");
  if (!version) return null;

  const badge = <span className="version">v{version}</span>;

  if (!link) return badge;

  return (
    <a
      className="version-link"
      href={release?.url ?? RELEASES}
      target="_blank"
      rel="noopener noreferrer"
    >
      {badge}
    </a>
  );
}
