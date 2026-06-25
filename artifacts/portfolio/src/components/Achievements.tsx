import { motion } from "framer-motion";

const achievements = [
  { icon: "🎨", title: "100+ Drawings", desc: "Sketchbook filled", rarity: "gold" },
  { icon: "💻", title: "First Digital", desc: "Level up!", rarity: "silver" },
  { icon: "🐉", title: "Dragon Tamer", desc: "Rare collection", rarity: "gold" },
  { icon: "🌸", title: "Fan Art Feature", desc: "Community love", rarity: "silver" },
  { icon: "🐾", title: "Cat Obsessed", desc: "50 cat drawings", rarity: "special" },
  { icon: "⭐", title: "Night Owl", desc: "3am art sessions", rarity: "silver" },
  { icon: "🏆", title: "First Commission", desc: "Real money!", rarity: "gold" },
  { icon: "✨", title: "Glow Up", desc: "Style found", rarity: "special" },
];

const rarityStyle: Record<string, { bg: string; border: string; dot: string }> = {
  gold: {
    bg: "linear-gradient(135deg, rgba(232,212,168,0.3), rgba(232,212,168,0.15))",
    border: "rgba(232,212,168,0.5)",
    dot: "#C8A84B",
  },
  silver: {
    bg: "linear-gradient(135deg, rgba(200,200,220,0.3), rgba(220,218,240,0.15))",
    border: "rgba(200,198,220,0.4)",
    dot: "#8888AA",
  },
  special: {
    bg: "linear-gradient(135deg, rgba(179,157,219,0.3), rgba(244,167,195,0.2))",
    border: "rgba(179,157,219,0.5)",
    dot: "#B39DDB",
  },
};

export default function Achievements() {
  return (
    <section className="w-full py-16 max-w-5xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="font-handwriting text-xl text-[var(--ink-muted)] mb-1">unlocked over time</p>
        <h2 className="font-display text-4xl font-semibold text-[var(--ink)]">Trophy Case 🏆</h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((item, index) => {
          const style = rarityStyle[item.rarity];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-panel flex flex-col items-center p-5 text-center cursor-default"
              style={{ background: style.bg, borderColor: style.border }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-sm border border-white/60"
                style={{ background: "white" }}
              >
                {item.icon}
              </div>
              <div
                className="text-[10px] font-bold tracking-widest uppercase mb-1.5 flex items-center gap-1"
                style={{ color: style.dot }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: style.dot }} />
                {item.rarity}
              </div>
              <h4 className="font-display text-lg font-semibold text-[var(--ink)] leading-tight">{item.title}</h4>
              <p className="font-handwriting text-base text-[var(--ink)]/60 mt-0.5">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
