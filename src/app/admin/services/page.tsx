"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, ImagePlus, X, GripVertical } from "lucide-react";
import { ConfirmModal } from "@/components/confirm-modal";
import { RichTextEditor } from "@/components/rich-text-editor";

interface Service {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  body: string;
  cover_image: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
}

const EMPTY: Omit<Service, "id" | "slug" | "created_at"> = {
  title: "", tagline: "", description: "", body: "",
  cover_image: "", tags: [], featured: false, published: false, sort_order: 0,
};

export default function AdminServicesPage() {
  const [services, setServices]   = useState<Service[]>([]);
  const [editing, setEditing]     = useState<Partial<Service> | null>(null);
  const [isNew, setIsNew]         = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput]   = useState("");
  const fileInputRef              = useRef<HTMLInputElement>(null);

  function token() { return localStorage.getItem("admin_token") ?? ""; }

  async function load() {
    try {
      const res = await fetch("/api/admin/services", { headers: { Authorization: `Bearer ${token()}` } });
      if (!res.ok) return;
      const data = await res.json();
      setServices(data.services ?? []);
    } catch { /* ignore */ }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing({ ...EMPTY, sort_order: services.length });
    setIsNew(true); setError(""); setTagInput("");
  }

  async function openEdit(id: string) {
    const res = await fetch(`/api/admin/services/${id}`, { headers: { Authorization: `Bearer ${token()}` } });
    const data = await res.json();
    setEditing(data.service); setIsNew(false); setError(""); setTagInput("");
  }

  async function save(asDraft = false) {
    if (!editing) return;
    setSaving(true); setError("");
    const payload = asDraft ? { ...editing, published: false } : editing;
    const method = isNew ? "POST" : "PUT";
    const url    = isNew ? "/api/admin/services" : `/api/admin/services/${editing.id}`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Save failed"); setSaving(false); return; }
    await load(); setEditing(null); setSaving(false);
  }

  async function togglePublish(s: Service) {
    await fetch(`/api/admin/services/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ published: !s.published }),
    });
    await load();
  }

  async function deleteService(id: string) {
    setDeleting(id); setConfirmDeleteId(null);
    await fetch(`/api/admin/services/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token()}` } });
    await load(); setDeleting(null);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    setError("");
    const form = new FormData(); form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", headers: { Authorization: `Bearer ${token()}` }, body: form });
    const data = await res.json();
    if (res.ok) {
      setEditing((p) => ({ ...p, cover_image: data.url }));
    } else {
      setError(data.error ?? "Upload failed");
    }
    setUploading(false); e.target.value = "";
  }

  function addTag() {
    const t = tagInput.trim(); if (!t) return;
    setEditing((p) => ({ ...p, tags: [...(p?.tags ?? []), t] }));
    setTagInput("");
  }

  if (editing) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight">{isNew ? "New Service" : "Edit Service"}</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => setEditing(null)} className="border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:bg-muted transition-colors">Cancel</button>
            <button onClick={() => save(true)} disabled={saving} className="border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:bg-muted transition-colors disabled:opacity-50">Save Draft</button>
            <button onClick={() => save(false)} disabled={saving} className="bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? "Saving…" : isNew ? "Create Service" : "Save Changes"}
            </button>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-red-500 border border-red-200 bg-red-50 px-4 py-3">{error}</p>}

        <div className="space-y-5">
          {/* Cover image */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Cover Image</label>
            {editing.cover_image ? (
              <div className="relative w-full aspect-[16/7] bg-muted overflow-hidden mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={editing.cover_image} alt="" className="w-full h-full object-cover" />
                <button onClick={() => setEditing((p) => ({ ...p, cover_image: "" }))} className="absolute top-2 right-2 bg-background border border-border p-1 hover:bg-muted">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="flex w-full items-center justify-center gap-2 border border-dashed border-border py-8 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50">
                <ImagePlus className="h-4 w-4" />{uploading ? "Uploading…" : "Upload Image"}
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Title *</label>
            <input value={editing.title ?? ""} onChange={(e) => setEditing((p) => ({ ...p, title: e.target.value }))}
              className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="Web Design & Development" />
          </div>

          {/* Tagline */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tagline</label>
            <input value={editing.tagline ?? ""} onChange={(e) => setEditing((p) => ({ ...p, tagline: e.target.value }))}
              className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="One-line hook shown on cards and hover states" />
          </div>

          {/* Short description */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Short Description</label>
            <textarea rows={3} value={editing.description ?? ""} onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))}
              className="w-full resize-none border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="2-3 sentences shown on the services list page" />
          </div>

          {/* Rich text body */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Detail Body</label>
            <RichTextEditor
              value={editing.body ?? ""}
              onChange={(val) => setEditing((p) => ({ ...p, body: val }))}
              onImageUpload={async (file) => {
                const form = new FormData(); form.append("file", file);
                const res = await fetch("/api/admin/upload", { method: "POST", headers: { Authorization: `Bearer ${token()}` }, body: form });
                const data = await res.json();
                return res.ok ? data.url : "";
              }}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tags</label>
            <div className="flex gap-2 mb-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                className="flex-1 border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="UX/UI Design… press Enter" />
              <button type="button" onClick={addTag} className="border border-border px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:bg-muted transition-colors">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(editing.tags ?? []).map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 bg-muted px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest">
                  {tag}<button onClick={() => setEditing((p) => ({ ...p, tags: (p?.tags ?? []).filter((t) => t !== tag) }))}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Sort order */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Sort Order</label>
            <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing((p) => ({ ...p, sort_order: Number(e.target.value) }))}
              className="w-32 border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            {[{ key: "featured", label: "Featured" }, { key: "published", label: "Published" }].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={!!editing[key as keyof typeof editing]}
                  onChange={(e) => setEditing((p) => ({ ...p, [key]: e.target.checked }))} className="h-4 w-4" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
              </label>
            ))}
          </div>
        </div>

      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-sm text-muted-foreground mt-1">{services.length} total · drag to reorder</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity">
          <Plus className="h-3.5 w-3.5" /> New Service
        </button>
      </div>

      {services.length === 0 && (
        <div className="border border-dashed border-border py-20 text-center">
          <p className="text-muted-foreground text-sm">No services yet.</p>
          <button onClick={openNew} className="mt-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground underline underline-offset-4">Add your first service</button>
        </div>
      )}

      <div className="space-y-2">
        {services.map((s) => (
          <div key={s.id} className="flex items-center gap-4 border border-border px-5 py-4 bg-background hover:bg-muted/30 transition-colors">
            <GripVertical className="h-4 w-4 text-muted-foreground/30 shrink-0" />
            {s.cover_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.cover_image} alt="" className="h-12 w-20 object-cover shrink-0 border border-border" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{s.title}</p>
              <p className="text-[0.65rem] text-muted-foreground mt-0.5 truncate">{s.tagline}</p>
            </div>
            <span className={`text-[0.6rem] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 border ${s.published ? "border-green-500 text-green-600" : "border-border text-muted-foreground"}`}>
              {s.published ? "Published" : "Draft"}
            </span>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => togglePublish(s)} title={s.published ? "Unpublish" : "Publish"} className="text-muted-foreground hover:text-foreground transition-colors">
                {s.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button onClick={() => openEdit(s.id)} title="Edit" className="text-muted-foreground hover:text-foreground transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => setConfirmDeleteId(s.id)} disabled={deleting === s.id} title="Delete" className="text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!confirmDeleteId}
        title="Delete this service?"
        description="This action cannot be undone. The service will be permanently removed."
        confirmLabel="Yes, delete"
        destructive
        loading={!!deleting}
        onConfirm={() => confirmDeleteId && deleteService(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
