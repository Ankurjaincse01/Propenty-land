import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert arbitrary text into a URL-safe slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Indian numbering system:
 *   1450000  -> "₹14,50,000"
 *   1850000  -> "₹18.50 Lakhs"
 *   12500000 -> "₹1.25 Cr"
 */
export function formatIndianNumber(value: number): string {
  if (!isFinite(value)) return "₹0";
  return "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value));
}

export function formatPriceShort(value: number): string {
  if (!isFinite(value) || value <= 0) return "Price on request";
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} Lakhs`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return formatIndianNumber(value);
}

export function formatPrice(value: number, opts?: { short?: boolean }): string {
  if (opts?.short) return formatPriceShort(value);
  return formatIndianNumber(value);
}

/**
 * Area unit conversions. Base unit = square feet.
 */
export type AreaUnit = "sq.ft" | "sq.yd" | "sq.m" | "guntha" | "acre";

export const AREA_UNITS: { value: AreaUnit; label: string; short: string }[] = [
  { value: "sq.ft", label: "Square Feet", short: "sq.ft" },
  { value: "sq.yd", label: "Square Yards (Gaj)", short: "sq.yd" },
  { value: "sq.m", label: "Square Meters", short: "sq.m" },
  { value: "guntha", label: "Guntha", short: "guntha" },
  { value: "acre", label: "Acres", short: "acre" },
];

const SQFT_PER_UNIT: Record<AreaUnit, number> = {
  "sq.ft": 1,
  "sq.yd": 9,
  "sq.m": 10.7639,
  guntha: 1089,
  acre: 43560,
};

export function convertArea(value: number, from: AreaUnit, to: AreaUnit): number {
  const sqft = value * (SQFT_PER_UNIT[from] ?? 1);
  return sqft / (SQFT_PER_UNIT[to] ?? 1);
}

export function formatArea(value: number, unit: AreaUnit): string {
  const decimals = unit === "acre" ? 3 : unit === "sq.m" ? 1 : 0;
  const n = Number(value).toFixed(decimals);
  const label = AREA_UNITS.find((u) => u.value === unit)?.short ?? unit;
  return `${n} ${label}`;
}

/** Percentages 100 -> "100%" */
export function pct(v: number): string {
  return `${v}%`;
}

export function generateWhatsAppUrl(phone: string, message: string): string {
  const cleaned = (phone || "").replace(/[^0-9]/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function truncate(text: string, len = 140): string {
  if (!text) return "";
  return text.length > len ? text.slice(0, len).trimEnd() + "…" : text;
}

export function formatDate(input: string | Date): string {
  const d = new Date(input);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function relativeTime(input: string | Date): string {
  const d = new Date(input).getTime();
  const diff = Date.now() - d;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(input);
}

export const STATUS_STYLES: Record<string, string> = {
  Available: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Reserved: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Sold: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  Upcoming: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  Ongoing: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  "Ready to Construct": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  "Sold Out": "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  New: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  Contacted: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  "Site Visit Scheduled": "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  Qualified: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Closed: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

export const FACINGS = [
  "East",
  "West",
  "North",
  "South",
  "North-East",
  "North-West",
  "South-East",
  "South-West",
] as const;
