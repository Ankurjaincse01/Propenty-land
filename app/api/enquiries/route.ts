import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Enquiry from "@/models/Enquiry";
import Property from "@/models/Property";
import { enquirySchema, zodErrors } from "@/lib/validation";
import { ok, fail, routeHandler } from "@/lib/http";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export const POST = routeHandler(async (req: NextRequest) => {
  const ip = clientIp(req);
  const limit = rateLimit(`enquiry:${ip}`, { windowMs: 10 * 60 * 1000, max: 8 });
  if (!limit.allowed) {
    return fail(
      `Too many enquiries submitted. Please try again in ${limit.retryAfterSec}s.`,
      429
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request body", 400);

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return fail("Please check the form and try again.", 422, zodErrors(parsed.error));
  }

  await dbConnect();
  const data = parsed.data;

  // Resolve a property slug if the client only sent a slug instead of an id.
  let propertyId: string | null = data.property || null;
  if (propertyId && !/^[a-f\d]{24}$/i.test(propertyId)) {
    const found = await Property.findOne({ slug: propertyId }).select("_id").lean();
    propertyId = found ? String(found._id) : null;
  }

  const enquiry = await Enquiry.create({
    customerName: data.customerName,
    phone: data.phone,
    email: data.email || undefined,
    property: propertyId,
    project: data.project || undefined,
    preferredVisitDate: data.preferredVisitDate || undefined,
    message: data.message,
    source: data.source,
    followUpStatus: "New",
  });

  return ok({ id: enquiry._id }, { message: "Enquiry received" }, { status: 201 });
});
