import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
}

export function ok<T>(data: T, meta?: ApiMeta, init?: ResponseInit) {
  return NextResponse.json({ success: true, data, ...(meta ? { meta } : {}) }, init);
}

export function fail(
  message: string,
  status = 400,
  error: unknown = null
) {
  return NextResponse.json(
    { success: false, message, ...(error && process.env.NODE_ENV !== "production" ? { error: String(error) } : {}) },
    { status }
  );
}

import logger from "@/lib/logger";

/**
 * Wrap a route handler so unexpected errors never leak internals.
 */
export function routeHandler<T extends (...args: any[]) => Promise<Response>>(fn: T) {
  return async (...args: Parameters<T>): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (err) {
      logger.error("[api-error]", { error: err instanceof Error ? err.stack : err });
      return fail("Something went wrong. Please try again.", 500, err);
    }
  };
}

export function parseListParams(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10) || 1);
  const limitRaw = parseInt(sp.get("limit") || "12", 10) || 12;
  const limit = Math.min(60, Math.max(1, limitRaw));
  return { sp, page, limit, skip: (page - 1) * limit };
}

export const isObjectId = (v: string) => /^[a-f\d]{24}$/i.test(v);
