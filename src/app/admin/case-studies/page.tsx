"use client";

import { useEffect, useState, useRef } from "react";
import { PlusIcon as Plus, PencilIcon as Pencil, TrashIcon as Trash2, EyeIcon as Eye, EyeSlashIcon as EyeOff, ImageIcon as ImagePlus, XIcon as X } from "@phosphor-icons/react";
import { ConfirmModal } from "@/components/confirm-modal";
import { Spinner } from "@/components/admin/spinner";
import { RowActions } from "@/components/admin/row-actions";
import { adminFetch } from "@/lib/admin-fetch";

interface Stat { label: string; value: string; }

interface CaseStudy {
  id: string;
  slug: string;
  client: string;
  category: string;
  year: string;
  tagline: string;
  cover_image: string;
  client_url: string;
  services: string[];
  stats: Stat[];
  problem: string;
  approach: string;
  result: string;
  result_headline: string;
  result_body: string;
  featured: boolean;
  published: boolean;
  created_at: string;
}

const EMPTY: Omit<CaseStudy, "id" | "slug" | "created_at"> = {
  client: "", category: "Web Development", year: String(new Date().getFullYear()),
  tagline: "", cover_image: "", client_url: "", services: [],
  stats: [{ label: "", value: "" }, { label: "", value: "" }, { label: "", value: "" }],
  problem: "", approach: "", result: "", result_headline: "", result_body: "",
  featured: false, published: false,
};

const CATEGORIES = ["Web Development", "Mobile App", "Brand Identity", "Web & Brand", "Web Platform", "Other"];

export default function AdminCaseStudiesPage() {
  const [studies, setStudies]       = useState<CaseStudy[]>([]);
  const [editing, setEditing]       = useState<Partial<CaseStudy> | null>(null);
  const [isNew, setIsNew]           = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");
  const [deleting, setDeleting]     = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [uploading, setUploading]   = useState(false);
  const [serviceInput, setServiceInput] = useState("");
  const fileInputRef                = useRef<HTMLInputElement>(null);

  async function load() {
    try {
      const res = await adminFetch("/api/admin/case-studies");
      if (!res.ok) return;
      const data = await res.json();
      setStudies(data.case_studies ?? []);
    } catch { /* ignore */ }
  }

  useEffect(() => { load(); }, []);

  function openNew() { setEditing({ ...EMPTY, stats: EMPTY.stats.map((s) => ({ ...s })) }); setIsNew(true); setError(""); setServiceInput(""); }

  async function openEdit(id: string) {
    const res = await adminFetch(`/api/admin/case-studies/${id}`);
    const data = await res.json();
    const cs = data.case_study;
    if (typeof cs.stats === "string") cs.stats = JSON.parse(cs.stats);
    setEditing(cs); setIsNew(false); setError(""); setServiceInput("");
  }

  async function save(asDraft = false) {
    if (!editing) return;
    setSaving(true); setError("");
    const payload = asDraft ? { ...editing, published: false } : editing;
    const method = isNew ? "POST" : "PUT";
    const url    = isNew ? "/api/admin/case-studies" : `/api/admin/case-studies/${editing.id}`;
    const res = await adminFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Save failed"); setSaving(false); return; }
    await load(); setEditing(null); setSaving(false);
  }

  async function togglePublish(cs: CaseStudy) {
    await adminFetch(`/api/admin/case-studies/${cs.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !cs.published }),
    });
    await load();
  }

  async function deleteStudy(id: string) {
    setDeleting(id); setConfirmDeleteId(null);
    await adminFetch(`/api/admin/case-studies/${id}`, { method: "DELETE" });
    await load(); setDeleting(null);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    setError("");
    const form = new FormData(); form.append("file", file);
    const res = await adminFetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    if (res.ok) {
      setEditing((p) => ({ ...p, cover_image: data.url }));
    } else {
      setError(data.error ?? "Upload failed");
    }
    setUploading(false); e.target.value = "";
  }

  function addService() {
    const s = serviceInput.trim(); if (!s) return;
    setEditing((p) => ({ ...p, services: [...(p?.services ?? []), s] }));
    setServiceInput("");
  }

  function updateStat(i: number, field: keyof Stat, val: string) {
    setEditing((p) => {
      const stats = [...(p?.stats ?? [])];
      stats[i] = { ...stats[i], [field]: val };
      return { ...p, stats };
    });
  }

  if (editing) {
    const stats = editing.stats ?? [{ label: "", value: "" }, { label: "", value: "" }, { label: "", value: "" }];
    return (
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight">{isNew ? "New Case Study" : "Edit Case Study"}</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => setEditing(null)} className="border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:bg-muted transition-colors">Cancel</button>
            <button onClick={() => save(true)} disabled={saving} className="border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:bg-muted transition-colors disabled:opacity-50">Save Draft</button>
            <button onClick={() => save(false)} disabled={saving} className="bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? <Spinner size="sm" className="text-background" /> : isNew ? "Create Case Study" : "Save Changes"}
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

          {/* Client + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Client Name *</label>
              <input value={editing.client ?? ""} onChange={(e) => setEditing((p) => ({ ...p, client: e.target.value }))}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground" placeholder="Thomisia Travel" />
            </div>
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Category</label>
              <select value={editing.category ?? "Web Development"} onChange={(e) => setEditing((p) => ({ ...p, category: e.target.value }))}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Year + Client URL */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Year</label>
              <input value={editing.year ?? ""} onChange={(e) => setEditing((p) => ({ ...p, year: e.target.value }))}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground" placeholder="2024" />
            </div>
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Live URL</label>
              <input value={editing.client_url ?? ""} onChange={(e) => setEditing((p) => ({ ...p, client_url: e.target.value }))}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground" placeholder="https://..." />
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tagline</label>
            <input value={editing.tagline ?? ""} onChange={(e) => setEditing((p) => ({ ...p, tagline: e.target.value }))}
              className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="Bringing African travel booking into the digital age." />
          </div>

          {/* Services */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Services</label>
            <div className="flex gap-2 mb-2">
              <input value={serviceInput} onChange={(e) => setServiceInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addService(); } }}
                className="flex-1 border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="UX/UI Design… press Enter" />
              <button type="button" onClick={addService} className="border border-border px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:bg-muted transition-colors">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(editing.services ?? []).map((s) => (
                <span key={s} className="flex items-center gap-1.5 bg-muted px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest">
                  {s}<button onClick={() => setEditing((p) => ({ ...p, services: (p?.services ?? []).filter((x) => x !== s) }))}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Stats — 3 rows */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Stats (up to 3)</label>
            <div className="space-y-2">
              {stats.slice(0, 3).map((stat, i) => (
                <div key={i} className="grid grid-cols-2 gap-3">
                  <input value={stat.value} onChange={(e) => updateStat(i, "value", e.target.value)}
                    className="border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground" placeholder={`Value ${i + 1} — e.g. 3×`} />
                  <input value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)}
                    className="border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground" placeholder={`Label ${i + 1} — e.g. Increase in bookings`} />
                </div>
              ))}
            </div>
          </div>

          {/* Narrative fields */}
          {([
            { key: "problem",         label: "The Problem" },
            { key: "approach",        label: "My Approach" },
            { key: "result",          label: "Results (short)" },
            { key: "result_headline", label: "Result Headline" },
            { key: "result_body",     label: "Result Body" },
          ] as { key: keyof CaseStudy; label: string }[]).map(({ key, label }) => (
            <div key={key}>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</label>
              <textarea rows={key === "result_headline" ? 2 : 4}
                value={(editing[key] as string) ?? ""}
                onChange={(e) => setEditing((p) => ({ ...p, [key]: e.target.value }))}
                className="w-full resize-none border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
          ))}

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
          <h1 className="text-2xl font-bold tracking-tight">Case Studies</h1>
          <p className="text-sm text-muted-foreground mt-1">{studies.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity">
          <Plus className="h-3.5 w-3.5" /> New Case Study
        </button>
      </div>

      {studies.length === 0 && (
        <div className="border border-dashed border-border py-20 text-center">
          <p className="text-muted-foreground text-sm">No case studies yet.</p>
          <button onClick={openNew} className="mt-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground underline underline-offset-4">Add your first case study</button>
        </div>
      )}

      <div className="space-y-2">
        {studies.map((cs) => (
          <div key={cs.id} className="flex items-center gap-4 border border-border px-5 py-4 bg-background hover:bg-muted/30 transition-colors">
            {cs.cover_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cs.cover_image} alt="" className="h-12 w-20 object-cover shrink-0 border border-border" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{cs.client}</p>
              <p className="text-[0.65rem] text-muted-foreground uppercase tracking-widest mt-0.5">
                {cs.category} · {cs.year ?? "—"}
                {cs.featured && <span className="ml-2 text-[#0a291a]">Featured</span>}
              </p>
            </div>
            <span className={`text-[0.6rem] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 border ${cs.published ? "border-green-500 text-green-600" : "border-border text-muted-foreground"}`}>
              {cs.published ? "Published" : "Draft"}
            </span>
            <RowActions
              actions={[
                { label: cs.published ? "Unpublish" : "Publish", icon: cs.published ? EyeOff : Eye, onClick: () => togglePublish(cs) },
                { label: "Edit", icon: Pencil, onClick: () => openEdit(cs.id) },
                { label: "Delete", icon: Trash2, onClick: () => setConfirmDeleteId(cs.id), disabled: deleting === cs.id, destructive: true },
              ]}
            />
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!confirmDeleteId}
        title="Delete this case study?"
        description="This action cannot be undone. The case study will be permanently removed."
        confirmLabel="Yes, delete"
        destructive
        loading={!!deleting}
        onConfirm={() => confirmDeleteId && deleteStudy(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
