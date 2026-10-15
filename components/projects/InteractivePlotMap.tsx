"use client";

import { useState, useMemo, createElement } from "react";
import Link from "next/link";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Maximize2,
  CheckCircle2,
  Clock,
  Ban,
  MessageCircle,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { formatPriceShort, generateWhatsAppUrl, cn } from "@/lib/utils";

export interface MapPlot {
  _id: string;
  plotNumber?: string;
  title: string;
  slug: string;
  price: number;
  pricePerUnit?: number;
  area: number;
  areaUnit: string;
  facing?: string;
  isCornerPlot?: boolean;
  isDemo?: boolean;
  roadWidthFt?: number;
  status: "Available" | "Reserved" | "Sold";
  dimensions?: { length?: number; width?: number };
  layoutPosition?: { x?: number | null; y?: number | null; polygonPoints?: string | null };
}

interface Props {
  projectName?: string;
  masterLayoutImage?: string;
  plots: MapPlot[];
  whatsappNumber: string;
}

const STATUS_CONFIG: Record<
  string,
  {
    pin: string;
    svgFill: string;
    svgStroke: string;
    badge: string;
    dot: string;
    icon: typeof CheckCircle2;
  }
> = {
  Available: {
    pin: "bg-emerald-600 hover:bg-emerald-500 border-emerald-300",
    svgFill: "rgba(16,185,129,0.35)",
    svgStroke: "#059669",
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  Reserved: {
    pin: "bg-amber-500 hover:bg-amber-400 border-amber-200",
    svgFill: "rgba(245,158,11,0.38)",
    svgStroke: "#D97706",
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
    icon: Clock,
  },
  Sold: {
    pin: "bg-slate-600 hover:bg-slate-500 border-slate-300",
    svgFill: "rgba(100,116,139,0.45)",
    svgStroke: "#475569",
    badge: "bg-slate-100 text-slate-600 border-slate-300",
    dot: "bg-slate-500",
    icon: Ban,
  },
};

export default function InteractivePlotMap({
  projectName,
  masterLayoutImage,
  plots,
  whatsappNumber,
}: Props) {
  const [selected, setSelected] = useState<MapPlot | null>(null);
  const [statusFilter, setStatusFilter] = useState<"All" | MapPlot["status"]>("All");
  const [zoom, setZoom] = useState(1);

  const mapped = useMemo(
    () => plots.filter((p) => p.layoutPosition?.x != null && p.layoutPosition?.y != null),
    [plots]
  );

  const visible = useMemo(
    () => (statusFilter === "All" ? mapped : mapped.filter((p) => p.status === statusFilter)),
    [mapped, statusFilter]
  );

  const counts = useMemo(
    () => ({
      All: mapped.length,
      Available: mapped.filter((p) => p.status === "Available").length,
      Reserved: mapped.filter((p) => p.status === "Reserved").length,
      Sold: mapped.filter((p) => p.status === "Sold").length,
    }),
    [mapped]
  );

  if (!masterLayoutImage || mapped.length === 0) return null;

  const plotMessage = (plot: MapPlot) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/properties/${plot.slug}` : "";
    return `Hello, I am interested in Plot No. ${plot.plotNumber ?? ""} (${plot.title})${
      projectName ? ` in ${projectName}` : ""
    }. Price listed: ${formatPriceShort(plot.price)}. Link: ${url} - Please share availability and site visit details.`;
  };

  const selectedUrl = selected ? generateWhatsAppUrl(whatsappNumber, plotMessage(selected)) : "#";

  return (
    <section className="overflow-hidden rounded-2xl border border-navy-100 bg-alabaster shadow-soft">
      <div className="flex flex-col gap-4 border-b border-navy-100 bg-white p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-500">
              Interactive Master Plan
            </span>
            <span className="rounded-full bg-stone px-2 py-0.5 text-xs text-navy-500">
              Click any plot number for live price &amp; specs
            </span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-forest-800">
            {projectName || "Township Layout"} — Plot Availability Map
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["All", "Available", "Reserved", "Sold"] as const).map((status) => {
            const active = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
                  active
                    ? "border-forest-800 bg-forest-800 text-white shadow-sm"
                    : "border-navy-100 bg-stone text-navy-600 hover:bg-navy-50"
                )}
              >
                {status !== "All" && (
                  <span className={cn("h-2 w-2 rounded-full", STATUS_CONFIG[status].dot)} />
                )}
                <span>{status}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[11px]",
                    active ? "bg-white/20 text-white" : "bg-navy-100/70 text-navy-600"
                  )}
                >
                  {counts[status]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-navy-900 lg:col-span-8 sm:min-h-[540px]">
          <div className="absolute left-4 top-4 z-20 flex flex-col gap-1.5 rounded-xl border border-navy-100 bg-white/95 p-1.5 shadow-md backdrop-blur">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.25, 2.25))}
              title="Zoom in"
              className="rounded-lg p-2 text-navy-700 transition hover:bg-stone"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.25, 1))}
              title="Zoom out"
              className="rounded-lg p-2 text-navy-700 transition hover:bg-stone"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setSelected(null);
              }}
              title="Reset view"
              className="rounded-lg p-2 text-navy-700 transition hover:bg-stone"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-full border border-navy-100 bg-white/90 px-3 py-1.5 text-xs font-semibold text-navy-700 shadow-md backdrop-blur">
            <Compass className="h-4 w-4 text-gold-500" />
            <span>N ↑</span>
          </div>

          <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
            <div
              className="relative inline-block select-none transition-transform duration-200 ease-out"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={masterLayoutImage}
                alt={`${projectName || "Project"} master layout plan`}
                className="block h-auto max-w-full rounded-lg shadow-2xl"
              />

              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full"
              >
                {visible.map((plot) => {
                  if (!plot.layoutPosition?.polygonPoints) return null;
                  const cfg = STATUS_CONFIG[plot.status] || STATUS_CONFIG.Available;
                  const isSelected = selected?._id === plot._id;
                  return (
                    <polygon
                      key={`poly-${plot._id}`}
                      points={plot.layoutPosition.polygonPoints}
                      fill={cfg.svgFill}
                      stroke={isSelected ? "#C5A059" : cfg.svgStroke}
                      strokeWidth={isSelected ? 0.6 : 0.3}
                      className="pointer-events-auto cursor-pointer transition-all hover:opacity-90"
                      onClick={() => setSelected(plot)}
                    />
                  );
                })}
              </svg>

              {visible.map((plot) => {
                const cfg = STATUS_CONFIG[plot.status] || STATUS_CONFIG.Available;
                const isSelected = selected?._id === plot._id;
                return (
                  <button
                    key={plot._id}
                    type="button"
                    onClick={() => setSelected(plot)}
                    style={{
                      left: `${plot.layoutPosition?.x}%`,
                      top: `${plot.layoutPosition?.y}%`,
                    }}
                    className={cn(
                      "absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-bold text-white shadow-lg transition-all duration-200",
                      cfg.pin,
                      isSelected
                        ? "z-30 scale-125 border-gold-400 bg-forest-800 ring-4 ring-gold-400/40"
                        : "hover:scale-110"
                    )}
                    title={`Plot ${plot.plotNumber} · ${plot.status} · ${formatPriceShort(plot.price)}`}
                  >
                    <span>#{plot.plotNumber}</span>
                    {plot.isCornerPlot && <Sparkles className="h-3 w-3 shrink-0 text-gold-200" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between border-t border-navy-100 bg-white p-6 lg:col-span-4 lg:border-l lg:border-t-0">
          {selected ? (
            <div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "chip border",
                    (STATUS_CONFIG[selected.status] || STATUS_CONFIG.Available).badge
                  )}
                >
                  {createElement(
                    (STATUS_CONFIG[selected.status] || STATUS_CONFIG.Available).icon,
                    { className: "h-3.5 w-3.5" }
                  )}
                  {selected.status}
                </span>
                <div className="flex items-center gap-1.5">
                  {selected.isCornerPlot && (
                    <span className="chip border border-gold-200 bg-gold-50 text-gold-700">
                      Corner Plot
                    </span>
                  )}
                  {selected.isDemo && (
                    <span className="chip bg-stone text-navy-400">Demo Data</span>
                  )}
                </div>
              </div>

              <div className="border-b border-navy-100 pb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                  Plot Number {selected.plotNumber}
                </p>
                <h4 className="mt-0.5 text-xl font-bold text-forest-800">{selected.title}</h4>
                <p className="tabular mt-2 text-2xl font-extrabold text-forest-800">
                  {formatPriceShort(selected.price)}
                </p>
                {selected.pricePerUnit ? (
                  <p className="tabular mt-0.5 text-xs text-navy-500">
                    ₹{selected.pricePerUnit.toLocaleString("en-IN")} per {selected.areaUnit}
                  </p>
                ) : null}
              </div>

              <div className="my-5 grid grid-cols-2 gap-3">
                <Spec label="Plot Area" value={`${selected.area} ${selected.areaUnit}`} />
                <Spec
                  label="Dimensions"
                  value={
                    selected.dimensions?.length && selected.dimensions?.width
                      ? `${selected.dimensions.length}' × ${selected.dimensions.width}'`
                      : "Regular Shape"
                  }
                />
                <Spec label="Facing" value={selected.facing || "East"} />
                <Spec
                  label="Road Access"
                  value={selected.roadWidthFt ? `${selected.roadWidthFt} ft Road` : "30 ft Road"}
                />
              </div>

              <div className="space-y-2.5 pt-2">
                {selected.status !== "Sold" && (
                  <a
                    href={selectedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn w-full bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enquire about Plot #{selected.plotNumber}
                  </a>
                )}
                <Link href={`/properties/${selected.slug}`} className="btn-navy w-full">
                  View Full Plot Details
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="my-auto px-4 py-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-stone text-forest-800">
                <Maximize2 className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-navy-800">Select a Plot on the Map</h4>
              <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-navy-500">
                Click any numbered plot pin on the master layout to inspect its exact
                dimensions, facing, road width and live price.
              </p>
            </div>
          )}

          <p className="mt-6 border-t border-navy-100 pt-3 text-[11px] text-navy-400">
            *Plot boundaries on the interactive layout are indicative. Please verify exact
            measurements on the official physical site plan during your site visit.
          </p>
        </div>
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-navy-100 bg-stone p-3">
      <span className="block text-[11px] font-semibold uppercase text-navy-400">{label}</span>
      <span className="tabular text-sm font-bold text-navy-800">{value}</span>
    </div>
  );
}
