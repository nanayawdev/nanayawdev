"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, ImagePlus, X, GripVertical } from "lucide-react";
import { ConfirmModal } from "@/components/confirm-modal";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  initials: string;
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
  published: boolean;
  sort_order: number;
  created_at: string;
}

const EMPTY: Omit<TeamMember, "id" | "created_at"> = {
  name: "", role: "", bio: "", photo: "", initials: "",
  github: "", linkedin: "", twitter: "", website: "",
  published: false, sort_order: 0,
};

export default function AdminTeamPage() {
  const [members, setMembers]     = useState<TeamMember[]>([]);
  const [editing, setEditing]     = useState<Partial<TeamMember> | null>(null);
  const [isNew, setIsNew]         = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef              = useRef<HTMLInputElement>(null);

  function token() { return localStorage.getItem("admin_token") ?? ""; }

  async function load() {
    try {
      const res = await fetch("/api/admin/team", { headers: { Authorization: `Bearer ${token()}` } });
      if (!res.ok) return;
      const data = await res.json();
      setMembers(data.members ?? []);
    } catch { /* ignore */ }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing({ ...EMPTY, sort_order: members.length });
    setIsNew(true); setError("");
  }

  async function openEdit(id: string) {
    const res = await fetch(`/api/admin/team/${id}`, { headers: { Authorization: `Bearer ${token()}` } });
    const data = await res.json();
    setEditing(data.member); setIsNew(false); setError("");
  }

  async function save(asDraft = false) {
    if (!editing) return;
    setSaving(true); setError("");
    const payload = asDraft ? { ...editing, published: false } : editing;
    const method = isNew ? "POST" : "PUT";
    const url    = isNew ? "/api/admin/team" : `/api/admin/team/${editing.id}`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Save failed"); setSaving(false); return; }
    await load(); setEditing(null); setSaving(false);
  }

  async function togglePublish(m: TeamMember) {
    await fetch(`/api/admin/team/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ published: !m.published }),
    });
    await load();
  }

  async function deleteMember(id: string) {
    setDeleting(id); setConfirmDeleteId(null);
    await fetch(`/api/admin/team/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token()}` } });
    await load(); setDeleting(null);
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const form = new FormData(); form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", headers: { Authorization: `Bearer ${token()}` }, body: form });
    const data = await res.json();
    if (res.ok) setEditing((p) => ({ ...p, photo: data.url }));
    setUploading(false); e.target.value = "";
  }

  function autoInitials(name: string) {
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }

  if (editing) {
    return (
      <div className="max-w-xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight">{isNew ? "New Team Member" : "Edit Team Member"}</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => setEditing(null)} className="border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:bg-muted transition-colors">Cancel</button>
            <button onClick={() => save(true)} disabled={saving} className="border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:bg-muted transition-colors disabled:opacity-50">Save Draft</button>
            <button onClick={() => save(false)} disabled={saving} className="bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? "Saving…" : isNew ? "Add Member" : "Save Changes"}
            </button>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-red-500 border border-red-200 bg-red-50 px-4 py-3">{error}</p>}

        <div className="space-y-5">
          {/* Photo */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Photo</label>
            {editing.photo ? (
              <div className="relative w-32 h-32 bg-muted overflow-hidden mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={editing.photo} alt="" className="w-full h-full object-cover" />
                <button onClick={() => setEditing((p) => ({ ...p, photo: "" }))} className="absolute top-1 right-1 bg-background border border-border p-1 hover:bg-muted">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="flex w-32 h-32 items-center justify-center gap-2 border border-dashed border-border text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50 flex-col">
                <ImagePlus className="h-5 w-5" />
                {uploading ? "…" : "Photo"}
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </div>

          {/* Name + Role */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Name *</label>
              <input value={editing.name ?? ""}
                onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value, initials: p?.initials || autoInitials(e.target.value) }))}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="Kwame Asante" />
            </div>
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Initials</label>
              <input value={editing.initials ?? ""}
                onChange={(e) => setEditing((p) => ({ ...p, initials: e.target.value.toUpperCase().slice(0, 2) }))}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="KA" maxLength={2} />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Role *</label>
            <input value={editing.role ?? ""} onChange={(e) => setEditing((p) => ({ ...p, role: e.target.value }))}
              className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="Founder & Creative Director" />
          </div>

          {/* Bio */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Bio</label>
            <textarea rows={3} value={editing.bio ?? ""} onChange={(e) => setEditing((p) => ({ ...p, bio: e.target.value }))}
              className="w-full resize-none border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="Short bio…" />
          </div>

          {/* Social links */}
          <div className="space-y-3">
            <label className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Social Links</label>
            {([
              { key: "github",   placeholder: "https://github.com/username" },
              { key: "linkedin", placeholder: "https://linkedin.com/in/username" },
              { key: "twitter",  placeholder: "https://twitter.com/username" },
              { key: "website",  placeholder: "https://yoursite.com" },
            ] as { key: keyof TeamMember; placeholder: string }[]).map(({ key, placeholder }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground w-16 shrink-0">{key}</span>
                <input value={(editing[key] as string) ?? ""} onChange={(e) => setEditing((p) => ({ ...p, [key]: e.target.value }))}
                  className="flex-1 border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder={placeholder} />
              </div>
            ))}
          </div>

          {/* Sort + Published */}
          <div className="flex items-center gap-6">
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Sort Order</label>
              <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing((p) => ({ ...p, sort_order: Number(e.target.value) }))}
                className="w-24 border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-sm text-muted-foreground mt-1">{members.length} members · drag to reorder</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity">
          <Plus className="h-3.5 w-3.5" /> Add Member
        </button>
      </div>

      {members.length === 0 && (
        <div className="border border-dashed border-border py-20 text-center">
          <p className="text-muted-foreground text-sm">No team members yet.</p>
          <button onClick={openNew} className="mt-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground underline underline-offset-4">Add your first member</button>
        </div>
      )}

      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-4 border border-border px-5 py-4 bg-background hover:bg-muted/30 transition-colors">
            <GripVertical className="h-4 w-4 text-muted-foreground/30 shrink-0" />
            {m.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.photo} alt="" className="h-10 w-10 rounded-full object-cover shrink-0 border border-border" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-muted shrink-0 flex items-center justify-center text-xs font-bold text-muted-foreground">
                {m.initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{m.name}</p>
              <p className="text-[0.65rem] text-muted-foreground uppercase tracking-widest mt-0.5">{m.role}</p>
            </div>
            <span className={`text-[0.6rem] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 border ${m.published ? "border-green-500 text-green-600" : "border-border text-muted-foreground"}`}>
              {m.published ? "Visible" : "Hidden"}
            </span>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => togglePublish(m)} title={m.published ? "Hide" : "Show"} className="text-muted-foreground hover:text-foreground transition-colors">
                {m.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button onClick={() => openEdit(m.id)} title="Edit" className="text-muted-foreground hover:text-foreground transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => setConfirmDeleteId(m.id)} disabled={deleting === m.id} title="Delete" className="text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!confirmDeleteId}
        title="Remove this team member?"
        description="This action cannot be undone."
        confirmLabel="Yes, remove"
        destructive
        loading={!!deleting}
        onConfirm={() => confirmDeleteId && deleteMember(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
