"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import api from "@/lib/api";
import { Card, Grid } from "@/components/admin/FormBits";

interface SettingsValues {
  businessName: string;
  tagline: string;
  logoUrl: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  officeAddress: string;
  workingHours: string;
  mapCoordinates: { lat?: number; lng?: number };
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    twitter: string;
  };
  seoDefaults: { title: string; description: string };
  currency: string;
}

const blank: SettingsValues = {
  businessName: "",
  tagline: "",
  logoUrl: "",
  phone: "",
  whatsappNumber: "",
  email: "",
  officeAddress: "",
  workingHours: "",
  mapCoordinates: { lat: undefined, lng: undefined },
  socialLinks: { facebook: "", instagram: "", linkedin: "", youtube: "", twitter: "" },
  seoDefaults: { title: "", description: "" },
  currency: "₹",
};

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm<SettingsValues>({ defaultValues: blank });

  useEffect(() => {
    api
      .get("/settings")
      .then(({ data }) => {
        const s = data.data;
        reset({
          businessName: s.businessName || "",
          tagline: s.tagline || "",
          logoUrl: s.logoUrl || "",
          phone: s.phone || "",
          whatsappNumber: s.whatsappNumber || "",
          email: s.email || "",
          officeAddress: s.officeAddress || "",
          workingHours: s.workingHours || "",
          mapCoordinates: { lat: s.mapCoordinates?.lat, lng: s.mapCoordinates?.lng },
          socialLinks: {
            facebook: s.socialLinks?.facebook || "",
            instagram: s.socialLinks?.instagram || "",
            linkedin: s.socialLinks?.linkedin || "",
            youtube: s.socialLinks?.youtube || "",
            twitter: s.socialLinks?.twitter || "",
          },
          seoDefaults: {
            title: s.seoDefaults?.title || "",
            description: s.seoDefaults?.description || "",
          },
          currency: s.currency || "₹",
        });
      })
      .catch(() => toast.error("Could not load settings"))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (values: SettingsValues) => {
    setSaving(true);
    try {
      await api.put("/admin/settings", values);
      toast.success("Settings saved");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-navy-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-navy-900">Site settings</h2>
        <p className="text-sm text-navy-500">
          These values power the phone number, WhatsApp links, footer and SEO defaults across
          the public website.
        </p>
      </div>

      <Card title="Business">
        <Grid>
          <div>
            <label className="label">Business name *</label>
            <input className="input" {...register("businessName")} />
          </div>
          <div>
            <label className="label">Currency symbol</label>
            <input className="input" {...register("currency")} />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="label">Tagline</label>
            <input className="input" {...register("tagline")} />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="label">Logo URL (optional)</label>
            <input className="input" placeholder="https://…" {...register("logoUrl")} />
          </div>
        </Grid>
      </Card>

      <Card title="Contact">
        <Grid>
          <div>
            <label className="label">Phone number *</label>
            <input className="input" placeholder="+91 98765 43210" {...register("phone")} />
          </div>
          <div>
            <label className="label">WhatsApp number *</label>
            <input
              className="input"
              placeholder="919876543210"
              {...register("whatsappNumber")}
            />
          </div>
          <div>
            <label className="label">Email *</label>
            <input className="input" type="email" {...register("email")} />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="label">Office address *</label>
            <input className="input" {...register("officeAddress")} />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="label">Working hours</label>
            <input className="input" {...register("workingHours")} />
          </div>
          <div>
            <label className="label">Office latitude</label>
            <input type="number" step="any" className="input" {...register("mapCoordinates.lat")} />
          </div>
          <div>
            <label className="label">Office longitude</label>
            <input type="number" step="any" className="input" {...register("mapCoordinates.lng")} />
          </div>
        </Grid>
        <p className="mt-3 text-xs text-navy-400">
          The WhatsApp number must include the country code, digits only (e.g. 919876543210).
        </p>
      </Card>

      <Card title="Social links">
        <Grid>
          <div>
            <label className="label">Facebook</label>
            <input className="input" {...register("socialLinks.facebook")} />
          </div>
          <div>
            <label className="label">Instagram</label>
            <input className="input" {...register("socialLinks.instagram")} />
          </div>
          <div>
            <label className="label">LinkedIn</label>
            <input className="input" {...register("socialLinks.linkedin")} />
          </div>
          <div>
            <label className="label">YouTube</label>
            <input className="input" {...register("socialLinks.youtube")} />
          </div>
          <div>
            <label className="label">X / Twitter</label>
            <input className="input" {...register("socialLinks.twitter")} />
          </div>
        </Grid>
      </Card>

      <Card title="SEO defaults">
        <Grid>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="label">Default meta title</label>
            <input className="input" {...register("seoDefaults.title")} />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="label">Default meta description</label>
            <textarea rows={3} className="input resize-none" {...register("seoDefaults.description")} />
          </div>
        </Grid>
      </Card>

      <div className="sticky bottom-4 flex justify-end rounded-2xl border border-navy-100 bg-white/95 p-4 shadow-card backdrop-blur">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save settings
        </button>
      </div>
    </form>
  );
}
