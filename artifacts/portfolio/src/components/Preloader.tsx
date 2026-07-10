import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function Preloader({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isHome = location === "/" || location === "";
  const [loading, setLoading] = useState(isHome);

  useEffect(() => {
    if (!isHome) { setLoading(false); return; }
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [isHome]);

  return (
    <>
      <AnimatePresence>
        {loading && isHome && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[var(--bg)]"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl mb-5"
            >
              🐱
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-xl text-[var(--ink)] italic"
            >
              Loading magic...
            </motion.p>
            <div className="flex gap-2 mt-4">
              {[0, 0.15, 0.3].map((d, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: d, ease: "easeInOut" }}
                  className="w-2 h-2 rounded-full bg-[var(--app-accent)]"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading && isHome ? 0 : 1 }}
        transition={{ duration: 0.4, delay: loading && isHome ? 0 : 0.1 }}
      >
        {children}
      </motion.div>
    </>
  );
}
