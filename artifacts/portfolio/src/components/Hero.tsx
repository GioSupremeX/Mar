import { motion } from "framer-motion";
import { useGetSiteSettings } from "@workspace/api-client-react";
import { Sparkles, StarCluster } from "./Doodles";

export default function Hero() {
  const { data: settings } = useGetSiteSettings();
  
  const scrollToGallery = () => {
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
  };

  const artistName = settings?.artistName || "Creative Soul";
  const tagline = settings?.tagline || "Digital Artist & Dreamer";
  const subtitle = settings?.heroSubtitle || "Welcome to my digital sketchbook. I create soft, ethereal worlds and characters.";

  return (
    <section 
      id="home" 
      className="relative flex min-h-[100dvh] w-full flex-col md:flex-row items-center justify-center py-20 px-6 gap-16 md:gap-24"
    >
      <div className="absolute top-32 left-10 text-[var(--app-accent)]">
        <StarCluster />
      </div>
      <div className="absolute bottom-32 right-20 text-[var(--app-accent-pink)]">
        <Sparkles />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10"
      >
        <h1 className="font-display text-6xl sm:text-7xl lg:text-[5rem] leading-none font-semibold text-[var(--ink)] tracking-tight">
          {artistName}
        </h1>
        <p className="font-handwriting text-3xl sm:text-4xl text-[var(--app-accent)] mt-2 -rotate-2">
          {tagline}
        </p>
        <p className="mt-8 text-lg sm:text-xl text-[var(--ink-muted)] max-w-md leading-relaxed font-sans">
          {subtitle}
        </p>
        
        <button 
          onClick={scrollToGallery}
          className="mt-10 rounded-full bg-gradient-to-r from-[var(--app-accent)] to-[var(--app-accent-pink)] px-8 py-4 text-white font-sans font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[var(--app-accent)]/30"
        >
          Explore My Art
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="flex-1 flex justify-center z-10"
      >
        <div className="relative">
          {/* Decorative soft rings */}
          <div className="absolute inset-0 -m-8 rounded-full border border-[var(--app-accent-pink)]/30 animate-[spin_30s_linear_infinite]" />
          <div className="absolute inset-0 -m-4 rounded-full border border-[var(--app-accent-blue)]/40 animate-[spin_20s_linear_infinite_reverse]" />
          
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl" />
          
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 overflow-hidden rounded-full border-4 border-white/60 shadow-2xl glass-panel p-2">
            <img 
              src="/images/avatar.png" 
              alt={artistName}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(artistName) + "&background=F7F5FF&color=2A1F4A";
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
