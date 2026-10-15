import type { MetadataRoute } from "next";
import dbConnect from "@/lib/mongoose";
import Property from "@/models/Property";
import Project from "@/models/Project";

export const revalidate = 3600;

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/plots`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/projects`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    await dbConnect();
    const [properties, projects] = await Promise.all([
      Property.find({ status: { $ne: "Sold" } }).select("slug updatedAt").lean(),
      Project.find().select("slug updatedAt").lean(),
    ]);

    return [
      ...staticRoutes,
      ...properties.map((p: any) => ({
        url: `${BASE}/properties/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...projects.map((p: any) => ({
        url: `${BASE}/projects/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
