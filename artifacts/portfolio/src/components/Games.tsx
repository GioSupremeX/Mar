import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useGetSiteSettings } from "@workspace/api-client-react";
import { TextReveal, FadeIn } from "./TextReveal";

interface Game { title: string; description: string; image: string; accentColor: string; textColor: string; }

function safeParseJSON<T>(str: string | undefined, fallback: T): T {
  try { return str ? JSON.parse(str) as T : fallback; } catch { return fallback; }
}

const DEFAULT_GAMES: Game[] = [
  { title: "Dragon Adventures", description: "My ultimate comfort game. Collecting rare dragons and flying through different worlds. The sky islands are a huge inspiration for my art!", image: "/images/game-dragon.png", accentColor: "#FDE8CC", textColor: "#7A4000" },
  { title: "Forsaken", description: "The dark, mysterious atmosphere is incredible. I love exploring the lore and sketching the eerie environments.", image: "/images/game-forsaken.png", accentColor: "#DDE4EE", textColor: "#2A3550" },
  { title: "Block Tales", description: "Such a playful aesthetic! The cute blocky characters and colorful worlds always put me in a good mood.", image: "/images/game-block.png", accentColor: "#D5E8D4", textColor: "#2A5520" },
];

export default function Games() {
  const { data: settings } = useGetSiteSettings();
  const games = safeParseJSON<Game[]>(settings?.games, DEFAULT_GAMES);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="games" className="w-full py-24 relative" ref={ref}>
      <div className="text-center mb-14 relative z-10">
        <TextReveal as="div" className="text-[var(--ink-muted)] font-handwriting text-xl mb-1">
          where I find inspiration
        </TextReveal>
        <TextReveal as="h2" className="font-display text-4xl font-semibold text-[var(--ink)]">
          Favorite Games
        </TextReveal>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10 px-4">
        {games.map((game, index) => (
          <motion.div
            key={`${game.title}-${index}`}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
            className="glass-panel overflow-hidden flex flex-col group"
          >
            {/* Image */}
            <div className="h-48 overflow-hidden relative">
              <div
                className="absolute inset-0 z-10 mix-blend-multiply opacity-40"
                style={{ background: game.accentColor }}
              />
              <motion.img
                src={game.image}
                alt={game.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  el.parentElement!.style.background = game.accentColor;
                }}
              />
              <div className="absolute top-3 left-3 z-20 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-xs font-bold" style={{ color: game.textColor }}>
                {index + 1}
              </div>
            </div>

            {/* Content */}
            <div className="p-7 flex-1 flex flex-col" style={{ background: `${game.accentColor}55` }}>
              <h3 className="font-display text-2xl font-semibold mb-3" style={{ color: game.textColor }}>
                {game.title}
              </h3>
              <p className="font-sans text-sm leading-relaxed flex-1" style={{ color: game.textColor, opacity: 0.8 }}>
                {game.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
