import { cn } from "@/lib/utils";
import { SearchX } from "lucide-react";
import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-gold-500">
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading text-3xl font-extrabold text-navy-900 md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-navy-500">{description}</p>
      )}
    </div>
  );
}

export function EmptyState({
  title = "Nothing here yet",
  description = "Try adjusting your filters or check back later.",
  actionHref,
  actionLabel,
}: {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-stone text-navy-400">
        <SearchX className="h-7 w-7" />
      </div>
      <h3 className="font-heading text-lg font-bold text-navy-800">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-navy-500">{description}</p>
      {actionHref && actionLabel && (
        <Link href={actionHref} className="btn-primary mt-5">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-navy-100 bg-white"
        >
          <div className="aspect-[4/3] bg-stone" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-3/4 rounded bg-stone" />
            <div className="h-3 w-1/2 rounded bg-stone" />
            <div className="h-6 w-1/3 rounded bg-stone" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="min-h-[60vh] bg-alabaster">
      <div className="border-b border-navy-100 bg-white">
        <div className="section space-y-3 py-10">
          <div className="h-3 w-24 animate-pulse rounded bg-stone" />
          <div className="h-9 w-72 max-w-full animate-pulse rounded bg-stone" />
          <div className="h-4 w-full max-w-xl animate-pulse rounded bg-stone" />
        </div>
      </div>
      <div className="section py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl border border-navy-100 bg-white p-5">
              <div className="aspect-[16/10] rounded-xl bg-stone" />
              <div className="mt-4 h-5 w-3/4 rounded bg-stone" />
              <div className="mt-3 h-3 w-1/2 rounded bg-stone" />
              <div className="mt-5 h-3 w-full rounded bg-stone" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-alabaster">
      <div className="min-h-[620px] bg-navy-900">
        <div className="section flex min-h-[620px] flex-col items-center justify-center space-y-5 text-center">
          <div className="h-7 w-72 rounded-full bg-white/10" />
          <div className="h-14 w-full max-w-2xl rounded bg-white/10" />
          <div className="h-14 w-3/4 max-w-xl rounded bg-white/10" />
          <div className="h-5 w-full max-w-2xl rounded bg-white/10" />
          <div className="h-12 w-56 rounded-2xl bg-white/10" />
          <div className="mt-8 h-64 w-full max-w-5xl rounded-3xl bg-white/10" />
        </div>
      </div>
      <div className="section space-y-6 py-16">
        <div className="h-8 w-64 rounded bg-stone" />
        <div className="h-4 w-96 max-w-full rounded bg-stone" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-72 rounded-2xl border border-navy-100 bg-white" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="h-8 w-64 animate-pulse rounded bg-stone" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-stone" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl border border-navy-100 bg-white" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl border border-navy-100 bg-white" />
        <div className="h-72 animate-pulse rounded-2xl border border-navy-100 bg-white" />
      </div>
    </div>
  );
}

export function StatusPill({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const styles: Record<string, string> = {
    Available: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    Reserved: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    Sold: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  };
  return (
    <span className={cn("chip", styles[status] || styles.Available, className)}>
      {status}
    </span>
  );
}
