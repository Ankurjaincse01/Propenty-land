export const siteConfig = {
  name: "GreenLand Estates",
  description: "Find Your Perfect Plot. Build Your Future.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  business: {
    name: "GreenLand Estates",
    phone: process.env.NEXT_PUBLIC_PHONE || "+91XXXXXXXXXX",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "91XXXXXXXXXX",
    email: process.env.NEXT_PUBLIC_EMAIL || "info@greenlandestates.com",
    address: "Your Business Address Here",
  },
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
