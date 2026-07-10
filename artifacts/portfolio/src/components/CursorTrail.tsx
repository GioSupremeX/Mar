import { useEffect, useRef } from "react";

const COLORS = ["#C4A8FF", "#F4B8D0", "#E8D4A8", "#A8D4F0"];
const SHAPES = ["\u2726", "\u22c6", "\u00b7", "\u25cf"];

let nextId = 0;

export default function CursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      // Only spawn when moving fast enough, fewer particles overall
      if (now - lastTime < 80 || dist < 30 || Math.random() > 0.25) return;
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;

      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const size = 4 + Math.random() * 6;
      const rotation = Math.random() * 360;

      const el = document.createElement("div");
      el.className = "cursor-particle";
      el.textContent = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      el.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        color: ${color};
        font-size: ${size}px;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%) rotate(${rotation}deg);
        animation: particle-fade 1s ease-out forwards;
        user-select: none;
        line-height: 1;
      `;
      container.appendChild(el);

      el.addEventListener("animationend", () => el.remove());
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <style>{`
        @keyframes particle-fade {
          0%   { opacity: 0.9; transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) scale(1); }
          50%  { opacity: 0.5; transform: translate(-50%, calc(-50% - 10px)) rotate(calc(var(--rot, 0deg) + 20deg)) scale(0.7); }
          100% { opacity: 0; transform: translate(-50%, calc(-50% - 20px)) rotate(calc(var(--rot, 0deg) + 40deg)) scale(0.2); }
        }
      `}</style>
      <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[9999]" />
    </>
  );
}
