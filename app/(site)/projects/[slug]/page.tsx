import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, CheckCircle2, Layers, IndianRupee, Hash } from "lucide-react";
import dbConnect from "@/lib/mongoose";
import Project from "@/models/Project";
import Property from "@/models/Property";
import { loadSettings } from "@/lib/settings";
import { formatPriceShort, STATUS_STYLES, cn } from "@/lib/utils";
import ImageGallery from "@/components/ui/ImageGallery";
import InteractivePlotMap from "@/components/projects/InteractivePlotMap";
import LocationMap from "@/components/map/LocationMap";
import EnquiryForm from "@/components/forms/EnquiryForm";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import PropertyCard, { PropertyCardData } from "@/components/ui/PropertyCard";
import { SectionHeading } from "@/components/ui/Shared";

export const revalidate = 60;

import { getDemoProjectBySlug } from "@/lib/demoData";

type Params = { params: { slug: string } };

async function getProject(slug: string) {
  try {
    await dbConnect();
    const project = await Project.findOne({ slug }).lean<any>();
    if (project) {
      const plots = await Property.find({ project: project._id })
        .sort({ "layoutPosition.x": 1, createdAt: -1 })
        .lean<any[]>();
      return { project, plots };
    }
  } catch (err) {
    // ignore DB errors
  }
  const demo = getDemoProjectBySlug(slug);
  if (!demo) return null;
  return { project: demo.project, plots: demo.properties };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const data = await getProject(params.slug).catch(() => null);
  if (!data) return { title: "Project not found" };
  const { project } = data;
  return {
    title: `${project.name} — ${project.location?.city ?? "India"}`,
    description: project.description?.slice(0, 155),
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.name,
      description: project.description?.slice(0, 155),
      images: project.images?.[0]?.url ? [{ url: project.images[0].url }] : undefined,
    },
  };
}

export default async function ProjectDetailsPage({ params }: Params) {
  const data = await getProject(params.slug);
  if (!data) notFound();
  const { project, plots } = data;
  const settings = await loadSettings();

  const coords = project.coordinates;
  const hasMap = coords?.lat != null && coords?.lng != null;
  const place = [project.location?.locality, project.location?.city, project.location?.state]
    .filter(Boolean)
    .join(", ");

  const available = plots.filter((p: any) => p.status === "Available").length;
  const reserved = plots.filter((p: any) => p.status === "Reserved").length;
  const sold = plots.filter((p: any) => p.status === "Sold").length;

  return (
    <div className="bg-alabaster">
      <div className="border-b border-navy-100 bg-white">
        <div className="section py-6">
          <nav className="mb-3 text-xs text-navy-400">
            <Link href="/" className="hover:text-forest-700">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/projects" className="hover:text-forest-700">Projects</Link>
            <span className="mx-1.5">/</span>
            <span className="text-navy-600">{project.name}</span>
          </nav>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                <span className={cn("chip", STATUS_STYLES[project.projectStatus])}>
                  {project.projectStatus}
                </span>
                {project.isDemo && (
                  <span className="chip bg-navy-900/80 text-white">Demo Project</span>
                )}
              </div>
              <h1 className="font-heading text-3xl font-extrabold text-navy-900 md:text-4xl">
                {project.name}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-navy-500">
                <MapPin className="h-4 w-4" /> {place}
              </p>
            </div>
            {project.startingPrice ? (
              <div className="text-right">
                <p className="text-xs text-navy-400">Starting from</p>
                <p className="tabular font-heading text-3xl font-extrabold text-forest-800">
                  {formatPriceShort(project.startingPrice)}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="section grid grid-cols-1 gap-10 py-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {project.images?.length > 0 && (
            <ImageGallery images={project.images} title={project.name} />
          )}

          {project.masterLayoutImage && plots.some((p: any) => p.layoutPosition?.x != null) && (
            <InteractivePlotMap
              projectName={project.name}
              masterLayoutImage={project.masterLayoutImage}
              whatsappNumber={settings.whatsappNumber}
              plots={plots.map((p: any) => ({
                _id: String(p._id),
                plotNumber: p.plotNumber,
                title: p.title,
                slug: p.slug,
                price: p.price,
                pricePerUnit: p.pricePerUnit,
                area: p.area,
                areaUnit: p.areaUnit,
                facing: p.facing,
                isCornerPlot: p.isCornerPlot,
                isDemo: p.isDemo,
                roadWidthFt: p.roadWidthFt,
                status: p.status,
                dimensions: p.dimensions,
                layoutPosition: p.layoutPosition,
              }))}
            />
          )}

          <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
            <h2 className="font-heading text-xl font-bold text-navy-900">About this project</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-navy-600">
              {project.description}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
              <Stat icon={Hash} label="Available" value={String(available)} />
              <Stat icon={Hash} label="Reserved" value={String(reserved)} />
              <Stat icon={Hash} label="Sold" value={String(sold)} />
              <Stat
                icon={Layers}
                label="Total plots"
                value={String(project.totalPlots ?? plots.length)}
              />
            </div>

            {project.plotSizeRange?.min && (
              <p className="mt-4 flex items-center gap-2 text-sm text-navy-600">
                <IndianRupee className="h-4 w-4 text-gold-500" />
                Plot sizes: {project.plotSizeRange.min}–{project.plotSizeRange.max}{" "}
                {project.plotSizeRange.unit}
              </p>
            )}

            {project.amenities?.length > 0 && (
              <>
                <h3 className="mt-6 font-heading text-base font-bold text-navy-900">
                  Amenities
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.amenities.map((a: string) => (
                    <span key={a} className="chip border border-navy-100 bg-stone text-navy-600">
                      <CheckCircle2 className="h-3 w-3 text-forest-600" /> {a}
                    </span>
                  ))}
                </div>
              </>
            )}
          </section>

          <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
            <h2 className="font-heading text-xl font-bold text-navy-900">Project location</h2>
            <div className="mt-4">
              <LocationMap
                points={hasMap ? [{ lat: coords.lat, lng: coords.lng, label: project.name }] : []}
                zoom={13}
                height={340}
              />
            </div>
          </section>

          {plots.length > 0 && (
            <section>
              <SectionHeading
                eyebrow="Available now"
                title="Plots in this project"
                className="mb-6"
              />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {plots.map((p: any) => (
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
                Enquire about this project
              </p>
              <p className="mt-1 font-heading text-lg font-bold text-navy-900">
                {project.name}
              </p>
              <div className="mt-4 space-y-2.5">
                <WhatsAppButton
                  phone={settings.whatsappNumber}
                  message={`Hello, I am interested in the project ${project.name}. Please share the layout, available plot sizes, pricing and site visit details.`}
                  className="w-full"
                />
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="btn-outline w-full">
                  Call · {settings.phone}
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
              <h2 className="font-heading text-base font-bold text-navy-900">
                Request a callback
              </h2>
              <div className="mt-4">
                <EnquiryForm
                  compact
                  source="Project Page"
                  projectId={String(project._id)}
                  defaultMessage={`I'm interested in ${project.name}. Please share available plots and pricing.`}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Hash;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-navy-100 bg-stone p-3.5">
      <Icon className="mb-2 h-4 w-4 text-gold-500" />
      <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">{label}</p>
      <p className="tabular mt-0.5 text-lg font-extrabold text-navy-800">{value}</p>
    </div>
  );
}
