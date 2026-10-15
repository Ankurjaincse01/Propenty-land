import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Ruler,
  Compass,
  Route,
  Landmark,
  CornerDownRight,
  FileCheck2,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";
import dbConnect from "@/lib/mongoose";
import Property from "@/models/Property";
import Project from "@/models/Project";
import { loadSettings } from "@/lib/settings";
import { formatPrice, formatPriceShort, formatArea, cn, STATUS_STYLES } from "@/lib/utils";
import ImageGallery from "@/components/ui/ImageGallery";
import UnitConverter from "@/components/ui/UnitConverter";
import LocationMap from "@/components/map/LocationMap";
import EnquiryForm from "@/components/forms/EnquiryForm";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import PropertyCard, { PropertyCardData } from "@/components/ui/PropertyCard";
import { SectionHeading } from "@/components/ui/Shared";

export const revalidate = 60;

import { getDemoPropertyBySlug } from "@/lib/demoData";

type Params = { params: { slug: string } };

async function getProperty(slug: string) {
  try {
    await dbConnect();
    const property = await Property.findOne({ slug })
      .populate("project", "name slug location masterLayoutImage _id")
      .lean<any>();
    if (property) {
      const related = await Property.find({
        _id: { $ne: property._id },
        status: { $ne: "Sold" },
        $or: [
          { "location.city": property.location?.city },
          { project: (property as any).project?._id ?? null },
        ],
      })
        .limit(3)
        .lean<any[]>();

      return { property, related };
    }
  } catch (err) {
    // ignore DB errors
  }
  return getDemoPropertyBySlug(slug);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const data = await getProperty(params.slug).catch(() => null);
  if (!data) return { title: "Property not found" };
  const { property } = data;
  const title =
    property.seo?.metaTitle || `${property.title} — ${property.location?.city ?? "India"}`;
  const description =
    property.seo?.metaDescription ||
    property.description?.slice(0, 150) ||
    "Plot details, pricing and availability.";
  const image = property.images?.[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
      type: "article",
    },
  };
}

export default async function PropertyDetailsPage({ params }: Params) {
  const data = await getProperty(params.slug);
  if (!data) notFound();
  const { property, related } = data;
  const settings = await loadSettings();

  const loc = property.location || {};
  const place = [loc.locality, loc.city, loc.state].filter(Boolean).join(", ");
  const coords = property.coordinates;
  const hasMap = coords?.lat != null && coords?.lng != null;

  const specs = [
    { icon: Ruler, label: "Plot Area", value: formatArea(property.area, property.areaUnit) },
    {
      icon: Layers,
      label: "Dimensions",
      value:
        property.dimensions?.length && property.dimensions?.width
          ? `${property.dimensions.length}′ × ${property.dimensions.width}′`
          : "Regular shape",
    },
    { icon: Compass, label: "Facing", value: property.facing || "—" },
    {
      icon: Route,
      label: "Road Access",
      value: property.roadWidthFt ? `${property.roadWidthFt} ft wide road` : "—",
    },
    { icon: CornerDownRight, label: "Plot No.", value: property.plotNumber || "—" },
    { icon: Landmark, label: "Zoning", value: property.zoning || property.propertyType },
  ];

  const isCorner = property.isCornerPlot;

  return (
    <div className="bg-alabaster">
      <div className="border-b border-navy-100 bg-white">
        <div className="section py-6">
          <nav className="mb-3 text-xs text-navy-400">
            <Link href="/" className="hover:text-forest-700">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/plots" className="hover:text-forest-700">Plots</Link>
            <span className="mx-1.5">/</span>
            <span className="text-navy-600">{property.title}</span>
          </nav>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                <span className={cn("chip", STATUS_STYLES[property.status])}>
                  {property.status}
                </span>
                <span className="chip bg-stone text-navy-600">{property.propertyType}</span>
                {isCorner && (
                  <span className="chip bg-gold-400 text-navy-900">
                    <Sparkles className="h-3 w-3" /> Corner Plot
                  </span>
                )}
                {property.isDemo && (
                  <span className="chip bg-navy-900/80 text-white">Demo Listing</span>
                )}
              </div>
              <h1 className="font-heading text-3xl font-extrabold text-navy-900 md:text-4xl">
                {property.title}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-navy-500">
                <MapPin className="h-4 w-4" /> {place}
              </p>
            </div>
            <div className="text-right">
              <p className="tabular font-heading text-3xl font-extrabold text-forest-800">
                {property.priceDisplay || formatPriceShort(property.price)}
              </p>
              <p className="tabular text-sm text-navy-400">{formatPrice(property.price)}</p>
              {property.pricePerUnit ? (
                <p className="tabular mt-1 text-xs text-navy-500">
                  ₹{property.pricePerUnit.toLocaleString("en-IN")} / {property.areaUnit}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="section grid grid-cols-1 gap-10 py-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <ImageGallery images={property.images || []} title={property.title} />

          <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
            <h2 className="font-heading text-xl font-bold text-navy-900">Key specifications</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
              {specs.map((s) => (
                <div key={s.label} className="rounded-xl border border-navy-100 bg-stone p-3.5">
                  <s.icon className="mb-2 h-4 w-4 text-gold-500" />
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">
                    {s.label}
                  </p>
                  <p className="tabular mt-0.5 text-sm font-bold text-navy-800">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <UnitConverter area={property.area} areaUnit={property.areaUnit} />
              {property.boundaryWall != null && (
                <div className="rounded-xl border border-navy-100 bg-stone p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">
                    Boundary Wall
                  </p>
                  <p className="mt-1 text-sm font-bold text-navy-800">
                    {property.boundaryWall ? "Present" : "Not constructed"}
                  </p>
                  {property.zoning && (
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-navy-400">
                      Zoning / Approval Type
                    </p>
                  )}
                  {property.zoning && (
                    <p className="mt-1 text-sm font-bold text-navy-800">{property.zoning}</p>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
            <h2 className="font-heading text-xl font-bold text-navy-900">Description</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-navy-600">
              {property.description}
            </p>

            {property.amenities?.length > 0 && (
              <>
                <h3 className="mt-6 font-heading text-base font-bold text-navy-900">
                  Facilities &amp; amenities
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {property.amenities.map((a: string) => (
                    <span key={a} className="chip border border-navy-100 bg-stone text-navy-600">
                      <CheckCircle2 className="h-3 w-3 text-forest-600" /> {a}
                    </span>
                  ))}
                </div>
              </>
            )}

            {property.approvals?.length > 0 && (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-emerald-800">
                  <FileCheck2 className="h-4 w-4" /> Approvals &amp; documents (as supplied by owner)
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {property.approvals.map((a: string) => (
                    <li key={a} className="flex items-start gap-2 text-sm text-emerald-900">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {a}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] text-emerald-700">
                  Information shown only when provided and confirmed by the owner. Independently verify.
                </p>
              </div>
            )}
          </section>

          {property.landmarks?.length > 0 && (
            <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
              <h2 className="font-heading text-xl font-bold text-navy-900">Nearby landmarks</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {property.landmarks.map((l: any) => (
                  <div
                    key={l.name}
                    className="flex items-center justify-between rounded-xl border border-navy-100 bg-stone px-4 py-3"
                  >
                    <span className="text-sm font-medium text-navy-700">{l.name}</span>
                    {l.distanceKm != null && (
                      <span className="tabular text-xs text-navy-400">{l.distanceKm} km</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
            <h2 className="font-heading text-xl font-bold text-navy-900">Location map</h2>
            <p className="mt-1 text-sm text-navy-500">
              {hasMap
                ? "Location shown using the coordinates supplied for this plot."
                : "Verified coordinates have not been supplied for this plot yet."}
            </p>
            <div className="mt-4">
              <LocationMap
                points={hasMap ? [{ lat: coords.lat, lng: coords.lng, label: property.title }] : []}
                zoom={14}
                height={340}
              />
            </div>
          </section>

          {property.project && (
            <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
              <h2 className="font-heading text-xl font-bold text-navy-900">Part of a project</h2>
              <p className="mt-3 text-sm text-navy-600">
                This plot belongs to{" "}
                <Link href={`/projects/${(property.project as any).slug}`} className="font-semibold text-forest-700 hover:underline">
                  {(property.project as any).name}
                </Link>
                . Open the project to view the interactive master layout and all available plots.
              </p>
              <Link
                href={`/projects/${(property.project as any).slug}`}
                className="btn-outline mt-4"
              >
                View project &amp; interactive layout
              </Link>
            </section>
          )}

          {related.length > 0 && (
            <section>
              <SectionHeading eyebrow="Similar" title="Related plots" className="mb-6" />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {related.map((p: any) => (
                  <PropertyCard
                    key={String(p._id)}
                    property={p as PropertyCardData}
                    whatsappNumber={settings.whatsappNumber}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside>
          <div className="sticky top-20 space-y-5">
            <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-500">
                {property.status === "Sold" ? "Sold" : "Interested in this plot?"}
              </p>
              <p className="mt-1 font-heading text-lg font-bold text-navy-900">
                {property.title}
              </p>

              <div className="mt-4 space-y-2.5">
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="btn-navy w-full"
                >
                  Call now · {settings.phone}
                </a>
                <WhatsAppButton
                  phone={settings.whatsappNumber}
                  message={`Hello, I am interested in ${property.title}${
                    property.plotNumber ? ` (Plot No. ${property.plotNumber})` : ""
                  } listed at ${formatPriceShort(property.price)}. Please share its availability, pricing, location, and site visit details.`}
                  className="w-full"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
              <h2 className="font-heading text-base font-bold text-navy-900">
                Schedule a site visit
              </h2>
              <p className="mt-1 mb-4 text-xs text-navy-500">
                Share your details and preferred date — we'll confirm availability.
              </p>
              <EnquiryForm
                compact
                source="Property Page"
                propertyId={String(property._id)}
                defaultMessage={`I'm interested in ${property.title}. Please share availability and site visit details.`}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
