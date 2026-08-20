"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, ImagePlus, X } from "lucide-react";
import { RichTextEditor } from "@/components/rich-text-editor";
import { ConfirmModal } from "@/components/confirm-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/admin/spinner";
import { adminFetch } from "@/lib/admin-fetch";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  cover_image: string;
  featured: boolean;
  published: boolean;
  author: string;
  published_at: string | null;
  created_at: string;
}

const EMPTY: Omit<Post, "id" | "slug" | "published_at" | "created_at"> = {
  title: "", excerpt: "", body: "", category: "Software Engineering", tags: [],
  cover_image: "", featured: false, published: false, author: "nanayawdev",
};

const CATEGORIES = [
  "Software Engineering",
  "System Design",
  "Product Engineering",
  "Web Development",
  "Fintech & Payments",
  "African Tech",
  "AI & Technology",
  "UX & Product Design",
];

export default function AdminBlogPage() {
  const [posts, setPosts]           = useState<Post[]>([]);
  const [editing, setEditing]       = useState<Partial<Post> | null>(null);
  const [tagsInput, setTagsInput]   = useState("");
  const [isNew, setIsNew]           = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");
  const [deleting, setDeleting]     = useState<string | null>(null);
  const [uploading, setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef                = useRef<HTMLInputElement>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function load() {
    const res = await adminFetch("/api/admin/blog");
    const data = await res.json();
    setPosts(data.posts ?? []);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing({ ...EMPTY });
    setTagsInput("");
    setIsNew(true);
    setError("");
  }

  async function openEdit(id: string) {
    const res = await adminFetch(`/api/admin/blog/${id}`);
    const data = await res.json();
    setEditing(data.post);
    setTagsInput((data.post.tags ?? []).join(", "));
    setIsNew(false);
    setError("");
  }

  async function save() {
    if (!editing) return;
    setSaving(true); setError("");
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const url    = isNew ? "/api/admin/blog" : `/api/admin/blog/${editing.id}`;
      const method = isNew ? "POST" : "PATCH";
      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editing, tags }),
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

  async function togglePublish(post: Post) {
    await adminFetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
    await load();
  }

  async function deletePost(id: string) {
    setDeleting(id);
    setConfirmDeleteId(null);
    await adminFetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    await load();
    setDeleting(null);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await adminFetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setEditing((p) => ({ ...p, cover_image: data.url }));
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // ── Editor panel ──────────────────────────────────────────
  if (editing !== null) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">
              {isNew ? "New Post" : "Edit Post"}
            </p>
            <h1 className="text-2xl font-bold text-foreground truncate">
              {isNew ? "Write a new article" : editing.title}
            </h1>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setEditing(null)}
              className="flex-1 border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground hover:bg-muted transition-colors sm:flex-none"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity disabled:opacity-50 sm:flex-none"
            >
              {saving ? <Spinner size="sm" className="text-background" /> : "Save Post"}
            </button>
          </div>
        </div>

        {error && (
          <p className="mb-6 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-red-500">{error}</p>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main — title, excerpt, body */}
          <div className="min-w-0 space-y-6">
            {/* Title */}
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Title</label>
              <input
                type="text"
                value={editing.title ?? ""}
                onChange={(e) => setEditing((p) => ({ ...p, title: e.target.value }))}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="Post title"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Excerpt</label>
              <textarea
                rows={3}
                value={editing.excerpt ?? ""}
                onChange={(e) => setEditing((p) => ({ ...p, excerpt: e.target.value }))}
                className="w-full resize-none border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="Short summary shown in cards…"
              />
            </div>

            {/* Body */}
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Body
              </label>
              <RichTextEditor
                value={editing.body ?? ""}
                onChange={(html) => setEditing((p) => ({ ...p, body: html }))}
                articleTitle={editing.title}
                articleCategory={editing.category}
                onImageUpload={async (file) => {
                  const form = new FormData();
                  form.append("file", file);
                  const res = await adminFetch("/api/admin/upload", { method: "POST", body: form });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error ?? "Upload failed");
                  return data.url;
                }}
              />
            </div>
          </div>

          {/* Sidebar — category, author, tags, cover image, toggles */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Category</label>
              <Select
                value={editing.category ?? "Software Engineering"}
                onValueChange={(value) => setEditing((p) => ({ ...p, category: value }))}
              >
                <SelectTrigger className="w-full rounded-none border-border px-4 py-2.5 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Author</label>
              <input
                type="text"
                value={editing.author ?? ""}
                onChange={(e) => setEditing((p) => ({ ...p, author: e.target.value }))}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Tags <span className="normal-case font-normal text-muted-foreground/70">(comma-separated, for SEO)</span>
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="e.g. nextjs, postgres, multi-tenancy"
              />
            </div>

            {/* Cover image upload */}
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Cover Image</label>

              {/* Preview */}
              {editing.cover_image ? (
                <div className="relative mb-3 border border-border overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editing.cover_image}
                    alt="Cover preview"
                    className="h-40 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setEditing((p) => ({ ...p, cover_image: "" }))}
                    className="absolute top-2 right-2 bg-background border border-border p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-3 flex h-32 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-border bg-muted/20 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                >
                  <ImagePlus className="h-6 w-6" />
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em]">
                    {uploading ? "Uploading…" : "Click to upload"}
                  </p>
                  <p className="text-[0.55rem] uppercase tracking-widest">JPEG, PNG, WebP, GIF — max 4 MB</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleImageUpload}
              />

              {uploadError && (
                <p className="mt-1 text-[0.6rem] uppercase tracking-widest text-red-500">{uploadError}</p>
              )}

              {/* Also allow pasting a URL directly */}
              {!editing.cover_image && (
                <input
                  type="text"
                  value=""
                  onChange={(e) => { if (e.target.value) setEditing((p) => ({ ...p, cover_image: e.target.value })); }}
                  className="w-full border border-border bg-background px-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                  placeholder="…or paste an image URL"
                />
              )}
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox
                  checked={editing.featured ?? false}
                  onCheckedChange={(checked) => setEditing((p) => ({ ...p, featured: checked === true }))}
                />
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground">Featured Post</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox
                  checked={editing.published ?? false}
                  onCheckedChange={(checked) => setEditing((p) => ({ ...p, published: checked === true }))}
                />
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground">Publish Now</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Post list ─────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">Content</p>
          <h1 className="text-3xl font-bold text-foreground">Blog Posts</h1>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity"
        >
          <Plus className="h-3.5 w-3.5" />
          New Post
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-8">
        <div className="border border-border px-5 py-3">
          <p className="text-xl font-bold text-foreground">{posts.length}</p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mt-0.5">Total</p>
        </div>
        <div className="border border-border px-5 py-3">
          <p className="text-xl font-bold text-foreground">{posts.filter((p) => p.published).length}</p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mt-0.5">Published</p>
        </div>
        <div className="border border-border px-5 py-3">
          <p className="text-xl font-bold text-foreground">{posts.filter((p) => !p.published).length}</p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mt-0.5">Drafts</p>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border">
        <div className="grid grid-cols-[1fr_120px_100px_100px] border-b border-border px-5 py-3 bg-muted/20">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Title</p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Category</p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Status</p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Actions</p>
        </div>

        {posts.length === 0 && (
          <p className="px-5 py-10 text-sm text-muted-foreground text-center">No posts yet. Write your first one.</p>
        )}

        {posts.map((post) => (
          <div
            key={post.id}
            className="grid grid-cols-[1fr_120px_100px_100px] items-center border-b border-border px-5 py-4 last:border-0"
          >
            <div>
              <p className="text-sm font-semibold text-foreground leading-snug">{post.title}</p>
              <p className="text-[0.6rem] text-muted-foreground mt-0.5">
                {new Date(post.created_at).toLocaleDateString()} · {post.author}
                {post.featured && <span className="ml-2 text-[#0a291a]">★ Featured</span>}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">{post.category}</p>
            <span
              className={`justify-self-start px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-wider ${
                post.published ? "bg-foreground text-background" : "border border-border text-muted-foreground"
              }`}
            >
              {post.published ? "Live" : "Draft"}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => togglePublish(post)}
                title={post.published ? "Unpublish" : "Publish"}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={() => openEdit(post.id)}
                title="Edit"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => setConfirmDeleteId(post.id)}
                disabled={deleting === post.id}
                title="Delete"
                className="text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!confirmDeleteId}
        title="Delete this post?"
        description="This action cannot be undone. The post will be permanently removed."
        confirmLabel="Yes, delete"
        destructive
        loading={!!deleting}
        onConfirm={() => confirmDeleteId && deletePost(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
