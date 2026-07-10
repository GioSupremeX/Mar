import { useEffect } from "react";

/* Smooth-scrolls hash links and restores position on back nav */
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Smooth scroll on hash change
    const onHashChange = () => {
      const id = window.location.hash.replace("#", "");
      if (id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("hashchange", onHashChange);
    // Handle initial hash
    onHashChange();
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return <>{children}</>;
}
