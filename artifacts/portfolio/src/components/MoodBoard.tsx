import { motion } from "framer-motion";

const moods = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    label: "Playing",
    value: "Dragon Adventures",
    color: "#FDE8CC",
    accent: "#D4860A",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    label: "Listening to",
    value: "cozy lo-fi + rain",
    color: "#E8E0FF",
    accent: "#7B5EA7",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
      </svg>
    ),
    label: "Drawing style",
    value: "soft watercolor",
    color: "#FFE8F0",
    accent: "#D4607A",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    label: "Season",
    value: "eternal autumn",
    color: "#FFF0E0",
    accent: "#C07030",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z"/><line x1="6" x2="6" y1="1" y2="4"/><line x1="10" x2="10" y1="1" y2="4"/><line x1="14" x2="14" y1="1" y2="4"/>
      </svg>
    ),
    label: "Drinking",
    value: "iced matcha latte",
    color: "#E8F5E0",
    accent: "#5A8A3A",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2C8.5 2 6 4 6 7.5c0 2.5 1.5 4.5 3.5 5.5L8 17c-.3.8.2 1 .7.6L12 15l3.3 2.6c.5.4 1 .2.7-.6l-1.5-4C16.5 12 18 10 18 7.5 18 4 15.5 2 12 2Z" opacity="0.3"/>
        <ellipse cx="9" cy="8" rx="1.5" ry="2"/>
        <ellipse cx="15" cy="8" rx="1.5" ry="2"/>
        <path d="M9 11.5c0 1.1 1.3 2 3 2s3-.9 3-2"/>
      </svg>
    ),
    label: "Cat mood",
    value: "snuggly & purring",
    color: "#F8E8FF",
    accent: "#9060C0",
  },
];

export default function MoodBoard() {
  return (
    <section className="w-full py-20 relative">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-handwriting text-xl text-[var(--ink-muted)] mb-1">a peek inside my world</p>
          <h2 className="font-display italic text-4xl text-[var(--ink)]">
            right now
            <span className="inline-block ml-3 text-[var(--app-accent)]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 1l2.2 6.6H19l-5.6 4.1 2.1 6.6L10 14.2l-5.5 4.1 2.1-6.6L1 7.6h6.8L10 1z"/>
              </svg>
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {moods.map((mood, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="glass-panel p-5 flex flex-col gap-3"
              style={{ background: `${mood.color}99` }}
            >
              <div style={{ color: mood.accent }}>{mood.icon}</div>
              <div>
                <p className="text-xs font-medium tracking-widest uppercase mb-0.5" style={{ color: mood.accent, opacity: 0.7 }}>
                  {mood.label}
                </p>
                <p className="font-handwriting text-xl text-[var(--ink)] leading-tight">{mood.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
