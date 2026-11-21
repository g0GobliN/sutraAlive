import { fitProjection, iso, type Flat, type Point3 } from "../../iso/iso-kit";

export const WIDTH = 720;
export const HEIGHT = 430;

const EXTENTS: Point3[] = [
  [-450, -92, -30],
  [450, -92, -30],
  [-450, 92, -30],
  [450, 92, -30],
  [-450, 92, 0],
  [450, 92, 0],
  [-450, -92, 0],
  [450, -92, 0],
  [-432, -56, 176],
  [432, -56, 176],
  [396, -45, 172],
  [430, 54, 28],
  [-412, 42, 12],
];

export const P = fitProjection(EXTENTS, WIDTH, HEIGHT, {
  pad: 14,
  azimuth: 52,
  elevation: 30,
});

export const at = (x: number, y: number, z: number): Flat => iso([x, y, z], P);

export const BASE = { x: -450, y: -75, w: 900, d: 150, r: 12 };
export const BASE_BOTTOM = -20;
export const BED = { x: -430, y: -62, w: 860, d: 124, r: 4 };
export const BED_TOP = 4;

export const STATIONS = [-350, -250, -150, -50, 50, 150, 250, 350];
export const STATION_Y = 0;

export const PALLET = { x: -36, y: -26, w: 72, d: 52, r: 2 };
export const PALLET_TOP = 7;

export const PROBE_Y = 14;
export const PROBE_REST = 46;
export const PROBE_TOPS = [11.8, 21, 13, 27, 35, 16, 22.6, 35];

export const DIAL_CY = -14;
export const DIAL_R = 16;
export const DIAL_FACE = 161;

export const TAPE = { x: -420, y: 54, w: 840, d: 16, r: 2 };
export const CONSOLE = { x: 366, y: 28, w: 68, d: 26, r: 3 };
export const WHEEL = { x: 396, y: -45 };

export const percentOf = (saved: string) => {
  const value = Number.parseFloat(saved);
  return Number.isFinite(value) ? value : 0;
};
