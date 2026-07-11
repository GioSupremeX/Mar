import { Link } from "wouter";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[var(--bg)] px-6 text-center">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-7xl mb-6"
      >
        🐾
      </motion.div>
      <h1 className="font-display text-5xl text-[var(--ink)] mb-3">Oops!</h1>
      <p className="font-sans text-[var(--ink-muted)] text-lg mb-8 max-w-sm leading-relaxed">
        This page seems to have wandered off to find some catnip. Let's get you back home.
      </p>
      <Link
        href="/"
        className="px-8 py-3.5 rounded-full text-white font-medium text-sm hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md transition-all"
        style={{ background: "linear-gradient(135deg, var(--app-accent), var(--app-accent-pink))" }}
      >
        Take me home ✦
      </Link>
    </div>
  );
}
