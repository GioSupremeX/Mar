import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetSiteSettings } from "@workspace/api-client-react";

const msgs = [
  "hi there",
  "welcome",
  "enjoy",
  "stay awhile",
  "meow",
  "nya~",
  "purr",
  "have fun",
];

export default function CatMascot() {
  const { data: settings } = useGetSiteSettings();
  const [showBubble, setShowBubble] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [hearts, setHearts] = useState<{id: number, x: number}[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    setMsgIndex((i) => (i + 1) % msgs.length);
    setShowBubble(true);
    setTimeout(() => setShowBubble(false), 2200);
  };

  const handleHover = () => {
    const newHearts = Array.from({ length: 4 }, (_, i) => ({ id: Date.now() + i, x: (Math.random() - 0.5) * 40 }));
    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => setHearts((prev) => prev.filter((h) => !newHearts.find((n) => n.id === h.id))), 1200);
  };

  // Scroll-reactive: tilt slightly based on scroll direction
  const scrollTilt = Math.max(-8, Math.min(8, (scrollY % 200) / 25 - 4));

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.85 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute -top-10 -left-14 bg-white/90 backdrop-blur-md border border-[var(--glass-border)] px-3 py-1 rounded-2xl rounded-br-none shadow-lg whitespace-nowrap"
          >
            <span className="font-sans text-xs font-medium tracking-wide text-[var(--ink)]">{msgs[msgIndex]}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        onMouseEnter={handleHover}
        animate={{
          y: [0, -4, 0],
          rotate: scrollTilt,
        }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 0.3 },
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        className="cursor-pointer focus:outline-none opacity-70 hover:opacity-100 transition-opacity relative"
        aria-label="mascot"
      >
        <CatSVG />
        <AnimatePresence>
          {hearts.map((h) => (
            <motion.span
              key={h.id}
              initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
              animate={{ opacity: 0, y: -40, x: h.x, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-1/2 text-lg pointer-events-none"
            >
              💕
            </motion.span>
          ))}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

function CatSVG() {
  return (
    <svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="42" rx="16" ry="14" fill="#FFF5F8" stroke="#E8C8D8" strokeWidth="1"/>
      <ellipse cx="32" cy="26" rx="12" ry="11" fill="#FFF5F8" stroke="#E8C8D8" strokeWidth="1"/>
      <polygon points="20,16 16,8 26,14" fill="#FFF5F8" stroke="#E8C8D8" strokeWidth="1" strokeLinejoin="round"/>
      <polygon points="21,14 18,10 25,13" fill="#F4B8D0" opacity="0.5"/>
      <polygon points="44,16 48,8 38,14" fill="#FFF5F8" stroke="#E8C8D8" strokeWidth="1" strokeLinejoin="round"/>
      <polygon points="43,14 46,10 39,13" fill="#F4B8D0" opacity="0.5"/>
      <ellipse cx="27" cy="26" rx="2" ry="2.5" fill="#2A1F4A"/>
      <ellipse cx="37" cy="26" rx="2" ry="2.5" fill="#2A1F4A"/>
      <circle cx="28" cy="25" r="0.7" fill="white"/>
      <circle cx="38" cy="25" r="0.7" fill="white"/>
      <ellipse cx="32" cy="30" rx="1.2" ry="0.9" fill="#F4B8D0"/>
      <path d="M29 32 Q32 34 35 32" stroke="#E8C8D8" strokeWidth="1" strokeLinecap="round" fill="none"/>
      <ellipse cx="22" cy="30" rx="3.5" ry="2" fill="#F4B8D0" opacity="0.2"/>
      <ellipse cx="42" cy="30" rx="3.5" ry="2" fill="#F4B8D0" opacity="0.2"/>
      <path d="M18 38 Q32 42 46 38" stroke="#B39DDB" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="32" cy="40" r="1.5" fill="#B39DDB"/>
    </svg>
  );
}
