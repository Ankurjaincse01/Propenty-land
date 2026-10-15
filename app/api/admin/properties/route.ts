import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Property from "@/models/Property";
import { requireAdmin } from "@/middleware/auth";
import { propertySchema, zodErrors } from "@/lib/validation";
import { ok, fail, routeHandler, parseListParams } from "@/lib/http";
import { cleanRef } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export const GET = routeHandler(async (req: NextRequest) => {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.response;

  await dbConnect();
  const { sp, page, limit, skip } = parseListParams(req);
  const search = sp.get("search")?.trim();
  const status = sp.get("status");
  const propertyType = sp.get("propertyType");

  const query: Record<string, any> = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { plotNumber: { $regex: search, $options: "i" } },
      { "location.city": { $regex: search, $options: "i" } },
      { "location.locality": { $regex: search, $options: "i" } },
    ];
  }
  if (status && status !== "all") query.status = status;
  if (propertyType && propertyType !== "all") query.propertyType = propertyType;

  const [data, total] = await Promise.all([
    Property.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("project", "name slug")
      .lean(),
    Property.countDocuments(query),
  ]);

  return ok(data, { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) });
});

export const POST = routeHandler(async (req: NextRequest) => {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  const parsed = propertySchema.safeParse(body);
  if (!parsed.success) {
    return fail("Please fix the highlighted fields.", 422, zodErrors(parsed.error));
  }

  await dbConnect();
  const data = parsed.data;

  const payload = {
    ...data,
    project: cleanRef(data.project),
    images: (data.images || []).map((img, i) => ({ ...img, order: img.order ?? i })),
    approvals: data.approvals || [],
    amenities: data.amenities || [],
    landmarks: data.landmarks || [],
    layoutPosition: data.layoutPosition || undefined,
  };

  const created = await Property.create(payload);
  return ok(created, { message: "Property created" }, { status: 201 });
});
