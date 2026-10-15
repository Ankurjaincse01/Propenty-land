import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Enquiry from "@/models/Enquiry";
import { requireAdmin } from "@/middleware/auth";
import { ok, routeHandler, parseListParams } from "@/lib/http";

export const dynamic = "force-dynamic";

export const GET = routeHandler(async (req: NextRequest) => {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.response;

  await dbConnect();
  const { sp, page, limit, skip } = parseListParams(req);
  const search = sp.get("search")?.trim();
  const status = sp.get("status");

  const query: Record<string, any> = {};
  if (search) {
    query.$or = [
      { customerName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (status && status !== "all") query.followUpStatus = status;

  const [data, total] = await Promise.all([
    Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("property", "title slug")
      .populate("project", "name slug")
      .lean(),
    Enquiry.countDocuments(query),
  ]);

  return ok(data, { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) });
});
