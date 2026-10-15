"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PropertyCard, { PropertyCardData } from "@/components/ui/PropertyCard";
import { SectionHeading, SkeletonGrid } from "@/components/ui/Shared";
import api from "@/lib/api";

export default function FeaturedPlots({ whatsappNumber }: { whatsappNumber: string }) {
  const [plots, setPlots] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/properties", { params: { featured: "true", limit: 6, sort: "newest" } })
      .then(({ data }) => {
        if (data.success && data.data.length) setPlots(data.data);
        else
          return api
            .get("/properties", { params: { limit: 6, sort: "newest" } })
            .then((r) => setPlots(r.data.data || []));
      })
      .catch(() => setPlots([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && plots.length === 0) return null;

  return (
    <section className="section py-16">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Featured"
          title="Handpicked plots for you"
          description="A selection of premium residential and commercial plots across our network."
        />
        <Link href="/plots" className="btn-outline">
          View all plots <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <SkeletonGrid count={3} />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plots.map((p) => (
            <PropertyCard key={p._id} property={p} whatsappNumber={whatsappNumber} />
          ))}
        </div>
      )}
    </section>
  );
}
