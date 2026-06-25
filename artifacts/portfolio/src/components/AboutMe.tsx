import { motion } from "framer-motion";
import { useGetSiteSettings } from "@workspace/api-client-react";
import { ArchDivider, CatDoodle } from "./Doodles";

const timelineEvents = [
  { year: "2020", description: "Bought my first drawing tablet. Drew mostly cats.", emoji: "🐾" },
  { year: "2021", description: "Discovered digital painting and color theory.", emoji: "🎨" },
  { year: "2022", description: "Started posting art online, found an amazing community.", emoji: "✨" },
  { year: "2024", description: "Freelance commissions, fan art, and daily sketches.", emoji: "🌸" },
];

const hobbies = [
  { label: "Reading Fantasy", icon: "📖" },
  { label: "Stationery Hoard", icon: "✏️" },
  { label: "Roblox", icon: "🎮" },
  { label: "Baking", icon: "🍪" },
  { label: "Iced Matcha", icon: "🍵" },
  { label: "Cats", icon: "🐈" },
];

export default function AboutMe() {
  const { data: settings } = useGetSiteSettings();
  const bio =
    settings?.bio ||
    "I'm a digital artist who loves exploring the intersection of fantasy and soft aesthetics. My work is heavily inspired by dreams, nature, and the games I play.\n\nI draw a lot of cats. Like, a lot. It's a lifestyle.";

  return (
    <section id="about" className="w-full py-24 relative">
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[var(--app-accent-blue)]">
        <ArchDivider />
      </div>
      <div className="absolute top-0 right-10 text-[var(--app-accent)] opacity-25 hidden md:block">
        <CatDoodle />
      </div>

      <div className="grid md:grid-cols-2 gap-16 md:gap-24 relative z-10 max-w-5xl mx-auto px-4">
        {/* Left: Bio + Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl font-semibold text-[var(--ink)] mb-2">About Me</h2>
          <p className="font-handwriting text-xl text-[var(--app-accent)] mb-6">professional cat enthusiast</p>

          <div className="text-[var(--ink)]/80 text-lg leading-relaxed whitespace-pre-wrap font-sans">{bio}</div>

          <div className="mt-14">
            <h3 className="font-display text-2xl font-semibold text-[var(--ink)] mb-7">My Journey</h3>
            <div className="relative border-l border-[var(--glass-border)] ml-3 space-y-8 pb-4">
              {timelineEvents.map((item, index) => (
                <div key={index} className="relative pl-8">
                  <div className="absolute w-3 h-3 bg-white border-2 border-[var(--app-accent)] rounded-full -left-[7px] top-1.5" />
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-handwriting text-2xl text-[var(--app-accent)]">{item.year}</span>
                    <span>{item.emoji}</span>
                  </div>
                  <p className="text-[var(--ink)]/80 font-sans text-sm md:text-base">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Panels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          {/* Hobbies */}
          <div className="glass-panel p-7">
            <h3 className="font-display text-2xl font-semibold text-[var(--ink)] mb-5">Hobbies & Loves</h3>
            <div className="flex flex-wrap gap-2.5">
              {hobbies.map((h) => (
                <span
                  key={h.label}
                  className="flex items-center gap-1.5 bg-white/70 text-[var(--ink-muted)] px-4 py-2 rounded-full text-sm font-medium border border-white shadow-sm hover:-translate-y-0.5 transition-transform cursor-default"
                >
                  <span>{h.icon}</span> {h.label}
                </span>
              ))}
            </div>
          </div>

          {/* Current obsession */}
          <div
            className="glass-panel p-7"
            style={{ background: "linear-gradient(135deg, rgba(255,232,244,0.5), rgba(237,232,255,0.5))" }}
          >
            <h3 className="font-display text-2xl font-semibold text-[var(--ink)] mb-3">Current Obsession</h3>
            <p className="text-[var(--ink)]/80 font-sans leading-relaxed">
              Mastering complex hands and dynamic lighting — the hardest things to draw. Also watching cat videos for "reference".
            </p>
          </div>

          {/* Cat count fun fact */}
          <div
            className="glass-panel p-7 flex items-center gap-5"
            style={{ background: "rgba(179,157,219,0.12)", borderColor: "rgba(179,157,219,0.3)" }}
          >
            <div className="text-4xl">🐾</div>
            <div>
              <p className="font-display text-xl font-semibold text-[var(--ink)]">Cat drawings this year</p>
              <p className="font-handwriting text-3xl text-[var(--app-accent)] mt-0.5">47 and counting</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
