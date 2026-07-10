import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxOrbs() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -180]);

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div style={{ y: y1 }} className="parallax-orb">
        <div className="bg-orb bg-orb-1" />
      </motion.div>
      <motion.div style={{ y: y2 }} className="parallax-orb">
        <div className="bg-orb bg-orb-2" />
      </motion.div>
      <motion.div style={{ y: y3 }} className="parallax-orb">
        <div className="bg-orb bg-orb-3" />
      </motion.div>
    </div>
  );
}
