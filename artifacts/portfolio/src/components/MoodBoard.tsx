import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useGetSiteSettings } from "@workspace/api-client-react";
import { TextReveal, FadeIn } from "./TextReveal";

interface MoodItem { icon: string; label: string; value: string; }

function safeParseJSON<T>(str: string | undefined, fallback: T): T {
  try { return str ? JSON.parse(str) as T : fallback; } catch { return fallback; }
}

const DEFAULT_MOODS: MoodItem[] = [
  { icon: "game", label: "Playing", value: "Dragon Adventures" },
  { icon: "music", label: "Listening to", value: "cozy lo-fi + rain" },
  { icon: "brush", label: "Drawing style", value: "soft watercolor" },
  { icon: "clock", label: "Season", value: "eternal autumn" },
  { icon: "cup", label: "Drinking", value: "iced matcha latte" },
  { icon: "star", label: "Currently loving", value: "fantasy worldbuilding" },
];

const ICON_MAP: Record<string, { color: string; bg: string; svg: React.ReactNode }> = {
  game: {
    color: "#C07030", bg: "#FDE8CC",
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01M8 12h.01M16 12h.01M12 8v8"/></svg>,
  },
  music: {
    color: "#7B5EA7", bg: "#E8E0FF",
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  },
  brush: {
    color: "#D4607A", bg: "#FFE8F0",
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>,
  },
  clock: {
    color: "#C07030", bg: "#FFF0E0",
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  },
  cup: {
    color: "#5A8A3A", bg: "#E8F5E0",
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z"/><line x1="6" x2="6" y1="1" y2="4"/><line x1="10" x2="10" y1="1" y2="4"/><line x1="14" x2="14" y1="1" y2="4"/></svg>,
  },
  star: {
    color: "#7B5EA7", bg: "#F8E8FF",
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" opacity="0.7"/></svg>,
  },
  book: {
    color: "#8B6050", bg: "#F0E8E0",
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  },
  heart: {
    color: "#D4607A", bg: "#FFE0EA",
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" opacity="0.7"/></svg>,
  },
};

const FALLBACK_ICON = {
  color: "#7B6FA3", bg: "#F0EEFF",
  svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
};

export default function MoodBoard() {
  const { data: settings } = useGetSiteSettings();
  const moods = safeParseJSON<MoodItem[]>(settings?.moodBoard, DEFAULT_MOODS);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });

  return (
    <section className="w-full py-20 relative" ref={containerRef}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <TextReveal as="div" className="text-[var(--ink-muted)] font-handwriting text-xl mb-1">
            a peek inside my world
          </TextReveal>
          <TextReveal as="h2" className="font-display italic text-4xl text-[var(--ink)]">
            right now
          </TextReveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {moods.map((mood, i) => {
            const ic = ICON_MAP[mood.icon] || FALLBACK_ICON;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
                whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
                className="glass-panel p-5 flex flex-col gap-3 cursor-default"
                style={{ background: `${ic.bg}AA` }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ color: ic.color, background: `${ic.bg}CC` }}>
                  {ic.svg}
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-widest uppercase mb-0.5" style={{ color: ic.color, opacity: 0.7 }}>
                    {mood.label}
                  </p>
                  <p className="font-handwriting text-xl text-[var(--ink)] leading-tight">{mood.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
