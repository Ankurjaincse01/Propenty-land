import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken, TokenPayload } from "@/lib/auth";
import { fail } from "@/lib/http";

type GuardResult =
  | { ok: true; user: TokenPayload }
  | { ok: false; response: NextResponse };

/**
 * Guard for protected admin API routes.
 * Accepts a Bearer token (localStorage flow) or the HttpOnly cookie.
 */
export function requireAdmin(req: NextRequest): GuardResult {
  const token = getTokenFromRequest(req);
  if (!token) {
    return { ok: false, response: fail("Unauthorized. Please sign in.", 401) };
  }
  try {
    const user = verifyToken(token);
    return { ok: true, user };
  } catch {
    return { ok: false, response: fail("Session expired. Please sign in again.", 401) };
  }
}

export function requireRole(req: NextRequest, roles: string[]): GuardResult {
  const result = requireAdmin(req);
  if (!result.ok) return result;
  if (!roles.includes(result.user.role)) {
    return { ok: false, response: fail("You do not have permission to do this.", 403) };
  }
  return result;
}
