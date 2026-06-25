import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CatMascot() {
  const [showBubble, setShowBubble] = useState(false);
  const [meowIndex, setMeowIndex] = useState(0);
  const meows = ["ₘₑₒw ♡", "purr~", "*nuzzles*", "nya! ♡", "zzz..."];

  const handleClick = () => {
    setMeowIndex((i) => (i + 1) % meows.length);
    setShowBubble(true);
    setTimeout(() => setShowBubble(false), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.8 }}
            className="absolute -top-12 -left-16 bg-white/90 backdrop-blur-sm border border-[var(--glass-border)] px-3 py-1.5 rounded-2xl rounded-br-none shadow-lg whitespace-nowrap"
          >
            <span className="font-handwriting text-lg text-[var(--ink)]">{meows[meowIndex]}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.1 }}
        className="cursor-pointer focus:outline-none"
        aria-label="Cat mascot"
      >
        <CatSVG />
      </motion.button>
    </div>
  );
}

function CatSVG() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="32" cy="42" rx="18" ry="16" fill="#FFF5F8" stroke="#E8C8D8" strokeWidth="1.2"/>
      {/* Head */}
      <ellipse cx="32" cy="26" rx="14" ry="13" fill="#FFF5F8" stroke="#E8C8D8" strokeWidth="1.2"/>
      {/* Left ear outer */}
      <polygon points="18,16 14,6 24,13" fill="#FFF5F8" stroke="#E8C8D8" strokeWidth="1.2" strokeLinejoin="round"/>
      {/* Left ear inner */}
      <polygon points="19,14 16,8 23,12" fill="#F4B8D0" opacity="0.7"/>
      {/* Right ear outer */}
      <polygon points="46,16 50,6 40,13" fill="#FFF5F8" stroke="#E8C8D8" strokeWidth="1.2" strokeLinejoin="round"/>
      {/* Right ear inner */}
      <polygon points="45,14 48,8 41,12" fill="#F4B8D0" opacity="0.7"/>
      {/* Eyes */}
      <ellipse cx="27" cy="26" rx="2.5" ry="2.5" fill="#2A1F4A"/>
      <ellipse cx="37" cy="26" rx="2.5" ry="2.5" fill="#2A1F4A"/>
      {/* Eye shine */}
      <circle cx="28" cy="25" r="0.8" fill="white"/>
      <circle cx="38" cy="25" r="0.8" fill="white"/>
      {/* Nose */}
      <ellipse cx="32" cy="30" rx="1.5" ry="1" fill="#F4B8D0"/>
      {/* Mouth */}
      <path d="M29 32 Q32 34 35 32" stroke="#E8C8D8" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      {/* Whiskers left */}
      <line x1="16" y1="30" x2="25" y2="31" stroke="#E8C8D8" strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="16" y1="32" x2="25" y2="32" stroke="#E8C8D8" strokeWidth="0.8" strokeLinecap="round"/>
      {/* Whiskers right */}
      <line x1="48" y1="30" x2="39" y2="31" stroke="#E8C8D8" strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="48" y1="32" x2="39" y2="32" stroke="#E8C8D8" strokeWidth="0.8" strokeLinecap="round"/>
      {/* Tail */}
      <path d="M50 50 Q58 44 56 36 Q54 30 50 34" stroke="#E8C8D8" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Paws */}
      <ellipse cx="24" cy="55" rx="5" ry="3.5" fill="#FFF5F8" stroke="#E8C8D8" strokeWidth="1"/>
      <ellipse cx="40" cy="55" rx="5" ry="3.5" fill="#FFF5F8" stroke="#E8C8D8" strokeWidth="1"/>
      {/* Blush */}
      <ellipse cx="22" cy="30" rx="4" ry="2.5" fill="#F4B8D0" opacity="0.3"/>
      <ellipse cx="42" cy="30" rx="4" ry="2.5" fill="#F4B8D0" opacity="0.3"/>
      {/* Collar */}
      <path d="M18 38 Q32 42 46 38" stroke="#B39DDB" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="32" cy="40" r="2" fill="#B39DDB"/>
      <circle cx="32" cy="40" r="1" fill="#FFD700" opacity="0.8"/>
    </svg>
  );
}
