"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Ruler, MessageCircle, Sparkles, Compass } from "lucide-react";
import { cn, formatPrice, formatPriceShort, generateWhatsAppUrl, STATUS_STYLES } from "@/lib/utils";

export interface PropertyCardData {
  _id: string;
  title: string;
  slug: string;
  plotNumber?: string;
  price: number;
  priceDisplay?: string;
  area: number;
  areaUnit: string;
  pricePerUnit?: number;
  facing?: string;
  isCornerPlot?: boolean;
  isDemo?: boolean;
  featured?: boolean;
  propertyType: "Residential" | "Commercial";
  status: "Available" | "Reserved" | "Sold";
  location?: { locality?: string; city?: string; state?: string };
  images?: Array<{ url: string; alt?: string }>;
}

export default function PropertyCard({
  property,
  whatsappNumber,
}: {
  property: PropertyCardData;
  whatsappNumber: string;
}) {
  const image = property.images?.[0]?.url || "/placeholder-plot.svg";
  const place = [property.location?.locality, property.location?.city]
    .filter(Boolean)
    .join(", ");

  const enquiryUrl = generateWhatsAppUrl(
    whatsappNumber,
    `Hello, I am interested in ${property.title} (${formatPriceShort(property.price)}). Please share its availability, pricing, location, and site visit details.`
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone">
        <Image
          src={image}
          alt={property.images?.[0]?.alt || property.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className={cn("chip", STATUS_STYLES[property.status])}>{property.status}</span>
          {property.featured && (
            <span className="chip bg-gold-400 text-navy-900">
              <Sparkles className="h-3 w-3" /> Featured
            </span>
          )}
        </div>
        {property.isDemo && (
          <span className="absolute right-3 top-3 rounded-md bg-navy-900/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
            Demo Listing
          </span>
        )}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {property.plotNumber && (
            <span className="chip bg-forest-900/90 font-bold text-white shadow-sm backdrop-blur">
              #{property.plotNumber}
            </span>
          )}
          <span className="chip bg-white/90 text-navy-700 backdrop-blur">
            {property.propertyType}
          </span>
          {property.isCornerPlot && (
            <span className="chip bg-white/90 text-gold-700 backdrop-blur">
              <Compass className="h-3 w-3" /> Corner
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-bold leading-snug text-navy-900 line-clamp-1">
          {property.title}
        </h3>
        {place && (
          <p className="mt-1.5 flex items-center gap-1 text-sm text-navy-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{place}</span>
          </p>
        )}

        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="tabular font-heading text-xl font-extrabold text-forest-800">
              {property.priceDisplay || formatPriceShort(property.price)}
            </p>
            <p className="tabular text-xs text-navy-400">{formatPrice(property.price)}</p>
          </div>
          <div className="text-right">
            <p className="tabular flex items-center justify-end gap-1 text-sm font-semibold text-navy-700">
              <Ruler className="h-3.5 w-3.5" />
              {property.area} {property.areaUnit}
            </p>
            {property.pricePerUnit ? (
              <p className="tabular text-xs text-navy-400">
                ₹{property.pricePerUnit.toLocaleString("en-IN")}/{property.areaUnit}
              </p>
            ) : null}
          </div>
        </div>

        {property.facing && (
          <p className="mt-2 text-xs text-navy-400">
            Facing: <span className="font-medium text-navy-600">{property.facing}</span>
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <Link href={`/properties/${property.slug}`} className="btn-navy flex-1 py-2.5 text-xs">
            View Details
          </Link>
          <a
            href={enquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn flex-1 border border-emerald-200 bg-emerald-50 py-2.5 text-xs text-emerald-700 hover:bg-emerald-100"
          >
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-navy-100 bg-white">
      <div className="aspect-[4/3] bg-stone" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-3/4 rounded bg-stone" />
        <div className="h-3 w-1/2 rounded bg-stone" />
        <div className="h-6 w-1/3 rounded bg-stone" />
        <div className="flex gap-2 pt-2">
          <div className="h-9 flex-1 rounded-xl bg-stone" />
          <div className="h-9 flex-1 rounded-xl bg-stone" />
        </div>
      </div>
    </div>
  );
}
