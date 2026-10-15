"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { AreaUnit, AREA_UNITS, convertArea, formatArea } from "@/lib/utils";

export default function UnitConverter({
  area,
  areaUnit,
}: {
  area: number;
  areaUnit: AreaUnit;
}) {
  const [target, setTarget] = useState<AreaUnit>(areaUnit === "sq.yd" ? "sq.ft" : "sq.yd");
  const converted = convertArea(area, areaUnit, target);

  return (
    <div className="rounded-xl border border-navy-100 bg-stone p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-500">
        <ArrowLeftRight className="h-3.5 w-3.5 text-gold-500" />
        Area Unit Converter
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="tabular rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm font-bold text-navy-800">
          {formatArea(area, areaUnit)}
        </div>
        <span className="text-navy-400">=</span>
        <div className="tabular rounded-lg border border-forest-700 bg-white px-3 py-2 text-sm font-bold text-forest-800">
          {formatArea(converted, target)}
        </div>
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value as AreaUnit)}
          className="ml-auto rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-700 focus:border-forest-600 focus:outline-none"
        >
          {AREA_UNITS.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-2 text-[11px] text-navy-400">
        Conversions are approximate. Confirm exact measurements on the official site plan.
      </p>
    </div>
  );
}
