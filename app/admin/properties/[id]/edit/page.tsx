"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import api from "@/lib/api";
import PropertyForm, { PropertyFormValues } from "@/components/admin/PropertyForm";

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [initial, setInitial] = useState<PropertyFormValues | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/admin/properties/${id}`)
      .then(({ data }) => {
        const p = data.data;
        setInitial({
          _id: p._id,
          title: p.title,
          plotNumber: p.plotNumber || "",
          description: p.description,
          propertyType: p.propertyType,
          project: p.project?._id || p.project || "",
          price: p.price,
          priceDisplay: p.priceDisplay || "",
          area: p.area,
          areaUnit: p.areaUnit,
          facing: p.facing || "",
          isCornerPlot: !!p.isCornerPlot,
          roadWidthFt: p.roadWidthFt,
          boundaryWall: !!p.boundaryWall,
          zoning: p.zoning || "",
          location: {
            address: p.location?.address || "",
            locality: p.location?.locality || "",
            city: p.location?.city || "",
            state: p.location?.state || "",
            pincode: p.location?.pincode || "",
          },
          coordinates: {
            lat: p.coordinates?.lat,
            lng: p.coordinates?.lng,
          },
          landmarks: p.landmarks || [],
          images: p.images || [],
          layoutPlanUrl: p.layoutPlanUrl || "",
          layoutPosition: p.layoutPosition || { x: null, y: null },
          amenities: p.amenities || [],
          approvals: p.approvals || [],
          status: p.status,
          featured: !!p.featured,
          isDemo: !!p.isDemo,
          seo: {
            metaTitle: p.seo?.metaTitle || "",
            metaDescription: p.seo?.metaDescription || "",
          },
        });
      })
      .catch(() => toast.error("Could not load this property"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/properties"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-navy-500 hover:text-forest-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to properties
        </Link>
        <h2 className="font-heading text-2xl font-extrabold text-navy-900">Edit property</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-navy-400">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : initial ? (
        <PropertyForm initial={initial} onSaved={() => router.push("/admin/properties")} />
      ) : (
        <p className="rounded-2xl border border-navy-100 bg-white p-6 text-sm text-navy-500">
          Property not found.
        </p>
      )}
    </div>
  );
}
