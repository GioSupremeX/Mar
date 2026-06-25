import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  useListArtworks, useCreateArtwork, useUpdateArtwork, useDeleteArtwork, getListArtworksQueryKey,
  useGetSiteSettings, useUpdateSiteSettings, getGetSiteSettingsQueryKey,
  useListGuestbookMessages, useDeleteGuestbookMessage, getListGuestbookMessagesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Plus, Trash2, Edit, Upload, X, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpload } from "@workspace/object-storage-web";

type Tab = "artworks" | "settings" | "content" | "guestbook";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("artworks");

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (!t) setLocation("/admin");
    else setToken(t);
  }, [setLocation]);

  const handleLogout = () => { localStorage.removeItem("admin_token"); setLocation("/"); };

  if (!token) return null;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "artworks", label: "Artworks", icon: "🎨" },
    { id: "settings", label: "Site Settings", icon: "⚙️" },
    { id: "content", label: "Page Content", icon: "📝" },
    { id: "guestbook", label: "Guestbook", icon: "📖" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-60 glass-panel border-r border-t-0 border-b-0 border-l-0 rounded-none p-5 flex flex-col md:h-screen md:sticky md:top-0 shrink-0">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xl">🐾</span>
            <h1 className="font-display italic text-xl text-[var(--ink)]">Admin Panel</h1>
          </div>
          <p className="text-[10px] text-[var(--ink-muted)] pl-7 tracking-wider">YOUR SECRET GARDEN</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-2.5 ${activeTab === t.id ? "bg-[var(--app-accent)]/15 text-[var(--ink)] font-medium" : "text-[var(--ink-muted)] hover:bg-white/60 hover:text-[var(--ink)]"}`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout}
          className="mt-8 flex items-center gap-2 text-[var(--ink-muted)] hover:text-red-500 transition-colors px-4 py-2 text-sm rounded-xl hover:bg-red-50">
          <LogOut size={14} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === "artworks" && <ArtworksPanel token={token} />}
        {activeTab === "settings" && <SettingsPanel token={token} />}
        {activeTab === "content" && <ContentPanel token={token} />}
        {activeTab === "guestbook" && <GuestbookPanel token={token} />}
      </main>
    </div>
  );
}

/* ─── Image Uploader ─── */
function ImageUploader({ value, onChange, label = "Image" }: { value: string; onChange: (url: string) => void; label?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value);
  const [err, setErr] = useState("");

  const { uploadFile, isUploading, progress } = useUpload({
    onSuccess: (r) => { const url = `/api/storage${r.objectPath}`; setPreview(url); onChange(url); },
    onError: (e) => setErr("Upload failed: " + (e?.message || "unknown")),
  });

  const handleFile = (file: File) => {
    setErr("");
    if (!file.type.startsWith("image/")) { setErr("Please select an image file."); return; }
    setPreview(URL.createObjectURL(file));
    uploadFile(file);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-[var(--ink-muted)] uppercase tracking-wider">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${isUploading ? "border-[var(--app-accent)] bg-[var(--app-accent)]/5" : "border-[var(--glass-border)] hover:border-[var(--app-accent)] bg-white/40 hover:bg-white/60"}`}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !isUploading && fileRef.current?.click()}
      >
        <div className="flex flex-col items-center py-6 gap-2">
          {isUploading ? (
            <><div className="w-8 h-8 rounded-full border-3 border-[var(--app-accent)]/30 border-t-[var(--app-accent)] animate-spin" /><p className="text-xs text-[var(--ink-muted)]">{Math.round(progress)}%</p></>
          ) : (
            <><Upload size={20} className="text-[var(--ink-muted)]" /><p className="text-xs text-[var(--ink-muted)]">Drop or click to upload</p></>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
      {preview && (
        <div className="relative w-full h-28 rounded-xl overflow-hidden border border-[var(--glass-border)] bg-[var(--bg-2)]">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button type="button" onClick={() => { setPreview(""); onChange(""); if (fileRef.current) fileRef.current.value = ""; }}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm"><X size={13} /></button>
        </div>
      )}
      <Input value={value} onChange={(e) => { onChange(e.target.value); setPreview(e.target.value); }} placeholder="or paste URL" className="bg-white text-sm" />
      {err && <p className="text-xs text-red-500">{err}</p>}
    </div>
  );
}

/* ─── Artworks Panel ─── */
function ArtworksPanel({ token }: { token: string }) {
  const { data: artworks, isLoading } = useListArtworks();
  const deleteArtwork = useDeleteArtwork({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const createArtwork = useCreateArtwork({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const updateArtwork = useUpdateArtwork({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Sketches", imageUrl: "", description: "", position: 0 });
  const categories = ["Sketches", "Digital Art", "Fan Art", "Personal Projects"];

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateArtwork.mutate({ id: editingId, data: form }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListArtworksQueryKey() }); setEditingId(null); } });
    } else {
      createArtwork.mutate({ data: form }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListArtworksQueryKey() }); setIsAdding(false); } });
    }
  };

  const openEdit = (art: any) => { setForm({ title: art.title, category: art.category, imageUrl: art.imageUrl || "", description: art.description || "", position: art.position || 0 }); setEditingId(art.id); setIsAdding(false); };
  const startAdd = () => { setForm({ title: "", category: "Sketches", imageUrl: "", description: "", position: 0 }); setIsAdding(true); setEditingId(null); };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div><h2 className="font-display text-3xl text-[var(--ink)]">Artworks</h2><p className="text-sm text-[var(--ink-muted)] mt-0.5">Manage your gallery</p></div>
        {!isAdding && !editingId && (
          <button onClick={startAdd} className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:-translate-y-0.5 hover:shadow-md transition-all"
            style={{ background: "linear-gradient(135deg, var(--app-accent), var(--app-accent-pink))" }}>
            <Plus size={14} /> Add Art
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="glass-panel p-7 mb-8" style={{ background: "rgba(255,255,255,0.7)" }}>
          <h3 className="font-display text-xl mb-5 text-[var(--ink)]">{editingId ? "Edit Artwork" : "New Artwork"}</h3>
          <form onSubmit={save} className="space-y-5">
            <div><label className="block text-xs font-medium text-[var(--ink-muted)] mb-1.5 uppercase tracking-wider">Title</label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="bg-white" /></div>
            <div><label className="block text-xs font-medium text-[var(--ink-muted)] mb-1.5 uppercase tracking-wider">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]/30">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <ImageUploader value={form.imageUrl} onChange={url => setForm({ ...form, imageUrl: url })} label="Artwork Image" />
            <div><label className="block text-xs font-medium text-[var(--ink-muted)] mb-1.5 uppercase tracking-wider">Description</label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-white resize-none h-20" /></div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="text-white px-7 py-2.5 rounded-full text-sm font-medium hover:opacity-90" style={{ background: "var(--app-accent)" }}>Save</button>
              <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-[var(--ink-muted)] px-5 py-2.5 rounded-full text-sm hover:bg-black/5">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel overflow-hidden" style={{ background: "rgba(255,255,255,0.6)" }}>
        {isLoading ? <div className="p-10 text-center text-[var(--ink-muted)]">Loading...</div>
          : artworks?.length === 0 ? <div className="p-10 text-center"><p className="text-4xl mb-2">🎨</p><p className="text-[var(--ink-muted)] font-handwriting text-xl">No artworks yet.</p></div>
          : <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--glass-border)] text-[var(--ink-muted)]">
                <tr><th className="p-4 font-medium">Art</th><th className="p-4 font-medium">Title</th><th className="p-4 font-medium hidden md:table-cell">Category</th><th className="p-4 font-medium text-right">Actions</th></tr>
              </thead>
              <tbody>
                {artworks?.map(art => (
                  <tr key={art.id} className="border-b border-[var(--glass-border)]/40 last:border-0 hover:bg-white/30 transition-colors">
                    <td className="p-4"><div className="w-10 h-10 rounded-lg bg-[var(--bg-2)] overflow-hidden"><img src={art.imageUrl && !art.imageUrl.includes("placeholder") ? art.imageUrl : `/images/art-${(art.id % 8) + 1}.png`} alt="" className="w-full h-full object-cover" /></div></td>
                    <td className="p-4 font-medium text-[var(--ink)]">{art.title}</td>
                    <td className="p-4 text-[var(--ink-muted)] hidden md:table-cell">{art.category}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEdit(art)} className="p-2 text-[var(--ink-muted)] hover:text-[var(--app-accent)] rounded-lg hover:bg-black/5 transition-colors"><Edit size={14} /></button>
                      <button onClick={() => { if (confirm("Delete?")) deleteArtwork.mutate({ id: art.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListArtworksQueryKey() }) }); }} className="p-2 text-[var(--ink-muted)] hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>}
      </div>
    </div>
  );
}

/* ─── Settings Panel ─── */
function SettingsPanel({ token }: { token: string }) {
  const { data: settings } = useGetSiteSettings();
  const update = useUpdateSiteSettings({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ artistName: "", tagline: "", heroSubtitle: "", bio: "", avatarUrl: "" });
  const [heroStats, setHeroStats] = useState<{ value: string; label: string }[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({ artistName: settings.artistName || "", tagline: settings.tagline || "", heroSubtitle: settings.heroSubtitle || "", bio: settings.bio || "", avatarUrl: settings.avatarUrl || "" });
      try { setHeroStats(JSON.parse(settings.heroStats || "[]")); } catch { setHeroStats([{ value: "100+", label: "artworks" }, { value: "3", label: "fandoms" }, { value: "2 yrs", label: "drawing" }]); }
    }
  }, [settings]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    update.mutate({ data: { ...form, heroStats: JSON.stringify(heroStats) } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() }); setSaved(true); setTimeout(() => setSaved(false), 3000); },
    });
  };

  const addStat = () => setHeroStats([...heroStats, { value: "", label: "" }]);
  const removeStat = (i: number) => setHeroStats(heroStats.filter((_, idx) => idx !== i));
  const updateStat = (i: number, field: "value" | "label", val: string) => setHeroStats(heroStats.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8"><h2 className="font-display text-3xl text-[var(--ink)]">Site Settings</h2><p className="text-sm text-[var(--ink-muted)] mt-0.5">What visitors see</p></div>
      {saved && <div className="mb-5 glass-panel py-3 px-5 text-green-700 text-sm" style={{ background: "rgba(144,200,144,0.2)" }}>✓ Saved!</div>}
      <form onSubmit={save} className="glass-panel p-8 space-y-6" style={{ background: "rgba(255,255,255,0.65)" }}>
        <div><label className="lbl">Artist Name</label><Input value={form.artistName} onChange={e => setForm({ ...form, artistName: e.target.value })} className="bg-white" /></div>
        <div><label className="lbl">Tagline</label><Input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} className="bg-white" /></div>
        <div><label className="lbl">Hero Subtitle</label><Textarea value={form.heroSubtitle} onChange={e => setForm({ ...form, heroSubtitle: e.target.value })} className="bg-white h-20 resize-none" /></div>
        <div><label className="lbl">Bio</label><Textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="bg-white h-32 resize-none" /></div>
        <ImageUploader value={form.avatarUrl} onChange={url => setForm({ ...form, avatarUrl: url })} label="Profile Picture" />

        {/* Hero Stats */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="lbl mb-0">Hero Stats</label>
            <button type="button" onClick={addStat} className="text-xs text-[var(--app-accent)] hover:underline flex items-center gap-1"><Plus size={12} /> Add stat</button>
          </div>
          <div className="space-y-2">
            {heroStats.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input value={s.value} onChange={e => updateStat(i, "value", e.target.value)} placeholder="100+" className="bg-white w-28" />
                <Input value={s.label} onChange={e => updateStat(i, "label", e.target.value)} placeholder="artworks" className="bg-white flex-1" />
                <button type="button" onClick={() => removeStat(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><X size={13} /></button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={update.isPending} className="text-white px-8 py-3 rounded-full text-sm font-medium hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md transition-all disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, var(--app-accent), var(--app-accent-pink))" }}>
          {update.isPending ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

/* ─── Content Panel ─── */
function ContentPanel({ token }: { token: string }) {
  const { data: settings } = useGetSiteSettings();
  const update = useUpdateSiteSettings({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [section, setSection] = useState<"mood" | "trophies" | "games" | "journey" | "hobbies">("mood");

  const [moodItems, setMoodItems] = useState<{ icon: string; label: string; value: string }[]>([]);
  const [trophies, setTrophies] = useState<{ icon: string; title: string; desc: string; rarity: string }[]>([]);
  const [games, setGames] = useState<{ title: string; description: string; image: string; accentColor: string; textColor: string }[]>([]);
  const [journey, setJourney] = useState<{ year: string; description: string; emoji: string }[]>([]);
  const [hobbies, setHobbies] = useState<{ label: string; icon: string }[]>([]);
  const [currentObsession, setCurrentObsession] = useState("");

  useEffect(() => {
    if (!settings) return;
    function p<T>(s: string | undefined, d: T): T { try { return s ? JSON.parse(s) as T : d; } catch { return d; } }
    setMoodItems(p(settings.moodBoard, []));
    setTrophies(p(settings.trophies, []));
    setGames(p(settings.games, []));
    setJourney(p(settings.journey, []));
    setHobbies(p(settings.hobbies, []));
    setCurrentObsession(settings.currentObsession || "");
  }, [settings]);

  const saveAll = () => {
    update.mutate({
      data: {
        moodBoard: JSON.stringify(moodItems),
        trophies: JSON.stringify(trophies),
        games: JSON.stringify(games),
        journey: JSON.stringify(journey),
        hobbies: JSON.stringify(hobbies),
        currentObsession,
      },
    }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() }); setSaved(true); setTimeout(() => setSaved(false), 3000); },
    });
  };

  const ICONS = ["game", "music", "brush", "clock", "cup", "star", "book", "heart"];
  const RARITIES = ["gold", "silver", "special"];

  const sections = [
    { id: "mood", label: "Right Now" },
    { id: "trophies", label: "Trophy Case" },
    { id: "games", label: "Fav Games" },
    { id: "journey", label: "Journey" },
    { id: "hobbies", label: "Hobbies" },
  ] as const;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div><h2 className="font-display text-3xl text-[var(--ink)]">Page Content</h2><p className="text-sm text-[var(--ink-muted)] mt-0.5">Edit all sections</p></div>
        <button onClick={saveAll} disabled={update.isPending}
          className="text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, var(--app-accent), var(--app-accent-pink))" }}>
          {update.isPending ? "Saving..." : "Save All"}
        </button>
      </div>
      {saved && <div className="mb-4 glass-panel py-3 px-5 text-green-700 text-sm" style={{ background: "rgba(144,200,144,0.2)" }}>✓ Saved!</div>}

      {/* Sub-nav */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {sections.map((s) => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all ${section === s.id ? "bg-[var(--ink)] text-white" : "bg-white/60 text-[var(--ink-muted)] hover:bg-white border border-[var(--glass-border)]"}`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="glass-panel p-7 space-y-4" style={{ background: "rgba(255,255,255,0.65)" }}>

        {/* Mood Board */}
        {section === "mood" && (
          <ListEditor
            title="Right Now items"
            description='Icon options: game, music, brush, clock, cup, star, book, heart'
            items={moodItems}
            setItems={setMoodItems}
            newItem={{ icon: "star", label: "", value: "" }}
            renderItem={(item, i, update) => (
              <div className="flex gap-2 items-start flex-wrap">
                <select value={item.icon} onChange={e => update({ ...item, icon: e.target.value })} className="h-9 px-2 rounded-lg border border-input bg-white text-sm w-28">
                  {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <Input value={item.label} onChange={e => update({ ...item, label: e.target.value })} placeholder="Label" className="bg-white w-32" />
                <Input value={item.value} onChange={e => update({ ...item, value: e.target.value })} placeholder="Value" className="bg-white flex-1 min-w-[120px]" />
              </div>
            )}
          />
        )}

        {/* Trophies */}
        {section === "trophies" && (
          <ListEditor
            title="Trophies"
            description="Rarity: gold | silver | special"
            items={trophies}
            setItems={setTrophies}
            newItem={{ icon: "⭐", title: "", desc: "", rarity: "silver" }}
            renderItem={(item, _i, update) => (
              <div className="flex gap-2 items-start flex-wrap">
                <Input value={item.icon} onChange={e => update({ ...item, icon: e.target.value })} placeholder="🎨" className="bg-white w-16 text-center text-xl" />
                <Input value={item.title} onChange={e => update({ ...item, title: e.target.value })} placeholder="Title" className="bg-white flex-1 min-w-[120px]" />
                <Input value={item.desc} onChange={e => update({ ...item, desc: e.target.value })} placeholder="Subtitle" className="bg-white flex-1 min-w-[120px]" />
                <select value={item.rarity} onChange={e => update({ ...item, rarity: e.target.value })} className="h-9 px-2 rounded-lg border border-input bg-white text-sm w-28">
                  {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            )}
          />
        )}

        {/* Games */}
        {section === "games" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div><p className="font-medium text-[var(--ink)]">Favorite Games</p><p className="text-xs text-[var(--ink-muted)]">Each game card on the page</p></div>
              <button type="button" onClick={() => setGames([...games, { title: "", description: "", image: "", accentColor: "#EDE8FF", textColor: "#2A1F4A" }])}
                className="text-xs text-[var(--app-accent)] hover:underline flex items-center gap-1"><Plus size={12} /> Add game</button>
            </div>
            <div className="space-y-5">
              {games.map((g, i) => (
                <div key={i} className="p-4 bg-white/60 rounded-2xl border border-[var(--glass-border)] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[var(--ink)]">Game {i + 1}</span>
                    <button onClick={() => setGames(games.filter((_, idx) => idx !== i))} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button>
                  </div>
                  <Input value={g.title} onChange={e => setGames(games.map((g2, idx) => idx === i ? { ...g2, title: e.target.value } : g2))} placeholder="Game title" className="bg-white" />
                  <Textarea value={g.description} onChange={e => setGames(games.map((g2, idx) => idx === i ? { ...g2, description: e.target.value } : g2))} placeholder="Description" className="bg-white resize-none h-16" />
                  <ImageUploader value={g.image} onChange={url => setGames(games.map((g2, idx) => idx === i ? { ...g2, image: url } : g2))} label="Game Banner Image" />
                  <div className="flex gap-3">
                    <div className="flex-1"><label className="text-[10px] text-[var(--ink-muted)] uppercase tracking-wider">Card bg color</label><Input type="color" value={g.accentColor} onChange={e => setGames(games.map((g2, idx) => idx === i ? { ...g2, accentColor: e.target.value } : g2))} className="bg-white h-9 p-1 w-full" /></div>
                    <div className="flex-1"><label className="text-[10px] text-[var(--ink-muted)] uppercase tracking-wider">Text color</label><Input type="color" value={g.textColor} onChange={e => setGames(games.map((g2, idx) => idx === i ? { ...g2, textColor: e.target.value } : g2))} className="bg-white h-9 p-1 w-full" /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Journey */}
        {section === "journey" && (
          <ListEditor
            title="My Journey timeline"
            description="Ordered list of milestones"
            items={journey}
            setItems={setJourney}
            newItem={{ year: "", description: "", emoji: "✨" }}
            renderItem={(item, _i, update) => (
              <div className="flex gap-2 items-start flex-wrap">
                <Input value={item.year} onChange={e => update({ ...item, year: e.target.value })} placeholder="2024" className="bg-white w-20" />
                <Input value={item.emoji} onChange={e => update({ ...item, emoji: e.target.value })} placeholder="✨" className="bg-white w-14 text-center text-xl" />
                <Input value={item.description} onChange={e => update({ ...item, description: e.target.value })} placeholder="What happened?" className="bg-white flex-1 min-w-[160px]" />
              </div>
            )}
          />
        )}

        {/* Hobbies & Current Obsession */}
        {section === "hobbies" && (
          <div className="space-y-6">
            <ListEditor
              title="Hobbies & Loves"
              description="Pills shown in About Me"
              items={hobbies}
              setItems={setHobbies}
              newItem={{ label: "", icon: "✨" }}
              renderItem={(item, _i, update) => (
                <div className="flex gap-2">
                  <Input value={item.icon} onChange={e => update({ ...item, icon: e.target.value })} placeholder="📖" className="bg-white w-14 text-center text-xl" />
                  <Input value={item.label} onChange={e => update({ ...item, label: e.target.value })} placeholder="Reading Fantasy" className="bg-white flex-1" />
                </div>
              )}
            />
            <div>
              <label className="lbl">Current Obsession text</label>
              <Textarea value={currentObsession} onChange={e => setCurrentObsession(e.target.value)} className="bg-white resize-none h-24" placeholder="What are you obsessed with right now?" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Generic List Editor ─── */
function ListEditor<T extends object>({ title, description, items, setItems, newItem, renderItem }: {
  title: string; description?: string;
  items: T[]; setItems: (items: T[]) => void;
  newItem: T;
  renderItem: (item: T, index: number, update: (updated: T) => void) => React.ReactNode;
}) {
  const move = (i: number, dir: -1 | 1) => {
    const arr = [...items];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setItems(arr);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="font-medium text-[var(--ink)]">{title}</p>
          {description && <p className="text-xs text-[var(--ink-muted)]">{description}</p>}
        </div>
        <button type="button" onClick={() => setItems([...items, { ...newItem }])}
          className="text-xs text-[var(--app-accent)] hover:underline flex items-center gap-1"><Plus size={12} /> Add</button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-start p-3 bg-white/60 rounded-xl border border-[var(--glass-border)]">
            <div className="flex flex-col gap-0.5 shrink-0 pt-1">
              <button type="button" onClick={() => move(i, -1)} className="p-0.5 text-[var(--ink-muted)] hover:text-[var(--ink)] disabled:opacity-20" disabled={i === 0}><ChevronUp size={14} /></button>
              <button type="button" onClick={() => move(i, 1)} className="p-0.5 text-[var(--ink-muted)] hover:text-[var(--ink)] disabled:opacity-20" disabled={i === items.length - 1}><ChevronDown size={14} /></button>
            </div>
            <div className="flex-1">{renderItem(item, i, (updated) => setItems(items.map((x, idx) => idx === i ? updated : x)))}</div>
            <button type="button" onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0 mt-0.5"><X size={13} /></button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-[var(--ink-muted)] text-center py-4">No items yet. Click Add to create one.</p>}
      </div>
    </div>
  );
}

/* ─── Guestbook Panel ─── */
function GuestbookPanel({ token }: { token: string }) {
  const { data: messages, isLoading } = useListGuestbookMessages();
  const deleteMessage = useDeleteGuestbookMessage({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const queryClient = useQueryClient();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8"><h2 className="font-display text-3xl text-[var(--ink)]">Guestbook</h2><p className="text-sm text-[var(--ink-muted)] mt-0.5">{messages?.length || 0} entries</p></div>
      <div className="space-y-3">
        {isLoading ? <p className="text-[var(--ink-muted)]">Loading...</p>
          : messages?.length === 0 ? <div className="text-center py-12"><p className="text-4xl mb-3">📖</p><p className="text-[var(--ink-muted)] font-handwriting text-xl">No messages yet.</p></div>
          : messages?.map(msg => (
            <div key={msg.id} className="glass-panel px-5 py-4 flex justify-between items-start gap-4" style={{ background: "rgba(255,255,255,0.6)" }}>
              <div>
                <div className="flex items-center gap-2 mb-1"><span>{msg.emoji}</span><span className="font-semibold text-[var(--ink)] text-sm">{msg.name}</span><span className="text-xs text-[var(--ink-muted)]">{new Date(msg.createdAt).toLocaleString()}</span></div>
                <p className="text-[var(--ink)]/80 text-sm">{msg.message}</p>
              </div>
              <button onClick={() => { if (confirm("Delete?")) deleteMessage.mutate({ id: msg.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListGuestbookMessagesQueryKey() }) }); }}
                className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 shrink-0 transition-colors"><Trash2 size={14} /></button>
            </div>
          ))}
      </div>
    </div>
  );
}
