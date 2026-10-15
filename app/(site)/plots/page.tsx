import type { Metadata } from "next";
import { Suspense } from "react";
import PlotsExplorer from "@/components/plots/PlotsExplorer";
import { SkeletonGrid } from "@/components/ui/Shared";
import { loadSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Explore Plots",
  description:
    "Browse available residential and commercial plots. Filter by location, budget, area, facing and availability.",
  alternates: { canonical: "/plots" },
};

export default async function PlotsPage() {
  const settings = await loadSettings();

  return (
    <div className="bg-alabaster">
      <div className="border-b border-navy-100 bg-white">
        <div className="section py-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-500">
            Plot listings
          </p>
          <h1 className="mt-1 font-heading text-3xl font-extrabold text-navy-900 md:text-4xl">
            Explore available plots
          </h1>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="section py-10">
            <SkeletonGrid count={6} />
          </div>
        }
      >
        <PlotsExplorer whatsappNumber={settings.whatsappNumber} />
      </Suspense>
    </div>
  );
}
