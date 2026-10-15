import type { Metadata } from "next";
import FaqAccordion, { FaqItem } from "@/components/ui/FaqAccordion";
import { SectionHeading } from "@/components/ui/Shared";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about buying plots, pricing, availability and site visits.",
  alternates: { canonical: "/faq" },
};

const faqs: FaqItem[] = [
  {
    q: "How do I know if a plot is available?",
    a: "Each plot card shows a status of Available, Reserved or Sold. Status is managed live from the admin dashboard. For real-time confirmation, tap the WhatsApp button on any plot.",
  },
  {
    q: "Do you charge for a site visit?",
    a: "Site visits are arranged free of charge. Submit the enquiry form with a preferred date and we will confirm a time.",
  },
  {
    q: "What units are plot areas shown in?",
    a: "Plots are stored in square feet, square yards (gaj), square meters, guntha or acres. The property page includes a unit converter so you can view the size in your preferred unit.",
  },
  {
    q: "Are approvals and documents verified?",
    a: "We display approvals and documents only when they are supplied and confirmed by the property owner. We do not make independent legal verification claims — please verify documents with the relevant authority or your lawyer.",
  },
  {
    q: "How is the price displayed?",
    a: "Prices are shown in the Indian numbering format (lakhs and crores) along with the exact rupee amount, plus price per unit where available.",
  },
  {
    q: "Can I buy a commercial plot for a shop or office?",
    a: "Yes. Commercial plots are zoned for business use. Filter by 'Commercial' on the Explore Plots page to see what is available.",
  },
  {
    q: "Is my personal information safe?",
    a: "Enquiries are stored securely and are visible only to authorised admin users. We never publish customer contact details.",
  },
];

export default function FaqPage() {
  return (
    <div className="bg-alabaster">
      <div className="border-b border-navy-100 bg-white">
        <div className="section py-10">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="Everything you need to know about buying plots through us."
          />
        </div>
      </div>
      <div className="section max-w-3xl py-12">
        <FaqAccordion items={faqs} />
      </div>
    </div>
  );
}
