import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Admin from "@/models/Admin";
import { comparePassword, signToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { ok, fail, routeHandler } from "@/lib/http";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export const POST = routeHandler(async (req: NextRequest) => {
  const ip = clientIp(req);
  const limit = rateLimit(`login:${ip}`, { windowMs: 15 * 60 * 1000, max: 10 });
  if (!limit.allowed) {
    return fail(
      `Too many login attempts. Try again in ${limit.retryAfterSec}s.`,
      429
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return fail("Invalid email or password.", 400);

  await dbConnect();
  const { email, password } = parsed.data;

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) return fail("Invalid email or password.", 401);

  const valid = await comparePassword(password, admin.passwordHash);
  if (!valid) return fail("Invalid email or password.", 401);

  const token = signToken({
    userId: String(admin._id),
    email: admin.email,
    role: admin.role,
  });

  admin.lastLoginAt = new Date();
  await admin.save();

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
