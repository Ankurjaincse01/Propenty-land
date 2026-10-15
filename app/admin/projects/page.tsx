"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, ExternalLink, Loader2, MapPinned } from "lucide-react";
import api from "@/lib/api";
import { STATUS_STYLES, formatPriceShort, cn } from "@/lib/utils";

interface Row {
  _id: string;
  name: string;
  slug: string;
  projectStatus: string;
  totalPlots?: number;
  startingPrice?: number;
  isDemo?: boolean;
  masterLayoutImage?: string;
  location?: { locality?: string; city?: string };
  images?: Array<{ url: string }>;
}

export default function AdminProjectsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/projects");
      setRows(data.data || []);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (row: Row) => {
    if (!confirm(`Delete project "${row.name}"? Only allowed when it has no linked plots.`))
      return;
    setBusyId(row._id);
    try {
      await api.delete(`/admin/projects/${row._id}`);
      toast.success("Project deleted");
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-navy-900">Projects</h2>
          <p className="text-sm text-navy-500">{rows.length} project(s)</p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add project
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-navy-100 bg-white py-20 text-navy-400">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-navy-100 bg-white py-20 text-center text-sm text-navy-400">
          No projects yet.{" "}
          <Link href="/admin/projects/new" className="font-semibold text-forest-700">
            Create one
          </Link>
          .
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rows.map((p) => (
            <div
              key={p._id}
              className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft"
            >
              <div className="relative aspect-[16/9] bg-stone">
                {p.images?.[0]?.url && (
                  <Image
                    src={p.images[0].url}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                )}
                <span className={cn("chip absolute left-3 top-3", STATUS_STYLES[p.projectStatus])}>
                  {p.projectStatus}
                </span>
                {p.masterLayoutImage && (
                  <span className="chip absolute right-3 top-3 bg-navy-900/70 text-white">
                    <MapPinned className="h-3 w-3" /> Layout
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-heading text-base font-bold text-navy-900">{p.name}</h3>
                <p className="mt-0.5 text-xs text-navy-500">
                  {[p.location?.locality, p.location?.city].filter(Boolean).join(", ")}
                </p>
                <p className="tabular mt-2 text-sm text-navy-600">
                  {p.startingPrice ? `From ${formatPriceShort(p.startingPrice)}` : "Price on request"}
                  {p.totalPlots ? ` · ${p.totalPlots} plots` : ""}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <Link
                    href={`/admin/projects/${p._id}/edit`}
                    className="btn-outline flex-1 py-2 text-xs"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                  <Link
                    href={`/projects/${p.slug}`}
                    target="_blank"
                    className="rounded-lg border border-navy-100 p-2.5 text-navy-500 hover:bg-stone"
                    aria-label="View public page"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => remove(p)}
                    disabled={busyId === p._id}
                    className="rounded-lg border border-navy-100 p-2.5 text-rose-500 hover:bg-rose-50"
                    aria-label="Delete"
                  >
                    {busyId === p._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
