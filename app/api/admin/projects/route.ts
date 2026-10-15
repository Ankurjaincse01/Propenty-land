import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Project from "@/models/Project";
import { requireAdmin } from "@/middleware/auth";
import { projectSchema, zodErrors } from "@/lib/validation";
import { ok, fail, routeHandler } from "@/lib/http";

export const dynamic = "force-dynamic";

export const GET = routeHandler(async (req: NextRequest) => {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.response;

  await dbConnect();
  const projects = await Project.find().sort({ createdAt: -1 }).lean();
  return ok(projects);
});

export const POST = routeHandler(async (req: NextRequest) => {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Please fix the highlighted fields.", 422, zodErrors(parsed.error));
  }

  await dbConnect();
  const created = await Project.create(parsed.data);
  return ok(created, { message: "Project created" }, { status: 201 });
});
