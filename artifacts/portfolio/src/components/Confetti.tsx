import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  duration: number;
  drift: number;
}

const PALETTE = [
  "#B39DDB", "#F4A7C3", "#A8C8E8", "#D8CCE8", "#F4B8D0",
  "#C8D8F0", "#E8D8C8", "#F0D8E0", "#D0E0E8",
];

export function useConfetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  const burst = useCallback((count = 40) => {
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < count; i++) {
      newPieces.push({
        id: idCounter + i,
        x: 50 + (Math.random() - 0.5) * 60,
        y: 50,
        rotation: Math.random() * 360,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        size: Math.random() * 8 + 4,
        duration: 1.2 + Math.random() * 1,
        drift: (Math.random() - 0.5) * 60,
      });
    }
    setIdCounter((c) => c + count);
    setPieces(newPieces);
  }, [idCounter]);

  const clear = useCallback(() => setPieces([]), []);

  return { pieces, burst, clear };
}

export function ConfettiContainer({
  pieces,
  onComplete,
}: {
  pieces: ConfettiPiece[];
  onComplete?: () => void;
}) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      <AnimatePresence onExitComplete={onComplete}>
        {pieces.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              rotate: p.rotation,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              top: `${p.y + 120 + Math.random() * 40}%`,
              left: `${p.x + p.drift}%`,
              rotate: p.rotation + Math.random() * 540,
              opacity: 0,
              scale: 0.5,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: p.duration, ease: "easeOut" }}
            className="absolute"
          >
            <div
              style={{
                width: p.size,
                height: p.size * 0.6,
                background: p.color,
                borderRadius: 1,
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
