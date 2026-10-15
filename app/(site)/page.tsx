import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Building2,
  Landmark,
  TreePine,
  Store,
} from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import FeaturedPlots from "@/components/home/FeaturedPlots";
import HomeTownshipMap from "@/components/home/HomeTownshipMap";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import CtaBanner from "@/components/home/CtaBanner";
import FaqAccordion, { FaqItem } from "@/components/ui/FaqAccordion";
import { SectionHeading } from "@/components/ui/Shared";
import { loadSettings } from "@/lib/settings";

const faqs: FaqItem[] = [
  {
    q: "Are the plots on this website real listings?",
    a: "This is a demonstration website. Listings are sample data and clearly marked as demo. In a live deployment, only owner-confirmed plots are published.",
  },
  {
    q: "How do I get the price sheet and availability?",
    a: "Tap any WhatsApp button on a plot card or details page. A pre-filled enquiry is sent to our team, who will share the current price sheet and availability.",
  },
  {
    q: "Can I book a site visit?",
    a: "Yes. Submit the enquiry form with a preferred date, or message us on WhatsApp, and we will schedule a guided visit to the layout.",
  },
  {
    q: "What is the difference between Residential and Commercial plots?",
    a: "Residential plots are zoned for homes and villas. Commercial plots are zoned for shops, offices and business use. The zoning shown is as supplied by the owner.",
  },
  {
    q: "Do you help with documentation and registration?",
    a: "We coordinate the process and share the documents the owner provides. We do not make legal verification claims — always confirm details independently or with your lawyer.",
  },
];

const areas = [
  { icon: Building2, label: "City residential layouts" },
  { icon: Store, label: "Commercial main-road plots" },
  { icon: TreePine, label: "Farm & NA land" },
  { icon: Landmark, label: "Gated townships" },
];

export default async function HomePage() {
  const settings = await loadSettings();

  return (
    <>
      <HeroSection tagline={`Welcome to ${settings.businessName}.`} />
      <FeaturedProjects />
      <FeaturedPlots whatsappNumber={settings.whatsappNumber} />
      <HomeTownshipMap whatsappNumber={settings.whatsappNumber} />

      <section className="bg-white py-16">
        <div className="section">
          <SectionHeading
            eyebrow="Simple process"
            title="How plot buying works"
            description="Four straightforward steps from shortlisting to registration."
            className="mb-10"
          />
          <ProcessTimeline />
        </div>
      </section>

      <WhyChooseUs />

      <section className="bg-stone py-16">
        <div className="section grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Where we operate"
              title="Plots across the locations buyers ask for"
              description="From city residential layouts to highway-facing commercial plots and NA land, we help you find the right zoning for your plan."
            />
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {areas.map((a) => (
                <div
                  key={a.label}
                  className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white px-4 py-3"
                >
                  <a.icon className="h-5 w-5 text-gold-500" />
                  <span className="text-sm font-medium text-navy-700">{a.label}</span>
                </div>
              ))}
            </div>
            <Link href="/plots" className="btn-primary mt-7">
              Browse available plots <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-navy-100 shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1400&q=80"
              alt="Plotted layout with roads and greenery"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section py-16">
        <SectionHeading
          align="center"
          eyebrow="Visit us"
          title="Talk to our team"
          description="Prefer a conversation? Reach out and we will help you shortlist the right plots."
          className="mb-10"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <ContactCard icon={Phone} title="Call us" value={settings.phone} href={`tel:${settings.phone.replace(/\s/g, "")}`} />
          <ContactCard icon={Mail} title="Email" value={settings.email} href={`mailto:${settings.email}`} />
          <ContactCard icon={MapPin} title="Office" value={settings.officeAddress} />
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-navy-500">
          <Clock className="h-4 w-4 text-gold-500" /> {settings.workingHours}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="section max-w-3xl">
          <SectionHeading
            align="center"
            eyebrow="FAQ"
            title="Questions buyers ask"
            className="mb-8"
          />
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <CtaBanner settings={settings} />

      <div className="pb-8 text-center">
        <p className="text-xs text-navy-400">
          Testimonials are shown only when verified reviews are supplied. This demo
          includes none.
        </p>
      </div>
    </>
  );
}

function ContactCard({
  icon: Icon,
  title,
  value,
  href,
}: {
  icon: typeof Phone;
  title: string;
  value: string;
  href?: string;
}) {
  const body = (
    <div className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-soft transition hover:border-forest-700/40">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-800">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-heading text-base font-bold text-navy-900">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-navy-500">{value}</p>
    </div>
  );
  return href ? (
    <a href={href} className="block h-full">
      {body}
    </a>
  ) : (
    body
  );
}
