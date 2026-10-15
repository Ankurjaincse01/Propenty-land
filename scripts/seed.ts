/**
 * Seed script — populates the database with:
 *   1. A singleton SiteSettings document
 *   2. One default admin (credentials from .env.local)
 *   3. Two demo plotted developments and 8 demo plots with interactive
 *      master-layout coordinates.
 *
 * Run with:  npm run seed
 *
 * All listings are clearly marked `isDemo: true` and use placeholder
 * photography. No real approvals, RERA/DTCP numbers or testimonials are
 * invented.
 */
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* -------------------------------------------------------------------------- */
/* Minimal .env loader (tsx does not read .env.local automatically)           */
/* -------------------------------------------------------------------------- */
function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const p = path.join(process.cwd(), file);
    if (!fs.existsSync(p)) continue;
    const content = fs.readFileSync(p, "utf8");
    for (const raw of content.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}
loadEnv();

import Admin from "../models/Admin";
import Property from "../models/Property";
import Project from "../models/Project";
import SiteSettings, { getSettings } from "../models/SiteSettings";

const MONGODB_URI = process.env.MONGODB_URI;

const IMG = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const LAYOUT_IMAGE_1 = IMG("photo-1500382017468-9049fed747ef", 1800);
const LAYOUT_IMAGE_2 = IMG("photo-1524813686514-a57563d77965", 1800);

const PLOT_PHOTOS = [
  IMG("photo-1500382017468-9049fed747ef"),
  IMG("photo-1449844908441-8829872d2607"),
  IMG("photo-1524813686514-a57563d77965"),
  IMG("photo-1560518883-ce09059eeffa"),
];

/* -------------------------------------------------------------------------- */
/* Seed data                                                                  */
/* -------------------------------------------------------------------------- */
/* Seed data (Chhindwara, MP)                                                 */
/* -------------------------------------------------------------------------- */
const projects = [
  {
    name: "Satpura Green Valley Township (Chhindwara)",
    slug: "satpura-green-valley-chhindwara",
    description:
      "A premier gated plotted development located on VIP Road / Parasia Road in Chhindwara, Madhya Pradesh. Features 30 ft and 40 ft internal tar roads, grand entrance arch, children's play area and a landscaped central green. All plots are demarcated with clear title NA sanction.",
    location: { locality: "Parasia Road / VIP Road", city: "Chhindwara", state: "Madhya Pradesh" },
    coordinates: { lat: 22.0574, lng: 78.9382 },
    images: [
      { url: PLOT_PHOTOS[1], alt: "Satpura Green Valley entrance arch, Chhindwara" },
      { url: PLOT_PHOTOS[2], alt: "Satpura Green Valley 40ft internal avenue" },
    ],
    masterLayoutImage: LAYOUT_IMAGE_1,
    amenities: [
      "Gated entrance with security cabin",
      "30 ft & 40 ft wide tar roads",
      "Underground water & drainage lines",
      "LED street lights",
      "Landscaped central park",
      "Children's play garden",
    ],
    plotSizeRange: { min: 1000, max: 2400, unit: "sq.ft" },
    startingPrice: 1450000,
    totalPlots: 120,
    projectStatus: "Ongoing" as const,
    featured: true,
    isDemo: true,
  },
  {
    name: "Sunrise Enclave, Nagpur Road (Chhindwara)",
    slug: "sunrise-enclave-chhindwara",
    description:
      "A compact residential plotted layout close to Nagpur Road highway in Chhindwara with well-demarcated plots, perimeter compound wall, and scenic Satpura hill views.",
    location: { locality: "Nagpur Road", city: "Chhindwara", state: "Madhya Pradesh" },
    coordinates: { lat: 22.0450, lng: 78.9480 },
    images: [
      { url: PLOT_PHOTOS[0], alt: "Sunrise Enclave plot view, Chhindwara" },
      { url: PLOT_PHOTOS[3], alt: "Sunrise Enclave access road, Chhindwara" },
    ],
    masterLayoutImage: LAYOUT_IMAGE_2,
    amenities: [
      "Perimeter compound wall",
      "24 ft internal roads",
      "Water connection points",
      "Proposed open garden space",
    ],
    plotSizeRange: { min: 1200, max: 1800, unit: "sq.ft" },
    startingPrice: 980000,
    totalPlots: 60,
    projectStatus: "Upcoming" as const,
    featured: false,
    isDemo: true,
  },
];

/** Plot definitions reference a project by index. */
const plots = [
  {
    projectIndex: 0,
    title: "East-Facing Residential Plot in Satpura Green Valley, Chhindwara",
    slug: "east-facing-residential-plot-chhindwara",
    plotNumber: "A-12",
    description:
      "A well-proportioned east-facing residential plot on a 30 ft internal road in Satpura Green Valley layout, Parasia Road, Chhindwara. Suitable for a 3BHK bungalow or duplex villa.",
    propertyType: "Residential" as const,
    price: 1850000,
    priceDisplay: "₹18.50 Lakhs",
    area: 1200,
    areaUnit: "sq.ft" as const,
    dimensions: { length: 40, width: 30 },
    facing: "East",
    isCornerPlot: false,
    roadWidthFt: 30,
    boundaryWall: true,
    zoning: "Residential Plotted Layout",
    landmarks: [
      { name: "Chhindwara Railway Station", distanceKm: 3.2 },
      { name: "VIP Road Commercial Hub", distanceKm: 1.5 },
      { name: "District Hospital Chhindwara", distanceKm: 2.8 },
      { name: "Simariya Hanuman Mandir", distanceKm: 6.5 },
    ],
    amenities: ["30 ft road", "Water line", "Street lights", "Gated society"],
    approvals: ["T&CP Sanctioned Layout", "Diversion Approved"],
    status: "Available" as const,
    featured: true,
    layoutPosition: { x: 24, y: 32 },
  },
  {
    projectIndex: 0,
    title: "Corner West-Facing Plot on 40ft Avenue, Chhindwara",
    slug: "corner-west-facing-plot-chhindwara",
    plotNumber: "A-13",
    description:
      "A premium corner plot with 40ft and 30ft road frontage on two sides and a west facing entrance. Ideal for a spacious duplex home in Chhindwara.",
    propertyType: "Residential" as const,
    price: 2350000,
    priceDisplay: "₹23.50 Lakhs",
    area: 1500,
    areaUnit: "sq.ft" as const,
    dimensions: { length: 50, width: 30 },
    facing: "West",
    isCornerPlot: true,
    roadWidthFt: 40,
    boundaryWall: true,
    zoning: "Residential Plotted Layout",
    landmarks: [
      { name: "Chhindwara Bus Terminal", distanceKm: 2.9 },
      { name: "Parasia Road Flyover", distanceKm: 1.8 },
      { name: "Kendriya Vidyalaya Chhindwara", distanceKm: 3.5 },
    ],
    amenities: ["Corner plot", "40 ft + 30 ft roads", "Water line", "Street lights"],
    approvals: ["T&CP Sanctioned Layout"],
    status: "Reserved" as const,
    featured: true,
    layoutPosition: { x: 56, y: 32 },
  },
  {
    projectIndex: 0,
    title: "North-Facing Garden-Facing Plot, Chhindwara",
    slug: "north-facing-garden-plot-chhindwara",
    plotNumber: "B-04",
    description:
      "North-facing plot directly overlooking the landscaped central garden in Satpura Green Valley, Chhindwara. Excellent ventilation and peaceful surroundings.",
    propertyType: "Residential" as const,
    price: 2100000,
    priceDisplay: "₹21.00 Lakhs",
    area: 1350,
    areaUnit: "sq.ft" as const,
    dimensions: { length: 45, width: 30 },
    facing: "North",
    isCornerPlot: false,
    roadWidthFt: 30,
    boundaryWall: true,
    zoning: "Residential Plotted Layout",
    landmarks: [
      { name: "Central Park Green Valley", distanceKm: 0.1 },
      { name: "VIP Road", distanceKm: 1.2 },
      { name: "Raja Bhoj Complex", distanceKm: 2.4 },
    ],
    amenities: ["Park-facing", "30 ft road", "Water line", "Landscaped views"],
    approvals: ["T&CP Sanctioned Layout", "Clear Title"],
    status: "Available" as const,
    featured: false,
    layoutPosition: { x: 24, y: 68 },
  },
  {
    projectIndex: 0,
    title: "Commercial Plot on Main Road Frontage, Chhindwara",
    slug: "commercial-plot-main-road-chhindwara",
    plotNumber: "C-01",
    description:
      "High-visibility commercial plot fronting the main access corridor in Chhindwara. Perfect for a commercial showroom, clinic, office or retail establishment.",
    propertyType: "Commercial" as const,
    price: 5200000,
    priceDisplay: "₹52.00 Lakhs",
    area: 2400,
    areaUnit: "sq.ft" as const,
    dimensions: { length: 60, width: 40 },
    facing: "South-East",
    isCornerPlot: true,
    roadWidthFt: 40,
    boundaryWall: false,
    zoning: "Commercial",
    landmarks: [
      { name: "Parasia Main Highway", distanceKm: 0.2 },
      { name: "Chhindwara Railway Station", distanceKm: 3.0 },
      { name: "Chhota Talaab", distanceKm: 4.1 },
    ],
    amenities: ["Main road frontage", "Corner plot", "High footfall zone", "Commercial sanction"],
    approvals: ["Commercial Diversion Approved", "Municipal Sanctioned"],
    status: "Sold" as const,
    featured: false,
    layoutPosition: { x: 56, y: 68 },
  },
  {
    projectIndex: 1,
    title: "Affordable East-Facing Plot in Sunrise Enclave, Nagpur Road, Chhindwara",
    slug: "affordable-plot-nagpur-road-chhindwara",
    plotNumber: "S-07",
    description:
      "A budget-friendly east-facing plot in Sunrise Enclave on Nagpur Road, Chhindwara. Connected to the main four-lane highway with scenic surroundings.",
    propertyType: "Residential" as const,
    price: 980000,
    priceDisplay: "₹9.80 Lakhs",
    area: 1200,
    areaUnit: "sq.ft" as const,
    dimensions: { length: 40, width: 30 },
    facing: "East",
    isCornerPlot: false,
    roadWidthFt: 24,
    boundaryWall: true,
    zoning: "Residential Plotted Layout",
    landmarks: [
      { name: "Nagpur Road Highway (NH-547)", distanceKm: 0.8 },
      { name: "Chhindwara Junction", distanceKm: 6.4 },
      { name: "Simariya Hanuman Temple", distanceKm: 5.2 },
    ],
    amenities: ["24 ft internal road", "Water connection point", "Compound wall"],
    approvals: ["Gram Panchayat Sanction", "Diverted Land"],
    status: "Available" as const,
    featured: true,
    layoutPosition: { x: 30, y: 35 },
  },
  {
    projectIndex: 1,
    title: "South-Facing Plot near Park, Nagpur Road, Chhindwara",
    slug: "south-facing-plot-chhindwara",
    plotNumber: "S-08",
    description:
      "South-facing residential plot adjacent to the proposed park in Sunrise Enclave, Nagpur Road, Chhindwara.",
    propertyType: "Residential" as const,
    price: 1150000,
    priceDisplay: "₹11.50 Lakhs",
    area: 1400,
    areaUnit: "sq.ft" as const,
    dimensions: { length: 47, width: 30 },
    facing: "South",
    isCornerPlot: false,
    roadWidthFt: 24,
    boundaryWall: false,
    zoning: "Residential Plotted Layout",
    landmarks: [
      { name: "Nagpur Road Highway", distanceKm: 0.9 },
      { name: "Satpura Mountain Viewpoint", distanceKm: 3.0 },
    ],
    amenities: ["Adjacent to park", "24 ft road", "Peaceful locality"],
    approvals: ["Diverted Land", "Clean Title"],
    status: "Available" as const,
    featured: false,
    layoutPosition: { x: 58, y: 36 },
  },
  {
    projectIndex: 1,
    title: "West-Facing Plot with Wide Frontage, Nagpur Road, Chhindwara",
    slug: "west-facing-plot-wide-frontage-chhindwara",
    plotNumber: "S-12",
    description:
      "A wide 53ft frontage west-facing plot ideal for custom villa architecture with private garden space in Chhindwara.",
    propertyType: "Residential" as const,
    price: 1320000,
    priceDisplay: "₹13.20 Lakhs",
    area: 1600,
    areaUnit: "sq.ft" as const,
    dimensions: { length: 53, width: 30 },
    facing: "West",
    isCornerPlot: false,
    roadWidthFt: 24,
    boundaryWall: true,
    zoning: "Residential Plotted Layout",
    landmarks: [
      { name: "Nagpur Road NH-547", distanceKm: 1.0 },
      { name: "Collectorate Chhindwara", distanceKm: 5.5 },
    ],
    amenities: ["Wider frontage", "24 ft road", "Perimeter compound wall"],
    approvals: ["Diverted Land"],
    status: "Reserved" as const,
    featured: false,
    layoutPosition: { x: 30, y: 70 },
  },
  {
    projectIndex: 1,
    title: "North-East Corner Plot in Sunrise Enclave, Chhindwara",
    slug: "north-east-corner-plot-chhindwara",
    plotNumber: "S-15",
    description:
      "A highly auspicious North-East facing corner plot with dual road access in Sunrise Enclave, Nagpur Road, Chhindwara.",
    propertyType: "Residential" as const,
    price: 1480000,
    priceDisplay: "₹14.80 Lakhs",
    area: 1800,
    areaUnit: "sq.ft" as const,
    dimensions: { length: 60, width: 30 },
    facing: "North-East",
    isCornerPlot: true,
    roadWidthFt: 24,
    boundaryWall: true,
    zoning: "Residential Plotted Layout",
    landmarks: [
      { name: "Nagpur Road Highway", distanceKm: 1.1 },
      { name: "Proposed School Campus", distanceKm: 1.0 },
      { name: "Chhindwara Junction", distanceKm: 6.8 },
    ],
    amenities: ["Corner plot", "24 ft dual roads", "Compound wall", "Vaastu Compliant"],
    approvals: ["Diverted Land", "Clean Title"],
    status: "Available" as const,
    featured: true,
    layoutPosition: { x: 58, y: 70 },
  },
];

/* -------------------------------------------------------------------------- */
/* Runners                                                                    */
/* -------------------------------------------------------------------------- */
async function seedSettings() {
  const settings = await getSettings();
  settings.businessName = "GreenLand Estates";
  settings.tagline = "Find Your Perfect Plot in Chhindwara. Build Your Future.";
  settings.phone = "+91 98765 43210";
  settings.whatsappNumber = process.env.WHATSAPP_NUMBER || "919876543210";
  settings.email = "info@greenlandestates.com";
  settings.officeAddress = "GreenLand Estates, VIP Road, Near Bus Stand, Chhindwara, Madhya Pradesh 480001, India";
  settings.workingHours = "Mon – Sat: 9:30 AM – 7:00 PM";
  settings.mapCoordinates = { lat: 22.0574, lng: 78.9382 };
  settings.seoDefaults = {
    title: "GreenLand Estates | Find Your Perfect Plot in Chhindwara",
    description:
      "Discover premium residential, commercial and NA plots across Chhindwara, MP with transparent pricing, verified layouts and site-visit support.",
  };
  settings.currency = "₹";
  await settings.save();
  console.log("• Site settings ready");
}

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || "admin@greenlandestates.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe@123";
  const name = process.env.ADMIN_NAME || "Admin";

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`• Admin already exists: ${email} (password unchanged)`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ name, email, passwordHash, role: "admin" });
  console.log(`• Admin created: ${email}`);
}

async function seedProjectsAndPlots() {
  // Re-seed only demo content so any manually added real data is preserved.
  const removedProjects = await Project.deleteMany({ isDemo: true });
  const removedPlots = await Property.deleteMany({ isDemo: true });
  if (removedProjects.deletedCount || removedPlots.deletedCount) {
    console.log(
      `• Cleared previous demo data (${removedProjects.deletedCount} projects, ${removedPlots.deletedCount} plots)`
    );
  }

  const createdProjects = await Project.create(projects);
  console.log(`• Created ${createdProjects.length} demo projects`);

  const docs = plots.map((p) => {
    const project = createdProjects[p.projectIndex];
    const images = [
      { url: PLOT_PHOTOS[p.projectIndex % PLOT_PHOTOS.length], alt: `${p.title} (demo)` },
      { url: PLOT_PHOTOS[(p.projectIndex + 2) % PLOT_PHOTOS.length], alt: `${p.title} view (demo)` },
    ];
    return {
      title: p.title,
      plotNumber: p.plotNumber,
      description: p.description,
      propertyType: p.propertyType,
      project: project._id,
      price: p.price,
      priceDisplay: p.priceDisplay,
      area: p.area,
      areaUnit: p.areaUnit,
      dimensions: p.dimensions,
      facing: p.facing,
      isCornerPlot: p.isCornerPlot,
      roadWidthFt: p.roadWidthFt,
      boundaryWall: p.boundaryWall,
      zoning: p.zoning,
      location: {
        locality: project.location.locality,
        city: project.location.city,
        state: project.location.state,
      },
      coordinates: project.coordinates,
      landmarks: p.landmarks,
      images,
      amenities: p.amenities,
      approvals: p.approvals,
      status: p.status,
      featured: p.featured,
      isDemo: true,
      layoutPosition: { ...p.layoutPosition, polygonPoints: null },
    };
  });

  const createdPlots = await Property.create(docs);
  console.log(`• Created ${createdPlots.length} demo plots with layout coordinates`);
}

async function main() {
  if (!MONGODB_URI) {
    console.error(
      "✗ MONGODB_URI is not set. Add it to .env.local (copy from .env.example) and retry."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("✓ Connected to MongoDB");

    await seedSettings();
    await seedAdmin();
    await seedProjectsAndPlots();

    const counts = {
      admins: await Admin.countDocuments(),
      projects: await Project.countDocuments(),
      properties: await Property.countDocuments(),
      settings: await SiteSettings.countDocuments(),
    };
    console.log("\n✓ Seed complete:", counts);
    console.log(
      `\n  Sign in at /admin/login with:\n    email:    ${process.env.ADMIN_EMAIL || "admin@greenlandestates.com"}\n    password: (the ADMIN_PASSWORD in .env.local)\n`
    );
    process.exit(0);
  } catch (err) {
    console.error("✗ Seed failed:", err);
    process.exit(1);
  }
}

main();
