import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Admin from "@/models/Admin";
import { requireAdmin } from "@/middleware/auth";
import { ok, fail, routeHandler } from "@/lib/http";

export const dynamic = "force-dynamic";

export const GET = routeHandler(async (req: NextRequest) => {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.response;

  await dbConnect();
  const admin = await Admin.findById(auth.user.userId).select("-passwordHash").lean();
  if (!admin) return fail("Account not found", 404);

  return ok(admin);
});
