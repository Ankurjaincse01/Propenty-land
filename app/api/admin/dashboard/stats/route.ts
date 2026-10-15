import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Property from "@/models/Property";
import Project from "@/models/Project";
import Enquiry from "@/models/Enquiry";
import { ok, routeHandler } from "@/lib/http";
import { requireAdmin } from "@/middleware/auth";

export const dynamic = "force-dynamic";

export const GET = routeHandler(async (req: NextRequest) => {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.response;

  await dbConnect();

  const [
    totalProperties,
    available,
    reserved,
    sold,
    totalProjects,
    totalEnquiries,
    newEnquiries,
    recentEnquiries,
    recentProperties,
  ] = await Promise.all([
    Property.countDocuments(),
    Property.countDocuments({ status: "Available" }),
    Property.countDocuments({ status: "Reserved" }),
    Property.countDocuments({ status: "Sold" }),
    Project.countDocuments(),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ followUpStatus: "New" }),
    Enquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("customerName phone followUpStatus createdAt")
      .lean(),
    Property.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title status location")
      .lean(),
  ]);

  return ok({
    totalProperties,
    available,
    reserved,
    sold,
    totalProjects,
    totalEnquiries,
    newEnquiries,
    recentEnquiries,
    recentProperties,
  });
});
