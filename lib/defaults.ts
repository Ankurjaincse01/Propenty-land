export interface SiteSettingsData {
  businessName: string;
  tagline: string;
  logoUrl?: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  officeAddress: string;
  workingHours: string;
  mapCoordinates?: { lat?: number; lng?: number };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
  };
  seoDefaults: { title: string; description: string };
  currency: string;
}

export const DEFAULT_SETTINGS: SiteSettingsData = {
  businessName: "GreenLand Estates",
  tagline: "Find Your Perfect Plot. Build Your Future.",
  phone: "+91 XXXXX XXXXX",
  whatsappNumber: "91XXXXXXXXXX",
  email: "info@greenlandestates.com",
  officeAddress: "GreenLand Estates, VIP Road, Near Bus Stand, Chhindwara, Madhya Pradesh 480001, India",
  workingHours: "Mon – Sat: 9:30 AM – 7:00 PM",
  mapCoordinates: { lat: 22.0574, lng: 78.9382 },
  socialLinks: {},
  seoDefaults: {
    title: "Find Your Perfect Plot in Chhindwara | GreenLand Estates",
    description:
      "Discover premium residential, commercial and NA plots across Chhindwara, MP with transparent pricing, verified master layouts and guided site-visit support.",
  },
  currency: "₹",
};

export const DEMO_LAYOUT_IMAGE =
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/plots", label: "Explore Plots" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];
