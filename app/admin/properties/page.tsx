"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Plus, Search, Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { formatPriceShort, STATUS_STYLES, cn } from "@/lib/utils";
import Pagination from "@/components/ui/Pagination";

interface Row {
  _id: string;
  title: string;
  slug: string;
  status: string;
  propertyType: string;
  price: number;
  area: number;
  areaUnit: string;
  plotNumber?: string;
  isDemo?: boolean;
  project?: { name?: string } | null;
  location?: { locality?: string; city?: string };
  images?: Array<{ url: string }>;
}

export default function AdminPropertiesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/properties", {
        params: { page, limit: 12, search, status, propertyType: type },
      });
      setRows(data.data || []);
      setTotal(data.meta?.total ?? 0);
      setTotalPages(data.meta?.totalPages ?? 1);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, type]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const remove = async (row: Row) => {
    if (!confirm(`Delete "${row.title}"? This also removes its images. This cannot be undone.`))
      return;
    setBusyId(row._id);
    try {
      await api.delete(`/admin/properties/${row._id}`);
      toast.success("Property deleted");
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
          <h2 className="font-heading text-2xl font-extrabold text-navy-900">Properties</h2>
          <p className="text-sm text-navy-500">{total} total plot(s)</p>
        </div>
        <Link href="/admin/properties/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add property
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-navy-100 bg-white p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input
            className="input pl-9"
            placeholder="Search title, plot no. or city"
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
          <option value="Available">Available</option>
          <option value="Reserved">Reserved</option>
          <option value="Sold">Sold</option>
        </select>
        <select
          className="input w-auto"
          value={type}
          onChange={(e) => {
            setPage(1);
            setType(e.target.value);
          }}
        >
          <option value="all">All types</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-navy-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <div className="py-20 text-center text-sm text-navy-400">
            No properties found.{" "}
            <Link href="/admin/properties/new" className="font-semibold text-forest-700">
              Add one
            </Link>
            .
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-navy-100 bg-stone text-xs uppercase tracking-wide text-navy-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Property</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Area</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {rows.map((p) => (
                  <tr key={p._id} className="hover:bg-stone/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-stone">
                          {p.images?.[0]?.url && (
                            <Image
                              src={p.images[0].url}
                              alt={p.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-navy-800">{p.title}</p>
                          <p className="truncate text-xs text-navy-400">
                            {p.plotNumber ? `Plot ${p.plotNumber} · ` : ""}
                            {p.project?.name || p.propertyType}
                            {p.isDemo ? " · Demo" : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-navy-600">
                      {[p.location?.locality, p.location?.city].filter(Boolean).join(", ")}
                    </td>
                    <td className="tabular px-4 py-3 font-semibold text-navy-800">
                      {formatPriceShort(p.price)}
                    </td>
                    <td className="tabular px-4 py-3 text-navy-600">
                      {p.area} {p.areaUnit}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("chip", STATUS_STYLES[p.status])}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/properties/${p.slug}`}
                          target="_blank"
                          className="rounded-lg border border-navy-100 p-2 text-navy-500 hover:bg-stone"
                          aria-label="View public page"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          href={`/admin/properties/${p._id}/edit`}
                          className="rounded-lg border border-navy-100 p-2 text-navy-600 hover:bg-stone"
                          aria-label="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => remove(p)}
                          disabled={busyId === p._id}
                          className="rounded-lg border border-navy-100 p-2 text-rose-500 hover:bg-rose-50"
                          aria-label="Delete"
                        >
                          {busyId === p._id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
