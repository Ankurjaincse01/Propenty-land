import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Property from "@/models/Property";
import Project from "@/models/Project";
import Enquiry from "@/models/Enquiry";
import { ok, routeHandler } from "@/lib/http";
import { requireAdmin } from "@/middleware/auth";
import logger from "@/lib/logger";

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
    enquiriesByStatusRaw,
    enquiriesBySourceRaw,
    propertiesByProjectRaw,
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
      .select("title status location price")
      .lean(),
    Enquiry.aggregate([
      { $group: { _id: "$followUpStatus", count: { $sum: 1 } } },
    ]),
    Enquiry.aggregate([
      { $group: { _id: "$source", count: { $sum: 1 } } },
    ]),
    Property.aggregate([
      { $group: { _id: "$project", count: { $sum: 1 } } },
      { $lookup: { from: "projects", localField: "_id", foreignField: "_id", as: "proj" } },
      { $unwind: { path: "$proj", preserveNullAndEmptyArrays: true } },
      { $project: { name: { $ifNull: ["$proj.name", "Independent"] }, count: 1 } },
    ]),
  ]);

  const enquiriesByStatus = enquiriesByStatusRaw.map((e) => ({
    status: e._id || "Other",
    count: e.count,
  }));

  const enquiriesBySource = enquiriesBySourceRaw.map((e) => ({
    source: e._id || "Website",
    count: e.count,
  }));

  const propertiesByProject = propertiesByProjectRaw.map((p) => ({
    name: p.name,
    count: p.count,
  }));

  logger.info("Admin dashboard stats retrieved", {
    userId: auth.user.userId,
    totalProperties,
    totalEnquiries,
  });

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
    enquiriesByStatus,
    enquiriesBySource,
    propertiesByProject,
  });
});
