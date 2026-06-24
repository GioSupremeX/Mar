import { motion } from "framer-motion";

const games = [
  {
    title: "Dragon Adventures",
    description: "My ultimate comfort game. I love collecting rare dragons and flying through different worlds. The sky islands are a huge inspiration for my art!",
    image: "/images/game-dragon.png",
    color: "from-orange-400/20 to-amber-200/20",
    border: "border-orange-200/50"
  },
  {
    title: "Forsaken",
    description: "The dark, mysterious atmosphere in this game is incredible. I love exploring the lore and sketching the eerie environments.",
    image: "/images/game-forsaken.png", // We'll use a CSS fallback if image not generated
    color: "from-purple-900/20 to-indigo-900/20",
    border: "border-purple-300/30",
    fallbackBg: "bg-gradient-to-br from-indigo-950 to-purple-900"
  },
  {
    title: "Block Tales",
    description: "Such a fun and playful aesthetic! The cute blocky characters and colorful worlds always put me in a good mood when I need a break from serious drawing.",
    image: "/images/game-block.png", // We'll use a CSS fallback if image not generated
    color: "from-emerald-400/20 to-cyan-300/20",
    border: "border-emerald-200/50",
    fallbackBg: "bg-gradient-to-br from-emerald-400 to-cyan-400"
  }
];

export default function Games() {
  return (
    <section id="games" className="w-full max-w-6xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <h2 className="font-display text-4xl font-black text-[#3D2C5E] md:text-5xl">Favorite Games</h2>
        <p className="mt-4 text-lg text-[#3D2C5E]/70">Where I spend my time when I'm not drawing</p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3">
        {games.map((game, index) => (
          <motion.div
            key={game.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className={`group flex flex-col overflow-hidden rounded-[2rem] bg-white/40 backdrop-blur-md shadow-xl border ${game.border} transition-all`}
          >
            <div className={`relative h-48 w-full overflow-hidden ${game.fallbackBg || 'bg-gray-200'}`}>
              <img
                src={game.image}
                alt={game.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${game.color} mix-blend-overlay`} />
            </div>
            
            <div className="flex flex-1 flex-col p-8">
              <h3 className="font-display text-2xl font-bold text-[#3D2C5E]">{game.title}</h3>
              <p className="mt-4 flex-1 text-[#3D2C5E]/80 leading-relaxed">
                {game.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
