"use client";

import { useEffect, useState, useRef } from "react";
import { PlusIcon as Plus, PencilIcon as Pencil, TrashIcon as Trash2, EyeIcon as Eye, EyeSlashIcon as EyeOff, ImageIcon as ImagePlus, FilePlusIcon as FilePlus, XIcon as X, FileIcon as FileIcon } from "@phosphor-icons/react";
import { ConfirmModal } from "@/components/confirm-modal";
import { Spinner } from "@/components/admin/spinner";
import { RowActions } from "@/components/admin/row-actions";
import { adminFetch } from "@/lib/admin-fetch";

interface ComponentFile {
  name: string;
  url: string;
  size: number;
}

interface ComponentResource {
  id: string;
  slug: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  cover_image: string;
  files: ComponentFile[];
  featured: boolean;
  published: boolean;
  author: string;
  published_at: string | null;
  created_at: string;
}

const EMPTY: Omit<ComponentResource, "id" | "slug" | "published_at" | "created_at"> = {
  title: "", description: "", prompt: "", category: "General",
  cover_image: "", files: [], featured: false, published: false, author: "nanayawdev",
};

const CATEGORIES = ["General", "Navigation", "Forms", "Cards", "Buttons", "Layout", "Modals", "Hero Sections", "Data Display"];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminComponentsPage() {
  const [items, setItems]           = useState<ComponentResource[]>([]);
  const [editing, setEditing]       = useState<Partial<ComponentResource> | null>(null);
  const [isNew, setIsNew]           = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");
  const [deleting, setDeleting]     = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const coverInputRef               = useRef<HTMLInputElement>(null);
  const filesInputRef               = useRef<HTMLInputElement>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function load() {
    const res = await adminFetch("/api/admin/components");
    const data = await res.json();
    setItems(data.components ?? []);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing({ ...EMPTY });
    setIsNew(true);
    setError("");
  }

  async function openEdit(id: string) {
    const res = await adminFetch(`/api/admin/components/${id}`);
    const data = await res.json();
    setEditing(data.component);
    setIsNew(false);
    setError("");
  }

  async function save() {
    if (!editing) return;
    setSaving(true); setError("");
    try {
      const url    = isNew ? "/api/admin/components" : `/api/admin/components/${editing.id}`;
      const method = isNew ? "POST" : "PATCH";
      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Save failed"); return; }
      await load();
      setEditing(null);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(item: ComponentResource) {
    await adminFetch(`/api/admin/components/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !item.published }),
    });
    await load();
  }

  async function deleteItem(id: string) {
    setDeleting(id);
    setConfirmDeleteId(null);
    await adminFetch(`/api/admin/components/${id}`, { method: "DELETE" });
    await load();
    setDeleting(null);
  }

  async function uploadOne(file: File) {
    const form = new FormData();
    form.append("file", file);
    const res = await adminFetch("/api/admin/components/upload", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Upload failed");
    return data as { url: string; name: string; size: number };
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true); setUploadError("");
    try {
      const { url } = await uploadOne(file);
      setEditing((p) => ({ ...p, cover_image: url }));
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  }

  async function handleFilesUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = Array.from(e.target.files ?? []);
    if (fileList.length === 0) return;
    setUploadingFiles(true); setUploadError("");
    try {
      const uploaded: ComponentFile[] = [];
      for (const file of fileList) {
        const { url, name, size } = await uploadOne(file);
        uploaded.push({ name, url, size });
      }
      setEditing((p) => ({ ...p, files: [...(p?.files ?? []), ...uploaded] }));
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploadingFiles(false);
      if (filesInputRef.current) filesInputRef.current.value = "";
    }
  }

  function removeFile(index: number) {
    setEditing((p) => ({ ...p, files: (p?.files ?? []).filter((_, i) => i !== index) }));
  }

  // ── Editor panel ──────────────────────────────────────────
  if (editing !== null) {
    return (
      <div className="max-w-3xl">
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">
              {isNew ? "New Component" : "Edit Component"}
            </p>
            <h1 className="text-2xl font-bold text-foreground truncate">
              {isNew ? "Share a new component" : editing.title}
            </h1>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setEditing(null)}
              className="flex-1 rounded-full border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground hover:bg-muted transition-colors sm:flex-none"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 rounded-full bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity disabled:opacity-50 sm:flex-none"
            >
              {saving ? <Spinner size="sm" className="text-background" /> : "Save Component"}
            </button>
          </div>
        </div>

        {error && (
          <p className="mb-6 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-red-500">{error}</p>
        )}

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Title</label>
            <input
              type="text"
              value={editing.title ?? ""}
              onChange={(e) => setEditing((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="e.g. Animated Pricing Cards"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Description</label>
            <textarea
              rows={3}
              value={editing.description ?? ""}
              onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))}
              className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="Short summary shown in cards…"
            />
          </div>

          {/* Prompt */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Prompt
            </label>
            <textarea
              rows={10}
              value={editing.prompt ?? ""}
              onChange={(e) => setEditing((p) => ({ ...p, prompt: e.target.value }))}
              className="w-full resize-y rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-xs leading-relaxed text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="The exact prompt you used to build this component…"
            />
          </div>

          {/* Row, category + author */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Category</label>
              <select
                value={editing.category ?? "General"}
                onChange={(e) => setEditing((p) => ({ ...p, category: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Author</label>
              <input
                type="text"
                value={editing.author ?? ""}
                onChange={(e) => setEditing((p) => ({ ...p, author: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
          </div>

          {/* Cover image upload */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Cover Image</label>

            {editing.cover_image ? (
              <div className="relative mb-3 rounded-lg border border-border overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editing.cover_image}
                  alt="Cover preview"
                  className="h-48 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setEditing((p) => ({ ...p, cover_image: "" }))}
                  className="absolute top-2 right-2 rounded-full bg-background border border-border p-1 text-muted-foreground hover:text-foreground transition-colors"
                  title="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => coverInputRef.current?.click()}
                className="mb-3 flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
              >
                <ImagePlus className="h-6 w-6" />
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em]">
                  {uploadingCover ? "Uploading…" : "Click to upload"}
                </p>
                <p className="text-[0.55rem] uppercase tracking-widest">JPEG, PNG, WebP, GIF, SVG, max 4 MB</p>
              </div>
            )}

            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleCoverUpload}
            />
          </div>

          {/* Component files upload */}
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Component Files</label>

            {(editing.files ?? []).length > 0 && (
              <div className="mb-3 divide-y divide-border rounded-lg border border-border overflow-hidden">
                {(editing.files ?? []).map((f, i) => (
                  <div key={`${f.url}-${i}`} className="flex items-center justify-between gap-3 px-4 py-2.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate text-sm text-foreground">{f.name}</span>
                      <span className="shrink-0 text-[0.6rem] uppercase tracking-widest text-muted-foreground">{formatSize(f.size)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="shrink-0 text-muted-foreground hover:text-red-500 transition-colors"
                      title="Remove file"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              onClick={() => filesInputRef.current?.click()}
              className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
            >
              <FilePlus className="h-5 w-5" />
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em]">
                {uploadingFiles ? "Uploading…" : "Add file(s)"}
              </p>
              <p className="text-[0.55rem] uppercase tracking-widest">Code, zip, assets, max 4 MB each</p>
            </div>

            <input
              ref={filesInputRef}
              type="file"
              multiple
              accept=".tsx,.ts,.jsx,.js,.css,.scss,.json,.md,.txt,.html,.zip,.svg,.png,.jpg,.jpeg,.webp,.gif"
              className="hidden"
              onChange={handleFilesUpload}
            />

            {uploadError && (
              <p className="mt-1 text-[0.6rem] uppercase tracking-widest text-red-500">{uploadError}</p>
            )}
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.featured ?? false}
                onChange={(e) => setEditing((p) => ({ ...p, featured: e.target.checked }))}
                className="h-4 w-4 accent-foreground"
              />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground">Featured</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.published ?? false}
                onChange={(e) => setEditing((p) => ({ ...p, published: e.target.checked }))}
                className="h-4 w-4 accent-foreground"
              />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground">Publish Now</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // ── List ─────────────────────────────────────────────
  return (
    <div>
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">Content</p>
          <h1 className="text-3xl font-bold text-foreground">Components</h1>
        </div>
        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity"
        >
          <Plus className="h-3.5 w-3.5" />
          New Component
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-8">
        <div className="rounded-lg border border-border px-5 py-3">
          <p className="text-xl font-bold text-foreground">{items.length}</p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mt-0.5">Total</p>
        </div>
        <div className="rounded-lg border border-border px-5 py-3">
          <p className="text-xl font-bold text-foreground">{items.filter((c) => c.published).length}</p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mt-0.5">Published</p>
        </div>
        <div className="rounded-lg border border-border px-5 py-3">
          <p className="text-xl font-bold text-foreground">{items.filter((c) => !c.published).length}</p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mt-0.5">Drafts</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_100px_100px] border-b border-border px-5 py-3 bg-muted/20">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Title</p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Category</p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Status</p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Actions</p>
        </div>

        {items.length === 0 && (
          <p className="px-5 py-10 text-sm text-muted-foreground text-center">No components yet. Share your first one.</p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[1fr_120px_100px_100px] items-center border-b border-border px-5 py-4 last:border-0"
          >
            <div>
              <p className="text-sm font-semibold text-foreground leading-snug">{item.title}</p>
              <p className="text-[0.6rem] text-muted-foreground mt-0.5">
                {new Date(item.created_at).toLocaleDateString()} · {item.author} · {item.files?.length ?? 0} file{item.files?.length === 1 ? "" : "s"}
                {item.featured && <span className="ml-2 text-[#0a291a]">★ Featured</span>}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">{item.category}</p>
            <span
              className={`justify-self-start rounded-lg px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-wider ${
                item.published ? "bg-foreground text-background" : "border border-border text-muted-foreground"
              }`}
            >
              {item.published ? "Live" : "Draft"}
            </span>
            <RowActions
              actions={[
                { label: item.published ? "Unpublish" : "Publish", icon: item.published ? EyeOff : Eye, onClick: () => togglePublish(item) },
                { label: "Edit", icon: Pencil, onClick: () => openEdit(item.id) },
                { label: "Delete", icon: Trash2, onClick: () => setConfirmDeleteId(item.id), disabled: deleting === item.id, destructive: true },
              ]}
            />
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!confirmDeleteId}
        title="Delete this component?"
        description="This action cannot be undone. The component and its files will be permanently removed from the listing."
        confirmLabel="Yes, delete"
        destructive
        loading={!!deleting}
        onConfirm={() => confirmDeleteId && deleteItem(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
