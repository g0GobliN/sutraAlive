const FRAGMENTS = [
  [26, 168, 96, 142],
  [54, 224, 132, 196],
  [18, 268, 88, 284],
  [88, 128, 148, 166],
  [116, 214, 178, 188],
  [146, 260, 206, 232],
  [64, 320, 134, 296],
  [176, 130, 228, 164],
  [208, 198, 266, 176],
  [190, 286, 254, 306],
  [244, 148, 298, 128],
  [286, 230, 344, 202],
  [270, 326, 334, 300],
  [322, 160, 382, 184],
  [350, 254, 410, 278],
  [300, 106, 350, 86],
  [92, 366, 160, 342],
  [212, 368, 276, 342],
  [352, 350, 414, 324],
  [30, 386, 100, 400],
  [240, 62, 310, 80],
  [380, 96, 430, 118],
];

const MOTES = [
  [110, 160],
  [156, 332],
  [232, 246],
  [286, 122],
  [338, 196],
  [372, 300],
  [78, 396],
  [196, 86],
  [420, 148],
  [398, 360],
];

const RULE_LINES = [566, 598, 630, 662, 694];

export function GateDiagram() {
  return (
    <figure className="diagram reveal" aria-labelledby="diagram-caption">
      <svg
        className="diagram__svg"
        viewBox="0 0 1200 460"
        fill="none"
        role="img"
        aria-labelledby="diagram-title diagram-desc"
      >
        <title id="diagram-title">The SUTRA passage</title>
        <desc id="diagram-desc">
          Chaotic tool output enters a stone arch. Five rule lines cross the opening. A single
          labelled beam leaves on the right, carrying the retained bytes and a restore id.
        </desc>

        <g className="diagram__fragments" aria-hidden="true">
          {FRAGMENTS.map(([x1, y1, x2, y2], index) => (
            <line
              key={`${x1}-${y1}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              opacity={0.18 + (index % 4) * 0.07}
            />
          ))}
          {MOTES.map(([cx, cy], index) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={index % 3 === 0 ? 2.2 : 1.2} opacity="0.55" />
          ))}
        </g>

        <g className="diagram__gate" aria-hidden="true">
          <path d="M500 380V220A130 130 0 0 1 760 220V380" className="diagram__arch" />
          <path d="M536 380V224A94 94 0 0 1 724 224V380" className="diagram__arch diagram__arch--inner" />
          <path d="M482 220A148 148 0 0 1 778 220" className="diagram__course" strokeDasharray="1 7" />
          <path d="M470 380h320" className="diagram__ground" />
          <path d="M520 352V236M740 352V236" className="diagram__hatch" />
          <path d="M526 246h26M526 270h26M526 294h26M526 318h26M526 342h26" className="diagram__hatch" />
          <path d="M708 246h26M708 270h26M708 294h26M708 318h26M708 342h26" className="diagram__hatch" />
          {RULE_LINES.map((x, index) => (
            <g key={x}>
              <line x1={x} y1="236" x2={x} y2="344" className="diagram__rule" />
              <circle cx={x} cy={290 - (index % 2) * 18} r="2.4" className="diagram__node" />
            </g>
          ))}
        </g>

        <path
          className="diagram__signal"
          pathLength={1}
          d="M0 300H360L390 276L418 322L446 300H760"
        />
        <path className="diagram__signal diagram__signal--out" pathLength={1} d="M760 300H1092" />

        <g className="diagram__output" aria-hidden="true">
          <path d="M760 278H1040M760 322H980" className="diagram__thread" />
          <rect x="1000" y="268" width="150" height="64" className="diagram__tag" />
          <text x="1014" y="291" className="diagram__tag-label">
            su_3e72c41e…
          </text>
          <text x="1014" y="310" className="diagram__tag-value">
            133,522 B elided
          </text>
          <text x="1014" y="324" className="diagram__tag-value">
            restore ready
          </text>
        </g>

        <g className="diagram__labels" aria-hidden="true">
          <text x="0" y="432">
            RAW OUTPUT
          </text>
          <text x="626" y="432" textAnchor="middle">
            ONE ORDERED PASS
          </text>
          <text x="1200" y="432" textAnchor="end">
            EVIDENCE · RETRIEVABLE
          </text>
          <text x="1200" y="18" textAnchor="end" className="diagram__folio">
            FIG. 01 / THE PASSAGE
          </text>
        </g>

        <g className="diagram__tick" aria-hidden="true">
          <line x1="0" y1="300" x2="0" y2="316" />
          <line x1="1200" y1="300" x2="1200" y2="316" />
        </g>
      </svg>
      <figcaption className="diagram__caption" id="diagram-caption">
        <span>An illustrative rendering of the real ordered pass.</span>
        <span>No terminal was executed to draw this figure.</span>
      </figcaption>
    </figure>
  );
}
