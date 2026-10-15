import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GreenLand Estates | Find Your Perfect Plot. Build Your Future.",
    template: "%s | GreenLand Estates",
  },
  description:
    "Discover premium residential, commercial and NA plots across India. Verified layouts, transparent pricing and site-visit support from a trusted property dealer.",
  keywords: [
    "plots for sale",
    "residential plots",
    "commercial plots",
    "NA plots",
    "gated layout",
    "real estate India",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    title: "GreenLand Estates | Find Your Perfect Plot. Build Your Future.",
    description:
      "Premium residential and commercial plots across India with transparent pricing.",
    siteName: "GreenLand Estates",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable} ${playfair.variable}`}
    >
      <body className="min-h-screen font-sans">
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      </body>
    </html>
  );
}
