import { motion } from "framer-motion";
import { DragonSketch } from "./Doodles";

const games = [
  {
    title: "Dragon Adventures",
    description: "My ultimate comfort game. I love collecting rare dragons and flying through different worlds. The sky islands are a huge inspiration for my art!",
    image: "/images/game-dragon.png",
    accent: "bg-orange-100",
    textAccent: "text-orange-900"
  },
  {
    title: "Forsaken",
    description: "The dark, mysterious atmosphere in this game is incredible. I love exploring the lore and sketching the eerie environments.",
    image: "/images/game-forsaken.png",
    accent: "bg-slate-200",
    textAccent: "text-slate-800"
  },
  {
    title: "Block Tales",
    description: "Such a fun and playful aesthetic! The cute blocky characters and colorful worlds always put me in a good mood.",
    image: "/images/game-block.png",
    accent: "bg-[#D5E8D4]", // sage green
    textAccent: "text-emerald-900"
  }
];

export default function Games() {
  return (
    <section id="games" className="w-full py-24 relative">
      <div className="absolute top-10 left-10 text-[var(--app-accent)] opacity-40">
        <DragonSketch />
      </div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="font-display text-4xl font-semibold text-[var(--ink)]">Favorite Games</h2>
        <p className="mt-4 text-[var(--ink-muted)] font-sans max-w-xl mx-auto">
          Where I gather inspiration when I'm not drawing.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10 px-4">
        {games.map((game, index) => (
          <motion.div
            key={game.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-panel overflow-hidden flex flex-col group hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="h-48 overflow-hidden relative">
              <div className={`absolute inset-0 ${game.accent} opacity-50 mix-blend-multiply z-10`} />
              <img 
                src={game.image} 
                alt={game.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className={`p-8 flex-1 flex flex-col ${game.accent} bg-opacity-30`}>
              <h3 className={`font-display text-2xl font-semibold ${game.textAccent} mb-4`}>{game.title}</h3>
              <p className={`font-sans text-sm md:text-base opacity-80 ${game.textAccent} leading-relaxed`}>
                {game.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
