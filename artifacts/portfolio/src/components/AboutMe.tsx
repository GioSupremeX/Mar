import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useGetSiteSettings } from "@workspace/api-client-react";
import { TextReveal, FadeIn } from "./TextReveal";
import { ArchDivider } from "./Doodles";
import { GlowCard } from "./SpotlightCard";

interface JourneyItem { year: string; description: string; emoji: string; }
interface Hobby { label: string; icon: string; }

function safeParseJSON<T>(str: string | undefined, fallback: T): T {
  try { return str ? JSON.parse(str) as T : fallback; } catch { return fallback; }
}

const DEFAULT_JOURNEY: JourneyItem[] = [
  { year: "2020", description: "Bought my first drawing tablet.", emoji: "✏️" },
  { year: "2021", description: "Discovered digital painting and color theory.", emoji: "🎨" },
  { year: "2022", description: "Started posting art online, found an amazing community.", emoji: "✨" },
  { year: "2024", description: "Freelance commissions, fan art, and daily sketches.", emoji: "🌸" },
];

const DEFAULT_HOBBIES: Hobby[] = [
  { label: "Reading Fantasy", icon: "📖" },
  { label: "Stationery", icon: "✏️" },
  { label: "Roblox", icon: "🎮" },
  { label: "Baking", icon: "🍪" },
  { label: "Iced Matcha", icon: "🍵" },
  { label: "Cats", icon: "🐈" },
];

export default function AboutMe() {
  const { data: settings } = useGetSiteSettings();
  const bio = settings?.bio || "I'm a digital artist who loves exploring the intersection of fantasy and soft aesthetics. My work is heavily inspired by dreams, nature, and the games I play.";
  const journey = safeParseJSON<JourneyItem[]>(settings?.journey, DEFAULT_JOURNEY);
  const hobbies = safeParseJSON<Hobby[]>(settings?.hobbies, DEFAULT_HOBBIES);
  const currentObsession = settings?.currentObsession || "Mastering complex hands and dynamic lighting. Also currently deep in a worldbuilding rabbit hole.";
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="about" className="w-full py-24 relative" ref={ref}>
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[var(--app-accent-blue)] pointer-events-none">
        <ArchDivider />
      </div>

      <div className="grid md:grid-cols-2 gap-16 md:gap-24 relative z-10 max-w-5xl mx-auto px-4">
        {/* Left */}
        <FadeIn direction="left">
          <TextReveal as="h2" className="font-display text-4xl font-semibold text-[var(--ink)] mb-2">
            About Me
          </TextReveal>
          <div className="w-12 h-0.5 rounded-full mt-3 mb-7" style={{ background: "linear-gradient(90deg, var(--app-accent), var(--app-accent-pink))" }} />

          <div className="text-[var(--ink)]/80 text-lg leading-relaxed whitespace-pre-wrap font-sans">{bio}</div>

          {/* Journey */}
          <div className="mt-14">
            <TextReveal as="h3" className="font-display text-2xl font-semibold text-[var(--ink)] mb-7">
              My Journey
            </TextReveal>
            <div className="relative border-l border-[var(--glass-border)] ml-3 space-y-8 pb-4">
              {journey.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-8"
                >
                  <div className="absolute w-3 h-3 bg-white border-2 border-[var(--app-accent)] rounded-full -left-[7px] top-2" />
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-handwriting text-2xl text-[var(--app-accent)]">{item.year}</span>
                    <span className="text-base">{item.emoji}</span>
                  </div>
                  <p className="text-[var(--ink)]/75 font-sans text-sm md:text-base">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Right */}
        <FadeIn direction="right" delay={0.15} className="flex flex-col gap-6">
          {/* Hobbies */}
          <GlowCard className="glass-panel p-7" glowColor="rgba(179,157,219,0.15)">
            <h3 className="font-display text-2xl font-semibold text-[var(--ink)] mb-5">
              Hobbies & Loves
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {hobbies.map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  className="flex items-center gap-1.5 bg-white/70 text-[var(--ink-muted)] px-4 py-2 rounded-full text-sm font-medium border border-white shadow-sm cursor-default"
                >
                  <span>{h.icon}</span> {h.label}
                </motion.span>
              ))}
            </div>
          </GlowCard>

          {/* Current Obsession */}
          <GlowCard className="glass-panel p-7" glowColor="rgba(244,167,195,0.2)">
            <h3 className="font-display text-2xl font-semibold text-[var(--ink)] mb-3">Current Obsession</h3>
            <p className="text-[var(--ink)]/80 font-sans leading-relaxed">{currentObsession}</p>
          </GlowCard>

          {/* Fun visual */}
          <GlowCard className="glass-panel p-6 flex items-center gap-5" glowColor="rgba(168,200,232,0.15)">
            <div className="flex -space-x-1">
              {["🌸","✨","🎨","🐉"].map((e, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                  className="w-9 h-9 rounded-full bg-white border border-white/80 shadow-sm flex items-center justify-center text-base"
                >{e}</motion.div>
              ))}
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-[var(--ink)]">Always creating</p>
              <p className="font-handwriting text-base text-[var(--ink-muted)]">one sketch at a time</p>
            </div>
          </GlowCard>
        </FadeIn>
      </div>
    </section>
  );
}
