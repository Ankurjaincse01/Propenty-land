/**
 * End-to-end API integration test.
 *
 * Boots an in-memory MongoDB, then calls the actual Next.js route handlers
 * (imported directly) to verify auth, CRUD, filtering, pagination, enquiries
 * and the dashboard work against a real database.
 *
 * Run with:  npm run test:integration
 */
import test from "node:test";
import assert from "node:assert/strict";
import { MongoMemoryServer } from "mongodb-memory-server";
import { NextRequest } from "next/server";

const jsonInit = (method: string, body: unknown, token?: string) => ({
  method,
  body: JSON.stringify(body),
  headers: {
    "content-type": "application/json",
    ...(token ? { authorization: `Bearer ${token}` } : {}),
  },
});

const authHeader = (token?: string) =>
  token ? { headers: { authorization: `Bearer ${token}` } } : undefined;

test("API integration", async (t) => {
  // Boot an isolated in-memory database and set env BEFORE importing anything
  // that reads process.env at module load.
  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri("greenland_test");
  process.env.JWT_SECRET = "integration-test-secret";
  process.env.WHATSAPP_NUMBER = "91XXXXXXXXXX";

  const { default: mongoose } = await import("mongoose");
  const { default: dbConnect } = await import("../lib/mongoose");
  const { default: Admin } = await import("../models/Admin");
  const bcrypt = (await import("bcryptjs")).default;

  await dbConnect();

  // Seed one admin directly.
  await Admin.create({
    name: "Test Admin",
    email: "admin@test.com",
    passwordHash: await bcrypt.hash("secret1", 10),
    role: "admin",
  });

  t.after(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  let token = "";
  let projectId = "";
  let propertyId = "";
  let propertySlug = "";
  let enquiryId = "";

  /* ---------------------------------- health --------------------------------- */
  await t.test("GET /api/health", async () => {
    const { GET } = await import("../app/api/health/route");
    const res = await GET();
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
  });

  /* ------------------------------- public settings --------------------------- */
  await t.test("GET /api/settings returns defaults", async () => {
    const { GET } = await import("../app/api/settings/route");
    const res = await GET();
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.businessName);
  });

  /* ---------------------------------- auth ----------------------------------- */
  await t.test("POST /api/admin/auth/login rejects a bad password", async () => {
    const { POST } = await import("../app/api/admin/auth/login/route");
    const res = await POST(
      new NextRequest("http://localhost/api/admin/auth/login", jsonInit("POST", {
        email: "admin@test.com",
        password: "wrong-password",
      }))
    );
    assert.equal(res.status, 401);
  });

  await t.test("POST /api/admin/auth/login succeeds and returns a token", async () => {
    const { POST } = await import("../app/api/admin/auth/login/route");
    const res = await POST(
      new NextRequest("http://localhost/api/admin/auth/login", jsonInit("POST", {
        email: "admin@test.com",
        password: "secret1",
      }))
    );
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.data.token, "expected a JWT");
    token = body.data.token;
  });

  await t.test("admin routes reject a missing token", async () => {
    const { GET } = await import("../app/api/admin/properties/route");
    const res = await GET(new NextRequest("http://localhost/api/admin/properties"));
    assert.equal(res.status, 401);
  });

  await t.test("GET /api/admin/auth/me returns the admin", async () => {
    const { GET } = await import("../app/api/admin/auth/me/route");
    const res = await GET(
      new NextRequest("http://localhost/api/admin/auth/me", authHeader(token))
    );
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.email, "admin@test.com");
  });

  /* --------------------------------- projects -------------------------------- */
  await t.test("POST /api/admin/projects creates a project", async () => {
    const { POST } = await import("../app/api/admin/projects/route");
    const res = await POST(
      new NextRequest(
        "http://localhost/api/admin/projects",
        jsonInit(
          "POST",
          {
            name: "Integration Township",
            description: "A gated plotted development used for integration testing.",
            location: { locality: "Wagholi", city: "Pune", state: "Maharashtra" },
            projectStatus: "Ongoing",
            masterLayoutImage: "https://example.com/layout.png",
            images: [{ url: "https://example.com/project.png", alt: "demo" }],
            amenities: ["Gated", "Street lights"],
          },
          token
        )
      )
    );
    assert.equal(res.status, 201);
    const body = await res.json();
    projectId = body.data._id;
    assert.ok(projectId);
  });

  await t.test("GET /api/admin/projects lists the project", async () => {
    const { GET } = await import("../app/api/admin/projects/route");
    const res = await GET(
      new NextRequest("http://localhost/api/admin/projects", authHeader(token))
    );
    const body = await res.json();
    assert.equal(body.data.length, 1);
  });

  await t.test("GET /api/admin/projects/[id] returns project + plotCount", async () => {
    const { GET } = await import("../app/api/admin/projects/[id]/route");
    const res = await GET(
      new NextRequest(`http://localhost/api/admin/projects/${projectId}`, authHeader(token)),
      { params: { id: projectId } }
    );
    const body = await res.json();
    assert.equal(body.data.project.name, "Integration Township");
    assert.equal(body.data.plotCount, 0);
  });

  /* -------------------------------- properties ------------------------------- */
  await t.test("POST /api/admin/properties validates input", async () => {
    const { POST } = await import("../app/api/admin/properties/route");
    const res = await POST(
      new NextRequest(
        "http://localhost/api/admin/properties",
        jsonInit("POST", { title: "x" }, token)
      )
    );
    assert.equal(res.status, 422);
  });

  await t.test("POST /api/admin/properties creates a plot", async () => {
    const { POST } = await import("../app/api/admin/properties/route");
    const res = await POST(
      new NextRequest(
        "http://localhost/api/admin/properties",
        jsonInit(
          "POST",
          {
            title: "Integration Test Plot",
            plotNumber: "T-01",
            description: "A sufficiently long description for schema validation.",
            propertyType: "Residential",
            project: projectId,
            price: 1500000,
            priceDisplay: "₹15.00 Lakhs",
            area: 1200,
            areaUnit: "sq.ft",
            facing: "East",
            status: "Available",
            featured: true,
            layoutPosition: { x: 10, y: 20, polygonPoints: null },
            images: [{ url: "https://example.com/plot.png", alt: "plot" }],
            location: { locality: "Wagholi", city: "Pune", state: "Maharashtra" },
          },
          token
        )
      )
    );
    assert.equal(res.status, 201);
    const body = await res.json();
    propertyId = body.data._id;
    propertySlug = body.data.slug;
    assert.equal(body.data.slug, "integration-test-plot");
    assert.equal(body.data.layoutPosition.x, 10);
  });

  await t.test("admin property list supports search + status filter", async () => {
    const { GET } = await import("../app/api/admin/properties/route");
    const match = await GET(
      new NextRequest(
        "http://localhost/api/admin/properties?search=Integration&status=Available",
        authHeader(token)
      )
    );
    const matchBody = await match.json();
    assert.equal(matchBody.data.length, 1);
    assert.equal(matchBody.meta.total, 1);

    const none = await GET(
      new NextRequest(
        "http://localhost/api/admin/properties?status=Sold",
        authHeader(token)
      )
    );
    const noneBody = await none.json();
    assert.equal(noneBody.data.length, 0);
  });

  /* ------------------------------ public reads ------------------------------- */
  await t.test("GET /api/properties lists with pagination meta", async () => {
    const { GET } = await import("../app/api/properties/route");
    const res = await GET(
      new NextRequest("http://localhost/api/properties?page=1&limit=12&city=Pune&sort=price-asc")
    );
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.length, 1);
    assert.equal(body.meta.total, 1);
    assert.equal(body.meta.totalPages, 1);
  });

  await t.test("GET /api/properties/[slug] returns the plot", async () => {
    const { GET } = await import("../app/api/properties/[slug]/route");
    const res = await GET(
      new NextRequest(`http://localhost/api/properties/${propertySlug}`),
      { params: { slug: propertySlug } }
    );
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.property.title, "Integration Test Plot");
    assert.ok(Array.isArray(body.data.related));
  });

  await t.test("GET /api/properties/[slug] 404s for unknown slug", async () => {
    const { GET } = await import("../app/api/properties/[slug]/route");
    const res = await GET(
      new NextRequest("http://localhost/api/properties/does-not-exist"),
      { params: { slug: "does-not-exist" } }
    );
    assert.equal(res.status, 404);
  });

  await t.test("GET /api/projects and /api/projects/[slug] work", async () => {
    const list = await import("../app/api/projects/route");
    const listRes = await list.GET(new NextRequest("http://localhost/api/projects"));
    const listBody = await listRes.json();
    assert.equal(listBody.data.length, 1);

    const detail = await import("../app/api/projects/[slug]/route");
    const detailRes = await detail.GET(
      new NextRequest("http://localhost/api/projects/integration-township"),
      { params: { slug: "integration-township" } }
    );
    assert.equal(detailRes.status, 200);
    const detailBody = await detailRes.json();
    assert.equal(detailBody.data.project.name, "Integration Township");
    assert.equal(detailBody.data.properties.length, 1);
  });

  /* -------------------------------- enquiries -------------------------------- */
  await t.test("POST /api/enquiries creates an enquiry (slug resolved)", async () => {
    const { POST } = await import("../app/api/enquiries/route");
    const res = await POST(
      new NextRequest(
        "http://localhost/api/enquiries",
        jsonInit("POST", {
          customerName: "Ravi Kumar",
          phone: "+91 98765 43210",
          message: "Please share the price and site visit slots.",
          property: propertySlug,
          source: "Property Page",
        })
      )
    );
    assert.equal(res.status, 201);
    const body = await res.json();
    enquiryId = body.data.id;
    assert.ok(enquiryId);
  });

  await t.test("POST /api/enquiries rejects invalid input", async () => {
    const { POST } = await import("../app/api/enquiries/route");
    const res = await POST(
      new NextRequest(
        "http://localhost/api/enquiries",
        jsonInit("POST", { customerName: "R", phone: "abc", message: "hi" })
      )
    );
    assert.equal(res.status, 422);
  });

  await t.test("GET /api/admin/enquiries lists and populates property", async () => {
    const { GET } = await import("../app/api/admin/enquiries/route");
    const res = await GET(
      new NextRequest("http://localhost/api/admin/enquiries", authHeader(token))
    );
    const body = await res.json();
    assert.equal(body.data.length, 1);
    assert.equal(body.data[0].property.title, "Integration Test Plot");
  });

  await t.test("PATCH /api/admin/enquiries/[id] updates status + note", async () => {
    const { PATCH } = await import("../app/api/admin/enquiries/[id]/route");
    const res = await PATCH(
      new NextRequest(
        `http://localhost/api/admin/enquiries/${enquiryId}`,
        jsonInit("PATCH", { followUpStatus: "Contacted", note: "Called buyer" }, token)
      ),
      { params: { id: enquiryId } }
    );
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.followUpStatus, "Contacted");
    assert.equal(body.data.internalNotes.length, 1);
  });

  /* -------------------------------- dashboard -------------------------------- */
  await t.test("GET /api/admin/dashboard/stats reflects the data", async () => {
    const { GET } = await import("../app/api/admin/dashboard/stats/route");
    const res = await GET(
      new NextRequest("http://localhost/api/admin/dashboard/stats", authHeader(token))
    );
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.totalProperties, 1);
    assert.equal(body.data.available, 1);
    assert.equal(body.data.totalProjects, 1);
    assert.equal(body.data.totalEnquiries, 1);
    assert.equal(body.data.recentEnquiries.length, 1);
    assert.equal(body.data.recentProperties.length, 1);
  });

  /* --------------------------------- settings -------------------------------- */
  await t.test("PUT /api/admin/settings updates settings", async () => {
    const { PUT } = await import("../app/api/admin/settings/route");
    const res = await PUT(
      new NextRequest(
        "http://localhost/api/admin/settings",
        jsonInit(
          "PUT",
          {
            businessName: "GreenLand Estates",
            phone: "+91 90000 00000",
            whatsappNumber: "919000000000",
            email: "info@greenlandestates.com",
            officeAddress: "Test Address, Pune",
          },
          token
        )
      )
    );
    assert.equal(res.status, 200);

    const { GET } = await import("../app/api/settings/route");
    const pub = await (await GET()).json();
    assert.equal(pub.data.whatsappNumber, "919000000000");
  });

  /* ---------------------------- update + delete ------------------------------ */
  await t.test("PUT /api/admin/properties/[id] updates status", async () => {
    const { PUT } = await import("../app/api/admin/properties/[id]/route");
    const res = await PUT(
      new NextRequest(
        `http://localhost/api/admin/properties/${propertyId}`,
        jsonInit("PUT", { status: "Sold" }, token)
      ),
      { params: { id: propertyId } }
    );
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.status, "Sold");
  });

  await t.test("DELETE /api/admin/projects/[id] blocks when plots are linked", async () => {
    const { DELETE } = await import("../app/api/admin/projects/[id]/route");
    const res = await DELETE(
      new NextRequest(
        `http://localhost/api/admin/projects/${projectId}`,
        authHeader(token)
      ),
      { params: { id: projectId } }
    );
    assert.equal(res.status, 409);
  });

  await t.test("DELETE /api/admin/properties/[id] then project succeeds", async () => {
    const { DELETE: delProp } = await import("../app/api/admin/properties/[id]/route");
    const propRes = await delProp(
      new NextRequest(
        `http://localhost/api/admin/properties/${propertyId}`,
        authHeader(token)
      ),
      { params: { id: propertyId } }
    );
    assert.equal(propRes.status, 200);

    const { DELETE: delProj } = await import("../app/api/admin/projects/[id]/route");
    const projRes = await delProj(
      new NextRequest(
        `http://localhost/api/admin/projects/${projectId}`,
        authHeader(token)
      ),
      { params: { id: projectId } }
    );
    assert.equal(projRes.status, 200);
  });

  await t.test("invalid ObjectId returns 400", async () => {
    const { GET } = await import("../app/api/admin/properties/[id]/route");
    const res = await GET(
      new NextRequest("http://localhost/api/admin/properties/not-an-id", authHeader(token)),
      { params: { id: "not-an-id" } }
    );
    assert.equal(res.status, 400);
  });
});
