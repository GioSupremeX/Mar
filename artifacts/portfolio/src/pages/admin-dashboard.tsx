import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  useListArtworks, useCreateArtwork, useUpdateArtwork, useDeleteArtwork, getListArtworksQueryKey,
  useGetSiteSettings, useUpdateSiteSettings, getGetSiteSettingsQueryKey,
  useListGuestbookMessages, useDeleteGuestbookMessage, getListGuestbookMessagesQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Plus, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white/50 border-r border-[var(--glass-border)] p-6 flex flex-col h-auto md:h-screen sticky top-0">
        <h1 className="font-display italic text-2xl text-[var(--ink)] mb-10">Admin Panel</h1>
        
        <nav className="flex-1 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("artworks")}
            className={`text-left px-4 py-3 rounded-xl font-sans text-sm transition-colors ${activeTab === "artworks" ? "bg-[var(--bg-2)] text-[var(--ink)] font-medium" : "text-[var(--ink-muted)] hover:bg-white/50"}`}
          >
            Artworks
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`text-left px-4 py-3 rounded-xl font-sans text-sm transition-colors ${activeTab === "settings" ? "bg-[var(--bg-2)] text-[var(--ink)] font-medium" : "text-[var(--ink-muted)] hover:bg-white/50"}`}
          >
            Site Settings
          </button>
          <button 
            onClick={() => setActiveTab("guestbook")}
            className={`text-left px-4 py-3 rounded-xl font-sans text-sm transition-colors ${activeTab === "guestbook" ? "bg-[var(--bg-2)] text-[var(--ink)] font-medium" : "text-[var(--ink-muted)] hover:bg-white/50"}`}
          >
            Guestbook
          </button>
        </nav>
        
        <button 
          onClick={handleLogout}
          className="mt-8 flex items-center gap-2 text-[var(--ink-muted)] hover:text-red-500 transition-colors px-4 py-2 font-sans text-sm"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {activeTab === "artworks" && <ArtworksPanel token={token} />}
        {activeTab === "settings" && <SettingsPanel token={token} />}
        {activeTab === "guestbook" && <GuestbookPanel token={token} />}
      </main>
    </div>
  );
}

// Panels

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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListArtworksQueryKey() })
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateArtwork.mutate({ id: editingId, data: formData }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListArtworksQueryKey() });
          setEditingId(null);
        }
      });
    } else {
      createArtwork.mutate({ data: formData }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListArtworksQueryKey() });
          setIsAdding(false);
        }
      });
    }
  };

  const openEdit = (art: any) => {
    setFormData({ title: art.title, category: art.category, imageUrl: art.imageUrl || "", description: art.description || "", position: art.position || 0 });
    setEditingId(art.id);
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display text-3xl text-[var(--ink)]">Artworks</h2>
        {!isAdding && !editingId && (
          <button 
            onClick={() => { setIsAdding(true); setFormData({ title: "", category: "Sketches", imageUrl: "", description: "", position: 0 }); }}
            className="flex items-center gap-2 bg-[var(--ink)] text-white px-4 py-2 rounded-full font-sans text-sm hover:bg-[var(--ink)]/80"
          >
            <Plus size={16} /> Add Art
          </button>
        )}
      </div>

      {(isAdding || editingId) ? (
        <div className="bg-white/60 p-6 rounded-2xl border border-[var(--glass-border)] mb-8">
          <h3 className="font-display text-xl mb-6 text-[var(--ink)]">{editingId ? "Edit Art" : "New Art"}</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1 uppercase tracking-wider">Title</label>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1 uppercase tracking-wider">Category</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-white text-sm"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1 uppercase tracking-wider">Image URL (leave blank for auto-generated)</label>
              <Input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="bg-white" />
            </div>
            <div className="flex gap-4 pt-4">
              <button type="submit" className="bg-[var(--app-accent)] text-white px-6 py-2 rounded-full font-sans text-sm">Save</button>
              <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-[var(--ink-muted)] px-4 py-2 text-sm hover:text-[var(--ink)]">Cancel</button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="bg-white/60 rounded-2xl border border-[var(--glass-border)] overflow-hidden">
        {isLoading ? <div className="p-8 text-center text-[var(--ink-muted)]">Loading...</div> : 
         artworks?.length === 0 ? <div className="p-8 text-center text-[var(--ink-muted)]">No artworks yet.</div> : (
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-[var(--bg-2)]/50 text-[var(--ink-muted)] border-b border-[var(--glass-border)]">
              <tr>
                <th className="p-4 font-medium">Art</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium hidden md:table-cell">Category</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {artworks?.map(art => (
                <tr key={art.id} className="border-b border-[var(--glass-border)]/50 last:border-0 hover:bg-white/30">
                  <td className="p-4">
                    <div className="w-10 h-10 rounded-md bg-[var(--bg-2)] overflow-hidden">
                      <img src={art.imageUrl && !art.imageUrl.includes("placeholder") ? art.imageUrl : `/images/art-${(art.id % 10)+1}.png`} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4 font-medium text-[var(--ink)]">{art.title}</td>
                  <td className="p-4 text-[var(--ink-muted)] hidden md:table-cell">{art.category}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEdit(art)} className="p-2 text-[var(--ink-muted)] hover:text-[var(--app-accent)]"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(art.id)} className="p-2 text-[var(--ink-muted)] hover:text-red-500"><Trash2 size={16}/></button>
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
        bio: settings.bio || ""
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
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="font-display text-3xl text-[var(--ink)] mb-8">Site Settings</h2>
      
      {saved && (
        <div className="mb-6 bg-green-100 text-green-800 p-4 rounded-xl text-sm font-sans flex items-center gap-2">
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/60 p-8 rounded-2xl border border-[var(--glass-border)] space-y-6">
        <div>
          <label className="block text-xs font-medium text-[var(--ink-muted)] mb-2 uppercase tracking-wider">Artist Name</label>
          <Input value={formData.artistName} onChange={e => setFormData({...formData, artistName: e.target.value})} className="bg-white" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--ink-muted)] mb-2 uppercase tracking-wider">Tagline</label>
          <Input value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} className="bg-white" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--ink-muted)] mb-2 uppercase tracking-wider">Hero Subtitle</label>
          <Textarea value={formData.heroSubtitle} onChange={e => setFormData({...formData, heroSubtitle: e.target.value})} className="bg-white h-24 resize-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--ink-muted)] mb-2 uppercase tracking-wider">Bio (About Me)</label>
          <Textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="bg-white h-40 resize-none" />
        </div>
        
        <button 
          type="submit" 
          disabled={updateSettings.isPending}
          className="bg-[var(--ink)] text-white px-8 py-3 rounded-full font-sans text-sm hover:bg-[var(--ink)]/80 disabled:opacity-50"
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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListGuestbookMessagesQueryKey() })
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="font-display text-3xl text-[var(--ink)] mb-8">Guestbook Entries</h2>
      
      <div className="space-y-4">
        {isLoading ? <p>Loading...</p> : messages?.length === 0 ? <p className="text-[var(--ink-muted)]">No messages yet.</p> : (
          messages?.map(msg => (
            <div key={msg.id} className="bg-white/60 p-6 rounded-2xl border border-[var(--glass-border)] flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{msg.emoji}</span>
                  <span className="font-bold text-[var(--ink)]">{msg.name}</span>
                  <span className="text-xs text-[var(--ink-muted)]">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-[var(--ink)]/80 font-sans">{msg.message}</p>
              </div>
              <button 
                onClick={() => handleDelete(msg.id)}
                className="text-red-400 hover:text-red-600 p-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
