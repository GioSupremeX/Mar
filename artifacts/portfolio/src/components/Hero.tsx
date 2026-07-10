import { motion } from "framer-motion";
import { useGetSiteSettings } from "@workspace/api-client-react";
import { useCountUp } from "@/hooks/useCountUp";
import { TextReveal, FadeIn } from "./TextReveal";
import { Sparkles, StarCluster } from "./Doodles";
import { MagneticButton } from "./MagneticButton";
import { TextScramble } from "./TextScramble";

interface Stat { value: string; label: string; }

function safeParseJSON<T>(str: string | undefined, fallback: T): T {
  try { return str ? JSON.parse(str) as T : fallback; } catch { return fallback; }
}

const DEFAULT_STATS: Stat[] = [
  { value: "100+", label: "artworks" },
  { value: "3", label: "fandoms" },
  { value: "2 yrs", label: "drawing" },
];

function AnimatedStat({ value, label }: Stat) {
  const numeric = parseInt(value.replace(/\D/g, ""), 10) || 0;
  const suffix = value.replace(/[\d]/g, "");
  const count = useCountUp(numeric, 2000);
  return (
    <div className="text-center md:text-left">
      <div className="font-display text-3xl text-[var(--ink)] font-semibold tracking-tight">{count}{suffix}</div>
      <div className="text-[10px] text-[var(--ink-muted)] font-medium tracking-widest uppercase mt-1">{label}</div>
    </div>
  );
}

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

  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] w-full flex-col md:flex-row items-center justify-center py-24 px-6 gap-12 md:gap-20"
    >
      {/* Ambient decor */}
      <div className="absolute top-28 left-6 text-[var(--app-accent)] opacity-40 pointer-events-none">
        <StarCluster />
      </div>
      <div className="absolute bottom-40 right-14 text-[var(--app-accent-pink)] opacity-30 pointer-events-none">
        <Sparkles />
      </div>

      {/* Text side */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10 max-w-lg">
        {/* Live badge */}
        <FadeIn delay={0.1}>
          <div className="flex items-center gap-2.5 px-4 py-2 mb-7 rounded-full self-center md:self-start border"
            style={{ background: "rgba(244,184,208,0.15)", borderColor: "rgba(244,184,208,0.4)" }}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--app-accent-pink)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--app-accent-pink)]" />
            </span>
            <span className="text-xs font-medium tracking-wider uppercase text-[var(--ink-muted)]">Currently drawing</span>
            <span className="font-handwriting text-base text-[var(--ink)]">{settings?.currentlyDrawing || "Starfall Dragon ✦"}</span>
          </div>
        </FadeIn>

        <TextReveal as="h1" delay={0.2}>
          <span
            className="font-display font-semibold text-[var(--ink)] tracking-tight leading-none"
            style={{ fontSize: "clamp(48px, 6.5vw, 88px)" }}
          >
            {artistName}
          </span>
        </TextReveal>

        <TextReveal as="div" delay={0.35} className="mt-4">
          <span className="font-handwriting text-3xl text-[var(--app-accent)] -rotate-1 inline-block">
            {tagline}
          </span>
        </TextReveal>

        <FadeIn delay={0.45} className="mt-6 text-lg text-[var(--ink-muted)] max-w-md leading-relaxed font-sans">
          {subtitle}
        </FadeIn>

        {/* Stats with count-up */}
        {stats.length > 0 && (
          <FadeIn delay={0.55} className="flex gap-10 mt-10">
            {stats.map((s) => (
              <AnimatedStat key={s.label} {...s} />
            ))}
          </FadeIn>
        )}

        <FadeIn delay={0.65} className="mt-12">
          <MagneticButton
            onClick={scrollToGallery}
            className="rounded-full px-10 py-4 text-white font-sans font-medium text-lg focus:outline-none relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, var(--app-accent), var(--app-accent-pink))" }}
          >
            Explore My Art
          </MagneticButton>
        </FadeIn>

        {/* Scroll hint */}
        <FadeIn delay={0.85} className="mt-16">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1 text-[var(--ink-muted)]/40 cursor-pointer"
            onClick={scrollToGallery}
          >
            <span className="text-[10px] tracking-widest uppercase font-medium">Scroll</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </FadeIn>
      </div>

      {/* Avatar side */}
      <FadeIn delay={0.3} direction="right" distance={40} className="flex-1 flex justify-center z-10">
        <div className="relative">
          {/* Slow animated rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 -m-12 rounded-full border border-dashed border-[var(--app-accent-pink)]/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 -m-6 rounded-full border border-[var(--app-accent)]/15"
          />

          {/* Glow */}
          <div className="absolute inset-0 rounded-full blur-3xl opacity-20"
            style={{ background: "radial-gradient(circle, var(--app-accent), transparent 70%)" }}
          />

          {/* Avatar frame */}
          <div
            className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[340px] lg:h-[340px] rounded-full shadow-2xl overflow-hidden"
            style={{ border: "3px solid rgba(255,255,255,0.8)" }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={artistName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #EDE8FF 0%, #FFF0F8 50%, #E8F0FF 100%)" }}
              >
                <div className="text-center select-none">
                  <div className="font-display font-semibold text-[var(--app-accent)] opacity-40"
                    style={{ fontSize: "clamp(48px, 8vw, 80px)" }}
                  >
                    {artistName.slice(0, 2)}
                  </div>
                  <div className="text-4xl mt-2 opacity-25">✦</div>
                </div>
              </div>
            )}
          </div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-2 -right-3 rounded-full px-4 py-2 shadow-md border backdrop-blur-md"
            style={{ background: "rgba(255,255,255,0.9)", borderColor: "rgba(179,157,219,0.25)" }}
          >
            <span className="font-handwriting text-base text-[var(--ink)]">digital artist ✦</span>
          </motion.div>

          {/* Sparkle accents */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="absolute -top-3 right-8 text-[var(--app-accent-pink)] text-lg"
          >✦</motion.div>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            className="absolute top-8 -left-4 text-[var(--app-accent)] text-sm"
          >⋆</motion.div>
        </div>
      </FadeIn>
    </section>
  );
}
