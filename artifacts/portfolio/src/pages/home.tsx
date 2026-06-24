import { useEffect } from "react";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import AboutMe from "@/components/AboutMe";
import Games from "@/components/Games";
import Achievements from "@/components/Achievements";
import Guestbook from "@/components/Guestbook";
import Navigation from "@/components/Navigation";
import BackgroundEffects from "@/components/BackgroundEffects";

export default function Home() {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden text-[#3D2C5E]">
      <BackgroundEffects />
      <Navigation />
      
      <main className="relative z-10 flex flex-col items-center">
        <Hero />
        <Gallery />
        <AboutMe />
        <Games />
        <Achievements />
        <Guestbook />
      </main>
      
      <footer className="relative z-10 w-full py-8 text-center text-sm opacity-60">
        <p>Made with sparkles and magic ✨</p>
      </footer>
    </div>
  );
}
