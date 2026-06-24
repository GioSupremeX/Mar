import { motion } from "framer-motion";
import { useGetSiteSettings } from "@workspace/api-client-react";
import { ArchDivider } from "./Doodles";

const timelineEvents = [
  { year: "2020", description: "Bought my first drawing tablet." },
  { year: "2021", description: "Discovered digital painting and color theory." },
  { year: "2022", description: "Started posting art online." },
  { year: "2024", description: "Freelance commissions and personal projects." }
];

const hobbies = ["Reading Fantasy", "Collecting Stationery", "Roblox", "Baking", "Matcha Lattes"];

export default function AboutMe() {
  const { data: settings } = useGetSiteSettings();
  
  const bio = settings?.bio || "I'm a digital artist who loves exploring the intersection of fantasy and soft aesthetics. My work is heavily inspired by dreams, nature, and the games I play.";

  return (
    <section id="about" className="w-full py-24 relative">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[var(--app-accent-blue)]">
        <ArchDivider />
      </div>

      <div className="grid md:grid-cols-2 gap-16 md:gap-24 relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl font-semibold text-[var(--ink)] mb-8">About Me</h2>
          <div className="text-[var(--ink)]/80 text-lg leading-relaxed whitespace-pre-wrap font-sans">
            {bio}
          </div>
          
          <div className="mt-16">
            <h3 className="font-display text-2xl font-semibold text-[var(--ink)] mb-8">My Journey</h3>
            <div className="relative border-l border-[var(--glass-border)] ml-3 space-y-8 pb-4">
              {timelineEvents.map((item, index) => (
                <div key={index} className="relative pl-8">
                  <div className="absolute w-3 h-3 bg-white border border-[var(--app-accent)] rounded-full -left-[6.5px] top-1.5" />
                  <span className="font-handwriting text-2xl text-[var(--app-accent)] block mb-1">{item.year}</span>
                  <p className="text-[var(--ink)]/80 font-sans text-sm md:text-base">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-8"
        >
          <div className="glass-panel p-8 relative overflow-hidden">
            <h3 className="font-display text-2xl font-semibold text-[var(--ink)] mb-6">Fun Facts & Hobbies</h3>
            <div className="flex flex-wrap gap-3">
              {hobbies.map(hobby => (
                <span key={hobby} className="bg-white/60 text-[var(--ink-muted)] px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-white">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
          
          <div className="glass-panel p-8 bg-gradient-to-br from-white/40 to-[var(--bg-2)]/60">
            <h3 className="font-display text-2xl font-semibold text-[var(--ink)] mb-4">Current Obsession</h3>
            <p className="text-[var(--ink)]/80 font-sans">
              Currently trying to master drawing complex hands and dynamic lighting. Also drinking way too much iced matcha.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
