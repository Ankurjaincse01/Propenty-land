import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import { getSettings } from "@/models/SiteSettings";
import { requireAdmin } from "@/middleware/auth";
import { settingsSchema, zodErrors } from "@/lib/validation";
import { ok, fail, routeHandler } from "@/lib/http";

export const dynamic = "force-dynamic";

export const PUT = routeHandler(async (req: NextRequest) => {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  const parsed = settingsSchema.partial().safeParse(body);
  if (!parsed.success) {
    return fail("Please fix the highlighted fields.", 422, zodErrors(parsed.error));
  }

  await dbConnect();
  const settings = await getSettings();
  Object.assign(settings, parsed.data);
  await settings.save();

  return ok(settings, { message: "Settings saved" });
});
