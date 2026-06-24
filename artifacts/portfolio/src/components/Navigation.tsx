import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Menu, X } from 'lucide-react';
import { useGetSiteSettings } from '@workspace/api-client-react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { data: settings } = useGetSiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const artistName = settings?.artistName || "Creative Soul";

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-4 glass-panel border-x-0 border-t-0 rounded-none bg-white/70 dark:bg-black/50 backdrop-blur-lg shadow-sm' : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link href="/" className="font-display italic text-2xl md:text-3xl tracking-wide font-semibold text-[var(--ink)]">
            {artistName}
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wider text-[var(--ink-muted)]">
            <button onClick={() => scrollTo('gallery')} className="hover:text-[var(--app-accent)] transition-colors uppercase text-xs tracking-widest">Gallery</button>
            <button onClick={() => scrollTo('about')} className="hover:text-[var(--app-accent)] transition-colors uppercase text-xs tracking-widest">About</button>
            <button onClick={() => scrollTo('games')} className="hover:text-[var(--app-accent)] transition-colors uppercase text-xs tracking-widest">Games</button>
            <button onClick={() => scrollTo('guestbook')} className="hover:text-[var(--app-accent)] transition-colors uppercase text-xs tracking-widest">Guestbook</button>
            <Link href="/admin" className="ml-4 opacity-40 hover:opacity-100 transition-opacity">
              <Settings size={16} />
            </Link>
          </nav>
          
          <button 
            className="md:hidden text-[var(--ink)]"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-[var(--bg)] flex flex-col justify-center items-center backdrop-blur-md"
          >
            <button 
              className="absolute top-6 right-6 text-[var(--ink)] p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            <div className="flex flex-col items-center gap-8 text-2xl font-display">
              <button onClick={() => scrollTo('gallery')} className="hover:text-[var(--app-accent)] transition-colors italic">Gallery</button>
              <button onClick={() => scrollTo('about')} className="hover:text-[var(--app-accent)] transition-colors italic">About</button>
              <button onClick={() => scrollTo('games')} className="hover:text-[var(--app-accent)] transition-colors italic">Games</button>
              <button onClick={() => scrollTo('guestbook')} className="hover:text-[var(--app-accent)] transition-colors italic">Guestbook</button>
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="mt-8 flex items-center gap-2 text-base font-sans text-[var(--ink-muted)] hover:text-[var(--app-accent)] transition-colors">
                <Settings size={16} /> Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
