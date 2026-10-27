"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, IndianRupee, Compass, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_BUDGETS = [
  { label: "Under ₹15 Lakhs", max: "1500000" },
  { label: "₹15L – ₹25L", min: "1500000", max: "2500000" },
  { label: "₹25L – ₹50L", min: "2500000", max: "5000000" },
  { label: "Commercial", type: "Commercial" },
];

export default function QuickSearchBar() {
  const router = useRouter();
  const [propertyType, setPropertyType] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (search.trim()) p.set("search", search.trim());
    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);
    if (propertyType && propertyType !== "all") p.set("propertyType", propertyType);
    router.push(`/plots?${p.toString()}`);
  };

  const applyBudget = (item: typeof QUICK_BUDGETS[number]) => {
    if (item.type) {
      setPropertyType(item.type);
    } else {
      if (item.min) setMinPrice(item.min);
      else setMinPrice("");
      if (item.max) setMaxPrice(item.max);
      else setMaxPrice("");
    }
  };

  return (
    <div className="w-full rounded-3xl border border-navy-100/80 bg-white/95 p-4 shadow-card backdrop-blur-md sm:p-6">
      {/* Category Tabs */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-navy-100/60 pb-3">
        <div className="flex items-center gap-1.5 rounded-xl bg-stone/70 p-1">
          {[
            { id: "all", label: "All Plots" },
            { id: "Residential", label: "Residential" },
            { id: "Commercial", label: "Commercial" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPropertyType(tab.id)}
              className={cn(
                "rounded-lg px-4 py-1.5 text-xs font-bold transition-all",
                propertyType === tab.id
                  ? "bg-forest-800 text-white shadow-sm"
                  : "text-navy-600 hover:text-navy-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2 text-xs font-semibold text-forest-700 sm:flex">
          <Sparkles className="h-3.5 w-3.5 text-gold-500" />
          <span>Direct Dealer Listings · 0% Brokerage</span>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(220px,1fr)] lg:items-end"
      >
        <div className="min-w-0">
          <label className="label text-xs uppercase tracking-wider text-navy-500">
            Location or Plot Name
          </label>
          <div className="relative min-w-0">
            <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
            <input
              className="input pl-10 text-sm font-medium"
              placeholder="City, locality, e.g. Parasia Road, VIP Road, Nagpur Road"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label text-xs uppercase tracking-wider text-navy-500">
            Min Budget
          </label>
          <div className="relative min-w-0">
            <IndianRupee className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
            <input
              type="number"
              className="input pl-10 text-sm font-medium"
              placeholder="₹ Min (e.g. 1000000)"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label text-xs uppercase tracking-wider text-navy-500">
            Max Budget
          </label>
          <div className="relative min-w-0">
            <IndianRupee className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
            <input
              type="number"
              className="input pl-10 text-sm font-medium"
              placeholder="₹ Max (e.g. 3000000)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="min-w-0">
          <button
            type="submit"
            className="btn-primary h-[50px] w-full min-w-0 py-3 text-sm font-bold shadow-soft hover:shadow-card"
          >
            <Search className="h-4 w-4" />
            Search Plots
          </button>
        </div>
      </form>

      {/* Quick Filter Chips */}
      <div className="mt-4 flex flex-wrap items-center gap-2 pt-1 text-xs text-navy-500">
        <span className="font-semibold text-navy-400">Popular:</span>
        {QUICK_BUDGETS.map((b) => (
          <button
            key={b.label}
            type="button"
            onClick={() => applyBudget(b)}
            className="rounded-full border border-navy-100 bg-stone/50 px-3 py-1 font-medium transition hover:border-forest-600 hover:bg-forest-50 hover:text-forest-800"
          >
            {b.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => router.push("/plots?status=Available")}
          className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-800 transition hover:bg-emerald-100"
        >
          🟢 Ready to Construct
        </button>
      </div>
    </div>
  );
}
