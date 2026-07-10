import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(179,157,219,0.15)",
}: {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const background = useMotionTemplate`
    radial-gradient(
      320px circle at ${mouseX}px ${mouseY}px,
      ${spotlightColor},
      transparent 80%
    )
  `;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 rounded-[inherit]"
        style={{ background }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function GlowCard({
  children,
  className = "",
  glowColor = "rgba(179,157,219,0.18)",
}: {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}) {
  return (
    <SpotlightCard
      className={className}
      spotlightColor={glowColor}
    >
      {children}
    </SpotlightCard>
  );
}
