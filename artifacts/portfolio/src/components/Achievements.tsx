import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useGetSiteSettings } from "@workspace/api-client-react";
import { TextReveal, FadeIn } from "./TextReveal";
import { SpotlightCard } from "./SpotlightCard";

interface Trophy { icon: string; title: string; desc: string; rarity: string; }

function safeParseJSON<T>(str: string | undefined, fallback: T): T {
  try { return str ? JSON.parse(str) as T : fallback; } catch { return fallback; }
}

const DEFAULT_TROPHIES: Trophy[] = [
  { icon: "🎨", title: "100+ Drawings", desc: "Sketchbook filled", rarity: "gold" },
  { icon: "💻", title: "First Digital", desc: "Level up!", rarity: "silver" },
  { icon: "🐉", title: "Dragon Tamer", desc: "Rare collection", rarity: "gold" },
  { icon: "🌸", title: "Fan Art Feature", desc: "Community love", rarity: "silver" },
  { icon: "🏆", title: "First Commission", desc: "Real money!", rarity: "gold" },
  { icon: "⭐", title: "Night Owl", desc: "3am art sessions", rarity: "silver" },
  { icon: "✨", title: "Glow Up", desc: "Style found", rarity: "special" },
  { icon: "🎮", title: "Gamer Artist", desc: "Fan art master", rarity: "special" },
];

const rarityStyle: Record<string, { bg: string; border: string; dot: string; label: string; glow: string }> = {
  gold: { bg: "linear-gradient(135deg, rgba(232,212,168,0.35), rgba(248,230,160,0.18))", border: "rgba(200,168,80,0.35)", dot: "#B8900A", label: "gold", glow: "rgba(232,212,168,0.2)" },
  silver: { bg: "linear-gradient(135deg, rgba(200,200,220,0.3), rgba(220,218,240,0.15))", border: "rgba(160,158,190,0.35)", dot: "#7878AA", label: "silver", glow: "rgba(200,200,220,0.2)" },
  special: { bg: "linear-gradient(135deg, rgba(179,157,219,0.28), rgba(244,167,195,0.18))", border: "rgba(179,157,219,0.45)", dot: "#9D6ED8", label: "special", glow: "rgba(179,157,219,0.2)" },
};

export default function Achievements() {
  const { data: settings } = useGetSiteSettings();
  const trophies = safeParseJSON<Trophy[]>(settings?.trophies, DEFAULT_TROPHIES);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="w-full py-16 max-w-5xl mx-auto px-4" ref={ref}>
      <div className="text-center mb-12">
        <TextReveal as="div" className="text-[var(--ink-muted)] font-handwriting text-xl mb-1">
          unlocked over time
        </TextReveal>
        <TextReveal as="h2" className="font-display text-4xl font-semibold text-[var(--ink)]">
          Trophy Case
        </TextReveal>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trophies.map((item, index) => {
          const style = rarityStyle[item.rarity] || rarityStyle.silver;
          return (
            <motion.div
              key={`${item.title}-${index}`}
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
            >
              <SpotlightCard
                className="glass-panel flex flex-col items-center p-5 text-center cursor-default"
                spotlightColor={style.glow}
              >
                <div style={{ background: style.bg, borderColor: style.border, border: "1px solid", borderRadius: "1rem" }} className="flex flex-col items-center p-5 text-center w-full">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-sm border border-white/80 bg-white">
                    {item.icon}
                  </div>
                  <div className="text-[10px] font-bold tracking-widest uppercase mb-1.5 flex items-center gap-1" style={{ color: style.dot }}>
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: style.dot }} />
                    {style.label}
                  </div>
                  <h4 className="font-display text-lg font-semibold text-[var(--ink)] leading-tight">{item.title}</h4>
                  <p className="font-handwriting text-base text-[var(--ink)]/60 mt-0.5">{item.desc}</p>
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
