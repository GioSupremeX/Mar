import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  id: number;
  color: string;
  size: number;
  rotation: number;
}

const COLORS = ["#C4A8FF", "#F4B8D0", "#E8D4A8", "#A8D4F0", "#FFB8D0"];
const SHAPES = ["✦", "✧", "⋆", "·", "★"];

let nextId = 0;

export default function CursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.4) return;

      const particle: Particle = {
        x: e.clientX,
        y: e.clientY,
        id: nextId++,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.random() * 10,
        rotation: Math.random() * 360,
      };

      particlesRef.current.push(particle);

      const el = document.createElement("div");
      el.className = "cursor-particle";
      el.textContent = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      el.style.cssText = `
        position: fixed;
        left: ${particle.x}px;
        top: ${particle.y}px;
        color: ${particle.color};
        font-size: ${particle.size}px;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%) rotate(${particle.rotation}deg);
        animation: particle-fade 0.8s ease-out forwards;
        user-select: none;
        line-height: 1;
      `;
      container.appendChild(el);

      el.addEventListener("animationend", () => {
        el.remove();
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <style>{`
        @keyframes particle-fade {
          0%   { opacity: 1; transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) scale(1); }
          50%  { opacity: 0.8; transform: translate(-50%, calc(-50% - 15px)) rotate(calc(var(--rot, 0deg) + 30deg)) scale(0.8); }
          100% { opacity: 0; transform: translate(-50%, calc(-50% - 30px)) rotate(calc(var(--rot, 0deg) + 60deg)) scale(0.3); }
        }
      `}</style>
      <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[9999]" />
    </>
  );
}
