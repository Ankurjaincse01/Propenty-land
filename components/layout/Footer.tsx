import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Clock,
} from "lucide-react";
import { navLinks, SiteSettingsData } from "@/lib/defaults";
import { generateWhatsAppUrl } from "@/lib/utils";

export default function Footer({ settings }: { settings: SiteSettingsData }) {
  const year = new Date().getFullYear();
  const social = settings.socialLinks || {};
  const socials = [
    { href: social.facebook, Icon: Facebook, label: "Facebook" },
    { href: social.instagram, Icon: Instagram, label: "Instagram" },
    { href: social.linkedin, Icon: Linkedin, label: "LinkedIn" },
    { href: social.youtube, Icon: Youtube, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-navy-900 text-navy-100">
      <div className="section py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-heading text-2xl font-extrabold text-white">
              {settings.businessName}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-navy-300">
              {settings.tagline}
            </p>
            <p className="mt-4 text-xs text-navy-400">
              Premium residential, commercial &amp; NA plots across India.
            </p>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-3">
                {socials.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-navy-200 transition hover:bg-gold-400 hover:text-navy-900"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              Explore
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-navy-300 transition hover:text-gold-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              Legal
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="text-navy-300 transition hover:text-gold-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-navy-300 transition hover:text-gold-400">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-navy-300 transition hover:text-gold-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-navy-400 transition hover:text-gold-400">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              Get in touch
            </h4>
            <ul className="mt-4 space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 text-gold-400" />
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-gold-400">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="mt-0.5 h-4 w-4 text-gold-400" />
                <a
                  href={generateWhatsAppUrl(settings.whatsappNumber, "Hello, I'd like to enquire about a plot.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400"
                >
                  WhatsApp Enquiry
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 text-gold-400" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold-400">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 text-gold-400" />
                <span className="text-navy-300">{settings.officeAddress}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 text-gold-400" />
                <span className="text-navy-300">{settings.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-navy-400 sm:flex-row">
          <p>
            © {year} {settings.businessName}. All rights reserved.
          </p>
          <p className="text-center sm:text-right">
            Demo website · Sample listings are illustrative and not real property
            offers.
          </p>
        </div>
      </div>
    </footer>
  );
}
