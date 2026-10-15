"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Compass, Sparkles, Layers } from "lucide-react";
import InteractivePlotMap, { MapPlot } from "@/components/projects/InteractivePlotMap";
import { SectionHeading } from "@/components/ui/Shared";
import api from "@/lib/api";
import { DEMO_PROJECTS, DEMO_PROPERTIES, DEMO_PROJECT_1_ID } from "@/lib/demoData";

export default function HomeTownshipMap({
  whatsappNumber,
}: {
  whatsappNumber: string;
}) {
  const [project, setProject] = useState<{
    name: string;
    slug: string;
    masterLayoutImage: string;
  }>({
    name: DEMO_PROJECTS[0].name,
    slug: DEMO_PROJECTS[0].slug,
    masterLayoutImage: DEMO_PROJECTS[0].masterLayoutImage,
  });

  const [plots, setPlots] = useState<MapPlot[]>(
    DEMO_PROPERTIES.filter((p) => p.project === DEMO_PROJECT_1_ID) as unknown as MapPlot[]
  );

  useEffect(() => {
    // Attempt to load from API if connected
    api
      .get("/projects", { params: { featured: "true" } })
      .then(async ({ data }) => {
        const pList = data.data || [];
        const target = pList.find((p: any) => p.masterLayoutImage) || pList[0];
        if (target && target.slug) {
          const detailRes = await api.get(`/projects/${target.slug}`);
          if (detailRes.data.success && detailRes.data.data.project) {
            setProject(detailRes.data.data.project);
            if (detailRes.data.data.properties?.length) {
              setPlots(detailRes.data.data.properties);
            }
          }
        }
      })
      .catch(() => {
        // Keeps demo data
      });
  }, []);

  return (
    <section className="bg-stone py-20">
      <div className="section">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-gold-700">
              <Sparkles className="h-3.5 w-3.5" />
              Live Interactive Map
            </div>
            <h2 className="font-heading text-3xl font-extrabold text-navy-900 md:text-4xl">
              Click &amp; Inspect Plot Availability
            </h2>
            <p className="mt-2.5 max-w-2xl text-base text-navy-600">
              Select any numbered plot pin on the layout plan below to view dimensions,
              facing, road width, and real-time availability.
            </p>
          </div>
          <Link
            href={`/projects/${project.slug}`}
            className="btn-outline border-navy-200 bg-white hover:border-forest-700"
          >
            Explore Township Page <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <InteractivePlotMap
          projectName={project.name}
          masterLayoutImage={project.masterLayoutImage}
          plots={plots}
          whatsappNumber={whatsappNumber}
        />
      </div>
    </section>
  );
}
