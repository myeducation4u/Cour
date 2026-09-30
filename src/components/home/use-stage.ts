import { useCallback, useEffect, useMemo, useState, type RefObject } from "react";
import {
  CHAPTERS,
  TIMELINE,
  chapterAt,
  formatProgress,
  layerState,
  objectTrack,
  stackSeparation,
  type ChapterId,
} from "@/lib/stage/timeline";

/**
 * Stage runtime: turns scroll position into the CSS custom properties the
 * homepage stage renders from, and exposes a deterministic surface for QA.
 *
 * Design notes:
 *
 *  - **Stage-local progress.** `progressFromPin` measures the sticky track's own
 *    geometry (`pin.offsetHeight - viewportHeight`), not the document. The
 *    timeline therefore cannot be stretched by the footer, by an announcement
 *    bar, or by a route that renders more content below the stage.
 *
 *  - **No React state on scroll.** Every animated value is written as a CSS
 *    custom property inside a single `requestAnimationFrame` callback. React
 *    only re-renders when the *chapter* changes, which is a handful of times
 *    across the whole scroll.
 *
 *  - **Deterministic QA surface.** The stage always publishes
 *    `data-stage-progress` (4dp), `data-stage-chapter` and `data-stage-ready`,
 *    and `window.__courStage` lets a harness jump to an exact progress value
 *    without simulating scroll velocity. This is what the visual-regression
 *    suite drives.
 */

const PIN_SELECTOR = ".cour-pin";

function pinOf(stage: HTMLElement): HTMLElement {
  const pin = stage.closest(PIN_SELECTOR);
  return pin instanceof HTMLElement ? pin : stage;
}

/**
 * Progress through the stage, 0 → 1, derived only from the sticky track.
 *
 * Returns 0 when the pin has no scrollable range (short viewport, print, a
 * page rendered without the track) rather than dividing by zero.
 */
export function progressFromPin(
  pin: HTMLElement,
  scrollY = typeof window === "undefined" ? 0 : window.scrollY,
  viewH = typeof window === "undefined" ? 0 : window.innerHeight,
): number {
  const pinTop = pin.getBoundingClientRect().top + scrollY;
  const total = pin.offsetHeight - viewH;
  if (total <= 0) return 0;
  const raw = (scrollY - pinTop) / total;
  return raw < 0 ? 0 : raw > 1 ? 1 : raw;
}

/** Scroll so the stage shows `at` (0 → 1). Used by the chapter rail. */
export function scrollPinTo(pin: HTMLElement, at: number, smooth: boolean): void {
  const pinTop = pin.getBoundingClientRect().top + window.scrollY;
  const total = Math.max(0, pin.offsetHeight - window.innerHeight);
  const clamped = Math.min(1, Math.max(0, at));
  window.scrollTo({ top: pinTop + total * clamped, behavior: smooth ? "smooth" : "auto" });
}

/** Everything the stage's CSS reads, as custom properties. */
export type StageVars = Record<string, string>;

/**
 * Resolve the full variable set for a progress value.
 *
 * Kept separate from the hook so a test can assert the exact values a
 * checkpoint produces without a DOM.
 */
export function stageVars(p: number): StageVars {
  const object = objectTrack(p);
  const vars: StageVars = {
    "--course": formatProgress(p),
    "--jx": `${object.x.toFixed(3)}%`,
    "--jy": `${object.y.toFixed(3)}%`,
    "--js": object.s.toFixed(4),
    "--jo": object.o.toFixed(4),
    "--jz": `${object.z.toFixed(1)}px`,
    "--sep": stackSeparation(p).toFixed(4),
    "--rail": p.toFixed(4),
  };
  CHAPTERS.forEach((chapter, index) => {
    const state = layerState(TIMELINE[index], p, index);
    vars[`--${chapter.id}-o`] = state.opacity.toFixed(4);
    vars[`--${chapter.id}-y`] = `${state.y.toFixed(3)}%`;
    vars[`--${chapter.id}-z`] = String(state.z);
    vars[`--${chapter.id}-v`] = state.visible ? "visible" : "hidden";
    vars[`--${chapter.id}-p`] = state.interactive ? "auto" : "none";
  });
  return vars;
}

export type StageHandle = {
  /** Jump to an exact progress value. Returns the chapter that becomes active. */
  setProgress: (p: number) => ChapterId;
  /** Current progress, as last applied. */
  progress: () => number;
};

declare global {
  interface Window {
    /**
     * Test-only handle. Present in every environment because the visual
     * regression suite drives the real production build, but it is inert until
     * called and holds no application state.
     */
    __courStage?: StageHandle;
  }
}

/** True when the visitor has asked for less motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useStageProgress(
  stageRef: RefObject<HTMLElement | null>,
  onChapter: (id: ChapterId) => void,
  enabled = true,
): void {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !enabled) return;
    const pin = pinOf(stage);

    let raf = 0;
    let lastChapter: ChapterId | null = null;
    /** When set by the QA handle, scroll is ignored and this value is used. */
    let locked: number | null = null;
    let progress = 0;

    const apply = () => {
      raf = 0;
      progress = locked ?? progressFromPin(pin);
      const vars = stageVars(progress);
      for (const [key, value] of Object.entries(vars)) {
        stage.style.setProperty(key, value);
      }
      stage.dataset.stageProgress = formatProgress(progress);
      const chapter = chapterAt(progress);
      if (chapter !== lastChapter) {
        lastChapter = chapter;
        stage.dataset.act = chapter;
        stage.dataset.stageChapter = chapter;
        onChapter(chapter);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const handle: StageHandle = {
      setProgress: (p) => {
        locked = Math.min(1, Math.max(0, p));
        // Apply synchronously: a harness that jumps and immediately screenshots
        // must not race the next animation frame.
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        progress = locked;
        const vars = stageVars(progress);
        for (const [key, value] of Object.entries(vars)) {
          stage.style.setProperty(key, value);
        }
        stage.dataset.stageProgress = formatProgress(progress);
        const chapter = chapterAt(progress);
        lastChapter = chapter;
        stage.dataset.act = chapter;
        stage.dataset.stageChapter = chapter;
        onChapter(chapter);
        return chapter;
      },
      progress: () => progress,
    };
    const previous = window.__courStage;
    window.__courStage = handle;

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    apply();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
      if (window.__courStage === handle) window.__courStage = previous;
    };
  }, [stageRef, onChapter, enabled]);
}

/**
 * Pointer response for the hero specimen.
 *
 * Calibrated hard down from the generic parallax default: the reference
 * specimen barely rotates, and what it does is a slow settle rather than a
 * follow. Text and grid do NOT move with it — nothing that carries meaning is
 * allowed to shift under the cursor.
 *
 * Disabled entirely for coarse pointers (there is no hover on a touch screen)
 * and for reduced-motion visitors.
 */
export function useStagePointer(
  stageRef: RefObject<HTMLElement | null>,
  tiltRef: RefObject<HTMLElement | null>,
  enabled = true,
): void {
  useEffect(() => {
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    if (!stage || !tilt || !enabled) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia?.("(pointer: coarse)").matches) return;

    const MAX_Y = 3.2; // degrees
    const MAX_X = 1.6;
    const SETTLE = 0.075; // per-frame approach; lower is slower/softer
    const EPSILON = 0.0015;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const tick = () => {
      raf = 0;
      currentX += (targetX - currentX) * SETTLE;
      currentY += (targetY - currentY) * SETTLE;
      tilt.style.transform = `rotateY(${(currentX * MAX_Y).toFixed(3)}deg) rotateX(${(-currentY * MAX_X).toFixed(3)}deg)`;
      if (Math.abs(targetX - currentX) > EPSILON || Math.abs(targetY - currentY) > EPSILON) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      // Clamped to the stage so a pointer at the very edge cannot produce a
      // larger rotation than one a few pixels inside it.
      targetX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      targetY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
      schedule();
    };
    const reset = () => {
      targetX = 0;
      targetY = 0;
      schedule();
    };

    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", reset, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", reset);
    };
  }, [stageRef, tiltRef, enabled]);
}

export type Readiness = {
  /** True once every critical asset for the first visible frame is decoded. */
  ready: boolean;
  /** True only after `ready` has been observed for at least the fade-in delay. */
  show: boolean;
};

/**
 * Critical-asset readiness for the first visible stage.
 *
 * The loader used to hide on a fixed timeout racing a single `onLoad`, which is
 * why captures could show a half-painted stage. This waits for the things that
 * are actually visible at `p = 0` — the hero specimen, the display face, and
 * the document's own fonts — and then keeps a hard fallback so one broken asset
 * can never trap the visitor behind the loader.
 *
 * `minVisibleMs`/`revealDelayMs` exist to avoid a flash: a loader that appears
 * for 40ms reads as a glitch, so it is only shown if readiness is still pending
 * after `revealDelayMs`.
 */
export function useStageReadiness(
  assets: readonly string[],
  { revealDelayMs = 120, minVisibleMs = 260, timeoutMs = 6000 } = {},
): Readiness {
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);
  const assetKey = useMemo(() => assets.join("|"), [assets]);

  useEffect(() => {
    let cancelled = false;
    const startedAt = performance.now();
    const finish = () => {
      if (cancelled) return;
      setReady(true);
    };

    const fallback = window.setTimeout(finish, timeoutMs);

    const waitForImages = Promise.all(
      assetKey
        .split("|")
        .filter(Boolean)
        .map(
          (src) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => resolve();
              // A missing asset must not hold the stage hostage; the fallback
              // timeout is the other half of that guarantee.
              img.onerror = () => resolve();
              img.src = src;
              if (img.complete) resolve();
            }),
        ),
    );

    const waitForFonts =
      typeof document !== "undefined" && "fonts" in document
        ? document.fonts.ready.then(() => undefined).catch(() => undefined)
        : Promise.resolve();

    void Promise.all([waitForImages, waitForFonts]).then(() => {
      if (cancelled) return;
      window.clearTimeout(fallback);
      // Hold the composition for a beat so the loader is never a flash.
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, minVisibleMs - elapsed);
      if (remaining > 0) window.setTimeout(finish, remaining);
      else finish();
    });

    const revealTimer = window.setTimeout(() => {
      if (!cancelled && !ready) setShow(true);
    }, revealDelayMs);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      window.clearTimeout(revealTimer);
    };
    // `ready` is intentionally absent: this effect arms once per asset set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetKey, revealDelayMs, minVisibleMs, timeoutMs]);

  return { ready, show };
}

/** Stable callback identity for the chapter setter. */
export function useChapterReporter(onChapter: (id: ChapterId) => void) {
  return useCallback(onChapter, [onChapter]);
}
