import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Project from "@/models/Project";
import { ok, routeHandler } from "@/lib/http";
import { getDemoProjects } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export const GET = routeHandler(async (req: NextRequest) => {
  const sp = req.nextUrl.searchParams;
  const featured = sp.get("featured");
  const status = sp.get("status");

  try {
    await dbConnect();
    const query: Record<string, any> = {};
    if (featured === "true") query.featured = true;
    if (status && status !== "all") query.projectStatus = status;

    const projects = await Project.find(query).sort({ featured: -1, createdAt: -1 }).lean();
    if (projects.length > 0 || !process.env.MONGODB_URI) {
      if (projects.length > 0) return ok(projects);
    }
  } catch (err) {
    console.warn("[projects-api] DB query failed, using demo fallback:", (err as Error).message);
  }

  const fallback = getDemoProjects({
    featured: featured || undefined,
    status: status || undefined,
  });
  return ok(fallback);
});
