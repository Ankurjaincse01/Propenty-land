"use client";

import { useMemo } from "react";
import {
  PieChart,
  BarChart3,
  TrendingUp,
  Share2,
  Layers,
  CheckCircle2,
  Clock,
  Ban,
  MessageSquare,
} from "lucide-react";

interface Props {
  stats: {
    totalProperties: number;
    available: number;
    reserved: number;
    sold: number;
    totalEnquiries: number;
    newEnquiries: number;
    enquiriesByStatus?: { status: string; count: number }[];
    enquiriesBySource?: { source: string; count: number }[];
    propertiesByProject?: { name: string; count: number }[];
  } | null;
  loading: boolean;
}

export default function DashboardCharts({ stats, loading }: Props) {
  const totalPlots = stats?.totalProperties || 0;
  const available = stats?.available || 0;
  const reserved = stats?.reserved || 0;
  const sold = stats?.sold || 0;

  // Inventory Donut Calculations
  const availablePct = totalPlots ? Math.round((available / totalPlots) * 100) : 0;
  const reservedPct = totalPlots ? Math.round((reserved / totalPlots) * 100) : 0;
  const soldPct = totalPlots ? Math.max(0, 100 - availablePct - reservedPct) : 0;

  // Circumference for 2 * pi * 40 ≈ 251.2
  const C = 251.2;
  const strokeAvailable = (availablePct / 100) * C;
  const strokeReserved = (reservedPct / 100) * C;
  const strokeSold = (soldPct / 100) * C;

  const offsetAvailable = 0;
  const offsetReserved = -strokeAvailable;
  const offsetSold = -(strokeAvailable + strokeReserved);

  // Enquiry Status Breakdown
  const enquiryStatuses = useMemo(() => {
    const defaultList = [
      { status: "New", count: 0, color: "bg-amber-500", text: "text-amber-700" },
      { status: "Contacted", count: 0, color: "bg-indigo-500", text: "text-indigo-700" },
      { status: "Site Visit Scheduled", count: 0, color: "bg-emerald-500", text: "text-emerald-700" },
      { status: "Qualified", count: 0, color: "bg-blue-500", text: "text-blue-700" },
      { status: "Closed", count: 0, color: "bg-slate-500", text: "text-slate-700" },
    ];

    if (!stats?.enquiriesByStatus?.length) return defaultList;

    return defaultList.map((item) => {
      const found = stats.enquiriesByStatus?.find(
        (s) => s.status.toLowerCase() === item.status.toLowerCase()
      );
      return { ...item, count: found ? found.count : 0 };
    });
  }, [stats?.enquiriesByStatus]);

  const maxEnquiryCount = useMemo(() => {
    const max = Math.max(...enquiryStatuses.map((s) => s.count), 1);
    return max;
  }, [enquiryStatuses]);

  // Project distribution
  const projects = stats?.propertiesByProject || [];
  const maxProjectCount = Math.max(...projects.map((p) => p.count), 1);

  if (loading) {
    return (
      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="h-64 animate-pulse rounded-2xl border border-navy-100 bg-white" />
        <div className="h-64 animate-pulse rounded-2xl border border-navy-100 bg-white" />
      </div>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* Chart 1: Inventory Status Donut & Breakdown */}
      <div className="min-w-0 rounded-2xl border border-navy-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
              <PieChart className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h3 className="font-heading text-base font-bold text-navy-900">
                Inventory Status Graph
              </h3>
              <p className="text-xs text-navy-500">Live plot availability distribution</p>
            </div>
          </div>
          <span className="chip shrink-0 border border-navy-100 bg-stone text-xs font-semibold text-navy-700">
            {totalPlots} Total Plots
          </span>
        </div>

        <div className="flex min-w-0 flex-col items-center gap-6 sm:flex-row sm:justify-around">
          {/* Donut SVG */}
          <div className="relative flex h-36 w-36 items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#F1F5F9"
                strokeWidth="12"
              />
              {/* Available arc */}
              {availablePct > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeDasharray={`${strokeAvailable} ${C}`}
                  strokeDashoffset={offsetAvailable}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              )}
              {/* Reserved arc */}
              {reservedPct > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="12"
                  strokeDasharray={`${strokeReserved} ${C}`}
                  strokeDashoffset={offsetReserved}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              )}
              {/* Sold arc */}
              {soldPct > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#64748B"
                  strokeWidth="12"
                  strokeDasharray={`${strokeSold} ${C}`}
                  strokeDashoffset={offsetSold}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              )}
            </svg>
            <div className="absolute text-center">
              <span className="font-heading text-2xl font-extrabold text-navy-900">
                {available}
              </span>
              <span className="block text-[11px] font-medium uppercase text-emerald-600">
                Available
              </span>
            </div>
          </div>

          {/* Legend and Progress Bars */}
          <div className="w-full min-w-0 max-w-xs space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-navy-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Available
                </span>
                <span className="tabular text-navy-900 font-bold">
                  {available} ({availablePct}%)
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-stone">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${availablePct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-navy-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Reserved
                </span>
                <span className="tabular text-navy-900 font-bold">
                  {reserved} ({reservedPct}%)
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-stone">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${reservedPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-navy-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-500" /> Sold Out
                </span>
                <span className="tabular text-navy-900 font-bold">
                  {sold} ({soldPct}%)
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-stone">
                <div
                  className="h-full rounded-full bg-slate-500 transition-all duration-500"
                  style={{ width: `${soldPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart 2: Lead Pipeline / Enquiry Status Bar Graph */}
      <div className="min-w-0 rounded-2xl border border-navy-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-800">
              <BarChart3 className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h3 className="font-heading text-base font-bold text-navy-900">
                Lead Pipeline Graph
              </h3>
              <p className="text-xs text-navy-500">Customer enquiries by follow-up stage</p>
            </div>
          </div>
          <span className="chip shrink-0 border border-navy-100 bg-stone text-xs font-semibold text-navy-700">
            {stats?.totalEnquiries || 0} Total Leads
          </span>
        </div>

        <div className="space-y-3.5 pt-1">
          {enquiryStatuses.map((item) => {
            const pct = Math.round((item.count / maxEnquiryCount) * 100);
            return (
              <div key={item.status} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-navy-700">{item.status}</span>
                  <span className="tabular font-bold text-navy-900">
                    {item.count}{" "}
                    <span className="text-navy-400 font-normal">
                      ({stats?.totalEnquiries ? Math.round((item.count / stats.totalEnquiries) * 100) : 0}%)
                    </span>
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-stone">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-700`}
                    style={{ width: `${item.count > 0 ? Math.max(pct, 12) : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart 3: Township Distribution */}
      {projects.length > 0 && (
        <div className="min-w-0 rounded-2xl border border-navy-100 bg-white p-5 shadow-soft sm:p-6 lg:col-span-2">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-50 text-gold-800">
                <Layers className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-heading text-base font-bold text-navy-900">
                  Township Plot Distribution (Chhindwara)
                </h3>
                <p className="text-xs text-navy-500">
                  Plotted developments and inventory allocation
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {projects.map((proj) => {
              const pct = totalPlots ? Math.round((proj.count / totalPlots) * 100) : 0;
              return (
                <div
                  key={proj.name}
                  className="rounded-xl border border-navy-100 bg-stone/50 p-4 transition hover:border-forest-700/40"
                >
                      <div className="flex min-w-0 items-start justify-between gap-3">
                        <p className="min-w-0 truncate font-heading text-sm font-bold text-navy-900">
                      {proj.name}
                    </p>
                        <span className="shrink-0 tabular text-xs font-bold text-forest-800">
                      {proj.count} plots ({pct}%)
                    </span>
                  </div>
                  <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-navy-100">
                    <div
                      className="h-full rounded-full bg-forest-800 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
