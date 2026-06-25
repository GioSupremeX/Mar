export const Sparkles = ({ className }: { className?: string }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16 2L17.8 12L28 13L17.8 14.2L16 24L14.2 14.2L4 13L14.2 12L16 2Z" fill="currentColor" opacity="0.35"/>
    <path d="M6 5L6.6 8L9.5 8.6L6.6 9.2L6 12L5.4 9.2L2.5 8.6L5.4 8L6 5Z" fill="currentColor" opacity="0.45"/>
    <path d="M26 20L26.5 22.5L29 23L26.5 23.5L26 26L25.5 23.5L23 23L25.5 22.5L26 20Z" fill="currentColor" opacity="0.25"/>
  </svg>
);

export const StarCluster = ({ className }: { className?: string }) => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M18 12L19.2 16L23 17L19.2 18L18 22L16.8 18L13 17L16.8 16L18 12Z" fill="currentColor" opacity="0.35" />
    <path d="M38 18L40 24L46 26L40 28L38 34L36 28L30 26L36 24L38 18Z" fill="currentColor" opacity="0.4" />
    <path d="M26 36L26.7 39L30 40L26.7 41L26 44L25.3 41L22 40L25.3 39L26 36Z" fill="currentColor" opacity="0.25" />
    <circle cx="10" cy="28" r="1.5" fill="currentColor" opacity="0.2"/>
    <circle cx="44" cy="14" r="1" fill="currentColor" opacity="0.3"/>
  </svg>
);

export const SketchMark = ({ className }: { className?: string }) => (
  <svg width="90" height="44" viewBox="0 0 90 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 28C18 16 40 34 62 12C74 6 84 18 78 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" fill="none"/>
    <path d="M12 34C28 20 52 38 72 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.2" fill="none"/>
  </svg>
);

export const ArchDivider = ({ className }: { className?: string }) => (
  <svg width="140" height="24" viewBox="0 0 140 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 18C36 6 104 6 128 18M24 18C48 12 92 12 116 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.2" fill="none"/>
  </svg>
);

export const DragonSketch = ({ className }: { className?: string }) => (
  <svg width="64" height="44" viewBox="0 0 64 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16 22C10 16 16 4 28 10C40 16 50 4 56 16C62 28 50 38 38 32C26 26 22 32 16 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" fill="none"/>
    <path d="M28 10C28 4 34 4 34 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" fill="none"/>
    <path d="M50 10L56 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" fill="none"/>
  </svg>
);

export const CatDoodle = ({ className }: { className?: string }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Body */}
    <ellipse cx="24" cy="32" rx="12" ry="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
    {/* Head */}
    <ellipse cx="24" cy="19" rx="9" ry="8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
    {/* Left ear */}
    <path d="M15 14L13 6L21 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4"/>
    {/* Right ear */}
    <path d="M33 14L35 6L27 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4"/>
    {/* Eyes */}
    <path d="M20 18 Q21 16 22 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5"/>
    <path d="M26 18 Q27 16 28 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5"/>
    {/* Whiskers */}
    <line x1="10" y1="21" x2="17" y2="22" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.35"/>
    <line x1="31" y1="22" x2="38" y2="21" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.35"/>
    {/* Tail */}
    <path d="M36 38 Q44 32 42 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35"/>
  </svg>
);

export const SmallPaw = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <ellipse cx="12" cy="15" rx="4.5" ry="3.5" opacity="0.5"/>
    <ellipse cx="6.5" cy="11" rx="2" ry="2.5" transform="rotate(-20 6.5 11)" opacity="0.5"/>
    <ellipse cx="17.5" cy="11" rx="2" ry="2.5" transform="rotate(20 17.5 11)" opacity="0.5"/>
    <ellipse cx="9.5" cy="7.5" rx="1.8" ry="2.2" transform="rotate(-10 9.5 7.5)" opacity="0.5"/>
    <ellipse cx="14.5" cy="7.5" rx="1.8" ry="2.2" transform="rotate(10 14.5 7.5)" opacity="0.5"/>
  </svg>
);
