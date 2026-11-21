import { fitProjection, iso, type Flat, type Point3 } from "../../iso/iso-kit";

export const WIDTH = 540;
export const HEIGHT = 430;

const EXTENTS: Point3[] = [
  [-158, -74, -28],
  [158, -74, -28],
  [-158, 74, -28],
  [158, 74, -28],
  [-158, -74, 0],
  [158, 74, 0],
  [-12, -74, 154],
  [12, 74, 154],
  [-98, 0, 112],
  [98, 0, 112],
  [-125, -30, 4],
  [125, 26, 4],
  [115, -50, 20],
];

export const P = fitProjection(EXTENTS, WIDTH, HEIGHT, {
  pad: 16,
  azimuth: 55,
  elevation: 31,
});

export const at = (x: number, y: number, z: number): Flat => iso([x, y, z], P);

export const BASE = { x: -150, y: -70, w: 300, d: 140, r: 10 };
export const BASE_BOTTOM = -20;
export const BED = { x: -138, y: -58, w: 276, d: 116, r: 3 };
export const BED_TOP = 3;

export const SHEET_X0 = -125;
export const SHEET_X1 = 125;
export const SHEET_Y = -30;
export const SHEET_D = 56;
export const SHEET_Z = 3.2;
export const SHEET_H = 0.8;
export const SHEET_TOP = SHEET_Z + SHEET_H;
export const SHEET_LENGTH = SHEET_X1 - SHEET_X0;

export const WINDOW_MIN = 46;
export const WINDOW_MAX = 150;
export const WINDOW_DEFAULT = 106.874;

export const POST_Z = 132;
export const BRIDGE_Z = 132;
export const BRIDGE_H = 10;
export const BEAM_Z = 100;
export const BEAM_H = 10;
export const BEAM_STROKE = 18;
export const BLADE_REST_BOTTOM = 20;

export const TAPE_REST_Z = 78;
export const TAPE_STROKE = 74;

export const DIAL = { x: 115, y: -50, face: 20.06, r: 14.5 };

export const TOTAL_BYTES = 32084;
export const ELIDED_AT_DEFAULT = 13716;

export const bytesFor = (window: number) => Math.round((window / SHEET_LENGTH) * TOTAL_BYTES);
export const shareFor = (window: number) => window / SHEET_LENGTH;
