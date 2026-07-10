import { motion } from "framer-motion";

const paws = [
  { top: "6%",  left: "3%",   delay: 0,  scale: 1,   rotate: -20 },
  { top: "18%", left: "8%",   delay: 2,  scale: 0.8, rotate: 15  },
  { top: "32%", right: "4%",  delay: 4,  scale: 0.9, rotate: -10 },
  { top: "48%", left: "5%",   delay: 6,  scale: 0.7, rotate: 25  },
  { top: "62%", right: "6%",  delay: 8,  scale: 1,   rotate: -15 },
  { top: "78%", left: "3%",   delay: 10, scale: 0.85, rotate: 10  },
  { top: "88%", right: "5%",  delay: 12, scale: 0.75, rotate: -25 },
];

function PawSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="15" rx="4.5" ry="3.5" />
      <ellipse cx="6.5" cy="11" rx="2" ry="2.5" transform="rotate(-20 6.5 11)" />
      <ellipse cx="17.5" cy="11" rx="2" ry="2.5" transform="rotate(20 17.5 11)" />
      <ellipse cx="9.5" cy="7.5" rx="1.8" ry="2.2" transform="rotate(-10 9.5 7.5)" />
      <ellipse cx="14.5" cy="7.5" rx="1.8" ry="2.2" transform="rotate(10 14.5 7.5)" />
    </svg>
  );
}

export default function PawPrints() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {paws.map((p, i) => (
        <motion.div
          key={i}
          className="absolute text-[var(--app-accent)]"
          style={{
            top: p.top,
            left: p.left,
            right: p.right,
            rotate: p.rotate,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.06, 0.12, 0.06] }}
          transition={{
            duration: 4,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <PawSVG size={16 * p.scale} />
        </motion.div>
      ))}
    </div>
  );
}
