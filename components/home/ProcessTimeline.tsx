import { Search, CalendarCheck, FileCheck, KeyRound, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Explore & Shortlist",
    text: "Filter verified plots by budget, facing, and township. Inspect photos, video clips, and interactive master layouts.",
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Guided Site Inspection",
    text: "Book a complimentary guided site tour. Our specialist walks you through boundaries, road access, and utility connections.",
  },
  {
    step: "03",
    icon: FileCheck,
    title: "Legal & Title Verification",
    text: "Review certified layout plans, demarcation reports, NA orders, and title documents before placing any commitment.",
  },
  {
    step: "04",
    icon: KeyRound,
    title: "Token & Registration",
    text: "Secure your chosen plot with transparent token documentation and smooth registration at the sub-registrar office.",
  },
];

export default function ProcessTimeline() {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="group relative flex flex-col justify-between rounded-3xl border border-navy-100 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-card"
          >
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-50 text-forest-800 transition-colors group-hover:bg-forest-800 group-hover:text-gold-300">
                  <s.icon className="h-6 w-6" />
                </div>
                <span className="font-heading text-3xl font-extrabold tracking-tight text-navy-200 transition-colors group-hover:text-gold-500">
                  {s.step}
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-navy-900 group-hover:text-forest-900">
                {s.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-navy-600">
                {s.text}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-forest-700">
              <span>Step {i + 1}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

