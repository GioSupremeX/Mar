import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  useListArtworks, useCreateArtwork, useUpdateArtwork, useDeleteArtwork, getListArtworksQueryKey,
  useGetSiteSettings, useUpdateSiteSettings, getGetSiteSettingsQueryKey,
  useListGuestbookMessages, useDeleteGuestbookMessage, getListGuestbookMessagesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Plus, Trash2, Edit, Upload, Image, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpload } from "@workspace/object-storage-web";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"artworks" | "settings" | "guestbook">("artworks");

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) {
      setLocation("/admin");
    } else {
      setToken(storedToken);
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setLocation("/");
  };

  if (!token) return null;

  const tabs = [
    { id: "artworks", label: "🎨 Artworks" },
    { id: "settings", label: "⚙️ Settings" },
    { id: "guestbook", label: "📖 Guestbook" },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-r border-t-0 border-b-0 border-l-0 rounded-none p-6 flex flex-col md:h-screen md:sticky md:top-0">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🐾</span>
            <h1 className="font-display italic text-2xl text-[var(--ink)]">Admin Panel</h1>
          </div>
          <p className="text-xs text-[var(--ink-muted)] pl-8">Your secret garden</p>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-4 py-3 rounded-xl font-sans text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[var(--app-accent)]/15 text-[var(--ink)] font-medium shadow-sm"
                  : "text-[var(--ink-muted)] hover:bg-white/60 hover:text-[var(--ink)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-8 flex items-center gap-2 text-[var(--ink-muted)] hover:text-red-500 transition-colors px-4 py-2 text-sm rounded-xl hover:bg-red-50"
        >
          <LogOut size={15} /> Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === "artworks" && <ArtworksPanel token={token} />}
        {activeTab === "settings" && <SettingsPanel token={token} />}
        {activeTab === "guestbook" && <GuestbookPanel token={token} />}
      </main>
    </div>
  );
}

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value);
  const [localError, setLocalError] = useState("");

  const { uploadFile, isUploading, progress } = useUpload({
    onSuccess: (result) => {
      const url = `/api/storage${result.objectPath}`;
      setPreview(url);
      onChange(url);
    },
    onError: (err) => {
      setLocalError("Upload failed: " + (err?.message || "unknown error"));
    },
  });

  const handleFile = (file: File) => {
    setLocalError("");
    if (!file.type.startsWith("image/")) {
      setLocalError("Please select an image file.");
      return;
    }
    setPreview(URL.createObjectURL(file));
    uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const clear = () => {
    setPreview("");
    onChange("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 ${
          isUploading
            ? "border-[var(--app-accent)] bg-[var(--app-accent)]/5"
            : "border-[var(--glass-border)] hover:border-[var(--app-accent)] bg-white/40 hover:bg-white/60"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !isUploading && fileRef.current?.click()}
        style={{ cursor: isUploading ? "not-allowed" : "pointer" }}
      >
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          {isUploading ? (
            <>
              <div className="w-10 h-10 rounded-full border-4 border-[var(--app-accent)]/30 border-t-[var(--app-accent)] animate-spin" />
              <p className="text-sm text-[var(--ink-muted)]">Uploading... {Math.round(progress)}%</p>
            </>
          ) : (
            <>
              <Upload size={24} className="text-[var(--ink-muted)]" />
              <div className="text-center">
                <p className="text-sm text-[var(--ink)] font-medium">Drop image here or click to browse</p>
                <p className="text-xs text-[var(--ink-muted)] mt-0.5">PNG, JPG, GIF, WebP</p>
              </div>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {/* Preview */}
      {preview && (
        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[var(--glass-border)] bg-[var(--bg-2)]">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* URL fallback */}
      <div>
        <p className="text-xs text-[var(--ink-muted)] mb-1.5">Or paste an image URL</p>
        <Input
          value={value}
          onChange={(e) => { onChange(e.target.value); setPreview(e.target.value); }}
          placeholder="https://..."
          className="bg-white text-sm"
        />
      </div>

      {localError && <p className="text-xs text-red-500">{localError}</p>}
    </div>
  );
}

function ArtworksPanel({ token }: { token: string }) {
  const { data: artworks, isLoading } = useListArtworks();
  const deleteArtwork = useDeleteArtwork({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const createArtwork = useCreateArtwork({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const updateArtwork = useUpdateArtwork({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: "", category: "Sketches", imageUrl: "", description: "", position: 0 });

  const categories = ["Sketches", "Digital Art", "Fan Art", "Personal Projects"];

  const handleDelete = (id: number) => {
    if (confirm("Delete this artwork?")) {
      deleteArtwork.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListArtworksQueryKey() }),
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateArtwork.mutate({ id: editingId, data: formData }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListArtworksQueryKey() }); setEditingId(null); },
      });
    } else {
      createArtwork.mutate({ data: formData }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListArtworksQueryKey() }); setIsAdding(false); },
      });
    }
  };

  const openEdit = (art: any) => {
    setFormData({ title: art.title, category: art.category, imageUrl: art.imageUrl || "", description: art.description || "", position: art.position || 0 });
    setEditingId(art.id);
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setFormData({ title: "", category: "Sketches", imageUrl: "", description: "", position: 0 });
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-display text-3xl text-[var(--ink)]">Artworks</h2>
          <p className="text-sm text-[var(--ink-muted)] mt-0.5">Manage your gallery</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={startAdd}
            className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, var(--app-accent), var(--app-accent-pink))" }}
          >
            <Plus size={15} /> Add Art
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="glass-panel p-7 mb-8" style={{ background: "rgba(255,255,255,0.7)" }}>
          <h3 className="font-display text-xl mb-6 text-[var(--ink)]">{editingId ? "Edit Artwork" : "New Artwork"}</h3>
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1.5 uppercase tracking-wider">Title</label>
              <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className="bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1.5 uppercase tracking-wider">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-10 px-3 py-2 rounded-xl border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]/30"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Image size={12} /> Image
              </label>
              <ImageUploader value={formData.imageUrl} onChange={(url) => setFormData({ ...formData, imageUrl: url })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1.5 uppercase tracking-wider">Description (optional)</label>
              <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="bg-white resize-none h-20" />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="text-white px-7 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                style={{ background: "var(--app-accent)" }}
              >
                Save Artwork
              </button>
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="text-[var(--ink-muted)] px-5 py-2.5 rounded-full text-sm hover:text-[var(--ink)] hover:bg-black/5 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel overflow-hidden" style={{ background: "rgba(255,255,255,0.6)" }}>
        {isLoading ? (
          <div className="p-10 text-center text-[var(--ink-muted)]">Loading artworks...</div>
        ) : artworks?.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">🎨</p>
            <p className="text-[var(--ink-muted)] font-handwriting text-xl">No artworks yet. Add your first!</p>
          </div>
        ) : (
          <table className="w-full text-left font-sans text-sm">
            <thead className="border-b border-[var(--glass-border)] text-[var(--ink-muted)]">
              <tr>
                <th className="p-4 font-medium">Art</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium hidden md:table-cell">Category</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {artworks?.map(art => (
                <tr key={art.id} className="border-b border-[var(--glass-border)]/40 last:border-0 hover:bg-white/30 transition-colors">
                  <td className="p-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--bg-2)] overflow-hidden">
                      <img src={art.imageUrl && !art.imageUrl.includes("placeholder") ? art.imageUrl : `/images/art-${(art.id % 8) + 1}.png`} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4 font-medium text-[var(--ink)]">{art.title}</td>
                  <td className="p-4 text-[var(--ink-muted)] hidden md:table-cell">{art.category}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEdit(art)} className="p-2 text-[var(--ink-muted)] hover:text-[var(--app-accent)] transition-colors rounded-lg hover:bg-black/5"><Edit size={15} /></button>
                    <button onClick={() => handleDelete(art.id)} className="p-2 text-[var(--ink-muted)] hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SettingsPanel({ token }: { token: string }) {
  const { data: settings } = useGetSiteSettings();
  const updateSettings = useUpdateSiteSettings({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ artistName: "", tagline: "", heroSubtitle: "", bio: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        artistName: settings.artistName || "",
        tagline: settings.tagline || "",
        heroSubtitle: settings.heroSubtitle || "",
        bio: settings.bio || "",
      });
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({ data: formData }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl text-[var(--ink)]">Site Settings</h2>
        <p className="text-sm text-[var(--ink-muted)] mt-0.5">Customize what visitors see</p>
      </div>

      {saved && (
        <div className="mb-6 glass-panel py-3 px-5 flex items-center gap-2" style={{ background: "rgba(144,200,144,0.2)", borderColor: "rgba(100,180,100,0.3)" }}>
          <span className="text-green-700 font-sans text-sm">✓ Settings saved!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-6" style={{ background: "rgba(255,255,255,0.65)" }}>
        {[
          { label: "Artist Name", key: "artistName", type: "input", placeholder: "Art & Magic" },
          { label: "Tagline", key: "tagline", type: "input", placeholder: "Digital artist & cat enthusiast" },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-[var(--ink-muted)] mb-2 uppercase tracking-wider">{label}</label>
            <Input
              value={formData[key as keyof typeof formData]}
              onChange={e => setFormData({ ...formData, [key]: e.target.value })}
              placeholder={placeholder}
              className="bg-white"
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-[var(--ink-muted)] mb-2 uppercase tracking-wider">Hero Subtitle</label>
          <Textarea value={formData.heroSubtitle} onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })} className="bg-white h-24 resize-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--ink-muted)] mb-2 uppercase tracking-wider">Bio (About Me)</label>
          <Textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="bg-white h-40 resize-none" />
        </div>
        <button
          type="submit"
          disabled={updateSettings.isPending}
          className="text-white px-8 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, var(--app-accent), var(--app-accent-pink))" }}
        >
          {updateSettings.isPending ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

function GuestbookPanel({ token }: { token: string }) {
  const { data: messages, isLoading } = useListGuestbookMessages();
  const deleteMessage = useDeleteGuestbookMessage({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const queryClient = useQueryClient();

  const handleDelete = (id: number) => {
    if (confirm("Delete this message?")) {
      deleteMessage.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListGuestbookMessagesQueryKey() }),
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl text-[var(--ink)]">Guestbook Entries</h2>
        <p className="text-sm text-[var(--ink-muted)] mt-0.5">{messages?.length || 0} message{messages?.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-[var(--ink-muted)]">Loading...</p>
        ) : messages?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📖</p>
            <p className="text-[var(--ink-muted)] font-handwriting text-xl">No messages yet.</p>
          </div>
        ) : (
          messages?.map(msg => (
            <div key={msg.id} className="glass-panel px-6 py-5 flex justify-between items-start gap-4" style={{ background: "rgba(255,255,255,0.6)" }}>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">{msg.emoji}</span>
                  <span className="font-semibold text-[var(--ink)] text-sm">{msg.name}</span>
                  <span className="text-xs text-[var(--ink-muted)]">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-[var(--ink)]/80 font-sans text-sm">{msg.message}</p>
              </div>
              <button onClick={() => handleDelete(msg.id)} className="text-red-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50 shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
