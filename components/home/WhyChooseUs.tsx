import { ShieldCheck, Compass, Handshake, Receipt, Headset, Ruler, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/Shared";

const items = [
  {
    icon: ShieldCheck,
    title: "100% Owner-Verified Listings",
    text: "We publish only what the property owner confirms — zero fake claims, accurate measurements, and verified layout approvals.",
    highlight: "Clear Titles",
  },
  {
    icon: Compass,
    title: "Interactive Master Plans",
    text: "Explore full township plans online. Inspect exact plot positions, facing, road width, and real-time reservation status.",
    highlight: "Live Pin Map",
  },
  {
    icon: Ruler,
    title: "Transparent Per-Unit Pricing",
    text: "Clear, upfront pricing with area conversions in Gaj (sq.yd), sq.ft, or Guntha. No hidden fees or inflated rate sheets.",
    highlight: "Direct Rates",
  },
  {
    icon: Handshake,
    title: "Guided On-Site Visits",
    text: "Complimentary site visits with our local property specialists. We walk you through demarcated boundaries and access roads.",
    highlight: "Weekend Visits",
  },
  {
    icon: Receipt,
    title: "Documentation & Registry Support",
    text: "Full coordination for 7/12 extracts, NA sanction copies, demarcation verification, and sub-registrar deed registration.",
    highlight: "Hassle-Free",
  },
  {
    icon: Headset,
    title: "Dedicated WhatsApp Concierge",
    text: "Fast responses directly on WhatsApp. Get price sheets, layout PDFs, and location pins sent straight to your phone.",
    highlight: "Instant Chat",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section py-20">
      <SectionHeading
        align="center"
        eyebrow="The GreenLand Standard"
        title="A Smarter, Transparent Way to Buy Plots"
        description="Whether you are building your family home or investing in high-growth corridors, we make land buying straightforward and reliable."
        className="mb-12"
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.title}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-navy-100 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-card"
          >
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-50 text-forest-800 transition-colors duration-300 group-hover:bg-forest-800 group-hover:text-gold-300">
                  <it.icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-stone px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-navy-500 transition-colors group-hover:bg-gold-50 group-hover:text-gold-800">
                  {it.highlight}
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-navy-900 group-hover:text-forest-900">
                {it.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-navy-600">
                {it.text}
              </p>
            </div>
            <div className="mt-6 h-1 w-8 rounded-full bg-navy-100 transition-all duration-300 group-hover:w-16 group-hover:bg-gold-400" />
          </div>
        ))}
      </div>
    </section>
  );
}

