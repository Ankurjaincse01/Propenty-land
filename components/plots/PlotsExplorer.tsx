"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, X, Search, Loader2 } from "lucide-react";
import PropertyCard, { PropertyCardData } from "@/components/ui/PropertyCard";
import Pagination from "@/components/ui/Pagination";
import { EmptyState, SkeletonGrid } from "@/components/ui/Shared";
import { cn, FACINGS, AREA_UNITS } from "@/lib/utils";
import api from "@/lib/api";

interface Filters {
  search: string;
  propertyType: string;
  status: string;
  facing: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  sort: string;
}

const EMPTY: Filters = {
  search: "",
  propertyType: "all",
  status: "all",
  facing: "all",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
  sort: "newest",
};

export default function PlotsExplorer({ whatsappNumber }: { whatsappNumber: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<Filters>({
    ...EMPTY,
    search: searchParams.get("search") || "",
    propertyType: searchParams.get("propertyType") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });
  const [page, setPage] = useState(1);
  const [plots, setPlots] = useState<PropertyCardData[]>([]);
  const [meta, setMeta] = useState<{ total: number; totalPages: number }>({
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [drawer, setDrawer] = useState(false);

  const activeChips = useMemo(() => {
    const chips: { key: keyof Filters; label: string }[] = [];
    if (filters.search) chips.push({ key: "search", label: `“${filters.search}”` });
    if (filters.propertyType !== "all")
      chips.push({ key: "propertyType", label: filters.propertyType });
    if (filters.status !== "all") chips.push({ key: "status", label: filters.status });
    if (filters.facing !== "all") chips.push({ key: "facing", label: `${filters.facing} facing` });
    if (filters.minPrice) chips.push({ key: "minPrice", label: `Min ₹${filters.minPrice}` });
    if (filters.maxPrice) chips.push({ key: "maxPrice", label: `Max ₹${filters.maxPrice}` });
    if (filters.minArea) chips.push({ key: "minArea", label: `Min area ${filters.minArea}` });
    if (filters.maxArea) chips.push({ key: "maxArea", label: `Max area ${filters.maxArea}` });
    return chips;
  }, [filters]);

  const fetchPlots = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, any> = { page, limit: 9, sort: filters.sort };
      if (filters.search) params.search = filters.search;
      if (filters.propertyType !== "all") params.propertyType = filters.propertyType;
      if (filters.status !== "all") params.status = filters.status;
      if (filters.facing !== "all") params.facing = filters.facing;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.minArea) params.minArea = filters.minArea;
      if (filters.maxArea) params.maxArea = filters.maxArea;

      const { data } = await api.get("/properties", { params });
      setPlots(data.data || []);
      setMeta({
        total: data.meta?.total ?? data.data?.length ?? 0,
        totalPages: data.meta?.totalPages ?? 1,
      });
    } catch (e: any) {
      setError(e?.response?.data?.message || "Could not load plots. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    const t = setTimeout(fetchPlots, 250);
    return () => clearTimeout(t);
  }, [fetchPlots]);

  // Keep URL in sync with the primary filters (sharable links).
  useEffect(() => {
    const p = new URLSearchParams();
    if (filters.search) p.set("search", filters.search);
    if (filters.propertyType !== "all") p.set("propertyType", filters.propertyType);
    if (filters.minPrice) p.set("minPrice", filters.minPrice);
    if (filters.maxPrice) p.set("maxPrice", filters.maxPrice);
    const qs = p.toString();
    router.replace(qs ? `/plots?${qs}` : "/plots", { scroll: false });
  }, [filters.search, filters.propertyType, filters.minPrice, filters.maxPrice, router]);

  const set = (patch: Partial<Filters>) => {
    setPage(1);
    setFilters((f) => ({ ...f, ...patch }));
  };

  const reset = () => {
    setPage(1);
    setFilters(EMPTY);
  };

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <label className="label">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input
            className="input pl-9"
            placeholder="Title, plot no. or location"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="label">Property Type</label>
        <div className="grid grid-cols-3 gap-2">
          {["all", "Residential", "Commercial"].map((t) => (
            <button
              key={t}
              onClick={() => set({ propertyType: t })}
              className={cn(
                "rounded-lg border px-2 py-2 text-xs font-semibold transition",
                filters.propertyType === t
                  ? "border-forest-700 bg-forest-50 text-forest-800"
                  : "border-navy-200 bg-white text-navy-600 hover:border-navy-300"
              )}
            >
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Availability</label>
        <select
          className="input"
          value={filters.status}
          onChange={(e) => set({ status: e.target.value })}
        >
          <option value="all">All statuses</option>
          <option value="Available">Available</option>
          <option value="Reserved">Reserved</option>
          <option value="Sold">Sold</option>
        </select>
      </div>

      <div>
        <label className="label">Facing</label>
        <select
          className="input"
          value={filters.facing}
          onChange={(e) => set({ facing: e.target.value })}
        >
          <option value="all">Any facing</option>
          {FACINGS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Budget (₹)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            className="input"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => set({ minPrice: e.target.value })}
          />
          <input
            type="number"
            className="input"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => set({ maxPrice: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="label">Area</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            className="input"
            placeholder="Min"
            value={filters.minArea}
            onChange={(e) => set({ minArea: e.target.value })}
          />
          <input
            type="number"
            className="input"
            placeholder="Max"
            value={filters.maxArea}
            onChange={(e) => set({ maxArea: e.target.value })}
          />
        </div>
        <p className="mt-1 text-[11px] text-navy-400">
          Units: {AREA_UNITS.map((u) => u.short).join(", ")}
        </p>
      </div>

      <button onClick={reset} className="btn-outline w-full">
        Reset filters
      </button>
    </div>
  );

  return (
    <div className="section py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-2xl border border-navy-100 bg-white p-5 shadow-soft">
            <h2 className="mb-4 flex items-center gap-2 font-heading text-base font-bold text-navy-900">
              <SlidersHorizontal className="h-4 w-4 text-gold-500" /> Filters
            </h2>
            {FilterPanel}
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-heading text-2xl font-extrabold text-navy-900">
                Explore Plots
              </h1>
              <p className="text-sm text-navy-500">
                {loading ? "Searching…" : `${meta.total} plot(s) found`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDrawer(true)}
                className="btn-outline lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              <select
                className="input w-auto"
                value={filters.sort}
                onChange={(e) => set({ sort: e.target.value })}
              >
                <option value="newest">Newest first</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="area-asc">Area: small to large</option>
                <option value="area-desc">Area: large to small</option>
              </select>
            </div>
          </div>

          {activeChips.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {activeChips.map((c) => (
                <button
                  key={c.key}
                  onClick={() =>
                    set({ [c.key]: c.key === "search" ? "" : "all" } as Partial<Filters>)
                  }
                  className="chip border border-navy-200 bg-white text-navy-600 hover:border-rose-300 hover:text-rose-600"
                >
                  {c.label}
                  <X className="h-3 w-3" />
                </button>
              ))}
              <button onClick={reset} className="chip text-forest-700 underline">
                Clear all
              </button>
            </div>
          )}

          {loading ? (
            <SkeletonGrid count={6} />
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
              {error}
              <button onClick={fetchPlots} className="btn-outline mt-4">
                <Loader2 className="h-4 w-4" /> Retry
              </button>
            </div>
          ) : plots.length === 0 ? (
            <EmptyState
              title="No plots match your filters"
              description="Try widening your budget or clearing a few filters."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {plots.map((p) => (
                  <PropertyCard key={p._id} property={p} whatsappNumber={whatsappNumber} />
                ))}
              </div>
              <div className="mt-9">
                <Pagination page={page} totalPages={meta.totalPages} onChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-navy-900/50" onClick={() => setDrawer(false)} />
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-navy-900">Filters</h2>
              <button onClick={() => setDrawer(false)} className="rounded-lg p-2 hover:bg-stone">
                <X className="h-5 w-5" />
              </button>
            </div>
            {FilterPanel}
            <button onClick={() => setDrawer(false)} className="btn-primary mt-5 w-full">
              Show {meta.total} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
