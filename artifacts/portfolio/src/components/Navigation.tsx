import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Wand2 } from "lucide-react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Gallery", href: "#gallery" },
    { name: "About", href: "#about" },
    { name: "Games", href: "#games" },
    { name: "Guestbook", href: "#guestbook" },
  ];

  const scrollTo = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "bg-white/40 py-3 backdrop-blur-md shadow-sm dark:bg-black/20" : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2 text-xl font-black text-[#3D2C5E]">
            <Wand2 className="h-6 w-6 text-[#C9B8F0]" />
            <span className="font-display tracking-tight">Art & Magic</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollTo(link.href)}
                className="text-sm font-bold text-[#3D2C5E]/80 transition-colors hover:text-[#C9B8F0]"
              >
                {link.name}
              </button>
            ))}
          </nav>

          <button
            className="text-[#3D2C5E] md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-8 w-8" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-lg dark:bg-black/95"
          >
            <button
              className="absolute right-6 top-6 text-[#3D2C5E]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-8 w-8" />
            </button>
            
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollTo(link.href)}
                  className="font-display text-4xl font-black text-[#3D2C5E] transition-colors hover:text-[#C9B8F0]"
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
