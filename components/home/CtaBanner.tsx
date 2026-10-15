import { MessageCircle, Phone } from "lucide-react";
import { generateWhatsAppUrl } from "@/lib/utils";
import { SiteSettingsData } from "@/lib/defaults";

export default function CtaBanner({ settings }: { settings: SiteSettingsData }) {
  return (
    <section className="section py-16">
      <div className="relative overflow-hidden rounded-3xl bg-forest-800 px-6 py-12 md:px-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold-400/10" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-white/5" />
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">
              Ready to visit?
            </p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold text-white md:text-4xl">
              Let's find the plot that fits your plan.
            </h2>
            <p className="mt-3 text-navy-200">
              Message us on WhatsApp for live availability, price sheets and to book a
              site visit — no obligation.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={generateWhatsAppUrl(
                settings.whatsappNumber,
                `Hello ${settings.businessName}, please share available plots and price details.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-emerald-500 px-6 py-3.5 text-base text-white hover:bg-emerald-600"
            >
              <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
            </a>
            <a
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              className="btn border border-white/25 bg-white/10 px-6 py-3.5 text-base text-white backdrop-blur hover:bg-white/20"
            >
              <Phone className="h-5 w-5" /> {settings.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
