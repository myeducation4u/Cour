import { useEffect, type RefObject } from "react";

type Sample = { x: number; y: number; s: number; o: number };

const JACKET: Array<[number, Sample]> = [
  [0, { x: 0, y: 0, s: 1, o: 1 }],
  [0.1, { x: 0, y: 0, s: 1, o: 1 }],
  [0.2, { x: -11, y: 3, s: 1.16, o: 1 }],
  [0.34, { x: -11, y: 3, s: 1.16, o: 1 }],
  [0.44, { x: 0, y: -20, s: 0.4, o: 0.38 }],
  [0.56, { x: 0, y: -22, s: 0.36, o: 0.2 }],
  [0.66, { x: 4, y: -4, s: 0.72, o: 0.06 }],
  [0.8, { x: -16, y: 16, s: 0.58, o: 0.38 }],
  [1, { x: -16, y: 18, s: 0.58, o: 0.42 }],
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function sample(keys: Array<[number, Sample]>, p: number): Sample {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [p1, b] = keys[i];
    const [p0, a] = keys[i - 1];
    if (p <= p1) {
      const t = (p - p0) / Math.max(0.0001, p1 - p0);
      return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        s: lerp(a.s, b.s, t),
        o: lerp(a.o, b.o, t),
      };
    }
  }
  return keys[keys.length - 1][1];
}

function gate(p: number, a: number, b: number, c: number, d: number) {
  if (p <= a || p >= d) return 0;
  if (p < b) return (p - a) / Math.max(0.0001, b - a);
  if (p > c) return 1 - (p - c) / Math.max(0.0001, d - c);
  return 1;
}

function chapterOf(p: number) {
  if (p < 0.16) return "form";
  if (p < 0.38) return "surface";
  if (p < 0.58) return "line";
  if (p < 0.8) return "build";
  return "know";
}

function pinOf(stage: HTMLElement): HTMLElement {
  return stage.closest(".cour-pin") ?? stage;
}

export function progressFromPin(pin: HTMLElement, scrollY = window.scrollY, viewH = window.innerHeight): number {
  const pinTop = pin.getBoundingClientRect().top + scrollY;
  const total = pin.offsetHeight - viewH;
  if (total <= 0) return 0;
  return Math.min(1, Math.max(0, (scrollY - pinTop) / total));
}

export function scrollPinTo(pin: HTMLElement, at: number, smooth: boolean) {
  const pinTop = pin.getBoundingClientRect().top + window.scrollY;
  const total = Math.max(0, pin.offsetHeight - window.innerHeight);
  window.scrollTo({
    top: pinTop + total * Math.min(1, Math.max(0, at)),
    behavior: smooth ? "smooth" : "auto",
  });
}

function vis(value: number): string {
  return value > 0.04 ? "visible" : "hidden";
}

export function useStageProgress(
  stageRef: RefObject<HTMLElement | null>,
  onChapter: (id: string) => void,
) {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const pin = pinOf(stage);
    let raf = 0;
    let last = "";
    const chapterCb = onChapter;

    const apply = () => {
      raf = 0;
      const p = progressFromPin(pin);
      const j = sample(JACKET, p);
      const form = gate(p, -0.02, 0, 0.12, 0.18);
      const surf = gate(p, 0.14, 0.2, 0.34, 0.4);
      const line = gate(p, 0.36, 0.42, 0.56, 0.62);
      const build = gate(p, 0.58, 0.64, 0.76, 0.82);
      const know = gate(p, 0.78, 0.84, 1.02, 1.08);
      stage.style.setProperty("--jx", `${j.x}%`);
      stage.style.setProperty("--jy", `${j.y}%`);
      stage.style.setProperty("--js", j.s.toFixed(3));
      stage.style.setProperty("--jo", j.o.toFixed(3));
      stage.style.setProperty("--form-o", form.toFixed(3));
      stage.style.setProperty("--surf-o", surf.toFixed(3));
      stage.style.setProperty("--line-o", line.toFixed(3));
      stage.style.setProperty("--build-o", build.toFixed(3));
      stage.style.setProperty("--know-o", know.toFixed(3));
      stage.style.setProperty("--form-v", vis(form));
      stage.style.setProperty("--surf-v", vis(surf));
      stage.style.setProperty("--line-v", vis(line));
      stage.style.setProperty("--build-v", vis(build));
      stage.style.setProperty("--know-v", vis(know));
      stage.style.setProperty("--rail", p.toFixed(4));
      const ch = chapterOf(p);
      if (ch !== last) {
        last = ch;
        stage.dataset.act = ch;
        chapterCb(ch);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    apply();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [stageRef, onChapter]);
}

export function useStagePointer(stageRef: RefObject<HTMLElement | null>, tiltRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    if (!stage || !tilt) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduced) return;

    const hot = stage.querySelector<HTMLElement>(".cour-grid-hot");
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;

    const tick = () => {
      mx += (tx - mx) * 0.12;
      my += (ty - my) * 0.12;
      tilt.style.transform = `rotateY(${(mx * 5).toFixed(2)}deg) rotateX(${(-my * 2.5).toFixed(2)}deg)`;
      if (hot) {
        const r = stage.getBoundingClientRect();
        hot.style.transform = `translate3d(${((mx * 0.5 + 0.5) * r.width).toFixed(1)}px, ${((my * 0.5 + 0.5) * r.height).toFixed(1)}px, 0)`;
      }
      if (Math.abs(tx - mx) > 0.002 || Math.abs(ty - my) > 0.002) raf = requestAnimationFrame(tick);
      else raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      if (!r.width || !r.height) return;
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const reset = () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", reset, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", reset);
    };
  }, [stageRef, tiltRef]);
}
