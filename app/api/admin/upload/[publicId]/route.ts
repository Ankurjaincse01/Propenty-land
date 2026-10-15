import { NextRequest } from "next/server";
import { requireAdmin } from "@/middleware/auth";
import { ok, routeHandler } from "@/lib/http";
import { deleteImage } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export const DELETE = routeHandler(
  async (req: NextRequest, ctx: { params: { publicId: string } }) => {
    const auth = requireAdmin(req);
    if (!auth.ok) return auth.response;

    const publicId = decodeURIComponent(ctx.params.publicId);
    await deleteImage(publicId);
    return ok({ publicId }, { message: "Image deleted" });
  }
);
