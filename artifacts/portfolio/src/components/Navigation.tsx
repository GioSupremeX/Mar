import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Menu, X } from "lucide-react";
import { useGetSiteSettings } from "@workspace/api-client-react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: settings } = useGetSiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 30);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? (y / max) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const artistName = settings?.artistName || "Art & Magic";

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { label: "Gallery", id: "gallery" },
    { label: "About", id: "about" },
    { label: "Games", id: "games" },
    { label: "Guestbook", id: "guestbook" },
  ];

  return (
    <>
      {/* Scroll progress */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent">
        <div
          className="h-full transition-all duration-150"
          style={{ width: `${scrollProgress}%`, background: "linear-gradient(90deg, var(--app-accent), var(--app-accent-pink))" }}
        />
      </div>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "py-3 glass-panel border-x-0 border-t-0 rounded-none shadow-sm"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display italic text-2xl md:text-3xl font-semibold text-[var(--ink)] tracking-wide group-hover:opacity-80 transition-opacity">
              {artistName}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors text-xs font-medium tracking-widest uppercase relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--app-accent)] group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            <Link href="/admin" className="ml-2 opacity-25 hover:opacity-80 transition-opacity text-[var(--ink)]">
              <Settings size={15} />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[var(--ink)] p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col justify-center items-center"
            style={{ background: "rgba(247,245,255,0.97)", backdropFilter: "blur(20px)" }}
          >
            <button
              className="absolute top-6 right-6 text-[var(--ink)] p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={28} />
            </button>

            <div className="flex flex-col items-center gap-10">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => scrollTo(link.id)}
                  className="font-display italic text-4xl text-[var(--ink)] hover:text-[var(--app-accent)] transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-6 flex items-center gap-2 text-sm font-sans text-[var(--ink-muted)] hover:text-[var(--app-accent)]"
              >
                <Settings size={14} /> Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
