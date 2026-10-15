import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, MapPinned, BadgeCheck, PhoneCall, Sparkles, CheckCircle2 } from "lucide-react";
import QuickSearchBar from "@/components/home/QuickSearchBar";

export default function HeroSection({ tagline }: { tagline: string }) {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      {/* Background with luxury gradient overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80"
          alt="Aerial view of plotted land ready for development"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-900/80 to-navy-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.15),transparent_50%)]" />
      </div>

      <div className="section relative z-10 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-4xl text-center">
          {/* Top verified badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-gold-400" />
            <span>Verified Residential &amp; Commercial Plotted Layouts</span>
          </div>

          {/* Headline */}
          <h1 className="mt-6 font-heading text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">
            Find Your Dream Plot.
            <br />
            <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200 bg-clip-text text-transparent">
              Build Your Vision.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-navy-200 sm:text-lg">
            {tagline} Handpicked NA and commercial plots across prime development corridors.
            Transparent pricing, interactive master layouts, and complimentary guided site visits.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/plots"
              className="btn-primary rounded-2xl px-7 py-3.5 text-base font-bold shadow-soft hover:shadow-card"
            >
              Explore Available Plots
            </Link>
            <Link
              href="/contact"
              className="btn rounded-2xl border border-white/20 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <PhoneCall className="h-4 w-4 text-gold-400" />
              Schedule a Site Visit
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold text-navy-200 sm:text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 100% Clear Title Plots
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 backdrop-blur-sm">
              <MapPinned className="h-4 w-4 text-gold-400" /> Interactive Plot Map
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 backdrop-blur-sm">
              <BadgeCheck className="h-4 w-4 text-sky-400" /> Zero Direct Brokerage
            </span>
          </div>
        </div>
      </div>

      {/* Floating Search Bar */}
      <div className="section relative z-20 -mb-16 pb-16">
        <QuickSearchBar />
      </div>
    </section>
  );
}
