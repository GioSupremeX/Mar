import { motion } from "framer-motion";
import { Star, Wand2, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToGallery = () => {
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      id="home" 
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center p-6 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-panel relative flex max-w-2xl flex-col items-center gap-6 rounded-[3rem] p-8 sm:p-12"
      >
        <div className="absolute -left-6 -top-6 text-[#F7C5D5]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Star className="h-12 w-12 fill-current" />
          </motion.div>
        </div>
        
        <div className="absolute -right-8 top-12 text-[#C9B8F0]">
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Star className="h-8 w-8 fill-current" />
          </motion.div>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-xl shadow-purple-900/10"
        >
          <img 
            src="/images/avatar.png" 
            alt="Artist Avatar" 
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Art&background=F7C5D5&color=fff";
            }}
          />
        </motion.div>

        <div className="space-y-4">
          <h1 className="font-display text-5xl font-black tracking-tight sm:text-7xl">
            Welcome to my <br />
            <span className="bg-gradient-to-r from-[#C9B8F0] via-[#F7C5D5] to-[#B8D8F0] bg-clip-text text-transparent">
              Creative World
            </span>
          </h1>
          <p className="mx-auto max-w-lg text-lg font-medium opacity-80 sm:text-xl">
            Digital artist, dragon tamer, and professional daydreamer. 
            Step inside to see my latest sketches, fan art, and adventures.
          </p>
        </div>

        <Button 
          onClick={scrollToGallery}
          size="lg"
          className="group mt-4 rounded-full bg-gradient-to-r from-[#C9B8F0] to-[#F7C5D5] px-8 py-6 text-lg font-bold text-[#3D2C5E] shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#F7C5D5]/30"
        >
          <Wand2 className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
          Explore Gallery
        </Button>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 text-[#C9B8F0]"
      >
        <ArrowDown className="h-8 w-8" />
      </motion.div>
    </section>
  );
}
