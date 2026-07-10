import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X, Link2 } from "lucide-react";
import { useListArtworks } from "@workspace/api-client-react";
import { TextReveal, FadeIn, StaggerChildren, StaggerItem } from "./TextReveal";
import { SpotlightCard } from "./SpotlightCard";

const categories = ["All", "Sketches", "Digital Art", "Fan Art", "Personal Projects"];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-8deg", "8deg"]);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Gallery() {
  const { data: artworks = [], isLoading } = useListArtworks();
  const [filter, setFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{url: string, title: string, category: string} | null>(null);

  const filteredArtworks = artworks.filter(art => filter === "All" || art.category === filter);

  const getImageUrl = (url: string, id: number) => {
    if (url && !url.includes("placeholder.co")) return url;
    return `/images/art-${(id % 8) + 1}.png`;
  };

  return (
    <section id="gallery" className="w-full py-24 relative">
      <div className="text-center mb-14 relative z-10">
        <TextReveal as="div" className="text-[var(--ink-muted)] font-handwriting text-xl mb-1">
          a curated collection
        </TextReveal>
        <TextReveal as="h2" className="font-display text-4xl md:text-5xl font-semibold text-[var(--ink)]">
          Selected Works
        </TextReveal>

        <FadeIn delay={0.3} className="mt-8 flex flex-wrap justify-center gap-3 max-w-2xl mx-auto px-4">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === cat
                  ? "bg-[var(--ink)] text-white shadow-md"
                  : "bg-white/50 text-[var(--ink-muted)] hover:bg-white hover:text-[var(--ink)] border border-[var(--glass-border)]"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </FadeIn>
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
        <>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 relative z-10 px-4">
            {(showAll ? filteredArtworks : filteredArtworks.slice(0, 6)).map((art, i) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: (i % 6) * 0.08, ease: "easeOut" }}
                className="break-inside-avoid"
              >
                <TiltCard className="glass-panel overflow-hidden group cursor-pointer border-0 shadow-sm hover:shadow-xl transition-shadow duration-500 rounded-2xl">
                  <SpotlightCard
                    className="rounded-2xl"
                    spotlightColor="rgba(179,157,219,0.12)"
                  >
                    <div className="relative overflow-hidden rounded-2xl" onClick={() => setSelectedImage({ url: getImageUrl(art.imageUrl, art.id), title: art.title, category: art.category })}>
                      <img
                        src={getImageUrl(art.imageUrl, art.id)}
                        alt={art.title}
                        className="w-full h-auto object-cover transform group-hover:scale-[1.03] transition-transform duration-700 ease-out"
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
                  </SpotlightCard>
                </TiltCard>
              </motion.div>
            ))}
          </div>
          {filteredArtworks.length > 6 && (
            <div className="text-center mt-10">
              <motion.button
                onClick={() => setShowAll(!showAll)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 rounded-full text-sm font-medium border border-[var(--glass-border)] bg-white/50 text-[var(--ink-muted)] hover:bg-white hover:text-[var(--ink)] hover:border-[var(--app-accent)] transition-all duration-300"
              >
                {showAll ? "Show Less" : `See All (${filteredArtworks.length})`}
              </motion.button>
            </div>
          )}
        </>
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
            <div className="absolute inset-0 bg-[var(--bg)]/70 backdrop-blur-2xl" />

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-6 right-6 z-[110] p-3 text-[var(--ink)] hover:text-[var(--app-accent-pink)] transition-colors bg-white/60 rounded-full backdrop-blur-md border border-[var(--glass-border)]"
              onClick={() => setSelectedImage(null)}
            >
              <X size={22} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="relative max-w-5xl max-h-[90vh] z-[110] flex flex-col items-center bg-white p-3 rounded-2xl shadow-2xl border border-[var(--glass-border)]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-xl"
              />
              <div className="w-full p-5 text-center flex flex-col items-center gap-2">
                <h3 className="font-display text-2xl text-[var(--ink)]">{selectedImage.title}</h3>
                <p className="font-sans text-sm text-[var(--ink-muted)] tracking-wide uppercase">{selectedImage.category}</p>
                <button
                  onClick={() => { navigator.clipboard.writeText(window.location.href + "#gallery"); }}
                  className="mt-2 flex items-center gap-1.5 text-xs text-[var(--ink-muted)] hover:text-[var(--app-accent)] transition-colors px-3 py-1.5 rounded-full border border-[var(--glass-border)] hover:border-[var(--app-accent)] bg-white/50"
                >
                  <Link2 size={12} /> Copy link
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
