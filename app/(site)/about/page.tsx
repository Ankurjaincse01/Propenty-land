import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  HeartHandshake,
  ShieldCheck,
  MapPinned,
  Phone,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { loadSettings } from "@/lib/settings";
import { generateWhatsAppUrl } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/Shared";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about our property dealership, service areas and the values we bring to plot buying in India.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: ShieldCheck,
    title: "Honesty first",
    text: "We publish only owner-confirmed details and never invent approvals or ownership claims.",
  },
  {
    icon: Target,
    title: "Clear information",
    text: "Plot area, pricing, facing and road access presented in a format that is easy to compare.",
  },
  {
    icon: HeartHandshake,
    title: "Customer focus",
    text: "Guided site visits and prompt responses on WhatsApp and phone, with no obligation.",
  },
  {
    icon: MapPinned,
    title: "Local knowledge",
    text: "We help you understand zoning, access roads and landmarks for each location we serve.",
  },
];

export default async function AboutPage() {
  const settings = await loadSettings();

  return (
    <div className="bg-alabaster">
      <div className="border-b border-navy-100 bg-white">
        <div className="section py-10">
          <SectionHeading
            eyebrow="About us"
            title={`${settings.businessName}`}
            description={settings.tagline}
          />
        </div>
      </div>

      <div className="section grid grid-cols-1 gap-12 py-12 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-navy-900">Who we are</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-navy-600">
            <p>
              {settings.businessName} is a property dealership focused on residential,
              commercial and NA plots. We help buyers discover available plots, compare
              prices and understand each layout before committing.
            </p>
            <p>
              Our listings are presented with the information the property owner supplies —
              area, dimensions, facing, road width and, where confirmed, approvals. We
              deliberately avoid making legal or ownership claims on a seller's behalf.
            </p>
            <p>
              This website is a demonstration build. Sample listings are clearly labelled
              as demo data and do not represent real property offers.
            </p>
          </div>

          <h2 className="mt-10 font-heading text-2xl font-extrabold text-navy-900">
            Service areas
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-navy-600">
            We operate across city residential layouts, highway-facing commercial plots,
            gated townships and farm/NA land. Share your target location and budget and we
            will shortlist suitable plots.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={generateWhatsAppUrl(
                settings.whatsappNumber,
                `Hello ${settings.businessName}, I'd like to know more about your plots.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <MessageCircle className="h-4 w-4" /> Message us
            </a>
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="btn-outline">
              <Phone className="h-4 w-4" /> Call {settings.phone}
            </a>
            <Link href="/plots" className="btn-ghost">
              Browse plots <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-extrabold text-navy-900">Our values</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-800">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-navy-900">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-500">{v.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-gold-200 bg-gold-50 p-6">
            <h3 className="font-heading text-base font-bold text-gold-800">
              A note on honesty
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gold-900/80">
              We do not display RERA/DTCP/NA approval numbers, legal clearances or customer
              testimonials unless they have been supplied and verified. Where such data is
              present in the database, the relevant sections render automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
