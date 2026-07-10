import { useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";

export default function CursorGlow() {
  const [mouse, setMouse] = useState({ x: -100, y: -100 });
  const springX = useSpring(-100, { stiffness: 80, damping: 20 });
  const springY = useSpring(-100, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
      springX.set(e.clientX);
      springY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [springX, springY]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[4]"
      style={{ x: springX, y: springY }}
    >
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 280,
          height: 280,
          background: "radial-gradient(circle, rgba(179,157,219,0.12) 0%, rgba(244,167,195,0.06) 40%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(30px)",
        }}
      />
    </motion.div>
  );
}
