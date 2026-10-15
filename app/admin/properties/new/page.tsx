"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PropertyForm from "@/components/admin/PropertyForm";

export default function NewPropertyPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/properties"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-navy-500 hover:text-forest-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to properties
        </Link>
        <h2 className="font-heading text-2xl font-extrabold text-navy-900">Add property</h2>
        <p className="text-sm text-navy-500">
          Create a plot listing. Fields marked * are required.
        </p>
      </div>

      <PropertyForm
        onSaved={(id) => router.push(`/admin/properties/${id}/edit`)}
      />
    </div>
  );
}
