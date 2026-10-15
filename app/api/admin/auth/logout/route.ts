import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import { ok } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = ok({ loggedOut: true });
  clearAuthCookie(res as NextResponse);
  return res;
}
