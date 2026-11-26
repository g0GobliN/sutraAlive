/*
 * The mark: the guard.
 *
 * A carved stone guardian head with metal wings — the rock from the client's
 * original sketch, the wing from the reference marks, engraved in white and
 * used as it was drawn. It is a raster (`mark-sm.png`, a 96px master cut from
 * the 512px `mark.png`) because cross-hatched engraving turns to mud the moment
 * it is rebuilt out of flat CSS shapes at 30px.
 *
 * One emblem, three sizes: 30px header, 34px footer, 28px on mobile. Never a
 * second, simplified "small" logo — the same drawing everywhere.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <img
      className={`mark${className ? ` ${className}` : ""}`}
      src="/assets/mark-sm.png"
      alt=""
      width={121}
      height={96}
      decoding="async"
      draggable={false}
    />
  );
}
