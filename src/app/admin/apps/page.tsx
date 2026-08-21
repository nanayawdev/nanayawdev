"use client";

import { useEffect, useState, useRef } from "react";
import { PlusIcon as Plus, PencilIcon as Pencil, TrashIcon as Trash2, EyeIcon as Eye, EyeSlashIcon as EyeOff, ImageIcon as ImagePlus, XIcon as X, DotsSixVerticalIcon as GripVertical } from "@phosphor-icons/react";
import { ConfirmModal } from "@/components/confirm-modal";
import { Spinner } from "@/components/admin/spinner";
import { RowActions } from "@/components/admin/row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { adminFetch } from "@/lib/admin-fetch";

interface App {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon_image: string;
  category: string;
  play_store_url: string;
  app_store_url: string;
  website_url: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
}

const EMPTY: Omit<App, "id" | "slug" | "created_at"> = {
  name: "", tagline: "", description: "", icon_image: "", category: "Utility",
  play_store_url: "", app_store_url: "", website_url: "",
  featured: false, published: false, sort_order: 0,
};

const CATEGORIES = ["Utility", "Productivity", "Reference", "Entertainment", "Music", "Education", "Lifestyle", "Other"];

export default function AdminAppsPage() {
  const [apps, setApps]           = useState<App[]>([]);
  const [editing, setEditing]     = useState<Partial<App> | null>(null);
  const [isNew, setIsNew]         = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef              = useRef<HTMLInputElement>(null);

  async function load() {
    try {
      const res = await adminFetch("/api/admin/apps");
      if (!res.ok) return;
      const data = await res.json();
      setApps(data.apps ?? []);
    } catch { /* ignore */ }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing({ ...EMPTY, sort_order: apps.length });
    setIsNew(true); setError("");
  }

  async function openEdit(id: string) {
    const res = await adminFetch(`/api/admin/apps/${id}`);
    const data = await res.json();
    setEditing(data.app); setIsNew(false); setError("");
  }

  async function save(asDraft = false) {
    if (!editing) return;
    setSaving(true); setError("");
    const payload = asDraft ? { ...editing, published: false } : editing;
    const method = isNew ? "POST" : "PUT";
    const url    = isNew ? "/api/admin/apps" : `/api/admin/apps/${editing.id}`;
    const res = await adminFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Save failed"); setSaving(false); return; }
    await load(); setEditing(null); setSaving(false);
  }

  async function togglePublish(a: App) {
    await adminFetch(`/api/admin/apps/${a.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !a.published }),
    });
    await load();
  }

  async function deleteApp(id: string) {
    setDeleting(id); setConfirmDeleteId(null);
    await adminFetch(`/api/admin/apps/${id}`, { method: "DELETE" });
    await load(); setDeleting(null);
  }

  async function handleIconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    setError("");
    const form = new FormData(); form.append("file", file);
    const res = await adminFetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    if (res.ok) {
      setEditing((p) => ({ ...p, icon_image: data.url }));
    } else {
      setError(data.error ?? "Upload failed");
    }
    setUploading(false); e.target.value = "";
  }

  if (editing) {
    return (
      <div className="max-w-xl">
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{isNew ? "New App" : "Edit App"}</h1>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setEditing(null)} className="flex-1 rounded-full border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:bg-muted transition-colors sm:flex-none">Cancel</button>
            <button onClick={() => save(true)} disabled={saving} className="flex-1 rounded-full border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:bg-muted transition-colors disabled:opacity-50 sm:flex-none">Save Draft</button>
            <button onClick={() => save(false)} disabled={saving} className="flex-1 rounded-full bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity disabled:opacity-50 sm:flex-none">
              {saving ? <Spinner size="sm" className="text-background" /> : isNew ? "Add App" : "Save Changes"}
            </button>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-red-500 rounded-lg border border-red-200 bg-red-50 px-4 py-3">{error}</p>}

        <div className="space-y-5">
          {/* Icon */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Icon</label>
            {editing.icon_image ? (
              <div className="relative w-24 h-24 bg-muted overflow-hidden mb-2 rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={editing.icon_image} alt="" className="w-full h-full object-cover" />
                <button onClick={() => setEditing((p) => ({ ...p, icon_image: "" }))} className="absolute top-1 right-1 rounded-full bg-background border border-border p-1 hover:bg-muted">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="flex w-24 h-24 items-center justify-center gap-2 border border-dashed border-border text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50 flex-col rounded-2xl">
                <ImagePlus className="h-5 w-5" />
                {uploading ? "…" : "Icon"}
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleIconUpload} />
          </div>

          {/* Name + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Name *</label>
              <input value={editing.name ?? ""} onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="CAC Hymn Book" />
            </div>
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Category</label>
              <select value={editing.category ?? "Utility"} onChange={(e) => setEditing((p) => ({ ...p, category: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tagline</label>
            <input value={editing.tagline ?? ""} onChange={(e) => setEditing((p) => ({ ...p, tagline: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="Hymns and lyrics, offline, in your pocket." />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Description</label>
            <textarea rows={3} value={editing.description ?? ""} onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))}
              className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="A short description of what the app does…" />
          </div>

          {/* Store links */}
          <div className="space-y-3">
            <label className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Links</label>
            {([
              { key: "play_store_url", label: "Play Store", placeholder: "https://play.google.com/store/apps/details?id=…" },
              { key: "app_store_url",  label: "App Store",  placeholder: "https://apps.apple.com/app/…" },
              { key: "website_url",    label: "Website",    placeholder: "https://…" },
            ] as { key: keyof App; label: string; placeholder: string }[]).map(({ key, label, placeholder }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground w-20 shrink-0">{label}</span>
                <input value={(editing[key] as string) ?? ""} onChange={(e) => setEditing((p) => ({ ...p, [key]: e.target.value }))}
                  className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder={placeholder} />
              </div>
            ))}
          </div>

          {/* Sort + Toggles */}
          <div className="flex items-center gap-6">
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Sort Order</label>
              <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing((p) => ({ ...p, sort_order: Number(e.target.value) }))}
                className="w-24 rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
            </div>
            <label htmlFor="featured" className="flex items-center gap-2 cursor-pointer select-none mt-5">
              <Checkbox id="featured" checked={!!editing.featured} onCheckedChange={(checked) => setEditing((p) => ({ ...p, featured: checked === true }))} />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Featured</span>
            </label>
            <label htmlFor="published" className="flex items-center gap-2 cursor-pointer select-none mt-5">
              <Checkbox id="published" checked={!!editing.published} onCheckedChange={(checked) => setEditing((p) => ({ ...p, published: checked === true }))} />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Published</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Apps</h1>
          <p className="text-sm text-muted-foreground mt-1">{apps.length} apps · drag to reorder</p>
        </div>
        <button onClick={openNew} className="flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity">
          <Plus className="h-3.5 w-3.5" /> Add App
        </button>
      </div>

      {apps.length === 0 && (
        <div className="rounded-lg border border-dashed border-border py-20 text-center">
          <p className="text-muted-foreground text-sm">No apps yet.</p>
          <button onClick={openNew} className="mt-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground underline underline-offset-4">Add your first app</button>
        </div>
      )}

      <div className="space-y-2">
        {apps.map((a) => (
          <div key={a.id} className="flex items-center gap-4 rounded-lg border border-border px-5 py-4 bg-background hover:bg-muted/30 transition-colors">
            <GripVertical className="h-4 w-4 text-muted-foreground/30 shrink-0" />
            {a.icon_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.icon_image} alt="" className="h-10 w-10 rounded-xl object-cover shrink-0 border border-border" />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-muted shrink-0 flex items-center justify-center text-xs font-bold text-muted-foreground">
                {a.name?.[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {a.name}
                {a.featured && <span className="ml-2 text-[#0a291a]">★ Featured</span>}
              </p>
              <p className="text-[0.65rem] text-muted-foreground uppercase tracking-widest mt-0.5">{a.category}</p>
            </div>
            <span className={`text-[0.6rem] font-semibold uppercase tracking-[0.18em] rounded-lg px-2.5 py-1 border ${a.published ? "border-green-500 text-green-600" : "border-border text-muted-foreground"}`}>
              {a.published ? "Visible" : "Hidden"}
            </span>
            <RowActions
              actions={[
                { label: a.published ? "Hide" : "Show", icon: a.published ? EyeOff : Eye, onClick: () => togglePublish(a) },
                { label: "Edit", icon: Pencil, onClick: () => openEdit(a.id) },
                { label: "Delete", icon: Trash2, onClick: () => setConfirmDeleteId(a.id), disabled: deleting === a.id, destructive: true },
              ]}
            />
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!confirmDeleteId}
        title="Delete this app?"
        description="This action cannot be undone."
        confirmLabel="Yes, delete"
        destructive
        loading={!!deleting}
        onConfirm={() => confirmDeleteId && deleteApp(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
