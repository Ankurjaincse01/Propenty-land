"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Search,
  Loader2,
  Phone,
  Mail,
  MessageCircle,
  X,
  Trash2,
  CalendarClock,
  StickyNote,
} from "lucide-react";
import api from "@/lib/api";
import { STATUS_STYLES, cn, formatDate, relativeTime } from "@/lib/utils";
import Pagination from "@/components/ui/Pagination";

const STATUSES = ["New", "Contacted", "Site Visit Scheduled", "Qualified", "Closed"] as const;

interface Enquiry {
  _id: string;
  customerName: string;
  phone: string;
  email?: string;
  message: string;
  source: string;
  followUpStatus: string;
  preferredVisitDate?: string;
  createdAt: string;
  internalNotes?: Array<{ note: string; addedAt: string }>;
  property?: { title?: string; slug?: string } | null;
  project?: { name?: string; slug?: string } | null;
}

export default function AdminEnquiriesPage() {
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState<Enquiry | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/enquiries", {
        params: { page, limit: 12, search, status },
      });
      setRows(data.data || []);
      setTotal(data.meta?.total ?? 0);
      setTotalPages(data.meta?.totalPages ?? 1);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const refreshActive = (id: string, patch: Partial<Enquiry>) => {
    setRows((prev) => prev.map((r) => (r._id === id ? { ...r, ...patch } : r)));
    setActive((a) => (a && a._id === id ? { ...a, ...patch } : a));
  };

  const updateStatus = async (enquiry: Enquiry, followUpStatus: string) => {
    setSaving(true);
    try {
      await api.patch(`/admin/enquiries/${enquiry._id}`, { followUpStatus });
      refreshActive(enquiry._id, { followUpStatus });
      toast.success("Status updated");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const addNote = async () => {
    if (!active || !note.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.patch(`/admin/enquiries/${active._id}`, { note });
      refreshActive(active._id, { internalNotes: data.data.internalNotes });
      setNote("");
      toast.success("Note added");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not add note");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (enquiry: Enquiry) => {
    if (!confirm(`Delete enquiry from ${enquiry.customerName}?`)) return;
    try {
      await api.delete(`/admin/enquiries/${enquiry._id}`);
      toast.success("Enquiry deleted");
      setActive(null);
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  const waUrl = (phone: string, name: string) =>
    `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
      `Hello ${name}, thank you for your enquiry. How can we help you find the right plot?`
    )}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-navy-900">Enquiries</h2>
        <p className="text-sm text-navy-500">{total} total</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-navy-100 bg-white p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input
            className="input pl-9"
            placeholder="Search name, phone or email"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <select
          className="input w-auto"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-navy-100 bg-white py-20 text-navy-400">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-navy-100 bg-white py-20 text-center text-sm text-navy-400">
          No enquiries found.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((e) => (
            <button
              key={e._id}
              onClick={() => {
                setActive(e);
                setNote("");
              }}
              className="flex w-full flex-col gap-3 rounded-2xl border border-navy-100 bg-white p-4 text-left shadow-soft transition hover:border-forest-700/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-navy-900">{e.customerName}</p>
                  <span className={cn("chip", STATUS_STYLES[e.followUpStatus])}>
                    {e.followUpStatus}
                  </span>
                  <span className="chip bg-stone text-navy-500">{e.source}</span>
                </div>
                <p className="mt-1 truncate text-sm text-navy-500">{e.message}</p>
                <p className="mt-1 text-xs text-navy-400">
                  {e.phone}
                  {e.property?.title ? ` · ${e.property.title}` : ""}
                  {e.project?.name ? ` · ${e.project.name}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs text-navy-400">
                <span>{relativeTime(e.createdAt)}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {active && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          <div className="absolute inset-0 bg-navy-900/50" onClick={() => setActive(null)} />
          <div className="relative z-10 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-xl font-bold text-navy-900">
                  {active.customerName}
                </h3>
                <p className="text-xs text-navy-400">
                  Received {formatDate(active.createdAt)} · {active.source}
                </p>
              </div>
              <button
                onClick={() => setActive(null)}
                className="rounded-lg p-2 hover:bg-stone"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <a href={`tel:${active.phone}`} className="btn-outline py-2.5 text-xs">
                <Phone className="h-3.5 w-3.5" /> Call
              </a>
              <a
                href={waUrl(active.phone, active.customerName)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-emerald-600 py-2.5 text-xs text-white hover:bg-emerald-700"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
              <div className="col-span-2 text-sm text-navy-600">
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-navy-400" /> {active.phone}
                </p>
                {active.email && (
                  <p className="mt-1 flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-navy-400" /> {active.email}
                  </p>
                )}
                {active.preferredVisitDate && (
                  <p className="mt-1 flex items-center gap-2">
                    <CalendarClock className="h-3.5 w-3.5 text-navy-400" /> Preferred visit:{" "}
                    {formatDate(active.preferredVisitDate)}
                  </p>
                )}
              </div>
            </div>

            {(active.property?.title || active.project?.name) && (
              <div className="mt-4 rounded-xl border border-navy-100 bg-stone p-3 text-sm">
                <p className="text-[11px] font-semibold uppercase text-navy-400">Interest</p>
                {active.property?.slug && (
                  <Link
                    href={`/properties/${active.property.slug}`}
                    target="_blank"
                    className="font-medium text-forest-700 hover:underline"
                  >
                    {active.property.title}
                  </Link>
                )}
                {active.project?.slug && (
                  <Link
                    href={`/projects/${active.project.slug}`}
                    target="_blank"
                    className="block font-medium text-forest-700 hover:underline"
                  >
                    {active.project.name}
                  </Link>
                )}
              </div>
            )}

            <div className="mt-4 rounded-xl border border-navy-100 p-4">
              <p className="text-[11px] font-semibold uppercase text-navy-400">Message</p>
              <p className="mt-1 whitespace-pre-line text-sm text-navy-700">{active.message}</p>
            </div>

            <div className="mt-4">
              <label className="label">Follow-up status</label>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    disabled={saving}
                    onClick={() => updateStatus(active, s)}
                    className={cn(
                      "chip border transition",
                      active.followUpStatus === s
                        ? "border-forest-700 bg-forest-700 text-white"
                        : "border-navy-200 bg-white text-navy-600 hover:border-forest-600"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="label flex items-center gap-1.5">
                <StickyNote className="h-3.5 w-3.5" /> Internal notes
              </label>
              <div className="flex gap-2">
                <input
                  className="input"
                  placeholder="Add a private note…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addNote())}
                />
                <button onClick={addNote} disabled={saving || !note.trim()} className="btn-outline">
                  Add
                </button>
              </div>
              <ul className="mt-3 space-y-2">
                {(active.internalNotes || [])
                  .slice()
                  .reverse()
                  .map((n, i) => (
                    <li key={i} className="rounded-lg border border-navy-100 bg-stone p-3 text-xs">
                      <p className="text-navy-700">{n.note}</p>
                      <p className="mt-1 text-[10px] text-navy-400">{formatDate(n.addedAt)}</p>
                    </li>
                  ))}
                {(active.internalNotes || []).length === 0 && (
                  <li className="text-xs text-navy-400">No notes yet.</li>
                )}
              </ul>
            </div>

            <button
              onClick={() => remove(active)}
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-rose-500 hover:text-rose-600"
            >
              <Trash2 className="h-4 w-4" /> Delete enquiry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
