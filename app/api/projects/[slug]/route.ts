import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Project from "@/models/Project";
import Property from "@/models/Property";
import { ok, fail, routeHandler } from "@/lib/http";
import { getDemoProjectBySlug } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export const GET = routeHandler(
  async (_req: NextRequest, ctx: { params: { slug: string } }) => {
    try {
      await dbConnect();
      const project = await Project.findOne({ slug: ctx.params.slug }).lean();
      if (project) {
        const properties = await Property.find({ project: project._id })
          .sort({ "layoutPosition.x": 1, createdAt: -1 })
          .lean();

        return ok({ project, properties });
      }
    } catch (err) {
      console.warn("[project-slug-api] DB query failed, checking demo data:", (err as Error).message);
    }

    const demo = getDemoProjectBySlug(ctx.params.slug);
    if (!demo) return fail("Project not found", 404);

    return ok(demo);
  }
);
