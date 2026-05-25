export function NormaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <defs>
        <linearGradient id="norma-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="norma-g2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="norma-g3" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <linearGradient id="norma-g4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      {/* Top-left petal */}
      <path d="M16 16C16 16 6 14 4 6c0 0 8-2 12 10z" fill="url(#norma-g1)" />
      {/* Top-right petal */}
      <path d="M16 16C16 16 18 6 28 4c0 0 2 8-12 12z" fill="url(#norma-g2)" />
      {/* Bottom-right petal */}
      <path d="M16 16C16 16 26 18 28 26c0 0-8 2-12-10z" fill="url(#norma-g3)" />
      {/* Bottom-left petal */}
      <path d="M16 16C16 16 14 26 4 28c0 0-2-8 12-12z" fill="url(#norma-g4)" />
    </svg>
  );
}
