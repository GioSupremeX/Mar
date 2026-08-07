import { Router, type IRouter } from "express";
import { db, siteSettings } from "@workspace/db";
import { requireAdmin } from "../lib/auth";

const defaultHeroStats = JSON.stringify([
  { value: "100+", label: "artworks" },
  { value: "3", label: "fandoms" },
  { value: "2 yrs", label: "drawing" },
]);

const defaultMoodBoard = JSON.stringify([
  { icon: "game", label: "Playing", value: "Dragon Adventures" },
  { icon: "music", label: "Listening to", value: "cozy lo-fi + rain" },
  { icon: "brush", label: "Drawing style", value: "soft watercolor" },
  { icon: "clock", label: "Season", value: "eternal autumn" },
  { icon: "cup", label: "Drinking", value: "iced matcha latte" },
  { icon: "star", label: "Currently loving", value: "fantasy worldbuilding" },
]);

const defaultTrophies = JSON.stringify([
  { icon: "🎨", title: "100+ Drawings", desc: "Sketchbook filled", rarity: "gold" },
  { icon: "💻", title: "First Digital", desc: "Level up!", rarity: "silver" },
  { icon: "🐉", title: "Dragon Tamer", desc: "Rare collection", rarity: "gold" },
  { icon: "🌸", title: "Fan Art Feature", desc: "Community love", rarity: "silver" },
  { icon: "🏆", title: "First Commission", desc: "Real money!", rarity: "gold" },
  { icon: "⭐", title: "Night Owl", desc: "3am art sessions", rarity: "silver" },
  { icon: "✨", title: "Glow Up", desc: "Style found", rarity: "special" },
  { icon: "🎮", title: "Gamer Artist", desc: "Fan art master", rarity: "special" },
]);

const defaultGames = JSON.stringify([
  {
    title: "Dragon Adventures",
    description: "My ultimate comfort game. I love collecting rare dragons and flying through different worlds. The sky islands are a huge inspiration for my art!",
    image: "/images/game-dragon.png",
    accentColor: "#FDE8CC",
    textColor: "#7A4000",
  },
  {
    title: "Forsaken",
    description: "The dark, mysterious atmosphere in this game is incredible. I love exploring the lore and sketching the eerie environments.",
    image: "/images/game-forsaken.png",
    accentColor: "#DDE4EE",
    textColor: "#2A3550",
  },
  {
    title: "Block Tales",
    description: "Such a fun and playful aesthetic! The cute blocky characters and colorful worlds always put me in a good mood.",
    image: "/images/game-block.png",
    accentColor: "#D5E8D4",
    textColor: "#2A5520",
  },
]);

const defaultJourney = JSON.stringify([
  { year: "2020", description: "Bought my first drawing tablet.", emoji: "✏️" },
  { year: "2021", description: "Discovered digital painting and color theory.", emoji: "🎨" },
  { year: "2022", description: "Started posting art online, found an amazing community.", emoji: "✨" },
  { year: "2024", description: "Freelance commissions, fan art, and daily sketches.", emoji: "🌸" },
]);

const defaultHobbies = JSON.stringify([
  { label: "Reading Fantasy", icon: "📖" },
  { label: "Stationery", icon: "✏️" },
  { label: "Roblox", icon: "🎮" },
  { label: "Baking", icon: "🍪" },
  { label: "Iced Matcha", icon: "🍵" },
  { label: "Cats", icon: "🐈" },
]);

const DEFAULTS: Record<string, string> = {
  artistName: "Art & Magic",
  tagline: "Digital artist, dragon tamer & professional daydreamer",
  bio: "Hi! I'm a passionate digital artist who loves drawing characters, fantasy creatures, and fan art. When I'm not sketching, you'll find me in Dragon Adventures, Forsaken, or Block Tales.",
  heroSubtitle: "Step inside to see my latest sketches, fan art, and adventures.",
  accentColor: "#C9B8F0",
  avatarUrl: "",
  heroStats: defaultHeroStats,
  moodBoard: defaultMoodBoard,
  trophies: defaultTrophies,
  games: defaultGames,
  journey: defaultJourney,
  currentObsession: "Mastering complex hands and dynamic lighting. Also currently deep in a worldbuilding rabbit hole.",
  hobbies: defaultHobbies,
  currentlyDrawing: "Starfall Dragon ✦",
  showMoodBoard: "true",
  showTrophies: "true",
  showGames: "true",
  showJourney: "true",
  showHobbies: "true",
  showGuestbook: "true",
  guestbookCooldownSeconds: "60",
  adminPasswordHash: "",
  socialInstagram: "https://instagram.com",
  socialInstagramLabel: "Instagram",
  socialTwitter: "https://twitter.com",
  socialTwitterLabel: "Twitter / X",
  socialTikTok: "https://tiktok.com",
  socialTikTokLabel: "TikTok",
  socialYouTube: "https://youtube.com",
  socialYouTubeLabel: "YouTube",
  socialDeviantArt: "https://deviantart.com",
  socialDeviantArtLabel: "DeviantArt",
};

const ALLOWED_KEYS = Object.keys(DEFAULTS);

async function getSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(siteSettings);
  const map: Record<string, string> = { ...DEFAULTS };
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

const router: IRouter = Router();

router.get("/settings", async (_req, res): Promise<void> => {
  res.json(await getSettings());
});

router.put("/settings", requireAdmin, async (req, res): Promise<void> => {
  const updates = req.body as Record<string, string>;
  for (const [key, value] of Object.entries(updates)) {
    if (!ALLOWED_KEYS.includes(key)) continue;
    if (typeof value !== "string") continue;
    await db
      .insert(siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value } });
  }
  res.json(await getSettings());
});

export default router;
