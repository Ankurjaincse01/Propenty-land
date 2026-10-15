import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Property from "@/models/Property";
import { ok, fail, routeHandler, parseListParams } from "@/lib/http";
import { getDemoProperties } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export const GET = routeHandler(async (req: NextRequest) => {
  const { sp, page, limit, skip } = parseListParams(req);

  const search = sp.get("search")?.trim() || "";
  const city = sp.get("city")?.trim() || "";
  const propertyType = sp.get("propertyType") || "";
  const status = sp.get("status") || "";
  const facing = sp.get("facing") || "";
  const project = sp.get("project") || "";
  const featured = sp.get("featured") || "";
  const minPrice = sp.get("minPrice") || "";
  const maxPrice = sp.get("maxPrice") || "";
  const minArea = sp.get("minArea") || "";
  const maxArea = sp.get("maxArea") || "";
  const sort = sp.get("sort") || "newest";

  try {
    await dbConnect();

    const query: Record<string, any> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { plotNumber: { $regex: search, $options: "i" } },
        { "location.locality": { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
      ];
    }
    if (city && city !== "all") query["location.city"] = { $regex: `^${city}$`, $options: "i" };
    if (propertyType && propertyType !== "all") query.propertyType = propertyType;
    if (status && status !== "all") query.status = status;
    if (facing && facing !== "all") query.facing = facing;
    if (project && project !== "all") query.project = project;
    if (featured === "true") query.featured = true;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = Number(minArea);
      if (maxArea) query.area.$lte = Number(maxArea);
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      "area-asc": { area: 1 },
      "area-desc": { area: -1 },
    };
    const sortObj = sortMap[sort] || sortMap.newest;

    const [data, total] = await Promise.all([
      Property.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
      Property.countDocuments(query),
    ]);

    if (total > 0 || !process.env.MONGODB_URI) {
      if (total > 0) {
        return ok(data, {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        });
      }
    }
  } catch (err) {
    // If DB is not reachable, fall through to demo data
    console.warn("[properties-api] Database query failed, using demo data fallback:", (err as Error).message);
  }

  // Graceful Demo Fallback
  const fallback = getDemoProperties({
    search,
    city,
    propertyType,
    status,
    facing,
    project,
    featured,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    sort,
    skip,
    limit,
  });

  return ok(fallback.data, {
    page,
    limit,
    total: fallback.total,
    totalPages: fallback.totalPages,
  });
});
