"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  MessagesSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessagesSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const isPublicAuthRoute = pathname === "/admin/login";
    if (isPublicAuthRoute) {
      setReady(true);
      return;
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    api
      .get("/admin/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setAdmin(data.data))
      .catch(() => {
        localStorage.removeItem("adminToken");
        router.replace("/admin/login");
      })
      .finally(() => setReady(true));
  }, [pathname, router]);

  useEffect(() => setOpen(false), [pathname]);

  const logout = async () => {
    try {
      await api.post("/admin/auth/logout");
    } catch {
      /* ignore */
    }
    localStorage.removeItem("adminToken");
    router.replace("/admin/login");
  };

  if (pathname === "/admin/login") return <>{children}</>;

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-alabaster text-sm text-navy-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-alabaster lg:flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-navy-800 bg-navy-900 text-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link href="/admin/dashboard" className="font-heading text-lg font-extrabold text-white">
            GreenLand <span className="font-light text-forest-300">Admin</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-navy-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-gold-400 text-navy-900 font-semibold shadow-soft"
                    : "text-navy-200 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-white/10 bg-navy-950/40 p-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-navy-200 transition hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-4 w-4 shrink-0" /> View website
          </Link>
          <button
            onClick={logout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-100"
          >
            <LogOut className="h-4 w-4 shrink-0" /> Logout
          </button>
          {admin && (
            <div className="mt-2 border-t border-white/5 px-3.5 pt-2">
              <p className="truncate text-xs font-semibold text-white">{admin.name}</p>
              <p className="truncate text-[11px] text-navy-400 capitalize">{admin.role}</p>
            </div>
          )}
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-xs lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-navy-100 bg-white px-4 lg:px-8">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-stone lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-heading text-base font-bold text-navy-900">
            {nav.find((n) => pathname.startsWith(n.href))?.label || "Admin"}
          </h1>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
