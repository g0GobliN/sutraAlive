import { Dots, FaceText, Line, Solid } from "../../iso/react/draw";
import { iso, type Point3 } from "../../iso/iso-kit";
import { FIXTURES } from "../../data";
import { PALLET_ART, SPECIMENS, ZERO_ART } from "./geometry";
import { P } from "./view";

const CORNERS: Point3[] = [
  [-42, -32, 0],
  [42, -32, 0],
  [-42, 32, 0],
  [42, 32, 0],
  [-42, -32, 44],
  [42, -32, 44],
  [-42, 32, 44],
  [42, 32, 44],
];

const SCREEN = CORNERS.map(([x, y, z]) => iso([x, y, z], P));
const MIN_X = Math.min(...SCREEN.map(([x]) => x));
const MAX_X = Math.max(...SCREEN.map(([x]) => x));
const MIN_Y = Math.min(...SCREEN.map(([, y]) => y));
const MAX_Y = Math.max(...SCREEN.map(([, y]) => y));
const PAD = 8;
const SPEC_VIEW = `${MIN_X - PAD} ${MIN_Y - PAD} ${MAX_X - MIN_X + PAD * 2} ${MAX_Y - MIN_Y + PAD * 2}`;

export function SpecimenFigure({
  index,
  lifted = false,
  onToggle,
}: {
  index: number;
  lifted?: boolean;
  onToggle?: () => void;
}) {
  const fixture = FIXTURES[index];
  const zero = Boolean(fixture.zero);
  const art = SPECIMENS[index];
  const label = `${fixture.payload}, ${fixture.rule}, ${fixture.saved} saved${zero ? ", held whole" : ""}`;

  const inner = (
    <>
      <span className="specimen__num" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <svg className="specimen__svg" viewBox={SPEC_VIEW} aria-hidden="true" focusable="false">
        <Solid paths={PALLET_ART.body} tone="lo" crease="faint" />
        <Line d={zero ? PALLET_ART.zeroLine : PALLET_ART.line} tone={zero ? "lit" : "faint"} />
        <Dots points={PALLET_ART.screws} size={0.4} tone="mid" />
        <g className="specimen__body">
          {art.pieces.map((piece, part) => (
            <Solid
              key={part}
              paths={piece.paths}
              tone={piece.tone ?? "mid"}
              crease={piece.crease ?? "faint"}
              lit={piece.lit}
            />
          ))}
          {art.lines?.map((line, lineIndex) => (
            <Line key={lineIndex} d={line.d} tone={line.tone ?? "faint"} />
          ))}
          {art.dots ? <Dots points={art.dots} size={0.85} tone="mid" /> : null}
          {zero ? (
            <g>
              {ZERO_ART.pieces.map((piece, part) => (
                <Solid
                  key={part}
                  paths={piece.paths}
                  tone={piece.tone ?? "mid"}
                  crease={piece.crease ?? "faint"}
                  lit={piece.lit}
                />
              ))}
              <Line d={ZERO_ART.tagLine} tone="faint" />
              <Line d={ZERO_ART.sealTop} tone="hi" />
              <FaceText transform={ZERO_ART.tagText} size={4.4} tone="lo" anchor="middle">
                0
              </FaceText>
            </g>
          ) : null}
        </g>
      </svg>
    </>
  );

  if (zero) {
    return (
      <div className="specimen specimen--zero iso" role="img" aria-label={`${label}. Sealed on its plinth.`}>
        {inner}
      </div>
    );
  }

  return (
    <button
      type="button"
      className="specimen iso"
      aria-pressed={lifted}
      aria-label={`${label}. ${lifted ? "Lower" : "Lift"} the specimen.`}
      onClick={onToggle}
    >
      {inner}
    </button>
  );
}
