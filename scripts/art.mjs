#!/usr/bin/env node
/*
 * One command from a generated engraving to a shipped asset.
 *
 *   node scripts/art.mjs .tmp-art/chest.jpg chest
 *   node scripts/art.mjs .tmp-art/guard.jpg guard --chrome
 *
 * Reads light line art on a pure black background, turns the black into
 * transparency, cuts the result to the three-tone ramp the site uses for small
 * sizes, and writes palette PNGs into public/assets.
 *
 *   default   public/assets/art/<name>.png   height 420 — page plates
 *   --chrome  public/assets/<name>-sm.png    height 96  — header/footer emblem
 *   --big     public/assets/<name>.png       height 512 — brand surfaces
 *
 * See ART.md. Never generate on white: the cut-out depends on a black ground.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith("--"));
const flags = new Set(args.filter((a) => a.startsWith("--")));
const [input, name] = positional;

if (!input || !name) {
  console.error("usage: node scripts/art.mjs <source.jpg|png> <name> [--chrome] [--big]");
  process.exit(1);
}

const isChrome = flags.has("--chrome");
const isBig = flags.has("--big");
const height = isChrome ? 96 : isBig ? 512 : 420;

/* three tones: highlight, mid (the hatching), nothing */
const TONES = [1, 0.62, 0];

const toAlpha = (luma) => {
  const t = Math.min(1, Math.max(0, (luma / 255 - 0.22) / 0.62));
  const v = Math.pow(t, 0.9);
  return v > 0.62 ? TONES[0] : v > 0.32 ? TONES[1] : TONES[2];
};

const main = async () => {
  const trimmed = await sharp(input).trim({ background: "#000000", threshold: 18 }).toBuffer();
  const { data, info } = await sharp(trimmed).greyscale().raw().toBuffer({ resolveWithObject: true });

  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i += 1) {
    const a = toAlpha(data[i]);
    rgba[i * 4] = 242;
    rgba[i * 4 + 1] = 242;
    rgba[i * 4 + 2] = 242;
    rgba[i * 4 + 3] = Math.round(a * 255);
  }

  const out = isChrome
    ? path.join("public/assets", `${name}-sm.png`)
    : path.join("public/assets", isBig ? `${name}.png` : path.join("art", `${name}.png`));

  fs.mkdirSync(path.dirname(out), { recursive: true });

  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .resize({ height, kernel: "lanczos3" })
    .sharpen({ sigma: isChrome ? 0.7 : 0.5 })
    .png({ palette: true, colours: 32, compressionLevel: 9 })
    .toFile(out);

  const meta = await sharp(out).metadata();
  const kb = (fs.statSync(out).size / 1024).toFixed(0);
  console.log(`${out}  ${meta.width}x${meta.height}  ${kb}KB`);
  if (!isChrome && !isBig) {
    console.log(`\n<ArtPlate className="docs-hero__art" src="/assets/art/${name}.png" caption="plate · the ${name}" />`);
    console.log("<PageArt src=\"/assets/art/" + name + ".png\" />");
  }
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
