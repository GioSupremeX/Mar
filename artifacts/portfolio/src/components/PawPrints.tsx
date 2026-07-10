/* Subtle organic decorative marks along the page edges */
const marks = [
  { top: "8%",   left: "2%",   rotate: -25,  size: 6,  opacity: 0.06 },
  { top: "22%",  right: "3%",  rotate: 35,   size: 8,  opacity: 0.05 },
  { top: "38%",  left: "1.5%", rotate: -40,  size: 5,  opacity: 0.04 },
  { top: "52%",  right: "2%",  rotate: 20,   size: 7,  opacity: 0.06 },
  { top: "68%",  left: "2.5%", rotate: -30,  size: 6,  opacity: 0.05 },
  { top: "82%",  right: "1.5%",rotate: 45,   size: 5,  opacity: 0.04 },
  { top: "92%",  left: "3%",   rotate: -15,  size: 8,  opacity: 0.05 },
];

export default function PawPrints() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {marks.map((m, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: m.top,
            left: "left" in m ? m.left : undefined,
            right: "right" in m ? (m as any).right : undefined,
            transform: `rotate(${m.rotate}deg)`,
            opacity: m.opacity,
            width: m.size,
            height: m.size,
            borderRadius: "50%",
            background: "var(--app-accent)",
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}
