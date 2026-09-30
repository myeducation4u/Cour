export function Hud() {
  return (
    <div className="cour-hud" aria-hidden="true">
      <span className="cour-hud-mark top-2 left-2 border-t border-l" />
      <span className="cour-hud-mark top-2 right-2 border-t border-r" />
      <span className="cour-hud-mark bottom-2 left-2 border-b border-l" />
      <span className="cour-hud-mark bottom-2 right-2 border-b border-r" />
    </div>
  );
}

export function ScrollRail({ progress }: { progress: number }) {
  return (
    <div className="cour-rail" aria-hidden="true">
      <span className="cour-rail-thumb" style={{ transform: `translateY(${progress * 220}%)` }} />
    </div>
  );
}
