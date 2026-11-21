#!/usr/bin/env node
/**
 * Resolve the latest SUTRA tag from GitHub Releases and write it to
 * version.json (repository snapshot) and public/version.json (served at
 * /version.json and fetched by the app).
 *
 * Runs before every build and in .github/workflows/version-sync.yml.
 * GitHub is the single source of truth; a new tag never needs a site edit.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = process.env.SUTRA_REPO ?? "g0GobliN/sutra";
const API = `https://api.github.com/repos/${REPO}`;
const TARGETS = [join(ROOT, "version.json"), join(ROOT, "public", "version.json")];
const TIMEOUT_MS = 12_000;

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "sutra-web-version-sync",
};
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function get(path) {
  const response = await fetch(`${API}${path}`, {
    headers,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`${path} -> HTTP ${response.status}`);
  return response.json();
}

async function fromReleases() {
  const release = await get("/releases/latest");
  if (!release?.tag_name) throw new Error("release has no tag_name");
  return {
    tag: release.tag_name,
    url: release.html_url ?? `https://github.com/${REPO}/releases/tag/${release.tag_name}`,
    publishedAt: release.published_at ?? null,
  };
}

async function fromTags() {
  const tags = await get("/tags?per_page=100");
  if (!Array.isArray(tags) || tags.length === 0) throw new Error("repository has no tags");
  const tag = tags[0].name;
  return {
    tag,
    url: `https://github.com/${REPO}/releases/tag/${tag}`,
    publishedAt: null,
  };
}

async function readExisting() {
  try {
    const parsed = JSON.parse(await readFile(TARGETS[0], "utf8"));
    if (typeof parsed.tag !== "string") throw new Error("missing tag");
    return parsed;
  } catch {
    return null;
  }
}

async function write(payload) {
  const body = `${JSON.stringify(payload, null, 2)}\n`;
  await Promise.all(TARGETS.map((path) => writeFile(path, body, "utf8")));
  console.log(`version.json -> ${payload.tag} (${payload.source})`);
}

async function main() {
  const fallback = await readExisting();
  const base = { checkedAt: new Date().toISOString(), source: "github-releases" };

  for (const resolve of [fromReleases, fromTags]) {
    try {
      const resolved = await resolve();
      await write({
        ...base,
        ...resolved,
        version: resolved.tag.replace(/^v/i, ""),
      });
      return;
    } catch (error) {
      console.warn(`skip: ${error.message}`);
    }
  }

  if (fallback) {
    console.warn(`keeping committed snapshot ${fallback.tag}; GitHub was unreachable`);
    process.exit(0);
  }

  console.error("could not resolve a SUTRA tag and no committed snapshot exists");
  process.exit(1);
}

await main();
