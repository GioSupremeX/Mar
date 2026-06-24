import { motion } from "framer-motion";

const achievements = [
  { id: 1, title: "100+ Drawings", desc: "Sketchbook filled", category: "Milestones" },
  { id: 2, title: "First Digital Piece", desc: "Level Up!", category: "Milestones" },
  { id: 3, title: "Dragon Tamer", desc: "Rare collection", category: "Roblox" },
  { id: 4, title: "Fan Art Feature", desc: "Community love", category: "Milestones" },
];

export default function Achievements() {
  return (
    <section className="w-full py-16 max-w-5xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Trophy Case</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {achievements.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex flex-col items-center p-6 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-[2rem] text-center hover:-translate-y-1 transition-transform"
          >
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center border-2 border-[var(--gold)] mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--gold)]">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
              </svg>
            </div>
            <span className="text-xs font-semibold text-[var(--ink-muted)] tracking-wider uppercase mb-2">{item.category}</span>
            <h4 className="font-display text-xl font-semibold text-[var(--ink)]">{item.title}</h4>
            <p className="font-handwriting text-lg text-[var(--ink)]/70 mt-1">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
