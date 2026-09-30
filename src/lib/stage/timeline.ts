/**
 * COUR homepage stage timeline — the single source of truth for the scroll
 * choreography.
 *
 * ## Why this exists
 *
 * The stage used to gate five absolutely-positioned layers with five
 * independent opacity ramps and a hand-written `if (p < 0.18) …` chapter test.
 * That produced overlapping compositions (TECHNOLOGY copy visible on top of the
 * COLLECTIONS cards) because nothing enforced that layer A had finished exiting
 * before layer B began entering, and it made the "chapter" a discrete jump
 * rather than a point on a continuous curve.
 *
 * This module replaces both with one model:
 *
 *   - `TIMELINE` declares, per layer, its enter / hold / exit intervals on a
 *     single normalized progress axis `p ∈ [0, 1]`.
 *   - `layerState(plan, p)` resolves any layer at any `p` into opacity, offset,
 *     z-index and interactivity — continuously interpolated, so every
 *     in-between frame is defined rather than implied.
 *   - `objectTrack(p)` resolves the hero specimen's transform along the same
 *     axis, so the jacket and the copy can never disagree about where "now" is.
 *   - `chapterAt(p)` is derived from the intervals rather than hard-coded, so
 *     adding or retiming a chapter cannot desynchronize the rail.
 *
 * Everything here is a pure function of `p`. No DOM, no React, no randomness —
 * which is what makes the whole choreography unit-testable.
 *
 * ## Calibration
 *
 * The intervals below were measured against the 47-frame scroll capture in
 * `screenshots/ref/` (see `STAGE_PROGRESS_CHECKPOINTS`). Each `FRAME` comment
 * names the capture frame the boundary was read from. `p` is stage-local: it is
 * computed from the sticky track's own geometry, never from the whole document,
 * so a long footer cannot stretch the timeline.
 */

export const CHAPTERS = [
  { id: "form", n: "01", label: "FORM" },
  { id: "surface", n: "02", label: "SURFACE" },
  { id: "line", n: "03", label: "LINE" },
  { id: "build", n: "04", label: "BUILD" },
  { id: "know", n: "05", label: "KNOW" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

export type Interval = readonly [start: number, end: number];

/**
 * A layer's lifecycle on the progress axis.
 *
 * `enter`, `hold` and `exit` are contiguous: enter ends where hold begins and
 * hold ends where exit begins. Nothing enforces that at the type level, so the
 * `TIMELINE` below is additionally checked by the unit tests — a gap would show
 * up as a frame where the layer is invisible for no reason, an overlap between
 * one layer's enter and another's exit as the overlap defect this model exists
 * to prevent.
 */
export type LayerPlan = {
  readonly id: ChapterId;
  /** 0 → 1 as the layer arrives. */
  readonly enter: Interval;
  /** 1 throughout. */
  readonly hold: Interval;
  /** 1 → 0 as the layer leaves. */
  readonly exit: Interval;
  /** Vertical travel in `stage` percent: +N enters from below, −N leaves upward. */
  readonly drift: number;
  /** The chapter's own reading progress, where its rail marker sits. */
  readonly stop: number;
};

/**
 * The choreography. Boundaries are read off the reference capture:
 *
 *   form    frames 01–03   hero fully composed
 *   →surface frames 04–05  hero copy out, DETAILS heading in, jacket grows left
 *   surface frames 06–09   five spec cards staggered in
 *   →line   frames 10–14   jacket rises; COLLECTIONS heading then the row
 *   line    frames 15–24   four-product rail composed
 *   →build  frames 25–31   rail drops; TECHNOLOGY heading; stack separates
 *   build   frames 32–39   stack separated, labels aligned to layers
 *   →know   frames 40–44   stack closes; jacket returns low-left; FAQ in
 *   know    frames 45–47   NEED TO KNOW composed
 */
export const TIMELINE: readonly LayerPlan[] = [
  {
    id: "form",
    // The stage opens already composed: FORM has no entrance, it is the state
    // the visitor lands in. A negative start is how that is expressed on an
    // axis that itself starts at 0.
    enter: [-0.02, 0],
    hold: [0, 0.15],
    exit: [0.15, 0.23],
    drift: -10,
    stop: 0.08,
  },
  {
    id: "surface",
    // Each transition is a symmetric crossfade: the arriving layer's enter and
    // the leaving layer's exit share the same interval, and because both use
    // the same easing the pair sums to exactly 1 at every frame. There is no
    // instant where the stage is empty, and no instant where two chapter
    // bodies are both more than half present.
    enter: [0.15, 0.23],
    hold: [0.23, 0.43],
    exit: [0.43, 0.51],
    drift: 12,
    stop: 0.33,
  },
  {
    id: "line",
    enter: [0.43, 0.51],
    hold: [0.51, 0.68],
    exit: [0.68, 0.75],
    drift: 16,
    stop: 0.595,
  },
  {
    id: "build",
    enter: [0.68, 0.75],
    hold: [0.75, 0.89],
    exit: [0.89, 0.955],
    drift: 10,
    stop: 0.82,
  },
  {
    id: "know",
    enter: [0.89, 0.955],
    hold: [0.955, 1],
    exit: [1, 1.0001],
    drift: 14,
    stop: 0.978,
  },
] as const;

/**
 * Progress checkpoints used by the visual-regression suite. Each is the midpoint
 * of a `hold` (a composed reference frame) or a measured midpoint of a
 * transition (an in-between frame that must also be correct).
 */
export const STAGE_PROGRESS_CHECKPOINTS = [
  { name: "form", p: 0.08, frame: "sec_002" },
  { name: "form-exit", p: 0.173, frame: "sec_004" },
  { name: "surface-enter", p: 0.203, frame: "sec_005" },
  { name: "surface", p: 0.33, frame: "sec_008" },
  { name: "surface-exit", p: 0.45, frame: "sec_012" },
  { name: "line-enter", p: 0.48, frame: "sec_014" },
  { name: "line", p: 0.595, frame: "sec_018" },
  { name: "line-exit", p: 0.698, frame: "sec_026" },
  { name: "build-enter", p: 0.728, frame: "sec_028" },
  { name: "build", p: 0.82, frame: "sec_034" },
  { name: "know-enter", p: 0.905, frame: "sec_040" },
  { name: "know", p: 0.978, frame: "sec_046" },
] as const;

/** Where the hero specimen sits on the axis. */
export type ObjectSample = {
  /** Horizontal offset, in stage percent. */
  x: number;
  /** Vertical offset, in stage percent. */
  y: number;
  /** Uniform scale. */
  s: number;
  /** Opacity. */
  o: number;
  /** Depth offset in px, for the perspective tilt to read against. */
  z: number;
};

const OBJECT_KEYS: ReadonlyArray<readonly [number, ObjectSample]> = [
  [0, { x: 0, y: 0, s: 1, o: 1, z: 0 }],
  [0.15, { x: 0, y: 0, s: 1, o: 1, z: 0 }],
  // form → surface: the specimen grows and settles left of centre so the five
  // spec cards have the right-hand column to themselves.
  [0.23, { x: -7, y: 1.5, s: 1.16, o: 1, z: 26 }],
  [0.43, { x: -8, y: 2, s: 1.18, o: 1, z: 30 }],
  // surface → line: it rises out of the way as the product rail claims the floor.
  [0.51, { x: -2, y: -19, s: 0.62, o: 0.5, z: -40 }],
  [0.68, { x: 0, y: -21, s: 0.56, o: 0.34, z: -60 }],
  // line → build: fully handed over to the material stack.
  [0.75, { x: 0, y: -20, s: 0.5, o: 0.06, z: -80 }],
  [0.89, { x: 0, y: -18, s: 0.5, o: 0.04, z: -80 }],
  // build → know: it returns as the transitional object beside the FAQ column.
  [0.955, { x: -20, y: 24, s: 0.78, o: 0.6, z: 20 }],
  [1, { x: -21, y: 25, s: 0.8, o: 0.62, z: 24 }],
];

/**
 * How far the material stack is separated, 0 (closed) → 1 (fully exploded).
 * The reference shows it assembling as TECHNOLOGY arrives and closing again on
 * the way out, so it is a window rather than a one-way ramp.
 */
const SEPARATION_KEYS: ReadonlyArray<readonly [number, number]> = [
  [0.66, 0],
  [0.75, 1],
  [0.89, 1],
  [0.955, 0.3],
  [1, 0.15],
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** Ease for enter/exit ramps: fast in, soft landing. */
export function easeOut(t: number): number {
  const c = clamp01(t);
  return 1 - (1 - c) * (1 - c);
}

/** Piecewise-linear sampling over a sorted key list. */
export function sampleAt<T>(keys: ReadonlyArray<readonly [number, T]>, p: number, mix: (a: T, b: T, t: number) => T): T {
  const first = keys[0];
  const last = keys[keys.length - 1];
  if (!first || !last) throw new Error("sampleAt requires at least one key");
  if (p <= first[0]) return first[1];
  for (let i = 1; i < keys.length; i += 1) {
    const [p1, b] = keys[i];
    const [p0, a] = keys[i - 1];
    if (p <= p1) {
      const span = p1 - p0;
      return mix(a, b, span <= 0 ? 1 : clamp01((p - p0) / span));
    }
  }
  return last[1];
}

function mixObject(a: ObjectSample, b: ObjectSample, t: number): ObjectSample {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    s: lerp(a.s, b.s, t),
    o: lerp(a.o, b.o, t),
    z: lerp(a.z, b.z, t),
  };
}

/** The hero specimen's transform at `p`. */
export function objectTrack(p: number): ObjectSample {
  return sampleAt(OBJECT_KEYS, p, mixObject);
}

/** Material-stack separation at `p`, 0 → 1. */
export function stackSeparation(p: number): number {
  return sampleAt(SEPARATION_KEYS, p, (a, b, t) => lerp(a, b, t));
}

/** How far the top technology label has floated away from its plate, in `--sep` units. */
export function labelOffset(p: number): number {
  return stackSeparation(p);
}

export type LayerState = {
  /** 0 → 1, fully interpolated. */
  readonly opacity: number;
  /** Vertical offset as a percentage of the stage, from the exit drift. */
  readonly y: number;
  /** Discrete stacking, ordered by the calendar of the timeline. */
  readonly z: number;
  /**
   * True only while the layer is in its hold. This is what gates
   * `pointer-events` and `inert` — a layer that is 30% faded in must not accept
   * a click on a control the visitor cannot properly see, and a layer that has
   * fully exited must not be reachable by keyboard.
   */
  readonly interactive: boolean;
  /** True whenever any pixel of the layer is visible. */
  readonly visible: boolean;
};

/**
 * Resolve one layer at `p`.
 *
 * `z` is assigned from the layer's position in `TIMELINE`: each chapter stacks
 * above the one that came before it, so the arriving chapter always covers the
 * departing one and no two compositions can interleave in the wrong order.
 */
export function layerState(plan: LayerPlan, p: number, index: number): LayerState {
  const [enterStart, enterEnd] = plan.enter;
  const [holdStart, holdEnd] = plan.hold;
  const [exitStart, exitEnd] = plan.exit;

  let opacity: number;
  if (p <= enterStart) opacity = 0;
  else if (p < enterEnd) opacity = easeOut((p - enterStart) / Math.max(1e-4, enterEnd - enterStart));
  else if (p < holdStart) opacity = 1;
  else if (p <= holdEnd) opacity = 1;
  else if (p < exitEnd) opacity = 1 - easeOut((p - exitStart) / Math.max(1e-4, exitEnd - exitStart));
  else opacity = 0;

  // Offset follows the visible ramp so a layer that is fading also settles.
  const travelled = 1 - opacity;
  const y = travelled * plan.drift;

  return {
    opacity: clamp01(opacity),
    y,
    z: 12 + index * 2,
    interactive: p >= holdStart && p <= holdEnd,
    visible: opacity > 0.004,
  };
}

/** Every layer resolved at once, in timeline order. */
export function stageState(p: number): Record<ChapterId, LayerState> {
  const out = {} as Record<ChapterId, LayerState>;
  TIMELINE.forEach((plan, index) => {
    out[plan.id] = layerState(plan, p, index);
  });
  return out;
}

/**
 * The active chapter at `p`.
 *
 * A chapter is active from its own `enter` midpoint until the next chapter's,
 * so the rail advances when the visitor is genuinely in the arriving
 * composition rather than at a hard-coded cutoff.
 */
export function chapterAt(p: number): ChapterId {
  let current: ChapterId = TIMELINE[0].id;
  for (const plan of TIMELINE) {
    const midpoint = (plan.enter[0] + plan.enter[1]) / 2;
    if (p >= midpoint) current = plan.id;
  }
  return current;
}

/** Progress a rail button scrolls to for a chapter. */
export function chapterStop(id: ChapterId): number {
  const plan = TIMELINE.find((entry) => entry.id === id);
  return plan ? plan.stop : 0;
}

/** Index of a chapter in `CHAPTERS`, for the rail's active-marker styling. */
export function chapterIndex(id: ChapterId): number {
  return CHAPTERS.findIndex((c) => c.id === id);
}

/** Format the QA attribute exactly as the visual-regression harness reads it. */
export function formatProgress(p: number): string {
  return clamp01(p).toFixed(4);
}
