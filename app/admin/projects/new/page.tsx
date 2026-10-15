"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/projects"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-navy-500 hover:text-forest-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>
        <h2 className="font-heading text-2xl font-extrabold text-navy-900">Add project</h2>
      </div>

      <ProjectForm onSaved={(id) => router.push(`/admin/projects/${id}/edit`)} />
    </div>
  );
}
