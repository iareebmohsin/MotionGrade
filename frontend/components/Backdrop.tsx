const SPARKLES: { x: number; y: number; s: number; d: number }[] = [
  { x: 8, y: 18, s: 3, d: 0 },
  { x: 14, y: 62, s: 2, d: 1.2 },
  { x: 22, y: 34, s: 2, d: 2.1 },
  { x: 31, y: 80, s: 3, d: 0.6 },
  { x: 44, y: 12, s: 2, d: 1.8 },
  { x: 56, y: 26, s: 3, d: 0.3 },
  { x: 63, y: 70, s: 2, d: 2.6 },
  { x: 71, y: 44, s: 2, d: 1.5 },
  { x: 80, y: 16, s: 3, d: 0.9 },
  { x: 88, y: 58, s: 2, d: 2.3 },
  { x: 93, y: 32, s: 2, d: 0.4 },
  { x: 50, y: 90, s: 2, d: 1.1 },
];

export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
      {SPARKLES.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            animationDelay: `${p.d}s`,
            boxShadow: "0 0 6px rgba(255,255,255,0.6)",
          }}
        />
      ))}
    </div>
  );
}
