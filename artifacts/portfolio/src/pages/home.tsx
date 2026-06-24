import React from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import AboutMe from '@/components/AboutMe';
import Games from '@/components/Games';
import Achievements from '@/components/Achievements';
import Guestbook from '@/components/Guestbook';

export default function Home() {
  return (
    <main className="relative min-h-[100dvh] bg-[var(--bg)] overflow-hidden font-sans">
      <div className="bg-orbs-container">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>
      
      <Navigation />
      
      <div className="relative z-10 mx-auto max-w-7xl">
        <Hero />
        <Gallery />
        <AboutMe />
        <Games />
        <Achievements />
        <Guestbook />
      </div>
      
      <footer className="relative z-10 py-12 mt-20 text-center border-t border-[var(--glass-border)]">
        <p className="text-[var(--ink-muted)] text-sm font-sans tracking-wide">
          © {new Date().getFullYear()} Creative Soul. Crafted with intention.
        </p>
      </footer>
    </main>
  );
}
