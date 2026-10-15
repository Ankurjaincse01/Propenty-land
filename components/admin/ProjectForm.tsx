"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Loader2, Save } from "lucide-react";
import ImageUploader, { UploadedImage } from "@/components/admin/ImageUploader";
import { Card, Grid, Toggle, TagInput } from "@/components/admin/FormBits";
import { projectSchema, zodErrors } from "@/lib/validation";
import { AREA_UNITS } from "@/lib/utils";
import api from "@/lib/api";

export interface ProjectFormValues {
  _id?: string;
  name: string;
  description: string;
  location: {
    locality?: string;
    city: string;
    state: string;
  };
  coordinates?: { lat?: number; lng?: number };
  images?: UploadedImage[];
  masterLayoutImage?: string;
  amenities?: string[];
  plotSizeRange?: { min?: number; max?: number; unit?: string };
  startingPrice?: number;
  totalPlots?: number;
  projectStatus: "Upcoming" | "Ongoing" | "Ready to Construct" | "Sold Out";
  featured?: boolean;
  isDemo?: boolean;
}

const blank: ProjectFormValues = {
  name: "",
  description: "",
  location: { locality: "", city: "", state: "" },
  coordinates: { lat: undefined, lng: undefined },
  images: [],
  masterLayoutImage: "",
  amenities: [],
  plotSizeRange: { min: undefined, max: undefined, unit: "sq.yd" },
  startingPrice: undefined,
  totalPlots: undefined,
  projectStatus: "Ongoing",
  featured: false,
  isDemo: true,
};

export default function ProjectForm({
  initial,
  onSaved,
}: {
  initial?: ProjectFormValues;
  onSaved: (id: string) => void;
}) {
  const [images, setImages] = useState<UploadedImage[]>(initial?.images || []);
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities || []);
  const [masterLayoutImage, setMasterLayoutImage] = useState(initial?.masterLayoutImage || "");
  const [layoutUploading, setLayoutUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit } = useForm<ProjectFormValues>({
    defaultValues: initial ? { ...blank, ...initial } : blank,
  });

  const uploadLayout = async (file: File | undefined) => {
    if (!file) return;
    setLayoutUploading(true);
    try {
      const dataUrl = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(String(r.result));
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const { data } = await api.post("/admin/upload", {
        file: dataUrl,
        folder: "greenland-estates/layouts",
      });
      if (data.success) {
        setMasterLayoutImage(data.data.url);
        toast.success("Master layout image uploaded");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Layout upload failed");
    } finally {
      setLayoutUploading(false);
    }
  };

  const onSubmit = async (values: ProjectFormValues) => {
    const payload = {
      ...values,
      images: images.map((img, i) => ({ ...img, order: i })),
      amenities,
      masterLayoutImage,
      startingPrice: values.startingPrice ? Number(values.startingPrice) : undefined,
      totalPlots: values.totalPlots ? Number(values.totalPlots) : undefined,
    };

    const parsed = projectSchema.safeParse(payload);
    if (!parsed.success) {
      const errs = zodErrors(parsed.error);
      setErrors(errs);
      toast.error(Object.values(errs)[0] || "Please fix the highlighted fields.");
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      if (initial?._id) {
        await api.put(`/admin/projects/${initial._id}`, parsed.data);
        toast.success("Project updated");
        onSaved(initial._id);
      } else {
        const { data } = await api.post("/admin/projects", parsed.data);
        toast.success("Project created");
        onSaved(data.data._id);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not save project");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldErr = (name: string) =>
    errors[name] ? <p className="mt-1 text-xs text-rose-600">{errors[name]}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card title="Project details">
        <Grid>
          <div className="sm:col-span-2">
            <label className="label">Project name *</label>
            <input
              className="input"
              placeholder="e.g. Green Valley Township"
              {...register("name")}
            />
            {fieldErr("name")}
          </div>
          <div>
            <label className="label">Status *</label>
            <select className="input" {...register("projectStatus")}>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Ready to Construct">Ready to Construct</option>
              <option value="Sold Out">Sold Out</option>
            </select>
          </div>
          <div>
            <label className="label">Total plots</label>
            <input type="number" className="input" placeholder="e.g. 120" {...register("totalPlots")} />
          </div>
          <div>
            <label className="label">Starting price (₹)</label>
            <input
              type="number"
              className="input"
              placeholder="e.g. 1500000"
              {...register("startingPrice")}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="label">Description *</label>
            <textarea
              rows={4}
              className="input resize-none"
              placeholder="Describe the township, roads, amenities, approvals (only if confirmed)…"
              {...register("description")}
            />
            {fieldErr("description")}
          </div>
          <div className="flex flex-wrap gap-5 sm:col-span-2 lg:col-span-3">
            <Toggle label="Featured project" {...register("featured")} />
            <Toggle label="Mark as demo project" {...register("isDemo")} />
          </div>
        </Grid>
      </Card>

      <Card title="Location">
        <Grid>
          <div>
            <label className="label">Locality</label>
            <input className="input" placeholder="e.g. Wagholi" {...register("location.locality")} />
          </div>
          <div>
            <label className="label">City *</label>
            <input className="input" placeholder="e.g. Pune" {...register("location.city")} />
            {fieldErr("location.city")}
          </div>
          <div>
            <label className="label">State *</label>
            <input className="input" placeholder="e.g. Maharashtra" {...register("location.state")} />
            {fieldErr("location.state")}
          </div>
          <div>
            <label className="label">Latitude</label>
            <input
              type="number"
              step="any"
              className="input"
              placeholder="e.g. 18.5204"
              {...register("coordinates.lat")}
            />
          </div>
          <div>
            <label className="label">Longitude</label>
            <input
              type="number"
              step="any"
              className="input"
              placeholder="e.g. 73.8567"
              {...register("coordinates.lng")}
            />
          </div>
        </Grid>
      </Card>

      <Card title="Plot size range & amenities">
        <Grid>
          <div>
            <label className="label">Min plot size</label>
            <input type="number" step="any" className="input" {...register("plotSizeRange.min")} />
          </div>
          <div>
            <label className="label">Max plot size</label>
            <input type="number" step="any" className="input" {...register("plotSizeRange.max")} />
          </div>
          <div>
            <label className="label">Size unit</label>
            <select className="input" {...register("plotSizeRange.unit")}>
              {AREA_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </Grid>
        <div className="mt-5">
          <TagInput
            label="Amenities"
            value={amenities}
            onChange={setAmenities}
            placeholder="e.g. Gated entrance, 30 ft roads, park, street lights"
          />
        </div>
      </Card>

      <Card title="Project images">
        <ImageUploader value={images} onChange={setImages} folder="greenland-estates/projects" />
      </Card>

      <Card title="Master layout image (for the interactive plot map)">
        <p className="mb-3 text-xs text-navy-500">
          Upload the 2D master layout (JPEG/PNG/WebP exported from AutoCAD or a brochure). Once
          saved, you can place each plot on this image from the property form.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label className="btn-outline cursor-pointer">
            {layoutUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Upload master layout"
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              hidden
              onChange={(e) => uploadLayout(e.target.files?.[0])}
            />
          </label>
          {masterLayoutImage && (
            <button
              type="button"
              onClick={() => setMasterLayoutImage("")}
              className="text-xs font-semibold text-rose-500"
            >
              Remove
            </button>
          )}
        </div>
        <div className="mt-3">
          <input
            className="input"
            placeholder="…or paste a master layout image URL"
            value={masterLayoutImage}
            onChange={(e) => setMasterLayoutImage(e.target.value)}
          />
        </div>
        {masterLayoutImage && (
          <div className="mt-4 overflow-hidden rounded-xl border border-navy-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={masterLayoutImage} alt="Master layout preview" className="w-full" />
          </div>
        )}
      </Card>

      <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-2xl border border-navy-100 bg-white/95 p-4 shadow-card backdrop-blur">
        <a href="/admin/projects" className="btn-ghost">
          Cancel
        </a>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {initial?._id ? "Save changes" : "Create project"}
        </button>
      </div>
    </form>
  );
}
