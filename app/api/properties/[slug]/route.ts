import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Property from "@/models/Property";
import { ok, fail, routeHandler } from "@/lib/http";
import { getDemoPropertyBySlug } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export const GET = routeHandler(
  async (_req: NextRequest, ctx: { params: { slug: string } }) => {
    try {
      await dbConnect();
      const property = await Property.findOne({ slug: ctx.params.slug })
        .populate("project", "name slug location masterLayoutImage")
        .lean();

      if (property) {
        const related = await Property.find({
          _id: { $ne: property._id },
          status: { $ne: "Sold" },
          $or: [
            { "location.city": (property as any).location?.city },
            { project: (property as any).project?._id ?? null },
          ],
        })
          .limit(3)
          .select("title slug price area areaUnit images location propertyType status isDemo pricePerUnit")
          .lean();

        return ok({ property, related });
      }
    } catch (err) {
      console.warn("[property-slug-api] DB query failed, checking demo data:", (err as Error).message);
    }

    const demo = getDemoPropertyBySlug(ctx.params.slug);
    if (!demo) return fail("Property not found", 404);

    return ok(demo);
  }
);
