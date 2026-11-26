/*
 * A plate: one engraved artefact in a hairline frame, with a mono caption.
 * See ART.md for the rule this follows — every page carries one figure, and
 * the figure is an object from the same engraved world as the mark.
 */
export function ArtPlate({
  src,
  caption,
  className,
}: {
  src: string;
  caption: string;
  className?: string;
}) {
  return (
    <figure className={className ? `plate ${className}` : "plate"}>
      <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
