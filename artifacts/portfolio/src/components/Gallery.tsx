import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

const artworks = [
  { id: 1, title: "Magical Girl Sketch", category: "Sketches", image: "/images/art-1.png", aspect: "aspect-square" },
  { id: 2, title: "Forest Elf Warrior", category: "Fan Art", image: "/images/art-2.png", aspect: "aspect-[3/4]" },
  { id: 3, title: "Little Witch Potions", category: "Digital Art", image: "/images/art-3.png", aspect: "aspect-[4/3]" },
  { id: 4, title: "Sunset Dragon", category: "Fan Art", image: "/images/art-4.png", aspect: "aspect-square" },
  { id: 5, title: "Floating Sky Island", category: "Digital Art", image: "/images/art-5.png", aspect: "aspect-[4/3]" },
  { id: 6, title: "Cat Wizard Doodle", category: "Sketches", image: "/images/art-6.png", aspect: "aspect-square" },
  { id: 7, title: "Starry Dream Portrait", category: "Digital Art", image: "/images/art-7.png", aspect: "aspect-[3/4]" },
  { id: 8, title: "Night Sky Dragon", category: "Personal Projects", image: "/images/art-8.png", aspect: "aspect-square" },
];

export default function Gallery() {
  const [selectedArt, setSelectedArt] = useState<typeof artworks[0] | null>(null);

  return (
    <section id="gallery" className="w-full max-w-7xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h2 className="font-display text-4xl font-black text-[#3D2C5E] md:text-5xl">My Sketchbook</h2>
        <p className="mt-4 text-lg text-[#3D2C5E]/70">A collection of daydreams and doodles</p>
      </motion.div>

      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
        {artworks.map((art, index) => (
          <motion.div
            key={art.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group relative mb-6 break-inside-avoid overflow-hidden rounded-3xl bg-white/40 shadow-sm ${art.aspect}`}
            onClick={() => setSelectedArt(art)}
          >
            <div className="absolute inset-0 cursor-pointer">
              <img
                src={art.image}
                alt={art.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#3D2C5E]/80 via-transparent to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <h3 className="font-display text-xl font-bold text-white translate-y-4 transform transition-transform duration-300 group-hover:translate-y-0">{art.title}</h3>
              <p className="text-sm text-white/80 translate-y-4 transform transition-transform duration-300 delay-75 group-hover:translate-y-0">{art.category}</p>
            </div>
            
            <div className="absolute right-4 top-4 rounded-full bg-white/20 p-2 backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <ZoomIn className="h-5 w-5 text-white" />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedArt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3D2C5E]/80 p-4 backdrop-blur-sm sm:p-12"
            onClick={() => setSelectedArt(null)}
          >
            <button
              className="absolute right-6 top-6 z-[110] rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/40"
              onClick={() => setSelectedArt(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedArt.image}
                alt={selectedArt.title}
                className="max-h-[80vh] w-auto object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                <h3 className="font-display text-3xl font-bold text-white">{selectedArt.title}</h3>
                <p className="text-lg text-white/80">{selectedArt.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
