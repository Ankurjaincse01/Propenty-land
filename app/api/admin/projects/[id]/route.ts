import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Project from "@/models/Project";
import Property from "@/models/Property";
import { requireAdmin } from "@/middleware/auth";
import { projectSchema, zodErrors } from "@/lib/validation";
import { ok, fail, routeHandler, isObjectId } from "@/lib/http";
import { deleteImage } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export const GET = routeHandler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    const auth = requireAdmin(req);
    if (!auth.ok) return auth.response;
    if (!isObjectId(ctx.params.id)) return fail("Invalid project id", 400);

    await dbConnect();
    const project = await Project.findById(ctx.params.id);
    if (!project) return fail("Project not found", 404);
    const plotCount = await Property.countDocuments({ project: project._id });
    return ok({ project, plotCount });
  }
);

export const PUT = routeHandler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    const auth = requireAdmin(req);
    if (!auth.ok) return auth.response;
    if (!isObjectId(ctx.params.id)) return fail("Invalid project id", 400);

    const body = await req.json().catch(() => null);
    const parsed = projectSchema.partial().safeParse(body);
    if (!parsed.success) {
      return fail("Please fix the highlighted fields.", 422, zodErrors(parsed.error));
    }

    await dbConnect();
    const updated = await Project.findByIdAndUpdate(ctx.params.id, parsed.data, {
      new: true,
      runValidators: true,
    });
    if (!updated) return fail("Project not found", 404);
    return ok(updated, { message: "Project updated" });
  }
);

export const DELETE = routeHandler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    const auth = requireAdmin(req);
    if (!auth.ok) return auth.response;
    if (!isObjectId(ctx.params.id)) return fail("Invalid project id", 400);

    await dbConnect();
    const project = await Project.findById(ctx.params.id);
    if (!project) return fail("Project not found", 404);

    const plotCount = await Property.countDocuments({ project: project._id });
    if (plotCount > 0) {
      return fail(
        `This project has ${plotCount} plot(s) linked. Reassign or delete those plots first.`,
        409
      );
    }

    await Promise.all(
      project.images.map((i) => (i.publicId ? deleteImage(i.publicId) : Promise.resolve()))
    );
    await project.deleteOne();
    return ok({ id: ctx.params.id }, { message: "Project deleted" });
  }
);
