const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function hashToken(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function decodeFrame(text: string, frame: number, total = 14): string {
  const t = Math.min(1, Math.max(0, frame / total));
  const rng = mulberry32(hashToken(`${text}#${frame}`));
  return text
    .split("")
    .map((ch, i) => {
      if (ch === " " || ch === "." || ch === "/" || ch === "-") return ch;
      if (i / Math.max(1, text.length) < t) return text[i] ?? ch;
      return GLYPHS[Math.floor(rng() * GLYPHS.length)] ?? ch;
    })
    .join("");
}

export { GLYPHS };
