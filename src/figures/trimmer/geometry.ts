import {
  cylinder,
  insetPlan,
  lineOnTop,
  pathOf,
  planOutline,
  radialTicks,
  ring,
  segment,
  slabOf,
  topMatrix,
  topTicks,
  type Flat,
  type Plan,
} from "../../iso/iso-kit";
import {
  BASE,
  BASE_BOTTOM,
  BEAM_Z,
  BED,
  BED_TOP,
  DIAL,
  P,
  POST_Z,
  SHEET_D,
  SHEET_H,
  SHEET_LENGTH,
  SHEET_TOP,
  SHEET_X0,
  SHEET_X1,
  SHEET_Y,
  SHEET_Z,
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
  [BASE.x + 18, BASE.y + 18],
  [BASE.x + BASE.w - 18, BASE.y + 18],
  [BASE.x + 18, BASE.y + BASE.d - 18],
  [BASE.x + BASE.w - 18, BASE.y + BASE.d - 18],
];

const BASE_SCREWS: Array<[number, number]> = [
  [BASE.x + 8, BASE.y + 8],
  [BASE.x + BASE.w - 8, BASE.y + 8],
  [BASE.x + 8, BASE.y + BASE.d - 8],
  [BASE.x + BASE.w - 8, BASE.y + BASE.d - 8],
];

const RULER: Plan = { x: -138, y: 50, w: 276, d: 8, r: 1 };
const PLATE: Plan = { x: -138, y: -67, w: 70, d: 10, r: 1.4 };
const RULE_TICKS = topTicks(-134, 134, 4, 5, 51, 3.52, [2, 4], P);

export const BASE_ART = {
  halo: solid(BASE, BASE_BOTTOM - 8, 0.3, 10).fill,
  feet: FEET.map(([x, y]) => [
    disc(x, y, 8, BASE_BOTTOM - 8, 1.4, 18),
    disc(x, y, 5.6, BASE_BOTTOM - 6.6, 6.6, 18),
  ]),
  slab: solid(BASE, BASE_BOTTOM, 20, 10, 1.4),
  bed: solid(BED, 0, BED_TOP, 8, 0.6),
  bedGroove: planOutline(insetPlan(BED, 4), BED_TOP + 0.02, P, 8),
  slot: solid({ x: -80, y: -30, w: 160, d: 56, r: 1 }, BED_TOP + 0.03, 0.12, 2),
  slotLine: planOutline({ x: -80, y: -30, w: 160, d: 56, r: 1 }, BED_TOP + 0.17, P, 2),
  screws: BASE_SCREWS.map(([x, y]) => at(x, y, 0.04)),
  screwRings: join(BASE_SCREWS.map(([x, y]) => ring(x, y, 2.4, 0.04, P, 16))),
  ruler: solid(RULER, BED_TOP, 0.5, 4, 0.2),
  rulerBase: lineOnTop([-134, 51], [134, 51], 3.52, P),
  ticksMinor: RULE_TICKS.minor,
  ticksMajor: RULE_TICKS.major,
  plate: solid(PLATE, 0, 0.9, 4, 0.2),
  plateLine: planOutline(insetPlan(PLATE, 1.8), 0.92, P, 4),
  plateScrews: [at(PLATE.x + 5, PLATE.y + PLATE.d / 2, 0.94), at(PLATE.x + PLATE.w - 5, PLATE.y + PLATE.d / 2, 0.94)],
  plateText: topMatrix([PLATE.x + PLATE.w / 2, PLATE.y + 5.4], 0.94, P, "x"),
};

/* ---------------------------------------------------------------- portal */

const POST_BACK: Plan = { x: -6, y: -70, w: 12, d: 12, r: 1.6 };
const POST_FRONT: Plan = { x: -6, y: 48, w: 12, d: 12, r: 1.6 };
const PAD_BACK: Plan = { x: -9, y: -73, w: 18, d: 18, r: 2 };
const PAD_FRONT: Plan = { x: -9, y: 45, w: 18, d: 18, r: 2 };
const BRIDGE: Plan = { x: -7, y: -70, w: 14, d: 136, r: 2 };

export const PORTAL_ART = {
  backPad: solid(PAD_BACK, 0, 3, 4, 0.4),
  backPost: solid(POST_BACK, 3, POST_Z - 3, 4, 0.6),
  backLine: segment([-6, -64, 8], [-6, -64, POST_Z - 4], P),
  frontPad: solid(PAD_FRONT, BED_TOP, 2, 4, 0.3),
  frontPost: solid(POST_FRONT, BED_TOP + 2, POST_Z - BED_TOP - 2, 4, 0.6),
  frontLine: segment([-6, 54, BED_TOP + 5], [-6, 54, POST_Z - 4], P),
  padScrews: [at(-7, -71, 3.02), at(5, -71, 3.02)],
  bridge: solid(BRIDGE, 132, 10, 4, 0.8),
  bridgeLine: planOutline(insetPlan(BRIDGE, 2), 142.02, P, 4),
  bridgeScrews: [at(0, -64, 142.04), at(0, 54, 142.04)],
  mount: solid({ x: -10, y: -12, w: 20, d: 24, r: 2 }, 126, 6, 3, 0.3),
  arm: solid({ x: -3, y: -64, w: 6, d: 74, r: 1 }, 126, 6, 3, 0.3),
};

/* ---------------------------------------------------------------- blades */

const BEAM: Plan = { x: -95, y: -6, w: 190, d: 12, r: 2 };
const KNOB_BLOCK: Plan = { x: 79, y: -5, w: 13, d: 10, r: 1.5 };
const RODS = [-40, 40];

export const BEAM_ART = {
  beam: solid(BEAM, BEAM_Z, 10, 4, 0.8),
  beamLine: planOutline(insetPlan(BEAM, 2), BEAM_Z + 10.02, P, 4),
  beamScrews: [-88, -44, 44, 88].map((x) => at(x, 0, BEAM_Z + 10.04)),
  screw: solid({ x: -86, y: -1.2, w: 172, d: 2.4, r: 1 }, BEAM_Z + 10, 1.5, 3, 0.2),
  knobBlock: solid(KNOB_BLOCK, BEAM_Z + 10, 4, 3, 0.3),
  knob: disc(85.5, 0, 6, BEAM_Z + 14, 6, 24),
  knobCap: disc(85.5, 0, 4.2, BEAM_Z + 20, 1.2, 20),
  knobLine: planOutline({ x: 79, y: -5, w: 13, d: 10, r: 1.5 }, BEAM_Z + 14.02, P, 3),
  ends: [
    solid({ x: -96, y: -7, w: 3, d: 14, r: 0.8 }, BEAM_Z + 1, 8, 3),
    solid({ x: 93, y: -7, w: 3, d: 14, r: 0.8 }, BEAM_Z + 1, 8, 3),
  ],
  rods: RODS.map((x) => disc(x, 0, 2.6, 95, 37, 20)),
};

function bladeHead(side: -1 | 1) {
  const shoeX = side < 0 ? -18 : 9;
  const armX = side < 0 ? -15.5 : 11.5;
  return {
    block: solid({ x: -9, y: -54, w: 18, d: 108, r: 2 }, 84, 16, 4, 0.5),
    blockLine: planOutline({ x: -9, y: -54, w: 18, d: 108, r: 2 }, 100.02, P, 4),
    screws: [at(0, -46, 100.04), at(0, 46, 100.04)],
    blade: solid({ x: -1.5, y: -52, w: 3, d: 104, r: 0.6 }, 20, 64, 3, 0.15),
    edge: segment([0, -51, 20.04], [0, 51, 20.04], P),
    shoe: solid({ x: shoeX, y: -38, w: 9, d: 76, r: 1 }, 22, 12, 3, 0.3),
    shoeLine: planOutline({ x: shoeX, y: -38, w: 9, d: 76, r: 1 }, 34.02, P, 3),
    arm: solid({ x: armX, y: -4, w: 4, d: 8, r: 0.8 }, 34, 50, 3),
  };
}

export const HEAD_LEFT = bladeHead(-1);
export const HEAD_RIGHT = bladeHead(1);

export function spring(cx: number, cy: number, radius: number, z0: number, z1: number, turns = 7) {
  const points: Flat[] = [];
  const steps = turns * 12;
  for (let step = 0; step <= steps; step++) {
    const t = step / steps;
    const angle = t * turns * Math.PI * 2;
    points.push(at(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, z0 + (z1 - z0) * t));
  }
  return pathOf(points);
}

/* ---------------------------------------------------------------- tape head */

export const TAPE_ART = {
  bracket: solid({ x: -11, y: 48, w: 22, d: 18, r: 2 }, 142, 2, 3, 0.3),
  roll: disc(0, 57, 8, 144, 10, 28),
  rollCap: disc(0, 57, 5.6, 154, 1.4, 24),
  rollHub: disc(0, 57, 2.4, 155.4, 1.2, 16),
  rollLine: ring(0, 57, 6.6, 154.04, P, 24),
  head: {
    shaft: solid({ x: -2, y: -2, w: 4, d: 4, r: 0.8 }, 90, 42, 3),
    block: solid({ x: -17, y: -30, w: 34, d: 60, r: 2 }, 80, 10, 4, 0.4),
    blockLine: planOutline({ x: -17, y: -30, w: 34, d: 60, r: 2 }, 90.02, P, 4),
    screws: [at(0, -24, 90.04), at(0, 24, 90.04)],
    pad: solid({ x: -13, y: -26, w: 26, d: 52, r: 1.5 }, 78, 2, 4, 0.2),
    padLine: planOutline({ x: -13, y: -26, w: 26, d: 52, r: 1.5 }, 80.02, P, 4),
  },
};

/* ---------------------------------------------------------------- dial */

const STAND: Plan = { x: 96, y: -58, w: 38, d: 26, r: 3 };
const DIAL_TICKS = radialTicks(DIAL.x, DIAL.y, DIAL.r, 40, 5, DIAL.face + 0.03, [1.6, 3.4], P);

export const DIAL_ART = {
  stand: solid(STAND, BED_TOP, 5, 4, 0.5),
  standScrews: [at(100, -54, BED_TOP + 5.02), at(130, -54, BED_TOP + 5.02)],
  body: disc(DIAL.x, DIAL.y, 17, 8, 12, 40),
  bezel: ring(DIAL.x, DIAL.y, 16.4, DIAL.face + 0.02, P, 40),
  face: ring(DIAL.x, DIAL.y, DIAL.r, DIAL.face + 0.06, P, 40),
  ticksMinor: DIAL_TICKS.minor,
  ticksMajor: DIAL_TICKS.major,
  hub: disc(DIAL.x, DIAL.y, 2.2, DIAL.face + 0.02, 1.4, 16),
  label: topMatrix([DIAL.x, DIAL.y + 6.5], DIAL.face + 0.08, P, "x"),
};

export function needleFor(window: number) {
  const share = Math.max(0, Math.min(1, window / SHEET_LENGTH));
  const angle = (-135 + share * 270) * R;
  return lineOnTop(
    [DIAL.x, DIAL.y],
    [DIAL.x + Math.sin(angle) * (DIAL.r - 1.6), DIAL.y - Math.cos(angle) * (DIAL.r - 1.6)],
    DIAL.face + 0.1,
    P,
  );
}

/* ---------------------------------------------------------------- sheet */

const SHEET_FULL: Plan = { x: SHEET_X0, y: SHEET_Y, w: SHEET_LENGTH, d: SHEET_D, r: 0.8 };
const LINE_YS = [-23, -15, -7, 1, 9, 17];

export const SHEET_ART = {
  slab: solid(SHEET_FULL, SHEET_Z, SHEET_H, 4, 0.15),
  lines: join(LINE_YS.map((y) => lineOnTop([SHEET_X0 + 7, y], [SHEET_X1 - 7, y], SHEET_TOP + 0.02, P))),
  edge: planOutline(SHEET_FULL, SHEET_TOP + 0.02, P, 4),
};

export function cutArt(window: number) {
  const half = window / 2;
  const side = SHEET_X1 - half;
  const head = solid({ x: SHEET_X0, y: SHEET_Y, w: side, d: SHEET_D, r: 0.8 }, SHEET_Z, SHEET_H, 3, 0.15);
  const tail = solid({ x: half, y: SHEET_Y, w: side, d: SHEET_D, r: 0.8 }, SHEET_Z, SHEET_H, 3, 0.15);
  const band = solid({ x: -half, y: SHEET_Y, w: window, d: SHEET_D, r: 0.4 }, SHEET_Z, SHEET_H, 3, 0.1);
  const label = solid({ x: -7, y: -26, w: 14, d: 52, r: 0.5 }, SHEET_TOP, 0.55, 4, 0.12);
  const line = (from: number, to: number) => join(LINE_YS.map((y) => lineOnTop([from, y], [to, y], SHEET_TOP + 0.03, P)));
  return {
    head,
    tail,
    band,
    label,
    headLines: line(SHEET_X0 + 7, -half - 3),
    tailLines: line(half + 3, SHEET_X1 - 7),
    bandLines: line(-half + 3, half - 3),
    bandEdge: planOutline({ x: -half, y: SHEET_Y, w: window, d: SHEET_D, r: 0.4 }, SHEET_TOP + 0.04, P, 3),
    headEdge: planOutline({ x: SHEET_X0, y: SHEET_Y, w: side, d: SHEET_D, r: 0.8 }, SHEET_TOP + 0.03, P, 4),
    tailEdge: planOutline({ x: half, y: SHEET_Y, w: side, d: SHEET_D, r: 0.8 }, SHEET_TOP + 0.03, P, 4),
    labelText: topMatrix([0, -12], SHEET_TOP + 0.57, P, "y"),
  };
}

/* ---------------------------------------------------------------- drawer */

const DRAWER: Plan = { x: -72, y: 68, w: 144, d: 4, r: 2 };
const DRAWER_LABEL: Plan = { x: -58, y: 72.1, w: 34, d: 0.9, r: 0.2 };
const ACCESS: Plan = { x: 86, y: 70.2, w: 44, d: 2, r: 1 };

export const DRAWER_ART = {
  front: solid(DRAWER, BASE_BOTTOM, 17, 4, 0.4),
  faceLine: segment([-68, 72.14, -6.5], [68, 72.14, -6.5], P),
  handle: solid({ x: -20, y: 72, w: 40, d: 4, r: 1.5 }, -11, 3, 3, 0.3),
  label: solid(DRAWER_LABEL, -16, 8, 3, 0.15),
  labelScrews: [at(-54, 73.05, -8.6), at(-28, 73.05, -8.6)],
  labelRules: join([-14, -12, -10].map((z) => segment([-56, 73.05, z], [-30, 73.05, z], P))),
  footLine: segment([-72, 70.1, BASE_BOTTOM], [72, 70.1, BASE_BOTTOM], P),
  access: solid(ACCESS, -18, 12, 3, 0.3),
  accessScrews: [at(90, 72.35, -8), at(126, 72.35, -8)],
  accessRules: join([-15, -13, -11].map((z) => segment([92, 72.25, z], [124, 72.25, z], P))),
};
