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
import ParticleField from "@/components/ParticleField";
import ParallaxOrbs from "@/components/ParallaxOrbs";
import Footer from "@/components/Footer";
import { useGetSiteSettings, type SiteSettings } from "@workspace/api-client-react";

export default function Home() {
  const { data: settings } = useGetSiteSettings();
  const artistName = settings?.artistName || "Art & Magic";

  const isOn = (key: keyof SiteSettings) => (settings as Record<string, string> | undefined)?.[key] !== "false";

  return (
    <main className="relative min-h-[100dvh] bg-[var(--bg)] overflow-x-hidden font-sans">
      {/* Parallax background orbs */}
      <ParallaxOrbs />

      {/* Floating dust particles */}
      <div className="fixed inset-0 pointer-events-none z-[5]">
        <ParticleField />
      </div>

      {/* Subtle edge decoration */}
      <PawPrints />

      <Navigation />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <Hero />
        <Gallery />
        {isOn("showMoodBoard") && <MoodBoard />}
        <AboutMe />
        {isOn("showGames") && <Games />}
        {isOn("showTrophies") && <Achievements />}
        {isOn("showGuestbook") && <Guestbook />}
      </div>

      <Footer artistName={artistName} settings={settings} />


      {/* Floating mascot */}
      <CatMascot />
    </main>
  );
}
