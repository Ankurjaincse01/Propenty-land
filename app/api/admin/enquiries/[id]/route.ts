import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Enquiry from "@/models/Enquiry";
import { requireAdmin } from "@/middleware/auth";
import { enquiryUpdateSchema } from "@/lib/validation";
import { ok, fail, routeHandler, isObjectId } from "@/lib/http";

export const dynamic = "force-dynamic";

export const PATCH = routeHandler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    const auth = requireAdmin(req);
    if (!auth.ok) return auth.response;
    if (!isObjectId(ctx.params.id)) return fail("Invalid enquiry id", 400);

    const body = await req.json().catch(() => null);
    const parsed = enquiryUpdateSchema.safeParse(body);
    if (!parsed.success) return fail("Invalid update payload", 422);

    await dbConnect();
    const enquiry = await Enquiry.findById(ctx.params.id);
    if (!enquiry) return fail("Enquiry not found", 404);

    if (parsed.data.followUpStatus) enquiry.followUpStatus = parsed.data.followUpStatus;
    if (parsed.data.note && parsed.data.note.trim()) {
      enquiry.internalNotes.push({ note: parsed.data.note.trim(), addedAt: new Date() });
    }

    await enquiry.save();
    return ok(enquiry, { message: "Enquiry updated" });
  }
);

export const DELETE = routeHandler(
  async (req: NextRequest, ctx: { params: { id: string } }) => {
    const auth = requireAdmin(req);
    if (!auth.ok) return auth.response;
    if (!isObjectId(ctx.params.id)) return fail("Invalid enquiry id", 400);

    await dbConnect();
    const deleted = await Enquiry.findByIdAndDelete(ctx.params.id);
    if (!deleted) return fail("Enquiry not found", 404);
    return ok({ id: ctx.params.id }, { message: "Enquiry deleted" });
  }
);
