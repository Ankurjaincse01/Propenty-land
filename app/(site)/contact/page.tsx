import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { loadSettings } from "@/lib/settings";
import { generateWhatsAppUrl } from "@/lib/utils";
import EnquiryForm from "@/components/forms/EnquiryForm";
import LocationMap from "@/components/map/LocationMap";
import { SectionHeading } from "@/components/ui/Shared";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Call, WhatsApp or email us to enquire about plots, request price sheets or book a site visit.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await loadSettings();
  const coords = settings.mapCoordinates;

  return (
    <div className="bg-alabaster">
      <div className="border-b border-navy-100 bg-white">
        <div className="section py-10">
          <SectionHeading
            eyebrow="Contact"
            title="Get in touch"
            description="Tell us what you're looking for and we'll help you shortlist the right plots."
          />
        </div>
      </div>

      <div className="section grid grid-cols-1 gap-10 py-12 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
            <h2 className="font-heading text-lg font-bold text-navy-900">Reach us</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <ContactRow
                icon={Phone}
                label="Phone"
                value={settings.phone}
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
              />
              <ContactRow
                icon={MessageCircle}
                label="WhatsApp"
                value="Chat with us instantly"
                href={generateWhatsAppUrl(settings.whatsappNumber, "Hello, I'd like to enquire about a plot.")}
              />
              <ContactRow
                icon={Mail}
                label="Email"
                value={settings.email}
                href={`mailto:${settings.email}`}
              />
              <ContactRow icon={MapPin} label="Office" value={settings.officeAddress} />
              <ContactRow icon={Clock} label="Working hours" value={settings.workingHours} />
            </ul>
          </div>

          <div className="rounded-2xl border border-navy-100 bg-white p-3 shadow-soft">
            <LocationMap
              points={
                coords?.lat != null && coords?.lng != null
                  ? [{ lat: coords.lat, lng: coords.lng, label: settings.businessName }]
                  : []
              }
              zoom={13}
              height={320}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card lg:p-8">
          <h2 className="font-heading text-xl font-bold text-navy-900">Send us a message</h2>
          <p className="mt-1 mb-6 text-sm text-navy-500">
            We usually respond within a few hours during working hours.
          </p>
          <EnquiryForm source="Contact Page" />
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-50 text-forest-800">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">
          {label}
        </p>
        <p className="mt-0.5 font-medium text-navy-800">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <li>
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block transition hover:opacity-80">
        {content}
      </a>
    </li>
  ) : (
    <li>{content}</li>
  );
}
