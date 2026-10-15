import { NextRequest } from "next/server";
import { requireAdmin } from "@/middleware/auth";
import { ok, fail, routeHandler } from "@/lib/http";
import { uploadImage, validateImageDataUrl, cloudinaryEnabled } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export const POST = routeHandler(async (req: NextRequest) => {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  const dataUrl: string | undefined = body?.file;
  const folder: string = body?.folder || "greenland-estates";

  if (!dataUrl || typeof dataUrl !== "string") {
    return fail("No file provided. Send a base64 data URL in the 'file' field.", 400);
  }

  const check = validateImageDataUrl(dataUrl);
  if (!check.ok) return fail(check.error || "Invalid image", 422);

  const result = await uploadImage(dataUrl, folder);
  return ok({ ...result, cloudinary: cloudinaryEnabled });
});
