import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import AboutMe from "@/components/AboutMe";
import Games from "@/components/Games";
import Achievements from "@/components/Achievements";
import MoodBoard from "@/components/MoodBoard";
import Guestbook from "@/components/Guestbook";
import CatMascot from "@/components/CatMascot";
import PawPrints from "@/components/PawPrints";
import { useGetSiteSettings } from "@workspace/api-client-react";

export default function Home() {
  const { data: settings } = useGetSiteSettings();
  const artistName = settings?.artistName || "Art & Magic";

  return (
    <main className="relative min-h-[100dvh] bg-[var(--bg)] overflow-x-hidden font-sans">
      {/* Background orbs */}
      <div className="bg-orbs-container">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      {/* Subtle edge decoration */}
      <PawPrints />

      <Navigation />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <Hero />
        <Gallery />
        <MoodBoard />
        <AboutMe />
        <Games />
        <Achievements />
        <Guestbook />
      </div>

      <footer className="relative z-10 py-12 mt-16 border-t border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-muted)]">
          <p className="font-sans tracking-wide">
            &copy; {new Date().getFullYear()} {artistName}
          </p>
          <p className="font-sans tracking-wide opacity-50">made with intention</p>
        </div>
      </footer>

      {/* Floating mascot */}
      <CatMascot />
    </main>
  );
}
