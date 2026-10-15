"use client";

import { useState } from "react";
import { Plus, X, MapPin } from "lucide-react";

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-soft">
      <h3 className="mb-4 font-heading text-base font-bold text-navy-900">{title}</h3>
      {children}
    </section>
  );
}

export function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function Toggle({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-navy-700">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-navy-300 text-forest-700 focus:ring-forest-600"
        {...rest}
      />
      {label}
    </label>
  );
}

export function TagInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  const add = () => {
    const t = text.trim();
    if (!t) return;
    if (!value.includes(t)) onChange([...value, t]);
    setText("");
  };
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2">
        <input
          className="input"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button type="button" onClick={add} className="btn-outline shrink-0">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      {value.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.map((v) => (
            <span key={v} className="chip border border-navy-100 bg-stone text-navy-700">
              {v}
              <button type="button" onClick={() => onChange(value.filter((x) => x !== v))}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function LandmarkInput({
  value,
  onChange,
}: {
  value: Array<{ name: string; distanceKm?: number }>;
  onChange: (v: Array<{ name: string; distanceKm?: number }>) => void;
}) {
  const [name, setName] = useState("");
  const [km, setKm] = useState("");
  const add = () => {
    const n = name.trim();
    if (!n) return;
    onChange([...value, { name: n, distanceKm: km ? Number(km) : undefined }]);
    setName("");
    setKm("");
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <input
          className="input flex-1"
          placeholder="Landmark name e.g. City Hospital"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <input
          className="input w-28"
          type="number"
          step="any"
          placeholder="km"
          value={km}
          onChange={(e) => setKm(e.target.value)}
        />
        <button type="button" onClick={add} className="btn-outline">
          <MapPin className="h-4 w-4" /> Add
        </button>
      </div>
      {value.length > 0 && (
        <ul className="mt-3 space-y-2">
          {value.map((l, i) => (
            <li
              key={`${l.name}-${i}`}
              className="flex items-center justify-between rounded-lg border border-navy-100 bg-stone px-3 py-2 text-sm"
            >
              <span className="text-navy-700">{l.name}</span>
              <div className="flex items-center gap-3">
                {l.distanceKm != null && (
                  <span className="tabular text-xs text-navy-400">{l.distanceKm} km</span>
                )}
                <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))}>
                  <X className="h-3.5 w-3.5 text-rose-500" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
