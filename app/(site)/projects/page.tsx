import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import dbConnect from "@/lib/mongoose";
import Project from "@/models/Project";
import { formatPriceShort, STATUS_STYLES, cn } from "@/lib/utils";
import { SectionHeading, EmptyState } from "@/components/ui/Shared";

import { getDemoProjects } from "@/lib/demoData";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore plotted developments, gated layouts and townships with interactive master plans.",
  alternates: { canonical: "/projects" },
};

async function getProjects() {
  try {
    await dbConnect();
    const list = await Project.find().sort({ featured: -1, createdAt: -1 }).lean<any[]>();
    if (list && list.length > 0) return list;
  } catch {
    // ignore DB errors
  }
  return getDemoProjects();
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="bg-alabaster">
      <div className="border-b border-navy-100 bg-white">
        <div className="section py-10">
          <SectionHeading
            eyebrow="Developments"
            title="Plotted projects & townships"
            description="Browse our plotted developments, then open a project to explore its interactive master layout and individual plots."
          />
        </div>
      </div>

      <div className="section py-10">
        {projects.length === 0 ? (
          <EmptyState
            title="No projects published yet"
            description="Projects will appear here once they are added from the admin dashboard."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link
                key={String(p._id)}
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
                  {p.isDemo && (
                    <span className="absolute right-3 top-3 rounded-md bg-navy-900/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                      Demo Project
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-bold text-navy-900">{p.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-navy-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {[p.location?.locality, p.location?.city].filter(Boolean).join(", ")}
                  </p>
                  <p className="mt-2 text-sm text-navy-500 line-clamp-2">{p.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="tabular text-sm font-semibold text-forest-800">
                      {p.startingPrice
                        ? `From ${formatPriceShort(p.startingPrice)}`
                        : "Price on request"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-forest-700">
                      Explore <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
