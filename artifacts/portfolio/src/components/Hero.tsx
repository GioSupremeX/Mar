import { motion } from "framer-motion";
import { useGetSiteSettings } from "@workspace/api-client-react";
import { Sparkles, StarCluster, CatDoodle } from "./Doodles";

export default function Hero() {
  const { data: settings } = useGetSiteSettings();

  const scrollToGallery = () => {
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
  };

  const artistName = settings?.artistName || "Art & Magic";
  const tagline = settings?.tagline || "Digital artist, dragon tamer & professional daydreamer";
  const subtitle = settings?.heroSubtitle || "Step inside to see my latest sketches, fan art, and adventures.";

  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] w-full flex-col md:flex-row items-center justify-center py-24 px-6 gap-12 md:gap-20"
    >
      {/* Doodles */}
      <div className="absolute top-28 left-8 text-[var(--app-accent)] opacity-60">
        <StarCluster />
      </div>
      <div className="absolute bottom-36 right-16 text-[var(--app-accent-pink)] opacity-50">
        <Sparkles />
      </div>
      <div className="absolute top-40 right-40 text-[var(--app-accent)] opacity-30 hidden lg:block">
        <CatDoodle />
      </div>
      <div className="absolute bottom-24 left-24 opacity-20 text-[var(--app-accent-pink)] hidden md:block">
        <StarCluster />
      </div>

      {/* Text Side */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10 max-w-lg"
      >
        {/* Currently Creating badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass-panel flex items-center gap-2.5 px-4 py-2 mb-8 self-center md:self-start"
          style={{ background: "rgba(244,184,208,0.2)", borderColor: "rgba(244,184,208,0.4)" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--app-accent-pink)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--app-accent-pink)]"></span>
          </span>
          <span className="text-xs font-medium tracking-wider uppercase text-[var(--ink-muted)]">Currently drawing</span>
          <span className="font-handwriting text-base text-[var(--ink)]">Starfall Dragon ✦</span>
        </motion.div>

        <h1 className="font-display font-semibold text-[var(--ink)] tracking-tight leading-none"
          style={{ fontSize: "clamp(52px, 7vw, 96px)" }}>
          {artistName}
        </h1>

        <p className="font-handwriting text-3xl text-[var(--app-accent)] mt-3 -rotate-1">
          {tagline}
        </p>

        <p className="mt-7 text-lg text-[var(--ink-muted)] max-w-md leading-relaxed font-sans">
          {subtitle}
        </p>

        {/* Stats row */}
        <div className="flex gap-8 mt-8">
          {[["100+", "artworks"], ["3", "fandoms"], ["∞", "cat naps"]].map(([n, l]) => (
            <div key={l} className="text-center md:text-left">
              <div className="font-display text-2xl text-[var(--ink)] font-semibold">{n}</div>
              <div className="text-xs text-[var(--ink-muted)] font-medium tracking-wider uppercase">{l}</div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollToGallery}
          className="mt-10 rounded-full px-9 py-4 text-white font-sans font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[var(--app-accent)]/30 relative overflow-hidden group"
          style={{ background: "linear-gradient(135deg, var(--app-accent), var(--app-accent-pink))" }}
        >
          <span className="relative z-10">Explore My Art</span>
          <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
        </button>
      </motion.div>

      {/* Avatar Side */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="flex-1 flex justify-center z-10"
      >
        <div className="relative">
          {/* Soft rings */}
          <div className="absolute inset-0 -m-10 rounded-full border border-[var(--app-accent-pink)]/20 animate-[spin_40s_linear_infinite]" />
          <div className="absolute inset-0 -m-5 rounded-full border border-[var(--app-accent)]/25 animate-[spin_25s_linear_infinite_reverse]" />

          {/* Glow */}
          <div className="absolute inset-0 rounded-full blur-3xl opacity-30"
            style={{ background: "radial-gradient(circle, var(--app-accent), transparent 70%)" }} />

          {/* Cat ears on the avatar frame */}
          <div className="absolute -top-6 left-10 z-20">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <polygon points="4,34 0,4 20,20" fill="#FFF5F8" stroke="#E8C8D8" strokeWidth="1.5" strokeLinejoin="round"/>
              <polygon points="6,30 3,9 16,20" fill="#F4B8D0" opacity="0.7"/>
            </svg>
          </div>
          <div className="absolute -top-6 right-10 z-20">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <polygon points="32,34 36,4 16,20" fill="#FFF5F8" stroke="#E8C8D8" strokeWidth="1.5" strokeLinejoin="round"/>
              <polygon points="30,30 33,9 20,20" fill="#F4B8D0" opacity="0.7"/>
            </svg>
          </div>

          {/* Avatar frame */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[360px] lg:h-[360px] overflow-hidden rounded-full border-4 border-white/70 shadow-2xl"
            style={{ background: "var(--bg-2)" }}>
            <img
              src="/images/avatar.png"
              alt={artistName}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
                const parent = img.parentElement!;
                parent.style.background = "linear-gradient(135deg, #EDE8FF 0%, #FFE8F4 100%)";
                parent.innerHTML += `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:80px;color:#B39DDB;opacity:0.6">✦</div>`;
              }}
            />
          </div>

          {/* Small floating cat badge */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-2 -right-4 glass-panel px-3 py-1.5 shadow-md"
            style={{ background: "rgba(244,184,208,0.4)" }}
          >
            <span className="font-handwriting text-base text-[var(--ink)]">cat lover ♡</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
