"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Loader2, Save } from "lucide-react";
import ImageUploader, { UploadedImage } from "@/components/admin/ImageUploader";
import AdminPlotPinPicker from "@/components/admin/AdminPlotPinPicker";
import { Card, Grid, Toggle, TagInput, LandmarkInput } from "@/components/admin/FormBits";
import { propertySchema, zodErrors } from "@/lib/validation";
import { AREA_UNITS, FACINGS, cn } from "@/lib/utils";
import api from "@/lib/api";

interface ProjectOption {
  _id: string;
  name: string;
  masterLayoutImage?: string;
}

export interface PropertyFormValues {
  _id?: string;
  title: string;
  plotNumber?: string;
  description: string;
  propertyType: "Residential" | "Commercial";
  project?: string | null;
  price: number;
  priceDisplay?: string;
  area: number;
  areaUnit: "sq.ft" | "sq.yd" | "sq.m" | "guntha" | "acre";
  pricePerUnit?: number;
  dimensions?: { length?: number; width?: number };
  facing?: string;
  isCornerPlot?: boolean;
  roadWidthFt?: number;
  boundaryWall?: boolean;
  zoning?: string;
  location: {
    address?: string;
    locality?: string;
    city: string;
    state: string;
    pincode?: string;
  };
  coordinates?: { lat?: number; lng?: number };
  landmarks?: Array<{ name: string; distanceKm?: number }>;
  images?: UploadedImage[];
  layoutPlanUrl?: string;
  layoutPosition?: { x: number | null; y: number | null; polygonPoints?: string | null };
  amenities?: string[];
  approvals?: string[];
  status: "Available" | "Reserved" | "Sold";
  featured?: boolean;
  isDemo?: boolean;
  seo?: { metaTitle?: string; metaDescription?: string };
}

const blank: PropertyFormValues = {
  title: "",
  plotNumber: "",
  description: "",
  propertyType: "Residential",
  project: "",
  price: 0,
  priceDisplay: "",
  area: 0,
  areaUnit: "sq.yd",
  facing: "",
  isCornerPlot: false,
  roadWidthFt: undefined,
  boundaryWall: false,
  zoning: "",
  location: { address: "", locality: "", city: "", state: "", pincode: "" },
  coordinates: { lat: undefined, lng: undefined },
  landmarks: [],
  images: [],
  layoutPlanUrl: "",
  layoutPosition: { x: null, y: null },
  amenities: [],
  approvals: [],
  status: "Available",
  featured: false,
  isDemo: true,
  seo: { metaTitle: "", metaDescription: "" },
};

export default function PropertyForm({
  initial,
  onSaved,
  backHref = "/admin/properties",
}: {
  initial?: PropertyFormValues;
  onSaved: (id: string) => void;
  backHref?: string;
}) {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [images, setImages] = useState<UploadedImage[]>(initial?.images || []);
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities || []);
  const [approvals, setApprovals] = useState<string[]>(initial?.approvals || []);
  const [landmarks, setLandmarks] = useState<Array<{ name: string; distanceKm?: number }>>(
    initial?.landmarks || []
  );
  const [layoutPosition, setLayoutPosition] = useState<{ x: number | null; y: number | null }>(
    initial?.layoutPosition
      ? { x: initial.layoutPosition.x ?? null, y: initial.layoutPosition.y ?? null }
      : { x: null, y: null }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch } = useForm<PropertyFormValues>({
    defaultValues: initial ? { ...blank, ...initial } : blank,
  });

  useEffect(() => {
    api
      .get("/admin/projects")
      .then(({ data }) => setProjects(data.data || []))
      .catch(() => {});
  }, []);

  const selectedProjectId = watch("project");
  const selectedProject = projects.find((p) => p._id === selectedProjectId);

  const onSubmit = async (values: PropertyFormValues) => {
    const payload = {
      ...values,
      project: values.project || null,
      images: images.map((img, i) => ({ ...img, order: i })),
      amenities,
      approvals,
      landmarks,
      layoutPosition: { ...layoutPosition, polygonPoints: null },
      price: Number(values.price),
      area: Number(values.area),
      pricePerUnit: values.price && values.area ? Math.round(Number(values.price) / Number(values.area)) : undefined,
    };

    const parsed = propertySchema.safeParse(payload);
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
        await api.put(`/admin/properties/${initial._id}`, parsed.data);
        toast.success("Property updated");
        onSaved(initial._id);
      } else {
        const { data } = await api.post("/admin/properties", parsed.data);
        toast.success("Property created");
        onSaved(data.data._id);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not save property");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldErr = (name: string) =>
    errors[name] ? <p className="mt-1 text-xs text-rose-600">{errors[name]}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card title="Basic details">
        <Grid>
          <div className="sm:col-span-2">
            <label className="label">Property title *</label>
            <input className="input" placeholder="e.g. Green Valley Residential Plot" {...register("title")} />
            {fieldErr("title")}
          </div>
          <div>
            <label className="label">Plot number</label>
            <input className="input" placeholder="e.g. A-24" {...register("plotNumber")} />
          </div>
          <div>
            <label className="label">Property type *</label>
            <select className="input" {...register("propertyType")}>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
          <div>
            <label className="label">Parent project</label>
            <select className="input" {...register("project")}>
              <option value="">— None —</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Availability status</label>
            <select className="input" {...register("status")}>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description *</label>
            <textarea rows={5} className="input resize-none" placeholder="Describe the plot, access, surroundings…" {...register("description")} />
            {fieldErr("description")}
          </div>
          <div className="flex flex-wrap gap-5 sm:col-span-2">
            <Toggle label="Featured listing" {...register("featured")} />
            <Toggle label="Mark as demo listing" {...register("isDemo")} />
            <Toggle label="Corner plot" {...register("isCornerPlot")} />
            <Toggle label="Boundary wall present" {...register("boundaryWall")} />
          </div>
        </Grid>
      </Card>

      <Card title="Pricing & dimensions">
        <Grid>
          <div>
            <label className="label">Total price (₹) *</label>
            <input type="number" className="input" placeholder="e.g. 1850000" {...register("price")} />
            {fieldErr("price")}
          </div>
          <div>
            <label className="label">Price display override</label>
            <input className="input" placeholder="e.g. ₹18.50 Lakhs (optional)" {...register("priceDisplay")} />
          </div>
          <div>
            <label className="label">Plot area *</label>
            <input type="number" step="any" className="input" placeholder="e.g. 1200" {...register("area")} />
            {fieldErr("area")}
          </div>
          <div>
            <label className="label">Area unit *</label>
            <select className="input" {...register("areaUnit")}>
              {AREA_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Length (ft)</label>
            <input type="number" step="any" className="input" {...register("dimensions.length")} />
          </div>
          <div>
            <label className="label">Width (ft)</label>
            <input type="number" step="any" className="input" {...register("dimensions.width")} />
          </div>
          <div>
            <label className="label">Facing</label>
            <select className="input" {...register("facing")}>
              <option value="">— Select —</option>
              {FACINGS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Road width (ft)</label>
            <input type="number" step="any" className="input" placeholder="e.g. 30" {...register("roadWidthFt")} />
          </div>
          <div>
            <label className="label">Zoning / approval type</label>
            <input className="input" placeholder="e.g. Residential NA / Gated Layout" {...register("zoning")} />
          </div>
        </Grid>
        <p className="mt-3 text-[11px] text-navy-400">
          Price per unit is calculated automatically from total price ÷ area.
        </p>
      </Card>

      <Card title="Location">
        <Grid>
          <div className="sm:col-span-2">
            <label className="label">Address</label>
            <input className="input" placeholder="Street / survey no. (kept private)" {...register("location.address")} />
          </div>
          <div>
            <label className="label">Locality</label>
            <input className="input" placeholder="e.g. Hinjewadi Phase 2" {...register("location.locality")} />
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
            <label className="label">Pincode</label>
            <input className="input" {...register("location.pincode")} />
          </div>
          <div>
            <label className="label">Latitude</label>
            <input type="number" step="any" className="input" placeholder="e.g. 18.5204" {...register("coordinates.lat")} />
          </div>
          <div>
            <label className="label">Longitude</label>
            <input type="number" step="any" className="input" placeholder="e.g. 73.8567" {...register("coordinates.lng")} />
          </div>
        </Grid>
      </Card>

      <Card title="Images">
        <ImageUploader value={images} onChange={setImages} folder="greenland-estates/properties" />
      </Card>

      <Card title="Amenities & approvals">
        <TagInput label="Amenities / facilities" value={amenities} onChange={setAmenities} placeholder="e.g. 30 ft tar road, water line, street lights" />
        <div className="mt-5">
          <TagInput
            label="Approvals & documents (only if confirmed by owner)"
            value={approvals}
            onChange={setApprovals}
            placeholder="e.g. DTCP approved layout, registered sale deed"
          />
        </div>
      </Card>

      <Card title="Nearby landmarks">
        <LandmarkInput value={landmarks} onChange={setLandmarks} />
      </Card>

      {selectedProject?.masterLayoutImage && (
        <Card title="Interactive master layout position">
          <AdminPlotPinPicker
            masterLayoutImage={selectedProject.masterLayoutImage}
            value={layoutPosition}
            plotNumber={watch("plotNumber")}
            onChange={setLayoutPosition}
          />
        </Card>
      )}

      <Card title="SEO">
        <Grid>
          <div className="sm:col-span-2">
            <label className="label">Meta title</label>
            <input className="input" placeholder="Overrides the page title in search results" {...register("seo.metaTitle")} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Meta description</label>
            <textarea rows={3} className="input resize-none" {...register("seo.metaDescription")} />
          </div>
        </Grid>
      </Card>

      <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-2xl border border-navy-100 bg-white/95 p-4 shadow-card backdrop-blur">
        <a href={backHref} className="btn-ghost">
          Cancel
        </a>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {initial?._id ? "Save changes" : "Create property"}
        </button>
      </div>
    </form>
  );
}
