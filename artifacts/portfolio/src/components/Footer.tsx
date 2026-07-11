import type { SiteSettings } from "@workspace/api-client-react";

interface FooterProps {
  artistName: string;
  settings: SiteSettings | undefined;
}

/** Editable social links from admin dashboard. Empty string = hidden. */
export default function Footer({ artistName, settings }: FooterProps) {
  const s = settings as Record<string, string> | undefined;
  const links = [
    { label: "Instagram", url: s?.socialInstagram },
    { label: "Twitter / X", url: s?.socialTwitter },
    { label: "TikTok", url: s?.socialTikTok },
    { label: "DeviantArt", url: s?.socialDeviantArt },
  ].filter((l) => !!l.url && l.url.trim() !== "") as { label: string; url: string }[];

  return (
    <footer className="relative z-10 py-12 mt-16 border-t border-[var(--glass-border)]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-muted)]">
        <p className="font-sans tracking-wide">
          &copy; {new Date().getFullYear()} {artistName}
        </p>
        {links.length > 0 && (
          <div className="flex items-center gap-5 flex-wrap justify-center">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans tracking-wide hover:text-[var(--app-accent)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
        <p className="font-sans tracking-wide opacity-50">{s?.creditsText || "made by Giorgosxaral"}</p>
      </div>
    </footer>
  );
}
