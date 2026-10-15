import test from "node:test";
import assert from "node:assert/strict";
import {
  propertySchema,
  projectSchema,
  enquirySchema,
  loginSchema,
  settingsSchema,
  zodErrors,
} from "../lib/validation";

const validProperty = {
  title: "East-Facing Plot in Green Valley",
  description: "A well-proportioned residential plot on a 30 ft road.",
  propertyType: "Residential" as const,
  price: 1850000,
  area: 1200,
  areaUnit: "sq.ft" as const,
  location: { city: "Pune", state: "Maharashtra" },
};

test("propertySchema accepts a valid residential plot", () => {
  const parsed = propertySchema.safeParse(validProperty);
  assert.equal(parsed.success, true);
  if (parsed.success) assert.equal(parsed.data.status, "Available");
});

test("propertySchema rejects short titles and non-positive area", () => {
  const bad = propertySchema.safeParse({ ...validProperty, title: "Hi", area: 0 });
  assert.equal(bad.success, false);
  if (!bad.success) {
    const errs = zodErrors(bad.error);
    assert.ok(errs.title);
    assert.ok(errs.area);
  }
});

test("propertySchema bounds interactive layout coordinates to 0-100", () => {
  const ok = propertySchema.safeParse({
    ...validProperty,
    layoutPosition: { x: 24, y: 68, polygonPoints: null },
  });
  assert.equal(ok.success, true);

  const outOfRange = propertySchema.safeParse({
    ...validProperty,
    layoutPosition: { x: 140, y: -5 },
  });
  assert.equal(outOfRange.success, false);
});

test("projectSchema requires a valid name and city", () => {
  const ok = projectSchema.safeParse({
    name: "Green Valley Township",
    description: "A gated plotted development with wide internal roads.",
    location: { city: "Pune", state: "Maharashtra" },
  });
  assert.equal(ok.success, true);
  if (ok.success) assert.equal(ok.data.projectStatus, "Ongoing");

  const bad = projectSchema.safeParse({
    name: "GV",
    description: "too short",
    location: { city: "", state: "" },
  });
  assert.equal(bad.success, false);
});

test("enquirySchema validates phone format and message length", () => {
  const ok = enquirySchema.safeParse({
    customerName: "Ravi Kumar",
    phone: "+91 98765 43210",
    message: "Please share the price and site visit slots.",
  });
  assert.equal(ok.success, true);
  if (ok.success) assert.equal(ok.data.source, "Contact Page");

  const badPhone = enquirySchema.safeParse({
    customerName: "Ravi Kumar",
    phone: "call-me",
    message: "Please share the price.",
  });
  assert.equal(badPhone.success, false);

  const shortMessage = enquirySchema.safeParse({
    customerName: "Ravi Kumar",
    phone: "9876543210",
    message: "hi",
  });
  assert.equal(shortMessage.success, false);
});

test("loginSchema and settingsSchema enforce required fields", () => {
  assert.equal(
    loginSchema.safeParse({ email: "admin@x.com", password: "secret1" }).success,
    true
  );
  assert.equal(
    loginSchema.safeParse({ email: "nope", password: "123" }).success,
    false
  );

  assert.equal(
    settingsSchema.safeParse({
      businessName: "GreenLand Estates",
      phone: "+91 XXXXX XXXXX",
      whatsappNumber: "91XXXXXXXXXX",
      email: "info@greenlandestates.com",
      officeAddress: "Market Road, Pune",
    }).success,
    true
  );
});
