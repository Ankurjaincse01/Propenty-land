import { PipelineStage } from "mongoose";

/** Remove empty-string values and coerce null-ish refs so Mongoose casts succeed. */
export function cleanRef<T = any>(value: T): T | null {
  if (value === "" || value === undefined || value === null) return null;
  return value;
}

export function stripEmpty<T extends Record<string, any>>(obj: T): T {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === "" || v === undefined) continue;
    if (v && typeof v === "object" && !Array.isArray(v) && !(v instanceof Date)) {
      const nested = stripEmpty(v);
      if (Object.keys(nested).length > 0) out[k] = nested;
      continue;
    }
    out[k] = v;
  }
  return out as T;
}

export function buildSearchStage(search: string): Record<string, any> {
  return {
    $or: [
      { title: { $regex: search, $options: "i" } },
      { plotNumber: { $regex: search, $options: "i" } },
      { "location.city": { $regex: search, $options: "i" } },
      { "location.locality": { $regex: search, $options: "i" } },
    ],
  };
}

export type { PipelineStage };
