import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Admin from "@/models/Admin";
import { comparePassword, signToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { ok, fail, routeHandler } from "@/lib/http";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import logger from "@/lib/logger";

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
  if (!admin) {
    // Run dummy comparison to prevent user enumeration via timing attack
    await comparePassword(password, "$2a$10$wK1k6sC27jU93H2KzZ0I1eQ7bHn2Xy5RkL6mOpQrStUvWxYz12345");
    logger.warn("Admin login failed: email not found", { email, ip });
    return fail("Invalid email or password.", 401);
  }

  const valid = await comparePassword(password, admin.passwordHash);
  if (!valid) {
    logger.warn("Admin login failed: invalid password", { email, ip });
    return fail("Invalid email or password.", 401);
  }

  const token = signToken({
    userId: String(admin._id),
    email: admin.email,
    role: admin.role,
  });

  admin.lastLoginAt = new Date();
  await admin.save();
  logger.info("Admin login successful", { email: admin.email, ip });

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
