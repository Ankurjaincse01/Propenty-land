"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Clock,
  CircleSlash,
  MessagesSquare,
  Sparkles,
  Plus,
  ArrowRight,
} from "lucide-react";
import api from "@/lib/api";
import { relativeTime, STATUS_STYLES, cn } from "@/lib/utils";
import DashboardCharts from "@/components/admin/DashboardCharts";

interface Stats {
  totalProperties: number;
  available: number;
  reserved: number;
  sold: number;
  totalProjects: number;
  totalEnquiries: number;
  newEnquiries: number;
  recentEnquiries: any[];
  recentProperties: any[];
  enquiriesByStatus?: { status: string; count: number }[];
  enquiriesBySource?: { source: string; count: number }[];
  propertiesByProject?: { name: string; count: number }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = () => {
    setLoading(true);
    setError("");
    api
      .get("/admin/dashboard/stats")
      .then(({ data }) => setStats(data.data))
      .catch(() => setError("We could not load the latest dashboard figures."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, []);

  const cards = [
    { label: "Total properties", value: stats?.totalProperties, icon: Building2, tone: "bg-navy-50 text-navy-700" },
    { label: "Available", value: stats?.available, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Reserved", value: stats?.reserved, icon: Clock, tone: "bg-amber-50 text-amber-700" },
    { label: "Sold", value: stats?.sold, icon: CircleSlash, tone: "bg-slate-100 text-slate-600" },
    { label: "Total enquiries", value: stats?.totalEnquiries, icon: MessagesSquare, tone: "bg-violet-50 text-violet-700" },
    { label: "New enquiries", value: stats?.newEnquiries, icon: Sparkles, tone: "bg-blue-50 text-blue-700" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4 sm:items-center">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-navy-900">Overview &amp; Analytics</h2>
          <p className="text-sm text-navy-500">Live figures &amp; graphs calculated from your database.</p>
        </div>
        <Link href="/admin/properties/new" className="btn-primary shrink-0">
          <Plus className="h-4 w-4" /> Add property
        </Link>
      </div>

      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <span>{error}</span>
          <button type="button" onClick={loadStats} className="font-semibold underline underline-offset-2">
            Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="min-w-0 rounded-2xl border border-navy-100 bg-white p-5 shadow-soft">
            <div className={cn("mb-3 flex h-9 w-9 items-center justify-center rounded-lg", c.tone)}>
              <c.icon className="h-4 w-4" />
            </div>
            <p className="tabular font-heading text-2xl font-extrabold text-navy-900">
              {loading ? "—" : (c.value ?? 0)}
            </p>
            <p className="text-xs text-navy-500">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Visual Analytics & Graphs */}
      <DashboardCharts stats={stats} loading={loading} />

      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel title="Recent enquiries" href="/admin/enquiries" empty={!stats?.recentEnquiries?.length}>
          {stats?.recentEnquiries?.map((e) => (
            <div key={e._id} className="flex min-w-0 items-center justify-between gap-3 border-b border-navy-100 py-3 last:border-0">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy-800">{e.customerName}</p>
                <p className="truncate text-xs text-navy-500">
                  {e.phone} · {relativeTime(e.createdAt)}
                </p>
              </div>
              <span className={cn("chip max-w-[48%] shrink-0 truncate text-right", STATUS_STYLES[e.followUpStatus])}>
                {e.followUpStatus}
              </span>
            </div>
          ))}
        </Panel>

        <Panel title="Recently added properties" href="/admin/properties" empty={!stats?.recentProperties?.length}>
          {stats?.recentProperties?.map((p) => (
            <div key={p._id} className="flex min-w-0 items-center justify-between gap-3 border-b border-navy-100 py-3 last:border-0">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy-800">{p.title}</p>
                <p className="truncate text-xs text-navy-500">
                  {[p.location?.locality, p.location?.city].filter(Boolean).join(", ")}
                </p>
              </div>
              <span className={cn("chip shrink-0", STATUS_STYLES[p.status])}>{p.status}</span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function Panel({
  title,
  href,
  empty,
  children,
}: {
  title: string;
  href: string;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-navy-100 bg-white p-5 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-heading text-base font-bold text-navy-900">{title}</h3>
        <Link href={href} className="inline-flex items-center gap-1 text-xs font-semibold text-forest-700 hover:underline">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {empty ? (
        <p className="py-6 text-center text-sm text-navy-400">Nothing yet.</p>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}
