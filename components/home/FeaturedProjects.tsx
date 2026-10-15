"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/ui/Shared";
import { formatPriceShort, STATUS_STYLES, cn } from "@/lib/utils";
import api from "@/lib/api";

interface ProjectCard {
  _id: string;
  name: string;
  slug: string;
  location: { locality?: string; city?: string };
  images?: Array<{ url: string }>;
  startingPrice?: number;
  projectStatus: string;
  plotSizeRange?: { min?: number; max?: number; unit?: string };
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/projects", { params: { featured: "true" } })
      .then(({ data }) => {
        const list = data.data || [];
        if (list.length) return setProjects(list.slice(0, 3));
        return api.get("/projects").then((r) => setProjects((r.data.data || []).slice(0, 3)));
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-stone py-16">
        <div className="section">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-white/60" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) return null;

  return (
    <section className="bg-stone py-16">
      <div className="section">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Projects"
            title="Plotted developments"
            description="Explore gated layouts and townships and pick the plot that fits your plan."
          />
          <Link href="/projects" className="btn-outline">
            All projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p._id}
              href={`/projects/${p.slug}`}
              className="group overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={
                    p.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className={cn("chip absolute left-3 top-3", STATUS_STYLES[p.projectStatus])}>
                  {p.projectStatus}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-bold text-navy-900">{p.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-navy-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {[p.location?.locality, p.location?.city].filter(Boolean).join(", ")}
                </p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="tabular font-semibold text-forest-800">
                    {p.startingPrice ? `From ${formatPriceShort(p.startingPrice)}` : "Price on request"}
                  </span>
                  {p.plotSizeRange?.min && (
                    <span className="tabular text-navy-400">
                      {p.plotSizeRange.min}–{p.plotSizeRange.max} {p.plotSizeRange.unit}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
