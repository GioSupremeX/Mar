import { motion } from "framer-motion";
import { Trophy, Star, Medal, Crown } from "lucide-react";

const achievements = [
  { id: 1, title: "100+ Drawings", subtitle: "Sketchbook filled", icon: Star, color: "text-[#C9B8F0]", bg: "bg-[#C9B8F0]/20" },
  { id: 2, title: "First Digital Piece", subtitle: "Level Up!", icon: Palette, color: "text-[#F7C5D5]", bg: "bg-[#F7C5D5]/20" },
  { id: 3, title: "Dragon Tamer", subtitle: "Rare collection", icon: Crown, color: "text-amber-400", bg: "bg-amber-400/20" },
  { id: 4, title: "Fan Art Feature", subtitle: "Community love", icon: Trophy, color: "text-[#B8D8F0]", bg: "bg-[#B8D8F0]/20" },
];

// Need a simple Palette icon fallback
function Palette(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

export default function Achievements() {
  return (
    <section className="w-full max-w-5xl px-6 py-12">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        {achievements.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5 }}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-white/60 p-6 text-center shadow-lg backdrop-blur-sm border border-white/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            {/* Shine effect */}
            <div className="absolute -inset-[100%] z-10 hidden animate-[spin_4s_linear_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:block" />

            <div className={`relative z-20 mb-4 flex h-16 w-16 items-center justify-center rounded-full ${item.bg}`}>
              <item.icon className={`h-8 w-8 ${item.color}`} />
            </div>
            
            <h4 className="relative z-20 font-display text-lg font-bold text-[#3D2C5E] leading-tight">{item.title}</h4>
            <p className="relative z-20 mt-1 text-sm font-medium text-[#3D2C5E]/60">{item.subtitle}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
