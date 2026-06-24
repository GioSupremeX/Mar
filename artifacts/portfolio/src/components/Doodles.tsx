export const Sparkles = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" fill="currentColor" opacity="0.3"/>
    <path d="M5 4L5.5 6.5L8 7L5.5 7.5L5 10L4.5 7.5L2 7L4.5 6.5L5 4Z" fill="currentColor" opacity="0.4"/>
    <path d="M19 16L19.5 18.5L22 19L19.5 19.5L19 22L18.5 19.5L16 19L18.5 18.5L19 16Z" fill="currentColor" opacity="0.2"/>
  </svg>
);

export const StarCluster = ({ className }: { className?: string }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M15 10L16 13L19 14L16 15L15 18L14 15L11 14L14 13L15 10Z" fill="currentColor" opacity="0.3" />
    <path d="M32 15L33.5 19.5L38 21L33.5 22.5L32 27L30.5 22.5L26 21L30.5 19.5L32 15Z" fill="currentColor" opacity="0.4" />
    <path d="M22 30L22.5 32.5L25 33L22.5 33.5L22 36L21.5 33.5L19 33L21.5 32.5L22 30Z" fill="currentColor" opacity="0.2" />
  </svg>
);

export const SketchMark = ({ className }: { className?: string }) => (
  <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M5 25C15 15 35 30 55 10C65 5 75 15 70 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" fill="none"/>
    <path d="M10 30C25 18 45 35 65 15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.2" fill="none"/>
  </svg>
);

export const ArchDivider = ({ className }: { className?: string }) => (
  <svg width="120" height="20" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 15C30 5 90 5 110 15M20 15C40 10 80 10 100 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.2" fill="none"/>
  </svg>
);

export const DragonSketch = ({ className }: { className?: string }) => (
  <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M15 20C10 15 15 5 25 10C35 15 45 5 50 15C55 25 45 35 35 30C25 25 20 30 15 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" fill="none"/>
    <path d="M25 10C25 5 30 5 30 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" fill="none"/>
    <path d="M45 10L50 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" fill="none"/>
  </svg>
);
