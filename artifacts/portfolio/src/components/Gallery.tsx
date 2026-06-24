import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useListArtworks } from "@workspace/api-client-react";
import { SketchMark } from "./Doodles";

const categories = ["All", "Sketches", "Digital Art", "Fan Art", "Personal Projects"];

export default function Gallery() {
  const { data: artworks = [], isLoading } = useListArtworks();
  const [filter, setFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState<{url: string, title: string, category: string} | null>(null);

  const filteredArtworks = artworks.filter(art => filter === "All" || art.category === filter);

  // Helper to replace placeholder images with our generated ones based on ID modulo
  const getImageUrl = (url: string, id: number) => {
    if (url && !url.includes("placeholder.co")) return url;
    // Map to our 10 generated images
    const imageNum = (id % 10) + 1;
    return `/images/art-${imageNum}.png`;
  };

  return (
    <section id="gallery" className="w-full py-24 relative">
      <div className="absolute top-10 right-10 text-[var(--app-accent)]">
        <SketchMark />
      </div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-[var(--ink)]">Selected Works</h2>
        
        <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-2xl mx-auto px-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === cat 
                  ? "bg-[var(--ink)] text-white shadow-md" 
                  : "bg-white/50 text-[var(--ink-muted)] hover:bg-white hover:text-[var(--ink)] border border-[var(--glass-border)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--app-accent)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--app-accent-pink)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--app-accent-blue)]"></div>
          </div>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 relative z-10 px-4">
          {filteredArtworks.map((art, i) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 5) * 0.1 }}
              className="break-inside-avoid glass-panel overflow-hidden group cursor-pointer border-0 shadow-sm hover:shadow-xl transition-all duration-500"
              onClick={() => setSelectedImage({ url: getImageUrl(art.imageUrl, art.id), title: art.title, category: art.category })}
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={getImageUrl(art.imageUrl, art.id)}
                  alt={art.title}
                  className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(art.title)}&background=EDE8FF&color=7B6FA3`;
                  }}
                />
                <div className="absolute inset-0 bg-[var(--ink)]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white font-display text-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{art.title}</h3>
                  <p className="text-white/80 font-handwriting text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{art.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xl dark:bg-black/40" />
            
            <button
              className="absolute top-6 right-6 z-[110] p-3 text-[var(--ink)] hover:text-[var(--app-accent-pink)] transition-colors bg-white/50 rounded-full backdrop-blur-md"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[90vh] z-[110] flex flex-col items-center bg-white p-2 rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-xl"
              />
              <div className="w-full p-6 text-center">
                <h3 className="font-display text-3xl text-[var(--ink)]">{selectedImage.title}</h3>
                <p className="font-handwriting text-2xl text-[var(--ink-muted)] mt-1">{selectedImage.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
