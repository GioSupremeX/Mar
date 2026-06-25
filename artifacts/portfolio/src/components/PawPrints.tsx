const PawPrint = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="15" rx="4.5" ry="3.5"/>
    <ellipse cx="6.5" cy="11" rx="2" ry="2.5" transform="rotate(-20 6.5 11)"/>
    <ellipse cx="17.5" cy="11" rx="2" ry="2.5" transform="rotate(20 17.5 11)"/>
    <ellipse cx="9.5" cy="7.5" rx="1.8" ry="2.2" transform="rotate(-10 9.5 7.5)"/>
    <ellipse cx="14.5" cy="7.5" rx="1.8" ry="2.2" transform="rotate(10 14.5 7.5)"/>
  </svg>
);

const prints = [
  { top: "12%",  left: "3%",   rotate: -30,  size: 14, opacity: 0.12 },
  { top: "18%",  left: "5%",   rotate: -20,  size: 11, opacity: 0.09 },
  { top: "28%",  right: "4%",  rotate: 40,   size: 16, opacity: 0.13 },
  { top: "32%",  right: "6%",  rotate: 50,   size: 12, opacity: 0.10 },
  { top: "45%",  left: "2%",   rotate: -45,  size: 18, opacity: 0.10 },
  { top: "50%",  left: "4.5%", rotate: -35,  size: 13, opacity: 0.08 },
  { top: "60%",  right: "3%",  rotate: 25,   size: 15, opacity: 0.11 },
  { top: "65%",  right: "5.5%",rotate: 15,   size: 10, opacity: 0.08 },
  { top: "75%",  left: "3%",   rotate: -55,  size: 17, opacity: 0.12 },
  { top: "80%",  left: "5%",   rotate: -40,  size: 12, opacity: 0.09 },
  { top: "88%",  right: "4%",  rotate: 35,   size: 14, opacity: 0.10 },
];

export default function PawPrints() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {prints.map((p, i) => (
        <div
          key={i}
          className="absolute text-[var(--app-accent)]"
          style={{
            top: p.top,
            left: "left" in p ? p.left : undefined,
            right: "right" in p ? (p as any).right : undefined,
            transform: `rotate(${p.rotate}deg)`,
            opacity: p.opacity,
          }}
        >
          <PawPrint size={p.size} />
        </div>
      ))}
    </div>
  );
}
