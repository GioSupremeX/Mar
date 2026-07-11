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

      <footer className="relative z-10 py-12 mt-16 border-t border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-muted)]">
          <p className="font-sans tracking-wide">
            &copy; {new Date().getFullYear()} {artistName}
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: "Instagram", href: "https://instagram.com" },
              { label: "Twitter / X", href: "https://twitter.com" },
              { label: "TikTok", href: "https://tiktok.com" },
              { label: "DeviantArt", href: "https://deviantart.com" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans tracking-wide hover:text-[var(--app-accent)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <p className="font-sans tracking-wide opacity-50">made by Giorgosxaral</p>
        </div>
      </footer>

      {/* Floating mascot */}
      <CatMascot />
    </main>
  );
}
