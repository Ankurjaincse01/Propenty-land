import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Admin from "@/models/Admin";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { ok, fail, routeHandler } from "@/lib/http";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export const POST = routeHandler(async (req: NextRequest) => {
  const ip = clientIp(req);
  const limit = rateLimit(`register:${ip}`, { windowMs: 15 * 60 * 1000, max: 10 });
  if (!limit.allowed) {
    return fail(
      `Too many registration attempts. Try again in ${limit.retryAfterSec}s.`,
      429
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Invalid registration data.";
    return fail(errorMsg, 400);
  }

  await dbConnect();
  const { name, email, password } = parsed.data;

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    return fail("An account with this email already exists. Please log in.", 409);
  }

  const passwordHash = await hashPassword(password);
  const admin = await Admin.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: "admin",
  });

  const token = signToken({
    userId: String(admin._id),
    email: admin.email,
    role: admin.role,
  });

  const res = ok({
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
  setAuthCookie(res, token);
  return res;
});
