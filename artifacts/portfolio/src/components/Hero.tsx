import { motion } from "framer-motion";
import { useGetSiteSettings } from "@workspace/api-client-react";
import { Sparkles, StarCluster, CatDoodle } from "./Doodles";

interface Stat { value: string; label: string; }

function safeParseJSON<T>(str: string | undefined, fallback: T): T {
  try { return str ? JSON.parse(str) as T : fallback; } catch { return fallback; }
}

const DEFAULT_STATS: Stat[] = [
  { value: "100+", label: "artworks" },
  { value: "3", label: "fandoms" },
  { value: "2 yrs", label: "drawing" },
];

export default function Hero() {
  const { data: settings } = useGetSiteSettings();

  const scrollToGallery = () => {
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
  };

  const artistName = settings?.artistName || "Art & Magic";
  const tagline = settings?.tagline || "Digital artist, dragon tamer & professional daydreamer";
  const subtitle = settings?.heroSubtitle || "Step inside to see my latest sketches, fan art, and adventures.";
  const avatarUrl = settings?.avatarUrl || "";
  const stats = safeParseJSON<Stat[]>(settings?.heroStats, DEFAULT_STATS);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
  };

  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] w-full flex-col md:flex-row items-center justify-center py-24 px-6 gap-12 md:gap-20"
    >
      {/* Ambient doodles */}
      <div className="absolute top-28 left-6 text-[var(--app-accent)] opacity-50 pointer-events-none">
        <StarCluster />
      </div>
      <div className="absolute bottom-40 right-14 text-[var(--app-accent-pink)] opacity-40 pointer-events-none">
        <Sparkles />
      </div>
      <div className="absolute top-36 right-44 text-[var(--app-accent)] opacity-20 pointer-events-none hidden lg:block">
        <CatDoodle />
      </div>

      {/* Text side */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10 max-w-lg"
      >
        {/* Live badge */}
        <motion.div variants={itemVariants}
          className="flex items-center gap-2.5 px-4 py-2 mb-7 rounded-full self-center md:self-start border"
          style={{ background: "rgba(244,184,208,0.18)", borderColor: "rgba(244,184,208,0.45)" }}
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--app-accent-pink)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--app-accent-pink)]" />
          </span>
          <span className="text-xs font-medium tracking-wider uppercase text-[var(--ink-muted)]">Currently drawing</span>
          <span className="font-handwriting text-base text-[var(--ink)]">Starfall Dragon ✦</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-display font-semibold text-[var(--ink)] tracking-tight leading-none"
          style={{ fontSize: "clamp(48px, 6.5vw, 88px)" }}
        >
          {artistName}
        </motion.h1>

        <motion.p variants={itemVariants} className="font-handwriting text-3xl text-[var(--app-accent)] mt-3 -rotate-1">
          {tagline}
        </motion.p>

        <motion.p variants={itemVariants} className="mt-6 text-lg text-[var(--ink-muted)] max-w-md leading-relaxed font-sans">
          {subtitle}
        </motion.p>

        {/* Stats */}
        {stats.length > 0 && (
          <motion.div variants={itemVariants} className="flex gap-8 mt-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <div className="font-display text-2xl text-[var(--ink)] font-semibold">{s.value}</div>
                <div className="text-[10px] text-[var(--ink-muted)] font-medium tracking-widest uppercase">{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        <motion.button
          variants={itemVariants}
          onClick={scrollToGallery}
          whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(179,157,219,0.4)" }}
          whileTap={{ scale: 0.97 }}
          className="mt-10 rounded-full px-10 py-4 text-white font-sans font-medium text-lg focus:outline-none focus:ring-4 focus:ring-[var(--app-accent)]/30 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, var(--app-accent), var(--app-accent-pink))" }}
        >
          Explore My Art
        </motion.button>
      </motion.div>

      {/* Avatar side */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="flex-1 flex justify-center z-10"
      >
        <div className="relative">
          {/* Animated rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 -m-12 rounded-full border border-dashed border-[var(--app-accent-pink)]/25"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 -m-6 rounded-full border border-[var(--app-accent)]/20"
          />

          {/* Glow */}
          <div className="absolute inset-0 rounded-full blur-3xl opacity-25"
            style={{ background: "radial-gradient(circle, var(--app-accent), transparent 70%)" }}
          />

          {/* Avatar frame */}
          <div
            className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[360px] lg:h-[360px] rounded-full shadow-2xl overflow-hidden"
            style={{ border: "3px solid rgba(255,255,255,0.7)" }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={artistName} className="w-full h-full object-cover" />
            ) : (
              /* Beautiful no-avatar state */
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #EDE8FF 0%, #FFF0F8 50%, #E8F0FF 100%)" }}
              >
                <div className="text-center select-none">
                  <div className="font-display font-semibold text-[var(--app-accent)] opacity-50"
                    style={{ fontSize: "clamp(48px, 8vw, 80px)" }}
                  >
                    {artistName.slice(0, 2)}
                  </div>
                  <div className="text-4xl mt-2 opacity-30">✦</div>
                </div>
              </div>
            )}
          </div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-2 -right-3 rounded-full px-4 py-2 shadow-md border backdrop-blur-md"
            style={{ background: "rgba(255,255,255,0.85)", borderColor: "rgba(179,157,219,0.3)" }}
          >
            <span className="font-handwriting text-base text-[var(--ink)]">digital artist ✦</span>
          </motion.div>

          {/* Sparkle accents */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="absolute -top-3 right-8 text-[var(--app-accent-pink)] text-lg"
          >✦</motion.div>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            className="absolute top-8 -left-4 text-[var(--app-accent)] text-sm"
          >⋆</motion.div>
        </div>
      </motion.div>
    </section>
  );
}
