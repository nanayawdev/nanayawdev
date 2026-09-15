"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { PlusIcon as Plus, PencilIcon as Pencil, TrashIcon as Trash2, EyeIcon as Eye, EyeSlashIcon as EyeOff, ImageIcon as ImagePlus, XIcon as X, UsersIcon as Users, FirstAidKitIcon as FirstAid } from "@phosphor-icons/react";
import { ConfirmModal } from "@/components/confirm-modal";
import { Spinner } from "@/components/admin/spinner";
import { RowActions } from "@/components/admin/row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { adminFetch } from "@/lib/admin-fetch";

interface TicketType { id?: string; name: string; price: number | string; min_quantity: number }
interface ScheduleItem { id?: string; day_label: string; time_label: string; title: string }

interface EventItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image: string;
  starts_at: string;
  ends_at: string | null;
  venue: string;
  city: string;
  is_virtual: boolean;
  virtual_link: string;
  price_amount: string;
  price_currency: string;
  capacity: number | null;
  featured: boolean;
  published: boolean;
  is_ussd_active: boolean;
  map_link: string;
  organizer_phone: string;
  organizer_whatsapp: string;
  organizer_email: string;
  toilet_info: string;
  first_aid_info: string;
  emergency_exit_info: string;
  ticket_types: TicketType[];
  schedule: ScheduleItem[];
  registrations?: number;
  created_at: string;
}

const EMPTY: Omit<EventItem, "id" | "slug" | "created_at" | "registrations"> = {
  title: "", description: "", cover_image: "",
  starts_at: "", ends_at: null, venue: "", city: "Accra",
  is_virtual: false, virtual_link: "",
  price_amount: "0", price_currency: "GHS", capacity: null,
  featured: false, published: false, is_ussd_active: false,
  map_link: "", organizer_phone: "", organizer_whatsapp: "", organizer_email: "",
  toilet_info: "", first_aid_info: "", emergency_exit_info: "",
  ticket_types: [], schedule: [],
};

/** <input type="datetime-local"> needs "YYYY-MM-DDTHH:mm" with no timezone suffix. */
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const fieldLabel = "mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground";
const fieldInput = "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground";

export default function AdminEventsPage() {
  const [events, setEvents]       = useState<EventItem[]>([]);
  const [editing, setEditing]     = useState<Partial<EventItem> | null>(null);
  const [isNew, setIsNew]         = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef              = useRef<HTMLInputElement>(null);

  async function load() {
    try {
      const res = await adminFetch("/api/admin/events");
      if (!res.ok) return;
      const data = await res.json();
      setEvents(data.events ?? []);
    } catch { /* ignore */ }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing({ ...EMPTY, ticket_types: [{ name: "Regular", price: 0, min_quantity: 1 }] });
    setIsNew(true);
    setError("");
  }

  async function openEdit(id: string) {
    const res = await adminFetch(`/api/admin/events/${id}`);
    const data = await res.json();
    setEditing({ ...data.event, starts_at: toLocalInput(data.event.starts_at), ends_at: toLocalInput(data.event.ends_at) });
    setIsNew(false);
    setError("");
  }

  async function save(asDraft = false) {
    if (!editing) return;
    if (!editing.title || !editing.starts_at) { setError("Title and start date/time are required"); return; }
    setSaving(true); setError("");
    const payload = {
      ...editing,
      published: asDraft ? false : editing.published,
      starts_at: new Date(editing.starts_at as string).toISOString(),
      ends_at: editing.ends_at ? new Date(editing.ends_at as string).toISOString() : null,
      capacity: editing.capacity ? Number(editing.capacity) : null,
      price_amount: Number(editing.price_amount ?? 0),
      ticket_types: (editing.ticket_types ?? []).filter((t) => t.name.trim()).map((t) => ({ ...t, price: Number(t.price) || 0 })),
      schedule: (editing.schedule ?? []).filter((s) => s.title.trim()),
    };
    const method = isNew ? "POST" : "PUT";
    const url    = isNew ? "/api/admin/events" : `/api/admin/events/${editing.id}`;
    const res = await adminFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Save failed"); setSaving(false); return; }
    await load();
    setEditing(null);
    setSaving(false);
  }

  async function togglePublish(e: EventItem) {
    await adminFetch(`/api/admin/events/${e.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !e.published }),
    });
    await load();
  }

  async function toggleUssdActive(e: EventItem) {
    await adminFetch(`/api/admin/events/${e.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_ussd_active: !e.is_ussd_active }),
    });
    await load();
  }

  async function deleteEvent(id: string) {
    setDeleting(id); setConfirmDeleteId(null);
    await adminFetch(`/api/admin/events/${id}`, { method: "DELETE" });
    await load();
    setDeleting(null);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    const res = await adminFetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    if (res.ok) {
      setEditing((p) => ({ ...p, cover_image: data.url }));
    } else {
      setError(data.error ?? "Upload failed");
    }
    setUploading(false);
    e.target.value = "";
  }

  function updateTicketType(i: number, patch: Partial<TicketType>) {
    setEditing((p) => {
      const types = [...(p?.ticket_types ?? [])];
      types[i] = { ...types[i], ...patch };
      return { ...p, ticket_types: types };
    });
  }
  function addTicketType() {
    setEditing((p) => ({ ...p, ticket_types: [...(p?.ticket_types ?? []), { name: "", price: 0, min_quantity: 1 }] }));
  }
  function removeTicketType(i: number) {
    setEditing((p) => ({ ...p, ticket_types: (p?.ticket_types ?? []).filter((_, idx) => idx !== i) }));
  }

  function updateScheduleItem(i: number, patch: Partial<ScheduleItem>) {
    setEditing((p) => {
      const items = [...(p?.schedule ?? [])];
      items[i] = { ...items[i], ...patch };
      return { ...p, schedule: items };
    });
  }
  function addScheduleItem() {
    setEditing((p) => ({ ...p, schedule: [...(p?.schedule ?? []), { day_label: "Day 1", time_label: "", title: "" }] }));
  }
  function removeScheduleItem(i: number) {
    setEditing((p) => ({ ...p, schedule: (p?.schedule ?? []).filter((_, idx) => idx !== i) }));
  }

  if (editing) {
    return (
      <div className="max-w-2xl">
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{isNew ? "New Event" : "Edit Event"}</h1>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setEditing(null)} className="flex-1 rounded-full border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:bg-muted transition-colors sm:flex-none">
              Cancel
            </button>
            <button onClick={() => save(true)} disabled={saving} className="flex-1 rounded-full border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:bg-muted transition-colors disabled:opacity-50 sm:flex-none">
              Save Draft
            </button>
            <button onClick={() => save(false)} disabled={saving} className="flex-1 rounded-full bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity disabled:opacity-50 sm:flex-none">
              {saving ? <Spinner size="sm" className="text-background" /> : isNew ? "Create Event" : "Save Changes"}
            </button>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-red-500 rounded-lg border border-red-200 bg-red-50 px-4 py-3">{error}</p>}

        <div className="space-y-5">
          {/* Cover image */}
          <div>
            <label className={fieldLabel}>Cover Image</label>
            {editing.cover_image ? (
              <div className="relative w-full aspect-[16/7] bg-muted overflow-hidden mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={editing.cover_image} alt="" className="w-full h-full object-cover" />
                <button onClick={() => setEditing((p) => ({ ...p, cover_image: "" }))} className="absolute top-2 right-2 rounded-full bg-background border border-border p-1 hover:bg-muted">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-border py-8 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50">
                {uploading ? <Spinner size="sm" /> : <ImagePlus className="h-4 w-4" />}
                {uploading ? "Uploading…" : "Upload Image"}
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

          {/* Title */}
          <div>
            <label className={fieldLabel}>Title *</label>
            <input value={editing.title ?? ""} onChange={(e) => setEditing((p) => ({ ...p, title: e.target.value }))}
              className={fieldInput} placeholder="Product Launch Meetup" />
          </div>

          {/* Description */}
          <div>
            <label className={fieldLabel}>Description</label>
            <textarea rows={3} value={editing.description ?? ""} onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))}
              className={`${fieldInput} resize-none`} placeholder="What's this event about?" />
          </div>

          {/* Start / End */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={fieldLabel}>Starts *</label>
              <input type="datetime-local" value={editing.starts_at ?? ""} onChange={(e) => setEditing((p) => ({ ...p, starts_at: e.target.value }))} className={fieldInput} />
            </div>
            <div>
              <label className={fieldLabel}>Ends</label>
              <input type="datetime-local" value={editing.ends_at ?? ""} onChange={(e) => setEditing((p) => ({ ...p, ends_at: e.target.value }))} className={fieldInput} />
            </div>
          </div>

          {/* Virtual toggle */}
          <label htmlFor="is_virtual" className="flex items-center gap-2 cursor-pointer select-none">
            <Checkbox id="is_virtual" checked={!!editing.is_virtual} onCheckedChange={(checked) => setEditing((p) => ({ ...p, is_virtual: checked === true }))} />
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Virtual / Online Event</span>
          </label>

          {editing.is_virtual ? (
            <div>
              <label className={fieldLabel}>Virtual Link</label>
              <input value={editing.virtual_link ?? ""} onChange={(e) => setEditing((p) => ({ ...p, virtual_link: e.target.value }))} className={fieldInput} placeholder="https://meet.google.com/..." />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={fieldLabel}>Venue</label>
                <input value={editing.venue ?? ""} onChange={(e) => setEditing((p) => ({ ...p, venue: e.target.value }))} className={fieldInput} placeholder="Alisa Hotel" />
              </div>
              <div>
                <label className={fieldLabel}>City</label>
                <input value={editing.city ?? ""} onChange={(e) => setEditing((p) => ({ ...p, city: e.target.value }))} className={fieldInput} placeholder="Accra" />
              </div>
            </div>
          )}

          {/* Capacity + Map link */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={fieldLabel}>Capacity</label>
              <input type="number" min="0" value={editing.capacity ?? ""} onChange={(e) => setEditing((p) => ({ ...p, capacity: e.target.value ? Number(e.target.value) : null }))} className={fieldInput} placeholder="Unlimited" />
            </div>
            <div>
              <label className={fieldLabel}>Map Link</label>
              <input value={editing.map_link ?? ""} onChange={(e) => setEditing((p) => ({ ...p, map_link: e.target.value }))} className={fieldInput} placeholder="https://maps.google.com/..." />
            </div>
          </div>

          {/* Ticket Types */}
          <div>
            <label className={fieldLabel}>Ticket Types</label>
            <p className="text-xs text-muted-foreground mb-3">Shown on both the website and the USSD &quot;Register for Ticket&quot; menu. A tier with a minimum of 2+ prompts callers for quantity (e.g. a Group tier).</p>
            <div className="space-y-2 mb-2">
              {(editing.ticket_types ?? []).map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={t.name} onChange={(e) => updateTicketType(i, { name: e.target.value })} placeholder="Regular" className={`${fieldInput} flex-1`} />
                  <input type="number" min="0" step="0.01" value={t.price} onChange={(e) => updateTicketType(i, { price: e.target.value })} placeholder="Price" className={`${fieldInput} w-28`} />
                  <input type="number" min="1" value={t.min_quantity} onChange={(e) => updateTicketType(i, { min_quantity: Number(e.target.value) || 1 })} placeholder="Min qty" className={`${fieldInput} w-24`} />
                  <button type="button" onClick={() => removeTicketType(i)} className="shrink-0 rounded-full border border-border p-2 hover:bg-muted"><X className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addTicketType} className="rounded-full border border-border px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:bg-muted transition-colors">+ Add Ticket Type</button>
          </div>

          {/* Schedule */}
          <div>
            <label className={fieldLabel}>Schedule / Lineup</label>
            <div className="space-y-2 mb-2">
              {(editing.schedule ?? []).map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={s.day_label} onChange={(e) => updateScheduleItem(i, { day_label: e.target.value })} placeholder="Day 1" className={`${fieldInput} w-24`} />
                  <input value={s.time_label} onChange={(e) => updateScheduleItem(i, { time_label: e.target.value })} placeholder="6:00 PM" className={`${fieldInput} w-28`} />
                  <input value={s.title} onChange={(e) => updateScheduleItem(i, { title: e.target.value })} placeholder="Keynote: ..." className={`${fieldInput} flex-1`} />
                  <button type="button" onClick={() => removeScheduleItem(i)} className="shrink-0 rounded-full border border-border p-2 hover:bg-muted"><X className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addScheduleItem} className="rounded-full border border-border px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:bg-muted transition-colors">+ Add Schedule Item</button>
          </div>

          {/* Organizer contact */}
          <div>
            <label className={fieldLabel}>Organizer Contact (shown via USSD &quot;Contact Organizers&quot;)</label>
            <div className="grid grid-cols-3 gap-4">
              <input value={editing.organizer_phone ?? ""} onChange={(e) => setEditing((p) => ({ ...p, organizer_phone: e.target.value }))} placeholder="Phone" className={fieldInput} />
              <input value={editing.organizer_whatsapp ?? ""} onChange={(e) => setEditing((p) => ({ ...p, organizer_whatsapp: e.target.value }))} placeholder="WhatsApp" className={fieldInput} />
              <input value={editing.organizer_email ?? ""} onChange={(e) => setEditing((p) => ({ ...p, organizer_email: e.target.value }))} placeholder="Email" className={fieldInput} />
            </div>
          </div>

          {/* Facility info */}
          <div>
            <label className={fieldLabel}>Facility Info (shown via USSD &quot;Grounds Management&quot;)</label>
            <div className="space-y-2">
              <input value={editing.toilet_info ?? ""} onChange={(e) => setEditing((p) => ({ ...p, toilet_info: e.target.value }))} placeholder="Nearest toilet directions" className={fieldInput} />
              <input value={editing.first_aid_info ?? ""} onChange={(e) => setEditing((p) => ({ ...p, first_aid_info: e.target.value }))} placeholder="Nearest first aid directions" className={fieldInput} />
              <input value={editing.emergency_exit_info ?? ""} onChange={(e) => setEditing((p) => ({ ...p, emergency_exit_info: e.target.value }))} placeholder="Emergency exit directions" className={fieldInput} />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-6">
            {[{ key: "featured", label: "Featured" }, { key: "published", label: "Published" }].map(({ key, label }) => (
              <label key={key} htmlFor={key} className="flex items-center gap-2 cursor-pointer select-none">
                <Checkbox id={key} checked={!!editing[key as keyof typeof editing]} onCheckedChange={(checked) => setEditing((p) => ({ ...p, [key]: checked === true }))} />
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
              </label>
            ))}
            <label htmlFor="is_ussd_active" className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox id="is_ussd_active" checked={!!editing.is_ussd_active} onCheckedChange={(checked) => setEditing((p) => ({ ...p, is_ussd_active: checked === true }))} />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#0a291a]">Live on USSD</span>
            </label>
          </div>
          {editing.is_ussd_active && (
            <p className="text-xs text-muted-foreground -mt-3">Only one event can be live on the USSD short code at a time — saving this will deactivate whichever one currently is.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="text-sm text-muted-foreground mt-1">{events.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity">
          <Plus className="h-3.5 w-3.5" /> New Event
        </button>
      </div>

      {events.length === 0 && (
        <div className="rounded-lg border border-dashed border-border py-20 text-center">
          <p className="text-muted-foreground text-sm">No events yet.</p>
          <button onClick={openNew} className="mt-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground underline underline-offset-4">Add your first event</button>
        </div>
      )}

      <div className="space-y-2">
        {events.map((e) => (
          <div key={e.id} className="flex items-center gap-4 rounded-lg border border-border px-5 py-4 bg-background hover:bg-muted/30 transition-colors">
            {e.cover_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={e.cover_image} alt="" className="h-12 w-20 rounded-lg object-cover shrink-0 border border-border" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate flex items-center gap-2">
                {e.title}
                {e.is_ussd_active && <span className="rounded-full bg-[#cdf68c] px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-[#0a291a]">Live on USSD</span>}
              </p>
              <p className="text-[0.65rem] text-muted-foreground uppercase tracking-widest mt-0.5">
                {new Date(e.starts_at).toLocaleString()} · {e.is_virtual ? "Online" : e.venue || e.city}
                {Number(e.price_amount) > 0 && <span className="ml-2">{e.price_currency} {Number(e.price_amount).toFixed(2)}</span>}
                {e.featured && <span className="ml-2 text-[#0a291a]">Featured</span>}
              </p>
            </div>
            <button onClick={() => toggleUssdActive(e)} className={`shrink-0 rounded-lg border px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] transition-colors ${e.is_ussd_active ? "border-[#cdf68c] bg-[#cdf68c] text-[#0a291a]" : "border-border text-muted-foreground hover:bg-muted"}`}>
              {e.is_ussd_active ? "Live" : "Go Live"}
            </button>
            <Link href={`/admin/events/${e.id}/registrations`} className="flex items-center gap-1.5 shrink-0 rounded-lg border border-border px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:bg-muted transition-colors">
              <Users className="h-3 w-3" /> {e.registrations ?? 0}
            </Link>
            <Link href={`/admin/events/${e.id}/grounds`} className="flex items-center gap-1.5 shrink-0 rounded-lg border border-border px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:bg-muted transition-colors">
              <FirstAid className="h-3 w-3" /> Grounds
            </Link>
            <span className={`text-[0.6rem] font-semibold uppercase tracking-[0.18em] rounded-lg px-2.5 py-1 border ${e.published ? "border-green-500 text-green-600" : "border-border text-muted-foreground"}`}>
              {e.published ? "Published" : "Draft"}
            </span>
            <RowActions
              actions={[
                { label: e.published ? "Unpublish" : "Publish", icon: e.published ? EyeOff : Eye, onClick: () => togglePublish(e) },
                { label: "Edit", icon: Pencil, onClick: () => openEdit(e.id) },
                { label: "Delete", icon: Trash2, onClick: () => setConfirmDeleteId(e.id), disabled: deleting === e.id, destructive: true },
              ]}
            />
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!confirmDeleteId}
        title="Delete this event?"
        description="This action cannot be undone. The event and its registrations will be permanently removed."
        confirmLabel="Yes, delete"
        destructive
        loading={!!deleting}
        onConfirm={() => confirmDeleteId && deleteEvent(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
