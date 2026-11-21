import {
  cylinder,
  insetPlan,
  lineOnTop,
  planOutline,
  radialTicks,
  ring,
  segment,
  slabOf,
  topMatrix,
  topTicks,
  type Flat,
  type LineTone,
  type Plan,
  type SolidPaths,
  type Tone,
} from "../../iso/iso-kit";
import {
  BASE,
  BASE_BOTTOM,
  BED,
  BED_TOP,
  CONSOLE,
  DIAL_CY,
  DIAL_FACE,
  DIAL_R,
  P,
  PALLET,
  PALLET_TOP,
  STATIONS,
  TAPE,
  WHEEL,
  at,
} from "./view";

const solid = (plan: Plan, z: number, height: number, steps = 6, bevel = 0) =>
  slabOf(plan, z, height, P, steps, bevel);
const disc = (cx: number, cy: number, r: number, z: number, height: number, steps = 28, bevel = 0) =>
  cylinder(cx, cy, r, z, height, P, steps, bevel);
const join = (paths: string[]) => paths.join("");
const R = Math.PI / 180;

/* ---------------------------------------------------------------- base */

const FEET: Array<[number, number]> = [
  [BASE.x + 26, BASE.y + 26],
  [BASE.x + BASE.w - 26, BASE.y + 26],
  [BASE.x + 26, BASE.y + BASE.d - 26],
  [BASE.x + BASE.w - 26, BASE.y + BASE.d - 26],
];

const BASE_SCREWS: Array<[number, number]> = [
  [BASE.x + 10, BASE.y + 10],
  [BASE.x + BASE.w - 10, BASE.y + 10],
  [BASE.x + 10, BASE.y + BASE.d - 10],
  [BASE.x + BASE.w - 10, BASE.y + BASE.d - 10],
];

const PLATE: Plan = { x: -412, y: 30, w: 72, d: 12, r: 1.4 };
const RAIL: Plan = { x: -420, y: -82, w: 840, d: 16, r: 2 };
const DRAWER: Plan = { x: -72, y: 75, w: 144, d: 3, r: 2 };
const ACCESS: Plan = { x: 82, y: 75.4, w: 92, d: 2, r: 1 };

const TAPE_LINE = lineOnTop([-414, 56], [414, 56], BED_TOP + 0.58, P);
const TAPE_STATION_TICKS = join(
  STATIONS.map((x) => lineOnTop([x, 55], [x, 69], BED_TOP + 0.6, P)),
);
const TAPE_MINOR = topTicks(-420, 420, 20, 5, 57, BED_TOP + 0.6, [1.4, 2.6], P);

export const BASE_ART = {
  halo: solid(BASE, BASE_BOTTOM - 8, 0.3, 12).fill,
  feet: FEET.map(([x, y]) => [
    disc(x, y, 9.5, BASE_BOTTOM - 8, 1.4, 18),
    disc(x, y, 6.6, BASE_BOTTOM - 6.6, 6.6, 18),
  ]),
  slab: solid(BASE, BASE_BOTTOM, 20, 12, 1.6),
  bed: solid(BED, 0, BED_TOP, 10, 0.8),
  bedGroove: planOutline(insetPlan(BED, 5), BED_TOP + 0.02, P, 10),
  screws: BASE_SCREWS.map(([x, y]) => at(x, y, 0.04)),
  screwRings: join(BASE_SCREWS.map(([x, y]) => ring(x, y, 2.5, 0.04, P, 16))),
  plate: solid(PLATE, BED_TOP, 0.9, 4, 0.2),
  plateLine: planOutline(insetPlan(PLATE, 1.8), BED_TOP + 0.92, P, 4),
  plateScrews: [
    at(PLATE.x + 5, PLATE.y + PLATE.d / 2, BED_TOP + 0.96),
    at(PLATE.x + PLATE.w - 5, PLATE.y + PLATE.d / 2, BED_TOP + 0.96),
  ],
  plateText: topMatrix([PLATE.x + PLATE.w / 2, PLATE.y + 5.6], BED_TOP + 0.96, P, "x"),
  rail: solid(RAIL, 0, 8, 4, 0.4),
  railLine: planOutline(insetPlan(RAIL, 3), 8.02, P, 4),
  railScrews: STATIONS.flatMap((x) => [at(x - 40, -72, 8.04), at(x + 40, -72, 8.04)]),
  tape: solid(TAPE, BED_TOP, 0.55, 4, 0.2),
  tapeBase: TAPE_LINE,
  tapeStationTicks: TAPE_STATION_TICKS,
  tapeMinor: TAPE_MINOR.minor,
  tapeNumbers: STATIONS.map((x, index) => ({
    transform: topMatrix([x, 61], BED_TOP + 0.62, P, "x"),
    text: String(index + 1).padStart(2, "0"),
  })),
  drawer: solid(DRAWER, BASE_BOTTOM, 16, 4, 0.4),
  drawerLine: segment([-68, 76.52, -6.5], [68, 76.52, -6.5], P),
  drawerHandle: solid({ x: -20, y: 75.3, w: 40, d: 3, r: 1.5 }, BASE_BOTTOM + 8, 3, 3, 0.3),
  drawerLabel: solid({ x: -58, y: 75.5, w: 34, d: 0.9, r: 0.2 }, BASE_BOTTOM + 3, 8, 3, 0.15),
  drawerLabelScrews: [at(-54, 76.45, -8.6), at(-28, 76.45, -8.6)],
  drawerLabelRules: join(
    [-14, -12, -10].map((z) => segment([-56, 76.4, z], [-30, 76.4, z], P)),
  ),
  access: solid(ACCESS, BASE_BOTTOM, 12, 3, 0.3),
  accessScrews: [at(86, 76.42, -8), at(170, 76.42, -8)],
  accessRules: join(
    [-15, -13, -11].map((z) => segment([88, 76.35, z], [168, 76.35, z], P)),
  ),
};

/* ---------------------------------------------------------------- console */

const CONSOLE_BASE: Plan = { x: CONSOLE.x, y: CONSOLE.y, w: CONSOLE.w, d: CONSOLE.d, r: 3 };
const CONSOLE_BODY: Plan = { x: CONSOLE.x + 6, y: CONSOLE.y + 3, w: CONSOLE.w - 12, d: CONSOLE.d - 8, r: 2 };
const SCREEN: Plan = { x: CONSOLE.x + 12, y: CONSOLE.y + 8, w: CONSOLE.w - 24, d: 13, r: 1 };
const SCREEN_Z = 21.2;

export const CONSOLE_ART = {
  base: solid(CONSOLE_BASE, BED_TOP, 4, 4, 0.3),
  body: solid(CONSOLE_BODY, 8, 12, 4, 0.3),
  bodyLine: planOutline(insetPlan(CONSOLE_BODY, 2), 20.02, P, 4),
  screen: solid(SCREEN, 20, 1.2, 2, 0.1),
  screenLine: planOutline(SCREEN, SCREEN_Z + 0.02, P, 2),
  screenText: topMatrix([CONSOLE.x + CONSOLE.w / 2, CONSOLE.y + 14], SCREEN_Z + 0.08, P, "x"),
  start: disc(CONSOLE.x + 16, CONSOLE.y + 22, 3.1, 8, 1.8, 16),
  stop: disc(CONSOLE.x + 28, CONSOLE.y + 22, 2.6, 8, 1.2, 16),
  screws: [at(CONSOLE.x + 5, CONSOLE.y + 5, 8.04), at(CONSOLE.x + CONSOLE.w - 5, CONSOLE.y + 5, 8.04)],
};

/* ---------------------------------------------------------------- gantry */

const WHEEL_R = 18;
const WHEEL_Z = 168;

export const GANTRY_ART = {
  footL: solid({ x: -436, y: -60, w: 44, d: 44, r: 3 }, BED_TOP, 5, 4, 0.4),
  footR: solid({ x: 392, y: -60, w: 44, d: 44, r: 3 }, BED_TOP, 5, 4, 0.4),
  columnL: solid({ x: -430, y: -55, w: 22, d: 22, r: 2 }, BED_TOP + 4, 142, 4, 0.7),
  columnR: solid({ x: 408, y: -55, w: 22, d: 22, r: 2 }, BED_TOP + 4, 142, 4, 0.7),
  columnLLine: segment([-425.9, -43.9, 18], [-425.9, -43.9, 140], P),
  columnRLine: segment([412.1, -43.9, 18], [412.1, -43.9, 140], P),
  columnCaps: [
    solid({ x: -434, y: -58, w: 30, d: 28, r: 2 }, 146, 4, 3, 0.3),
    solid({ x: 404, y: -58, w: 30, d: 28, r: 2 }, 146, 4, 3, 0.3),
  ],
  bracketL: solid({ x: -434, y: -56, w: 30, d: 22, r: 2 }, 134, 10, 3, 0.3),
  bracketR: solid({ x: 404, y: -56, w: 30, d: 22, r: 2 }, 134, 10, 3, 0.3),
  bracketLline: segment([-430, -33.4, 134], [-400, -33.4, 150], P),
  bracketRline: segment([430, -33.4, 134], [400, -33.4, 150], P),
  bridge: solid({ x: -432, y: -56, w: 864, d: 22, r: 2 }, 144, 20, 4, 0.8),
  bridgeLine: planOutline(insetPlan({ x: -432, y: -56, w: 864, d: 22, r: 2 }, 3), 164.02, P, 4),
  bridgeScrews: [-360, -180, 0, 180, 360].map((x) => at(x, -45, 164.04)),
  frontRail: solid({ x: -424, y: -34, w: 848, d: 5, r: 1 }, 150, 3, 3, 0.2),
  railLine: lineOnTop([-420, -31.5], [420, -31.5], 153.04, P),
  leadScrew: segment([-418, -31, 155.05], [418, -31, 155.05], P),
  wheelSupport: solid({ x: WHEEL.x - 15, y: WHEEL.y - 13, w: 30, d: 26, r: 3 }, 164, 2, 3, 0.2),
  wheelShaft: disc(WHEEL.x, WHEEL.y, 4, 166, 2, 16),
  wheel: disc(WHEEL.x, WHEEL.y, WHEEL_R, WHEEL_Z, 2, 36),
  wheelRim: ring(WHEEL.x, WHEEL.y, WHEEL_R - 0.4, WHEEL_Z + 2.02, P, 36),
  wheelInner: ring(WHEEL.x, WHEEL.y, WHEEL_R - 6.2, WHEEL_Z + 2.04, P, 36),
  wheelHub: disc(WHEEL.x, WHEEL.y, 4.8, WHEEL_Z + 1.9, 1.6, 16),
  wheelSpokes: join(
    [15, 135, 255].map((angle) =>
      segment(
        [WHEEL.x + Math.cos(angle * R) * 5, WHEEL.y + Math.sin(angle * R) * 5, WHEEL_Z + 2.1],
        [WHEEL.x + Math.cos(angle * R) * 15, WHEEL.y + Math.sin(angle * R) * 15, WHEEL_Z + 2.1],
        P,
      ),
    ),
  ),
  wheelIndex: disc(WHEEL.x, WHEEL.y - 14.2, 1.4, WHEEL_Z + 2.1, 1, 12),
};

/* ---------------------------------------------------------------- head */

const CARRIAGE: Plan = { x: -27, y: -62, w: 54, d: 30, r: 3 };
const QUILL: Plan = { x: -9, y: -38, w: 18, d: 12, r: 1.5 };
const ARM: Plan = { x: -12, y: -42, w: 24, d: 60, r: 2 };
const DIAL_STAND: Plan = { x: -15, y: -28, w: 30, d: 24, r: 2 };

const DIAL_TICKS = radialTicks(0, DIAL_CY, DIAL_R, 40, 5, DIAL_FACE + 0.03, [1.4, 3], P);
const ZERO_ANGLE = -135 * R;

export const HEAD_ART = {
  carriage: solid(CARRIAGE, 164, 10, 4, 0.5),
  carriageLine: planOutline(insetPlan(CARRIAGE, 3), 174.02, P, 4),
  carriageScrews: [at(-20, -57, 174.04), at(20, -57, 174.04)],
  quill: solid(QUILL, 136, 30, 4, 0.4),
  quillLine: planOutline({ x: -9, y: -38, w: 18, d: 12, r: 1.5 }, 166.02, P, 4),
  arm: solid(ARM, 136, 8, 4, 0.6),
  armLine: planOutline(insetPlan(ARM, 2), 144.02, P, 4),
  armScrews: [at(0, -34, 144.04), at(0, -8, 144.04), at(0, 12, 144.04)],
  stand: solid(DIAL_STAND, 144, 3, 4, 0.25),
  body: disc(0, DIAL_CY, 18, 147, 12, 40),
  bezel: ring(0, DIAL_CY, DIAL_R + 1.2, DIAL_FACE + 0.02, P, 40),
  face: ring(0, DIAL_CY, DIAL_R, DIAL_FACE + 0.06, P, 40),
  ticksMinor: DIAL_TICKS.minor,
  ticksMajor: DIAL_TICKS.major,
  hub: disc(0, DIAL_CY, 2.4, DIAL_FACE + 0.02, 1.3, 16),
  label: topMatrix([0, DIAL_CY + 7], DIAL_FACE + 0.08, P, "x"),
  zeroStop: lineOnTop(
    [Math.sin(ZERO_ANGLE) * 12, DIAL_CY - Math.cos(ZERO_ANGLE) * 12],
    [Math.sin(ZERO_ANGLE) * (DIAL_R - 1.2), DIAL_CY - Math.cos(ZERO_ANGLE) * (DIAL_R - 1.2)],
    DIAL_FACE + 0.1,
    P,
  ),
  sleeve: disc(0, 14, 4.6, 128, 8, 20),
  sleeveLine: ring(0, 14, 4.6, 128.05, P, 20),
  probeTip: disc(0, 14, 2.2, 0, 1.6, 12),
  probeCollar: disc(0, 14, 3, 1.6, 1.1, 12),
};

export function needleFor(percent: number) {
  const share = Math.max(0, Math.min(100, percent)) / 100;
  const angle = (-135 + share * 270) * R;
  return lineOnTop(
    [0, DIAL_CY],
    [Math.sin(angle) * (DIAL_R - 1.6), DIAL_CY - Math.cos(angle) * (DIAL_R - 1.6)],
    DIAL_FACE + 0.12,
    P,
  );
}

/* ---------------------------------------------------------------- stations */

export const PALLET_ART = {
  body: solid(PALLET, BED_TOP, 3, 4, 0.3),
  line: planOutline(PALLET, PALLET_TOP + 0.02, P, 4),
  zeroLine: planOutline(PALLET, PALLET_TOP + 0.04, P, 4),
  screws: [
    at(-30, -20, PALLET_TOP + 0.04),
    at(30, -20, PALLET_TOP + 0.04),
    at(-30, 20, PALLET_TOP + 0.04),
    at(30, 20, PALLET_TOP + 0.04),
  ],
};

export type Piece = {
  paths: SolidPaths;
  tone?: Tone;
  crease?: Tone | "none";
  lit?: boolean;
};

export type SpecimenArt = {
  pieces: Piece[];
  lines?: Array<{ d: string; tone?: LineTone }>;
  dots?: Flat[];
};

/* 01 — 12,000-line command output: head and tail kept, middle gone. */
const outputPile = (x: number) =>
  [0, 1, 2].map((layer) =>
    solid(
      { x: x, y: -18, w: 24, d: 36, r: 0.5 },
      PALLET_TOP + layer * 1.6,
      1.5,
      3,
      0.12,
    ),
  );

const OUTPUT_LINES = join(
  [-28, -18, -8, 8, 18, 28].flatMap((x) =>
    [-10, 2, 14].map((y) => lineOnTop([x - 8, y], [x + 8, y], 11.82, P)),
  ),
);

const OUTPUT_ART: SpecimenArt = {
  pieces: [
    ...outputPile(-30).map((paths, index) => ({
      paths,
      tone: (index === 2 ? "mid" : "lo") as Tone,
      crease: "none" as const,
    })),
    ...outputPile(6).map((paths, index) => ({
      paths,
      tone: (index === 2 ? "mid" : "lo") as Tone,
      crease: "none" as const,
    })),
  ],
  lines: [{ d: OUTPUT_LINES, tone: "faint" }],
};

/* 02 — JSON tool envelope: a frame around the retained shape. */
const JSON_FRAME: Plan[] = [
  { x: -28, y: -17, w: 56, d: 6, r: 0.6 },
  { x: -28, y: 11, w: 56, d: 6, r: 0.6 },
  { x: -28, y: -11, w: 6, d: 22, r: 0.6 },
  { x: 22, y: -11, w: 6, d: 22, r: 0.6 },
];

const JSON_ART: SpecimenArt = {
  pieces: JSON_FRAME.map((plan) => ({
    paths: solid(plan, PALLET_TOP, 14, 3, 0.25),
    tone: "mid" as Tone,
    crease: "faint" as const,
  })),
  lines: [
    { d: planOutline({ x: -28, y: -17, w: 56, d: 34, r: 1 }, 21.02, P, 4), tone: "faint" },
  ],
};

/* 03 — 2,000-case test run: a perforated grid. */
const GRID_DOTS = Array.from({ length: 4 }, (_, row) =>
  Array.from({ length: 5 }, (_, col) => at(-20 + col * 10, -12 + row * 8, 13.12)),
).flat();

const TEST_ART: SpecimenArt = {
  pieces: [
    {
      paths: solid({ x: -28, y: -18, w: 56, d: 36, r: 1 }, PALLET_TOP, 6, 4, 0.25),
      tone: "mid",
      crease: "faint",
    },
  ],
  dots: GRID_DOTS,
};

/* 04 — traceback: a spool of frames, one tail hanging out. */
const SPOOL_ART: SpecimenArt = {
  pieces: [
    {
      paths: solid({ x: -3, y: 12, w: 6, d: 12, r: 0.4 }, PALLET_TOP, 0.35, 2, 0.08),
      tone: "hi",
      crease: "none",
    },
    {
      paths: disc(0, 0, 14, PALLET_TOP, 20, 32),
      tone: "mid",
      crease: "faint",
    },
    {
      paths: disc(0, 0, 4, 27, 1.2, 16),
      tone: "hi",
      crease: "none",
    },
  ],
  lines: [
    { d: ring(0, 0, 13, 27.04, P, 32), tone: "faint" },
    { d: ring(0, 0, 9.4, 27.05, P, 32), tone: "faint" },
    { d: ring(0, 0, 5.4, 27.06, P, 32), tone: "faint" },
    { d: lineOnTop([-3, 12], [3, 12], 7.42, P), tone: "faint" },
    { d: lineOnTop([-3, 16], [3, 16], 7.43, P), tone: "faint" },
    { d: lineOnTop([-3, 20], [3, 20], 7.44, P), tone: "faint" },
  ],
};

/* 05 — 600 KB patch: kept whole, seam visible, deliberately zero. */
const PATCH_ART: SpecimenArt = {
  pieces: [
    {
      paths: solid({ x: -26, y: -16, w: 52, d: 32, r: 1 }, PALLET_TOP, 28, 4, 0.4),
      tone: "mid",
      crease: "faint",
    },
    {
      paths: solid({ x: -12, y: -8, w: 24, d: 16, r: 0.6 }, PALLET_TOP + 28, 1, 3, 0.15),
      tone: "lo",
      crease: "none",
    },
  ],
  lines: [
    { d: segment([0, 16.02, 10], [0, 16.02, 32], P), tone: "faint" },
    { d: join([-12, -6, 0, 6, 12].map((y) => segment([-5, y, 35.08], [5, y, 35.08], P))), tone: "faint" },
    { d: planOutline({ x: -12, y: -8, w: 24, d: 16, r: 0.6 }, 35.06, P, 3), tone: "faint" },
  ],
};

/* 06 — 900-row SQL result: a bound ledger. */
const LEDGER_ART: SpecimenArt = {
  pieces: [
    ...[0, 1, 2].map((layer) => ({
      paths: solid({ x: -27, y: -18, w: 54, d: 36, r: 0.7 }, PALLET_TOP + layer * 3, 2.9, 4, 0.15),
      tone: (layer === 2 ? "mid" : "lo") as Tone,
      crease: "none" as const,
    })),
    {
      paths: solid({ x: -27, y: -18, w: 7, d: 36, r: 0.6 }, PALLET_TOP, 11, 3, 0.2),
      tone: "mid",
      crease: "faint",
    },
  ],
  lines: [
    { d: lineOnTop([-18, -10], [24, -10], 16.02, P), tone: "faint" },
    { d: lineOnTop([-18, 0], [24, 0], 16.02, P), tone: "faint" },
    { d: lineOnTop([-18, 10], [24, 10], 16.02, P), tone: "faint" },
    { d: segment([-20.4, 18.02, 8], [-20.4, 18.02, 15], P), tone: "faint" },
  ],
};

/* 07 — 8,000-line build log: a tall, slightly fanned stack. */
const STACK_ART: SpecimenArt = {
  pieces: Array.from({ length: 6 }, (_, layer) => ({
    paths: solid(
      { x: -30 + layer * 0.9, y: -18 + layer * 0.35, w: 60 - layer * 1.8, d: 36, r: 0.5 },
      PALLET_TOP + layer * 2.6,
      2.45,
      3,
      0.12,
    ),
    tone: (layer % 2 ? "lo" : "mid") as Tone,
    crease: "none" as const,
  })),
  lines: [
    { d: join([-8, 0, 8].map((y) => lineOnTop([-20, y], [20, y], 22.62, P))), tone: "faint" },
  ],
};

/* 08 — 8,000-item JSON array: a rack of records, kept whole. */
const ARRAY_ART: SpecimenArt = {
  pieces: [
    {
      paths: solid({ x: -26, y: -16, w: 52, d: 32, r: 0.8 }, PALLET_TOP, 3, 3, 0.2),
      tone: "lo",
      crease: "none",
    },
    ...[-24, -12, 0, 12, 24].map((x) => ({
      paths: solid({ x: x - 2, y: -16, w: 4, d: 32, r: 0.3 }, PALLET_TOP + 3, 25, 3, 0.12),
      tone: "mid" as Tone,
      crease: "none" as const,
    })),
    {
      paths: solid({ x: -26, y: 12, w: 52, d: 4, r: 0.5 }, PALLET_TOP + 3, 25, 3, 0.15),
      tone: "mid",
      crease: "faint",
    },
  ],
  lines: [
    { d: lineOnTop([-26, 14], [26, 14], 35.03, P), tone: "hi" },
  ],
};

export const SPECIMENS: SpecimenArt[] = [
  OUTPUT_ART,
  JSON_ART,
  TEST_ART,
  SPOOL_ART,
  PATCH_ART,
  LEDGER_ART,
  STACK_ART,
  ARRAY_ART,
];

/* ---------------------------------------------------------------- zero clamp */

const CLAMP_POSTS = [-33, 28];
const ZERO_TAG: Plan = { x: 18, y: -25, w: 14, d: 9, r: 1 };

export const ZERO_ART = {
  pieces: [
    ...CLAMP_POSTS.map((x) => ({
      paths: solid({ x, y: -21, w: 5, d: 5, r: 0.6 }, PALLET_TOP, 29, 3, 0.15),
      tone: "lo" as Tone,
      crease: "none" as const,
    })),
    {
      paths: solid({ x: -35, y: -22, w: 70, d: 8, r: 1.5 }, 34, 4, 4, 0.3),
      tone: "mid",
      crease: "faint",
    },
    {
      paths: disc(0, -18, 4, 38, 1, 16),
      tone: "hi",
      crease: "none",
      lit: true,
    },
    {
      paths: solid(ZERO_TAG, 38, 0.8, 3, 0.1),
      tone: "hi",
      crease: "none",
      lit: true,
    },
  ] as Piece[],
  tagLine: planOutline(ZERO_TAG, 38.82, P, 3),
  tagText: topMatrix([ZERO_TAG.x + ZERO_TAG.w / 2, ZERO_TAG.y + 4.5], 38.9, P, "x"),
  palletEdge: planOutline(PALLET, PALLET_TOP + 0.04, P, 4),
  sealTop: lineOnTop([-3, -18], [3, -18], 39.04, P),
};

/* ---------------------------------------------------------------- chart marker */

export const MARKER_ART = solid({ x: -4, y: 68, w: 8, d: 3, r: 1 }, BED_TOP + 0.6, 0.8, 2, 0.1);
