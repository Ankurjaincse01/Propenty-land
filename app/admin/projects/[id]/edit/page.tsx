"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import api from "@/lib/api";
import ProjectForm, { ProjectFormValues } from "@/components/admin/ProjectForm";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [initial, setInitial] = useState<ProjectFormValues | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/admin/projects/${id}`)
      .then(({ data }) => {
        const p = data.data.project;
        setInitial({
          _id: p._id,
          name: p.name,
          description: p.description,
          location: {
            locality: p.location?.locality || "",
            city: p.location?.city || "",
            state: p.location?.state || "",
          },
          coordinates: { lat: p.coordinates?.lat, lng: p.coordinates?.lng },
          images: p.images || [],
          masterLayoutImage: p.masterLayoutImage || "",
          amenities: p.amenities || [],
          plotSizeRange: p.plotSizeRange || { min: undefined, max: undefined, unit: "sq.yd" },
          startingPrice: p.startingPrice,
          totalPlots: p.totalPlots,
          projectStatus: p.projectStatus,
          featured: !!p.featured,
          isDemo: !!p.isDemo,
        });
      })
      .catch(() => toast.error("Could not load this project"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/projects"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-navy-500 hover:text-forest-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>
        <h2 className="font-heading text-2xl font-extrabold text-navy-900">Edit project</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-navy-400">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : initial ? (
        <ProjectForm initial={initial} onSaved={() => router.push("/admin/projects")} />
      ) : (
        <p className="rounded-2xl border border-navy-100 bg-white p-6 text-sm text-navy-500">
          Project not found.
        </p>
      )}
    </div>
  );
}
