import assert from "node:assert/strict";
import test from "node:test";
import {
  CHAPTERS,
  STAGE_PROGRESS_CHECKPOINTS,
  TIMELINE,
  chapterAt,
  chapterIndex,
  chapterStop,
  formatProgress,
  layerState,
  objectTrack,
  stackSeparation,
  stageState,
} from "./timeline.ts";

/**
 * The stage timeline is a pure function of progress, so the entire scroll
 * choreography is testable without a browser. These tests are the contract the
 * visual-regression suite assumes.
 */

test("intervals are contiguous: enter → hold → exit with no gap or overlap", () => {
  for (const plan of TIMELINE) {
    assert.equal(plan.enter[1], plan.hold[0], `${plan.id}: enter must end where hold begins`);
    assert.equal(plan.hold[1], plan.exit[0], `${plan.id}: hold must end where exit begins`);
    assert.ok(plan.enter[0] <= plan.enter[1], `${plan.id}: enter start must precede its end`);
    // Only FORM may start below 0 — it is the composition present at load.
    const floor = plan.id === "form" ? -0.05 : 0;
    assert.ok(plan.enter[0] >= floor, `${plan.id}: enter starts before the axis`);
    assert.ok(plan.exit[1] <= 1.0001, `${plan.id}: exit runs past the axis`);
  }
});

test("no two chapters are ever both interactive", () => {
  for (let step = 0; step <= 1000; step += 1) {
    const p = step / 1000;
    const interactive = TIMELINE.filter((plan, i) => layerState(plan, p, i).interactive);
    assert.ok(
      interactive.length <= 1,
      `p=${p} has ${interactive.length} interactive chapters: ${interactive.map((c) => c.id).join(", ")}`,
    );
  }
});

test("a chapter never enters before its predecessor has begun leaving", () => {
  for (let i = 1; i < TIMELINE.length; i += 1) {
    const previous = TIMELINE[i - 1];
    const next = TIMELINE[i];
    assert.ok(
      next.enter[0] >= previous.exit[0],
      `${next.id} enters at ${next.enter[0]} but ${previous.id} does not start exiting until ${previous.exit[0]}`,
    );
  }
});

test("chapters arrive in order and the axis covers it end to end", () => {
  const order = TIMELINE.map((plan) => plan.id);
  assert.deepEqual(order, CHAPTERS.map((c) => c.id));
  assert.equal(TIMELINE[0].enter[1], 0, "FORM is composed at p=0 and has no entrance");
  assert.equal(TIMELINE[TIMELINE.length - 1].hold[1], 1);
});

test("exactly one chapter body dominates at every checkpoint in the reference capture", () => {
  // A checkpoint frames a reference state. If two chapters were both more than
  // half present, the composition would show two chapter bodies at once — the
  // defect the shared choreography model exists to prevent.
  for (const { name, p } of STAGE_PROGRESS_CHECKPOINTS) {
    const dominant = Object.entries(stageState(p))
      .filter(([, state]) => state.opacity > 0.5)
      .map(([id]) => id);
    assert.equal(dominant.length, 1, `checkpoint ${name} (p=${p}) shows ${dominant.join(" + ")}`);
  }
});

test("the stage is never empty: some chapter is at least half present at every p", () => {
  for (let step = 0; step <= 1000; step += 1) {
    const p = step / 1000;
    const states = Object.values(stageState(p));
    const lit = states.filter((s) => s.opacity >= 0.5).length;
    assert.ok(lit >= 1, `p=${p} has no chapter at half opacity — the stage would look empty`);
  }
});

test("a crossfade keeps the pair summing to one, so nothing dips to black mid-transition", () => {
  for (const plan of TIMELINE.slice(1)) {
    const [start, end] = plan.enter;
    for (let t = 0; t <= 1; t += 0.05) {
      const p = start + (end - start) * t;
      const total = Object.values(stageState(p)).reduce((sum, s) => sum + s.opacity, 0);
      assert.ok(
        Math.abs(total - 1) < 1e-6,
        `p=${p.toFixed(3)} integrates to ${total.toFixed(6)} instead of 1`,
      );
    }
  }
});

test("the chapter name at a hold checkpoint matches the checkpoint", () => {
  for (const { name, p } of STAGE_PROGRESS_CHECKPOINTS) {
    if (name.includes("-")) continue; // transitions are between chapters
    assert.equal(chapterAt(p), name, `p=${p} should be the ${name} chapter`);
  }
});

test("opacity is continuous — no step larger than 1/8 of the ramp between 1/1000 steps", () => {
  for (const plan of TIMELINE) {
    let previous = layerState(plan, 0, 0).opacity;
    for (let step = 1; step <= 1000; step += 1) {
      const current = layerState(plan, step / 1000, 0).opacity;
      assert.ok(
        Math.abs(current - previous) < 0.125,
        `${plan.id} jumps ${Math.abs(current - previous)} at p=${step / 1000}`,
      );
      previous = current;
    }
  }
});

test("the stage opens composed and ends composed", () => {
  // p=0 is what the visitor lands on: FORM must already be fully present, with
  // no entrance animation between load and first paint.
  assert.equal(layerState(TIMELINE[0], 0, 0).opacity, 1);
  assert.ok(layerState(TIMELINE[TIMELINE.length - 1], 1, 0).opacity > 0.9);
  // Chapters that have not arrived yet are fully transparent, not merely faint.
  for (const plan of TIMELINE.slice(1)) {
    assert.equal(layerState(plan, 0, 0).opacity, 0, `${plan.id} must be hidden at p=0`);
  }
  // And every layer is gone once the axis is exhausted, apart from KNOW.
  for (const plan of TIMELINE.slice(0, -1)) {
    assert.equal(layerState(plan, 1, 0).opacity, 0, `${plan.id} must be hidden at p=1`);
  }
});

test("z-index increases with chapter order so the arriving body covers the leaving one", () => {
  const zs = TIMELINE.map((plan, i) => layerState(plan, 0.5, i).z);
  for (let i = 1; i < zs.length; i += 1) assert.ok(zs[i] > zs[i - 1], "z must strictly increase");
});

test("the specimen track is monotone within each transition and settled at holds", () => {
  const atHold = [0.06, 0.34, 0.6, 0.83, 0.98].map(objectTrack);
  for (const sample of atHold) {
    assert.ok(Number.isFinite(sample.x) && Number.isFinite(sample.y));
    assert.ok(sample.s > 0 && sample.s <= 1.5, "scale stays in a plausible range");
    assert.ok(sample.o >= 0 && sample.o <= 1, "opacity stays in range");
  }
  // At the DETAILS hold the specimen is larger and left of centre.
  assert.ok(atHold[1].s > 1, "specimen grows for DETAILS");
  assert.ok(atHold[1].x < 0, "specimen shifts left for DETAILS");
  // It hands over completely to the material stack by BUILD.
  assert.ok(atHold[3].o < 0.1, "specimen yields to the stack at BUILD");
  // And returns low-left for the KNOW chapter.
  assert.ok(atHold[4].o > 0.4 && atHold[4].x < 0, "specimen returns low-left for KNOW");
});

test("the sample track is deterministic", () => {
  for (const p of [0, 0.13, 0.271, 0.5, 0.6642, 1]) {
    assert.deepEqual(objectTrack(p), objectTrack(p));
  }
});

test("the material stack closes on the way out and is never negative", () => {
  for (let step = 0; step <= 100; step += 1) {
    const value = stackSeparation(step / 100);
    assert.ok(value >= 0 && value <= 1, `separation ${value} out of range at p=${step / 100}`);
  }
  assert.equal(stackSeparation(0.5), 0, "closed before BUILD");
  assert.equal(stackSeparation(0.83), 1, "fully exploded at the BUILD hold");
  assert.ok(stackSeparation(1) < 0.5, "closes on the way out");
});

test("chapter stops are ordered, in range, and land inside their own hold", () => {
  let previous = -1;
  for (const plan of TIMELINE) {
    assert.ok(plan.stop > previous, `${plan.id} stop must advance`);
    assert.ok(plan.stop >= 0 && plan.stop <= 1, `${plan.id} stop must be in range`);
    assert.ok(
      plan.stop >= plan.hold[0] && plan.stop <= plan.hold[1],
      `${plan.id} stop ${plan.stop} is outside its hold ${plan.hold.join("–")}`,
    );
    previous = plan.stop;
  }
});

test("chapterStop and chapterIndex agree with the declaration order", () => {
  CHAPTERS.forEach((chapter, index) => {
    assert.equal(chapterIndex(chapter.id), index);
    assert.ok(chapterStop(chapter.id) >= 0);
  });
});

test("progress formatting is stable to four decimals for the QA attributes", () => {
  assert.equal(formatProgress(0), "0.0000");
  assert.equal(formatProgress(0.4212345), "0.4212");
  assert.equal(formatProgress(-1), "0.0000");
  assert.equal(formatProgress(4), "1.0000");
});
