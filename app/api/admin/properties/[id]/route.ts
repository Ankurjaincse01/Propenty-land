import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Property from "@/models/Property";
import { requireAdmin } from "@/middleware/auth";
import { propertySchema, zodErrors } from "@/lib/validation";
import { ok, fail, routeHandler, isObjectId } from "@/lib/http";
import { cleanRef } from "@/lib/sanitize";
import { deleteImage } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export const GET = routeHandler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    const auth = requireAdmin(req);
    if (!auth.ok) return auth.response;
    if (!isObjectId(ctx.params.id)) return fail("Invalid property id", 400);

    await dbConnect();
    const property = await Property.findById(ctx.params.id).populate("project", "name slug masterLayoutImage");
    if (!property) return fail("Property not found", 404);
    return ok(property);
  }
);

export const PUT = routeHandler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    const auth = requireAdmin(req);
    if (!auth.ok) return auth.response;
    if (!isObjectId(ctx.params.id)) return fail("Invalid property id", 400);

    const body = await req.json().catch(() => null);
    const parsed = propertySchema.partial().safeParse(body);
    if (!parsed.success) {
      return fail("Please fix the highlighted fields.", 422, zodErrors(parsed.error));
    }

    await dbConnect();
    const data = parsed.data;

    const update: Record<string, any> = { ...data };
    if ("project" in data) update.project = cleanRef(data.project);
    if (data.images) update.images = data.images.map((img, i) => ({ ...img, order: img.order ?? i }));

    const updated = await Property.findByIdAndUpdate(ctx.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) return fail("Property not found", 404);
    return ok(updated, { message: "Property updated" });
  }
);

export const DELETE = routeHandler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    const auth = requireAdmin(req);
    if (!auth.ok) return auth.response;
    if (!isObjectId(ctx.params.id)) return fail("Invalid property id", 400);

    await dbConnect();
    const property = await Property.findById(ctx.params.id);
    if (!property) return fail("Property not found", 404);

    // Clean up Cloudinary assets that are unique to this property.
    const otherWithSameImage = new Set<string>();
    const publicIds = property.images.map((i) => i.publicId).filter(Boolean) as string[];
    if (publicIds.length) {
      const others = await Property.find({
        _id: { $ne: property._id },
        "images.publicId": { $in: publicIds },
      }).select("images.publicId");
      for (const o of others) {
        for (const img of o.images) if (img.publicId) otherWithSameImage.add(img.publicId);
      }
    }
    await Promise.all(
      publicIds.filter((id) => !otherWithSameImage.has(id)).map((id) => deleteImage(id))
    );

    await property.deleteOne();
    return ok({ id: ctx.params.id }, { message: "Property deleted" });
  }
);
