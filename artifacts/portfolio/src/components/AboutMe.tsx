import { motion } from "framer-motion";
import { Palette, Gamepad2, Headphones, PenTool, Sparkles } from "lucide-react";

const timeline = [
  { year: "2018", event: "Started doodling in notebooks during math class" },
  { year: "2020", event: "Got my first drawing tablet (an old Wacom!)" },
  { year: "2022", event: "Discovered the magic of fan art and digital painting" },
  { year: "2024", event: "Opening commissions and building this portfolio!" }
];

export default function AboutMe() {
  return (
    <section id="about" className="relative w-full max-w-5xl px-6 py-24">
      <div className="absolute left-10 top-20 opacity-20">
        <Sparkles className="h-16 w-16 text-[#C9B8F0]" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel grid overflow-hidden rounded-[3rem] p-8 md:grid-cols-2 md:p-12"
      >
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-4xl font-black text-[#3D2C5E]">About the Artist</h2>
            <p className="mt-6 text-lg leading-relaxed text-[#3D2C5E]/80">
              Hi! I'm a self-taught digital artist who loves bringing fantasy worlds to life. 
              When I'm not sketching, you can usually find me exploring floating islands in Roblox, 
              collecting rare dragons, or listening to lo-fi beats while organizing my brush sets.
            </p>
          </div>

          <div>
            <h3 className="font-display text-2xl font-bold text-[#3D2C5E]">Hobbies</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { icon: Palette, text: "Digital Painting" },
                { icon: Gamepad2, text: "Roblox" },
                { icon: Headphones, text: "Lo-Fi Music" },
                { icon: PenTool, text: "Character Design" }
              ].map((hobby) => (
                <div key={hobby.text} className="flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 text-sm font-medium text-[#3D2C5E] shadow-sm">
                  <hobby.icon className="h-4 w-4 text-[#C9B8F0]" />
                  {hobby.text}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#F7C5D5]/20 to-[#C9B8F0]/20 p-6 border border-white/40">
            <h3 className="font-display text-xl font-bold text-[#3D2C5E]">Fun Fact</h3>
            <p className="mt-2 text-[#3D2C5E]/80">
              I can draw a passable dragon in under 5 minutes, but hands still take me an hour to get right!
            </p>
          </div>
        </div>

        <div className="mt-12 md:mt-0 md:pl-12">
          <h3 className="font-display text-2xl font-bold text-[#3D2C5E] mb-8">My Journey</h3>
          <div className="relative space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-gradient-to-b before:from-[#C9B8F0] before:to-[#F7C5D5]">
            {timeline.map((item, index) => (
              <motion.div 
                key={item.year}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8"
              >
                <div className="absolute left-0 top-1.5 h-6 w-6 -translate-x-[11px] rounded-full border-4 border-white bg-[#C9B8F0] shadow-sm" />
                <h4 className="font-display text-xl font-bold text-[#C9B8F0]">{item.year}</h4>
                <p className="mt-1 font-medium text-[#3D2C5E]/80">{item.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
