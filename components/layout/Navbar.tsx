"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, MessageCircle, Phone, User } from "lucide-react";
import { cn, generateWhatsAppUrl } from "@/lib/utils";
import { navLinks, SiteSettingsData } from "@/lib/defaults";

export default function Navbar({ settings }: { settings: SiteSettingsData }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const whatsappUrl = generateWhatsAppUrl(
    settings.whatsappNumber,
    `Hello ${settings.businessName}, I am looking for a plot. Please share available options and site visit details.`
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all",
        scrolled
          ? "border-navy-100 bg-white/90 backdrop-blur-md shadow-soft"
          : "border-transparent bg-white/70 backdrop-blur"
      )}
    >
      <div className="section flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          {settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt={settings.businessName}
              width={140}
              height={36}
              className="h-9 w-auto object-contain"
            />
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-900 font-heading font-black text-gold-400 shadow-soft">
                GL
              </span>
              <span className="font-heading text-xl font-extrabold tracking-tight text-forest-900">
                {settings.businessName.split(" ")[0]}
                <span className="font-light text-navy-800">
                  {settings.businessName.split(" ").slice(1).join(" ")
                    ? " " + settings.businessName.split(" ").slice(1).join(" ")
                    : ""}
                </span>
              </span>
            </div>
          )}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-semibold transition-all",
                  active
                    ? "bg-forest-800 text-white shadow-soft"
                    : "text-navy-600 hover:bg-stone hover:text-forest-800"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1 text-xs font-semibold text-emerald-800 xl:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span>Site Visits Open</span>
          </div>

          <a
            href={`tel:${settings.phone.replace(/\s/g, "")}`}
            className="btn-outline px-4 py-2.5 text-xs font-bold"
          >
            <Phone className="h-3.5 w-3.5" />
            Call
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-4 py-2.5 text-xs font-bold shadow-soft"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>

          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 rounded-xl border border-navy-200/90 bg-white px-3.5 py-2 text-xs font-bold text-navy-700 shadow-sm transition hover:border-forest-700 hover:bg-forest-50 hover:text-forest-800"
            title="Sign in / Admin Portal"
          >
            <User className="h-3.5 w-3.5 text-forest-700" />
            <span>Sign in</span>
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="rounded-xl border border-navy-100 p-2 text-navy-700 hover:bg-stone lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-navy-100 bg-white lg:hidden">
          <div className="section space-y-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-navy-700 hover:bg-stone"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="btn-outline flex-1"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>

            <div className="border-t border-navy-100 pt-3">
              <Link
                href="/admin/login"
                className="flex items-center justify-center gap-2 rounded-xl border border-navy-200 bg-stone/70 py-2.5 text-sm font-bold text-navy-800 hover:bg-stone"
              >
                <User className="h-4 w-4 text-forest-700" /> Sign In / Admin Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
