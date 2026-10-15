"use client";

import { MapPin, Crosshair, Trash2 } from "lucide-react";

interface Props {
  masterLayoutImage?: string;
  value: { x: number | null; y: number | null };
  plotNumber?: string;
  onChange: (pos: { x: number | null; y: number | null }) => void;
}

export default function AdminPlotPinPicker({
  masterLayoutImage,
  value,
  plotNumber,
  onChange,
}: Props) {
  if (!masterLayoutImage) {
    return (
      <div className="rounded-xl border border-navy-100 bg-stone p-4 text-xs text-navy-500">
        Select a parent <strong>Project</strong> that has a Master Layout image to place
        this plot on the interactive township map.
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Number((((e.clientX - rect.left) / rect.width) * 100).toFixed(2));
    const y = Number((((e.clientY - rect.top) / rect.height) * 100).toFixed(2));
    onChange({ x, y });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-600">
          <Crosshair className="h-3.5 w-3.5 text-gold-500" />
          Click the master layout to set Plot #{plotNumber || "?"} position
        </label>
        <div className="flex items-center gap-2">
          {value.x != null && value.y != null && (
            <span className="tabular rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              X: {value.x}% | Y: {value.y}%
            </span>
          )}
          {value.x != null && (
            <button
              type="button"
              onClick={() => onChange({ x: null, y: null })}
              className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-600 hover:bg-rose-100"
            >
              <Trash2 className="h-3 w-3" /> Clear
            </button>
          )}
        </div>
      </div>

      <div
        onClick={handleClick}
        className="relative inline-block w-full cursor-crosshair overflow-hidden rounded-xl border-2 border-dashed border-navy-200 transition hover:border-forest-700"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={masterLayoutImage}
          alt="Click to assign plot location"
          className="block h-auto w-full select-none"
        />
        {value.x != null && value.y != null && (
          <div
            style={{ left: `${value.x}%`, top: `${value.y}%` }}
            className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-md border-2 border-gold-400 bg-forest-800 px-2.5 py-1 text-xs font-bold text-white shadow-lg"
          >
            <MapPin className="h-3.5 w-3.5 text-gold-400" />
            <span>#{plotNumber || "Plot"}</span>
          </div>
        )}
      </div>
    </div>
  );
}
