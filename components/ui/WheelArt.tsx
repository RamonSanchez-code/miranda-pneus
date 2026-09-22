/** Ilustração vetorial de roda — usada no fallback do hero e nos cards enquanto não há fotos reais. */
export function WheelArt({ className = "", spokes = 5 }: { className?: string; spokes?: number }) {
  return (
    <svg className={className} viewBox="-100 -100 200 200" aria-hidden>
      <defs>
        <radialGradient id="wa-tire" r="0.5"><stop offset="0.82" stopColor="#0b0b0c" /><stop offset="1" stopColor="#1a1b1e" /></radialGradient>
        <linearGradient id="wa-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f2f4f8" /><stop offset="0.5" stopColor="#8b919c" /><stop offset="1" stopColor="#d5d9e1" /></linearGradient>
      </defs>
      <circle r="98" fill="url(#wa-tire)" />
      <circle r="98" fill="none" stroke="#2a2c31" strokeWidth="1" />
      <circle r="70" fill="#0e0f11" stroke="url(#wa-metal)" strokeWidth="5" />
      {Array.from({ length: spokes }, (_, i) => (
        <g key={i} transform={`rotate(${(i * 360) / spokes})`}>
          <path d="M-7 -14 L-12 -66 L-2 -66 L2 -14 Z" fill="url(#wa-metal)" transform="rotate(-4)" />
          <path d="M7 -14 L12 -66 L2 -66 L-2 -14 Z" fill="url(#wa-metal)" transform="rotate(4)" />
        </g>
      ))}
      <circle r="16" fill="#15161a" stroke="url(#wa-metal)" strokeWidth="2" />
      {Array.from({ length: 5 }, (_, i) => (
        <circle key={i} r="1.8" cx={Math.cos((i / 5) * Math.PI * 2) * 9} cy={Math.sin((i / 5) * Math.PI * 2) * 9} fill="#c9ccd2" />
      ))}
    </svg>
  );
}
