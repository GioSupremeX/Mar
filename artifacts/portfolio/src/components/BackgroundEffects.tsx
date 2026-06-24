import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-[#C9B8F0] opacity-20 mix-blend-multiply blur-3xl filter animate-blob" />
      <div className="absolute top-[20%] right-[-10%] h-[50%] w-[50%] rounded-full bg-[#F7C5D5] opacity-20 mix-blend-multiply blur-3xl filter animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] h-[60%] w-[60%] rounded-full bg-[#B8D8F0] opacity-20 mix-blend-multiply blur-3xl filter animate-blob animation-delay-4000" />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-40 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{
              width: Math.random() * 6 + 2 + "px",
              height: Math.random() * 6 + 2 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}
