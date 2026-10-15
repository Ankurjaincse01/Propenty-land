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
    const isPublicAuthRoute = pathname === "/admin/login" || pathname === "/admin/register";
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

  if (pathname === "/admin/login" || pathname === "/admin/register") return <>{children}</>;

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
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-navy-100 bg-navy-900 text-white transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link href="/admin/dashboard" className="font-heading text-lg font-extrabold">
            GreenLand <span className="font-light">Admin</span>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-gold-400 text-navy-900"
                    : "text-navy-200 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-white/10 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-navy-200 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" /> View website
          </Link>
          <button
            onClick={logout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-navy-200 hover:bg-rose-500/20 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
          {admin && (
            <p className="px-3.5 pt-2 text-[11px] text-navy-400">
              {admin.name} · {admin.role}
            </p>
          )}
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 bg-navy-900/50 lg:hidden" onClick={() => setOpen(false)} />
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
