#!/usr/bin/env node
/**
 * Chapter-checkpoint captures for the homepage stage.
 *
 * The stage is driven deterministically through `window.__courStage`, which
 * `useStageProgress` installs on the live page. That means a capture is a pure
 * function of `p`: no scroll-velocity simulation, no timing races, and the same
 * frame every run.
 *
 * Usage:
 *   node --experimental-strip-types scripts/stage-shots.mjs [--base URL] [--out DIR] [--only form]
 *
 * Chromium resolution order:
 *   1. $STAGE_CHROMIUM — explicit executable path
 *   2. playwright's own downloaded browser (if present)
 * Then $STAGE_LD_LIBRARY_PATH is prepended to LD_LIBRARY_PATH, which is what
 * lets a Lambda-style build (`@sparticuz/chromium`) run in a bare sandbox.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright-core";
import { STAGE_PROGRESS_CHECKPOINTS, CHAPTERS, formatProgress } from "../src/lib/stage/timeline.ts";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

/** Layer class suffixes, taken from the model so a rename cannot desync them. */
const LAYER_IDS = CHAPTERS.map((chapter) => chapter.id);

const BASE = flag("base", process.env.STAGE_BASE ?? "http://127.0.0.1:8080");
const OUT = flag("out", "screenshots/stage");
const ONLY = flag("only", null);

/** Viewports that matter: phone, tablet, laptop. */
const VIEWPORTS = [
  /* The reference capture's own framing, so a capture can be laid over the
     extracted frames without rescaling either side. */
  { id: "ref", width: 864, height: 1920, dsf: 1 },
  { id: "mobile", width: 390, height: 844, dsf: 2 },
  { id: "tablet", width: 834, height: 1112, dsf: 1 },
  { id: "desktop", width: 1440, height: 900, dsf: 1 },
];

function executablePath() {
  const explicit = process.env.STAGE_CHROMIUM;
  if (explicit && existsSync(explicit)) return explicit;
  const candidates = [
    "/tmp/chromium",
    `${process.env.HOME}/.cache/ms-playwright/chromium/chrome-linux/chrome`,
  ];
  for (const candidate of candidates) if (existsSync(candidate)) return candidate;
  return undefined; // let playwright resolve its own download
}

const shots = ONLY ? STAGE_PROGRESS_CHECKPOINTS.filter((c) => c.id === ONLY) : STAGE_PROGRESS_CHECKPOINTS;
if (!shots.length) {
  console.error(`no checkpoint matches --only ${ONLY}`);
  process.exit(2);
}

if (process.env.STAGE_LD_LIBRARY_PATH) {
  process.env.LD_LIBRARY_PATH = [process.env.STAGE_LD_LIBRARY_PATH, process.env.LD_LIBRARY_PATH]
    .filter(Boolean)
    .join(":");
}

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: executablePath(),
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-color-profile=srgb",
    "--font-render-hinting=none",
    "--disable-lcd-text",
  ],
});

const report = { base: BASE, generated: new Date().toISOString(), checkpoints: [] };
const problems = [];

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.dsf,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (/grok-app-builder|net::ERR_CONNECTION_CLOSED/.test(message.text())) return;
    consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(`pageerror: ${error.message}`));
  page.on("requestfailed", (request) => {
    // The preview host injects its own extension bundle; its absence from the
    // sandbox is an environment fact, not an application defect.
    if (/grok\.com|grok-app-builder/.test(request.url())) return;
    consoleErrors.push(`requestfailed: ${request.url()} ${request.failure()?.errorText ?? ""}`);
  });

  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 90_000 });
  await page.waitForFunction(
    () => document.querySelector(".cour-stage")?.getAttribute("data-stage-ready") === "true",
    null,
    { timeout: 30_000 },
  );
  // Freeze the pointer-driven settle so it cannot smear a capture.
  await page.mouse.move(0, 0);
  await page.waitForTimeout(400);

  for (const [index, checkpoint] of shots.entries()) {
    const state = await page.evaluate(({ p, ids }) => {
      const stage = document.querySelector(".cour-stage");
      const handle = window.__courStage;
      if (!stage || !handle) return { error: "stage handle missing" };
      const chapter = handle.setProgress(p);
      const rect = stage.getBoundingClientRect();
      const layers = {};
      for (const id of ids) {
        const el = stage.querySelector(`.cour-layer-${id}`);
        if (!el) continue;
        const style = getComputedStyle(el);
        layers[id] = {
          opacity: Number(style.opacity).toFixed(3),
          visibility: style.visibility,
          interactive: style.pointerEvents,
        };
      }
      const specimen = stage.querySelector("[data-specimen]");
      const box = specimen?.getBoundingClientRect();
      return {
        chapter,
        attr: stage.getAttribute("data-stage-progress"),
        rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
        layers,
        specimen: box
          ? {
              x: Math.round(box.x),
              y: Math.round(box.y),
              w: Math.round(box.width),
              h: Math.round(box.height),
              opacity: Number(getComputedStyle(specimen.parentElement).opacity).toFixed(3),
            }
          : null,
        overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    }, { p: checkpoint.p, ids: LAYER_IDS });

    if (state.error) problems.push(`${viewport.id}/${checkpoint.id}: ${state.error}`);

    const seq = String(STAGE_PROGRESS_CHECKPOINTS.indexOf(checkpoint) + 1).padStart(2, "0");
    const file = path.join(OUT, `${seq}-${checkpoint.name}-${viewport.id}.jpg`);
    // JPEG at a fixed quality: the captures exist to be compared, and a lossless
    // set of 36 full-page frames costs an order of magnitude more to store.
    await page.screenshot({ path: file, type: "jpeg", quality: 88, animations: "disabled" });
    report.checkpoints.push({
      id: checkpoint.name,
      frame: checkpoint.frame,
      progress: checkpoint.p,
      formatted: formatProgress(checkpoint.p),
      viewport: viewport.id,
      file,
      ...state,
    });
  }

  if (consoleErrors.length) problems.push(`${viewport.id}: ${consoleErrors.slice(0, 6).join(" | ")}`);
  await context.close();
}

await browser.close();

report.chapters = CHAPTERS.map((c) => ({ id: c.id, n: c.n, label: c.label }));
report.problems = problems;
await writeFile(path.join(OUT, "report.json"), `${JSON.stringify(report, null, 2)}\n`);

const dominant = report.checkpoints.filter((c) => c.viewport === "desktop").map((c) => {
  const entries = Object.entries(c.layers ?? {});
  const top = entries.sort((a, b) => Number(b[1].opacity) - Number(a[1].opacity))[0];
  const name = String(c.id ?? "?").padEnd(13);
  return `${String(c.frame).padEnd(8)} ${name} p=${c.formatted} chapter=${String(c.chapter).padEnd(8)} dominant=${top?.[0]}@${top?.[1].opacity}`;
});
console.log(dominant.join("\n"));
if (problems.length) {
  console.error(`\nPROBLEMS:\n${problems.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`\nok: ${report.checkpoints.length} captures → ${OUT}`);
}
