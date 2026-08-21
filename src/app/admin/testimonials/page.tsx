"use client";

import { useEffect, useState, useRef } from "react";
import { PlusIcon as Plus, PencilIcon as Pencil, TrashIcon as Trash2, EyeIcon as Eye, EyeSlashIcon as EyeOff, ImageIcon as ImagePlus, XIcon as X, DotsSixVerticalIcon as GripVertical, UserIcon as User } from "@phosphor-icons/react";
import { ConfirmModal } from "@/components/confirm-modal";
import { Spinner } from "@/components/admin/spinner";
import { RowActions } from "@/components/admin/row-actions";
import { adminFetch } from "@/lib/admin-fetch";

interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_role: string;
  avatar: string;
  published: boolean;
  sort_order: number;
  created_at: string;
}

const EMPTY: Omit<Testimonial, "id" | "created_at"> = {
  quote: "", author_name: "", author_role: "", avatar: "",
  published: false, sort_order: 0,
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editing, setEditing]     = useState<Partial<Testimonial> | null>(null);
  const [isNew, setIsNew]         = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef              = useRef<HTMLInputElement>(null);

  async function load() {
    try {
      const res = await adminFetch("/api/admin/testimonials");
      if (!res.ok) return;
      const data = await res.json();
      setTestimonials(data.testimonials ?? []);
    } catch { /* ignore */ }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing({ ...EMPTY, sort_order: testimonials.length });
    setIsNew(true); setError("");
  }

  async function openEdit(id: string) {
    const res = await adminFetch(`/api/admin/testimonials/${id}`);
    const data = await res.json();
    setEditing(data.testimonial); setIsNew(false); setError("");
  }

  async function save(asDraft = false) {
    if (!editing) return;
    setSaving(true); setError("");
    const payload = asDraft ? { ...editing, published: false } : editing;
    const method = isNew ? "POST" : "PUT";
    const url    = isNew ? "/api/admin/testimonials" : `/api/admin/testimonials/${editing.id}`;
    const res = await adminFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Save failed"); setSaving(false); return; }
    await load(); setEditing(null); setSaving(false);
  }

  async function togglePublish(t: Testimonial) {
    await adminFetch(`/api/admin/testimonials/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !t.published }),
    });
    await load();
  }

  async function deleteTestimonial(id: string) {
    setDeleting(id); setConfirmDeleteId(null);
    await adminFetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    await load(); setDeleting(null);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    setError("");
    const form = new FormData(); form.append("file", file);
    const res = await adminFetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    if (res.ok) {
      setEditing((p) => ({ ...p, avatar: data.url }));
    } else {
      setError(data.error ?? "Upload failed");
    }
    setUploading(false); e.target.value = "";
  }

  if (editing) {
    return (
      <div className="max-w-xl">
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{isNew ? "New Testimonial" : "Edit Testimonial"}</h1>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setEditing(null)} className="flex-1 rounded-full border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:bg-muted transition-colors sm:flex-none">Cancel</button>
            <button onClick={() => save(true)} disabled={saving} className="flex-1 rounded-full border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:bg-muted transition-colors disabled:opacity-50 sm:flex-none">Save Draft</button>
            <button onClick={() => save(false)} disabled={saving} className="flex-1 rounded-full bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity disabled:opacity-50 sm:flex-none">
              {saving ? <Spinner size="sm" className="text-background" /> : isNew ? "Add Testimonial" : "Save Changes"}
            </button>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-red-500 rounded-lg border border-red-200 bg-red-50 px-4 py-3">{error}</p>}

        <div className="space-y-5">
          {/* Avatar */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Avatar</label>
            {editing.avatar ? (
              <div className="relative w-20 h-20 rounded-full bg-muted overflow-hidden mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={editing.avatar} alt="" className="w-full h-full object-cover" />
                <button onClick={() => setEditing((p) => ({ ...p, avatar: "" }))} className="absolute top-0.5 right-0.5 bg-background border border-border p-1 rounded-full hover:bg-muted">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="flex w-20 h-20 flex-col items-center justify-center gap-1 rounded-full border border-dashed border-border text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50">
                {uploading ? <span className="text-[0.6rem]">…</span> : <><User className="h-4 w-4" /><ImagePlus className="h-3 w-3" /></>}
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>

          {/* Quote */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Quote *</label>
            <textarea rows={5} value={editing.quote ?? ""} onChange={(e) => setEditing((p) => ({ ...p, quote: e.target.value }))}
              className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="I can assure you, you will not find a better designer…" />
          </div>

          {/* Name + Role */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Name *</label>
              <input value={editing.author_name ?? ""} onChange={(e) => setEditing((p) => ({ ...p, author_name: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="Jacob" />
            </div>
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Company / Role</label>
              <input value={editing.author_role ?? ""} onChange={(e) => setEditing((p) => ({ ...p, author_role: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="DAD Studio" />
            </div>
          </div>

          {/* Sort + Published */}
          <div className="flex items-center gap-6">
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Sort Order</label>
              <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing((p) => ({ ...p, sort_order: Number(e.target.value) }))}
                className="w-24 rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none mt-5">
              <input type="checkbox" checked={!!editing.published} onChange={(e) => setEditing((p) => ({ ...p, published: e.target.checked }))} className="h-4 w-4" />
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
          <h1 className="text-2xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-sm text-muted-foreground mt-1">{testimonials.length} testimonials · drag to reorder</p>
        </div>
        <button onClick={openNew} className="flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity">
          <Plus className="h-3.5 w-3.5" /> Add Testimonial
        </button>
      </div>

      {testimonials.length === 0 && (
        <div className="rounded-lg border border-dashed border-border py-20 text-center">
          <p className="text-muted-foreground text-sm">No testimonials yet.</p>
          <button onClick={openNew} className="mt-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground underline underline-offset-4">Add your first testimonial</button>
        </div>
      )}

      <div className="space-y-2">
        {testimonials.map((t) => (
          <div key={t.id} className="flex items-center gap-4 rounded-lg border border-border px-5 py-4 bg-background hover:bg-muted/30 transition-colors">
            <GripVertical className="h-4 w-4 text-muted-foreground/30 shrink-0" />
            {t.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.avatar} alt="" className="h-10 w-10 rounded-full object-cover shrink-0 border border-border" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-muted shrink-0 flex items-center justify-center text-muted-foreground">
                <User className="h-4 w-4" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{t.author_name}{t.author_role && `, ${t.author_role}`}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{t.quote}</p>
            </div>
            <span className={`rounded-lg text-[0.6rem] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 border shrink-0 ${t.published ? "border-green-500 text-green-600" : "border-border text-muted-foreground"}`}>
              {t.published ? "Visible" : "Hidden"}
            </span>
            <RowActions
              actions={[
                { label: t.published ? "Hide" : "Show", icon: t.published ? EyeOff : Eye, onClick: () => togglePublish(t) },
                { label: "Edit", icon: Pencil, onClick: () => openEdit(t.id) },
                { label: "Delete", icon: Trash2, onClick: () => setConfirmDeleteId(t.id), disabled: deleting === t.id, destructive: true },
              ]}
            />
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!confirmDeleteId}
        title="Remove this testimonial?"
        description="This action cannot be undone."
        confirmLabel="Yes, remove"
        destructive
        loading={!!deleting}
        onConfirm={() => confirmDeleteId && deleteTestimonial(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
