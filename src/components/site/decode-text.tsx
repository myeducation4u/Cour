import { useEffect, useState } from "react";
import { decodeFrame } from "@/lib/decode-seed";

export function DecodeText({
  text,
  active,
  className,
  as: Tag = "span",
}: {
  text: string;
  active: boolean;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
}) {
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!active) {
      setOut(text);
      return;
    }
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setOut(text);
      return;
    }
    let frame = 0;
    const total = 14;
    const id = window.setInterval(() => {
      frame += 1;
      setOut(decodeFrame(text, frame, total));
      if (frame >= total) window.clearInterval(id);
    }, 32);
    return () => window.clearInterval(id);
  }, [active, text]);

  return <Tag className={className}>{out}</Tag>;
}
