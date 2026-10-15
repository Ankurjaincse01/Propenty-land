import { slugify } from "@/lib/utils";

const IMG = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const DEMO_PROJECT_1_ID = "670e10000000000000000001";
export const DEMO_PROJECT_2_ID = "670e10000000000000000002";

export interface DemoProject {
  _id: string;
  name: string;
  slug: string;
  description: string;
  location: { locality?: string; city: string; state: string };
  coordinates: { lat: number; lng: number };
  images: Array<{ url: string; alt?: string }>;
  masterLayoutImage: string;
  amenities: string[];
  plotSizeRange: { min: number; max: number; unit: string };
  startingPrice: number;
  totalPlots: number;
  projectStatus: "Upcoming" | "Ongoing" | "Ready to Construct" | "Sold Out";
  featured: boolean;
  isDemo: boolean;
  createdAt: string;
}

export interface DemoProperty {
  _id: string;
  title: string;
  slug: string;
  plotNumber: string;
  description: string;
  propertyType: "Residential" | "Commercial";
  project: string | DemoProject;
  price: number;
  priceDisplay?: string;
  area: number;
  areaUnit: "sq.ft" | "sq.yd" | "sq.m" | "guntha" | "acre";
  pricePerUnit: number;
  dimensions?: { length?: number; width?: number };
  facing?: string;
  isCornerPlot: boolean;
  roadWidthFt?: number;
  boundaryWall: boolean;
  zoning?: string;
  location: {
    address?: string;
    locality?: string;
    city: string;
    state: string;
    pincode?: string;
  };
  coordinates?: { lat: number; lng: number };
  landmarks: Array<{ name: string; distanceKm?: number }>;
  images: Array<{ url: string; alt?: string }>;
  amenities: string[];
  approvals: string[];
  status: "Available" | "Reserved" | "Sold";
  featured: boolean;
  isDemo: boolean;
  layoutPosition?: { x?: number | null; y?: number | null; polygonPoints?: string | null };
  seo?: { metaTitle?: string; metaDescription?: string };
  createdAt: string;
}

export const DEMO_PROJECTS: DemoProject[] = [
  {
    _id: DEMO_PROJECT_1_ID,
    name: "Satpura Green Valley Township (Chhindwara)",
    slug: "satpura-green-valley-chhindwara",
    description:
      "A premier gated plotted development located on VIP Road / Parasia Road in Chhindwara, Madhya Pradesh. Features 30 ft and 40 ft internal tar roads, grand entrance arch, children's play area and a landscaped central green. All plots are demarcated with clear title NA sanction.",
    location: { locality: "Parasia Road / VIP Road", city: "Chhindwara", state: "Madhya Pradesh" },
    coordinates: { lat: 22.0574, lng: 78.9382 },
    images: [
      {
        url: IMG("photo-1449844908441-8829872d2607"),
        alt: "Satpura Green Valley entrance arch, Chhindwara",
      },
      {
        url: IMG("photo-1524813686514-a57563d77965"),
        alt: "Satpura Green Valley 40ft internal avenue",
      },
    ],
    masterLayoutImage: IMG("photo-1500382017468-9049fed747ef", 1800),
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
    projectStatus: "Ongoing",
    featured: true,
    isDemo: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: DEMO_PROJECT_2_ID,
    name: "Sunrise Enclave, Nagpur Road (Chhindwara)",
    slug: "sunrise-enclave-chhindwara",
    description:
      "A compact residential plotted layout close to Nagpur Road highway in Chhindwara with well-demarcated plots, perimeter compound wall, and scenic Satpura hill views.",
    location: { locality: "Nagpur Road", city: "Chhindwara", state: "Madhya Pradesh" },
    coordinates: { lat: 22.0450, lng: 78.9480 },
    images: [
      {
        url: IMG("photo-1500382017468-9049fed747ef"),
        alt: "Sunrise Enclave plot view, Chhindwara",
      },
      {
        url: IMG("photo-1560518883-ce09059eeffa"),
        alt: "Sunrise Enclave access road, Chhindwara",
      },
    ],
    masterLayoutImage: IMG("photo-1524813686514-a57563d77965", 1800),
    amenities: [
      "Perimeter compound wall",
      "24 ft internal roads",
      "Water connection points",
      "Proposed open garden space",
    ],
    plotSizeRange: { min: 1200, max: 1800, unit: "sq.ft" },
    startingPrice: 980000,
    totalPlots: 60,
    projectStatus: "Upcoming",
    featured: false,
    isDemo: true,
    createdAt: new Date().toISOString(),
  },
];

export const DEMO_PROPERTIES: DemoProperty[] = [
  {
    _id: "670e20000000000000000001",
    title: "East-Facing Residential Plot in Satpura Green Valley, Chhindwara",
    slug: "east-facing-residential-plot-chhindwara",
    plotNumber: "A-12",
    description:
      "A well-proportioned east-facing residential plot on a 30 ft internal road in Satpura Green Valley layout, Parasia Road, Chhindwara. Suitable for a 3BHK bungalow or duplex villa.",
    propertyType: "Residential",
    project: DEMO_PROJECT_1_ID,
    price: 1850000,
    priceDisplay: "₹18.50 Lakhs",
    area: 1200,
    areaUnit: "sq.ft",
    pricePerUnit: Math.round(1850000 / 1200),
    dimensions: { length: 40, width: 30 },
    facing: "East",
    isCornerPlot: false,
    roadWidthFt: 30,
    boundaryWall: true,
    zoning: "Residential Plotted Layout",
    location: {
      locality: "Parasia Road",
      city: "Chhindwara",
      state: "Madhya Pradesh",
      address: "Plot A-12, Satpura Green Valley, Parasia Road, Chhindwara, MP 480001",
      pincode: "480001",
    },
    coordinates: { lat: 22.0574, lng: 78.9382 },
    landmarks: [
      { name: "Chhindwara Railway Station", distanceKm: 3.2 },
      { name: "VIP Road Commercial Hub", distanceKm: 1.5 },
      { name: "District Hospital Chhindwara", distanceKm: 2.8 },
      { name: "Simariya Hanuman Mandir", distanceKm: 6.5 },
    ],
    images: [
      { url: IMG("photo-1500382017468-9049fed747ef"), alt: "Plot A-12 front view, Chhindwara" },
      { url: IMG("photo-1524813686514-a57563d77965"), alt: "Road access, Chhindwara" },
    ],
    amenities: ["30 ft road", "Water line", "Street lights", "Gated society"],
    approvals: ["T&CP Sanctioned Layout", "Diversion Approved"],
    status: "Available",
    featured: true,
    isDemo: true,
    layoutPosition: { x: 24, y: 32, polygonPoints: "20,28 28,28 28,36 20,36" },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "670e20000000000000000002",
    title: "Corner West-Facing Plot on 40ft Avenue, Chhindwara",
    slug: "corner-west-facing-plot-chhindwara",
    plotNumber: "A-13",
    description:
      "A premium corner plot with 40ft and 30ft road frontage on two sides and a west facing entrance. Ideal for a spacious duplex home in Chhindwara.",
    propertyType: "Residential",
    project: DEMO_PROJECT_1_ID,
    price: 2350000,
    priceDisplay: "₹23.50 Lakhs",
    area: 1500,
    areaUnit: "sq.ft",
    pricePerUnit: Math.round(2350000 / 1500),
    dimensions: { length: 50, width: 30 },
    facing: "West",
    isCornerPlot: true,
    roadWidthFt: 40,
    boundaryWall: true,
    zoning: "Residential Plotted Layout",
    location: {
      locality: "VIP Road Corridor",
      city: "Chhindwara",
      state: "Madhya Pradesh",
      address: "Plot A-13, Satpura Green Valley, VIP Road, Chhindwara, MP 480001",
      pincode: "480001",
    },
    coordinates: { lat: 22.0588, lng: 78.9395 },
    landmarks: [
      { name: "VIP Road Junction", distanceKm: 1.1 },
      { name: "Chhindwara Bus Terminal", distanceKm: 2.9 },
    ],
    images: [
      { url: IMG("photo-1449844908441-8829872d2607"), alt: "Plot A-13 corner view, Chhindwara" },
      { url: IMG("photo-1560518883-ce09059eeffa"), alt: "Wide internal avenue" },
    ],
    amenities: ["Corner plot", "40 ft + 30 ft roads", "Water line", "Street lights"],
    approvals: ["T&CP Sanctioned Layout", "Diversion Approved"],
    status: "Reserved",
    featured: true,
    isDemo: true,
    layoutPosition: { x: 56, y: 32, polygonPoints: "52,28 60,28 60,36 52,36" },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "670e20000000000000000003",
    title: "North-Facing Garden-Facing Plot, Chhindwara",
    slug: "north-facing-garden-plot-chhindwara",
    plotNumber: "B-04",
    description:
      "North-facing plot directly overlooking the landscaped central garden in Satpura Green Valley, Chhindwara. Excellent ventilation and peaceful surroundings.",
    propertyType: "Residential",
    project: DEMO_PROJECT_1_ID,
    price: 2100000,
    priceDisplay: "₹21.00 Lakhs",
    area: 1350,
    areaUnit: "sq.ft",
    pricePerUnit: Math.round(2100000 / 1350),
    dimensions: { length: 45, width: 30 },
    facing: "North",
    isCornerPlot: false,
    roadWidthFt: 30,
    boundaryWall: true,
    zoning: "Residential Plotted Layout",
    location: {
      locality: "Parasia Road",
      city: "Chhindwara",
      state: "Madhya Pradesh",
      address: "Plot B-04, Satpura Green Valley, Chhindwara, MP 480001",
      pincode: "480001",
    },
    coordinates: { lat: 22.0565, lng: 78.9370 },
    landmarks: [
      { name: "Central Garden", distanceKm: 0.1 },
      { name: "Raja Shankar Shah University", distanceKm: 4.8 },
    ],
    images: [
      { url: IMG("photo-1524813686514-a57563d77965"), alt: "Plot B-04 park front, Chhindwara" },
    ],
    amenities: ["Park-facing", "30 ft road", "Water line"],
    approvals: ["T&CP Sanctioned Layout", "Diversion Approved"],
    status: "Available",
    featured: false,
    isDemo: true,
    layoutPosition: { x: 24, y: 68, polygonPoints: "20,64 28,64 28,72 20,72" },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "670e20000000000000000004",
    title: "Commercial Plot on Main Road Frontage, Chhindwara",
    slug: "commercial-plot-main-road-chhindwara",
    plotNumber: "C-01",
    description:
      "High-visibility commercial plot fronting the main access corridor in Chhindwara. Perfect for a commercial showroom, clinic, office or retail establishment.",
    propertyType: "Commercial",
    project: DEMO_PROJECT_1_ID,
    price: 5200000,
    priceDisplay: "₹52.00 Lakhs",
    area: 2400,
    areaUnit: "sq.ft",
    pricePerUnit: Math.round(5200000 / 2400),
    dimensions: { length: 60, width: 40 },
    facing: "South-East",
    isCornerPlot: true,
    roadWidthFt: 40,
    boundaryWall: false,
    zoning: "Commercial",
    location: {
      locality: "VIP Road",
      city: "Chhindwara",
      state: "Madhya Pradesh",
      address: "Plot C-01, Commercial Corridor, VIP Road, Chhindwara, MP 480001",
      pincode: "480001",
    },
    coordinates: { lat: 22.0620, lng: 78.9410 },
    landmarks: [
      { name: "VIP Road Market", distanceKm: 0.2 },
      { name: "Chhindwara Railway Station", distanceKm: 3.0 },
    ],
    images: [
      { url: IMG("photo-1560518883-ce09059eeffa"), alt: "Plot C-01 commercial road frontage, Chhindwara" },
    ],
    amenities: ["Main road frontage", "Corner plot", "High footfall"],
    approvals: ["Commercial Diversion Approved"],
    status: "Sold",
    featured: false,
    isDemo: true,
    layoutPosition: { x: 56, y: 68, polygonPoints: "52,64 60,64 60,72 52,72" },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "670e20000000000000000005",
    title: "Affordable East-Facing Plot in Sunrise Enclave, Nagpur Road, Chhindwara",
    slug: "affordable-plot-nagpur-road-chhindwara",
    plotNumber: "S-07",
    description:
      "A budget-friendly east-facing plot in Sunrise Enclave on Nagpur Road, Chhindwara. Connected to the main four-lane highway with scenic surroundings.",
    propertyType: "Residential",
    project: DEMO_PROJECT_2_ID,
    price: 980000,
    priceDisplay: "₹9.80 Lakhs",
    area: 1200,
    areaUnit: "sq.ft",
    pricePerUnit: Math.round(980000 / 1200),
    dimensions: { length: 40, width: 30 },
    facing: "East",
    isCornerPlot: false,
    roadWidthFt: 24,
    boundaryWall: true,
    zoning: "Residential Plotted Layout",
    location: {
      locality: "Nagpur Road",
      city: "Chhindwara",
      state: "Madhya Pradesh",
      address: "Plot S-07, Sunrise Enclave, Nagpur Road, Chhindwara, MP 480001",
      pincode: "480001",
    },
    coordinates: { lat: 22.0450, lng: 78.9480 },
    landmarks: [
      { name: "Nagpur Road Highway", distanceKm: 0.8 },
      { name: "Chhindwara Junction", distanceKm: 6.4 },
    ],
    images: [
      { url: IMG("photo-1500382017468-9049fed747ef"), alt: "Plot S-07 view, Chhindwara" },
    ],
    amenities: ["24 ft road", "Water connection point", "Compound wall"],
    approvals: ["Town Planning Approved Layout"],
    status: "Available",
    featured: true,
    isDemo: true,
    layoutPosition: { x: 30, y: 35, polygonPoints: "26,31 34,31 34,39 26,39" },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "670e20000000000000000006",
    title: "South-Facing Plot near Park, Nagpur Road, Chhindwara",
    slug: "south-facing-plot-chhindwara",
    plotNumber: "S-08",
    description:
      "South-facing residential plot adjacent to the proposed park in Sunrise Enclave, Nagpur Road, Chhindwara.",
    propertyType: "Residential",
    project: DEMO_PROJECT_2_ID,
    price: 1150000,
    priceDisplay: "₹11.50 Lakhs",
    area: 1400,
    areaUnit: "sq.ft",
    pricePerUnit: Math.round(1150000 / 1400),
    dimensions: { length: 47, width: 30 },
    facing: "South",
    isCornerPlot: false,
    roadWidthFt: 24,
    boundaryWall: false,
    zoning: "Residential Plotted Layout",
    location: {
      locality: "Nagpur Road",
      city: "Chhindwara",
      state: "Madhya Pradesh",
      address: "Plot S-08, Sunrise Enclave, Nagpur Road, Chhindwara, MP 480001",
      pincode: "480001",
    },
    coordinates: { lat: 22.0440, lng: 78.9470 },
    landmarks: [{ name: "Nagpur Highway Link", distanceKm: 1.0 }],
    images: [
      { url: IMG("photo-1449844908441-8829872d2607"), alt: "Plot S-08 view, Chhindwara" },
    ],
    amenities: ["Near proposed park", "24 ft road"],
    approvals: ["Town Planning Approved Layout"],
    status: "Available",
    featured: false,
    isDemo: true,
    layoutPosition: { x: 58, y: 36, polygonPoints: "54,32 62,32 62,40 54,40" },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "670e20000000000000000007",
    title: "West-Facing Plot with Wider Frontage, Chhindwara",
    slug: "west-facing-plot-wider-frontage-chhindwara",
    plotNumber: "S-12",
    description:
      "A wider west-facing plot suitable for a spacious home with lawn and parking in Chhindwara.",
    propertyType: "Residential",
    project: DEMO_PROJECT_2_ID,
    price: 1320000,
    priceDisplay: "₹13.20 Lakhs",
    area: 1600,
    areaUnit: "sq.ft",
    pricePerUnit: Math.round(1320000 / 1600),
    dimensions: { length: 53, width: 30 },
    facing: "West",
    isCornerPlot: false,
    roadWidthFt: 24,
    boundaryWall: true,
    zoning: "Residential Plotted Layout",
    location: {
      locality: "Nagpur Road",
      city: "Chhindwara",
      state: "Madhya Pradesh",
      address: "Plot S-12, Sunrise Enclave, Nagpur Road, Chhindwara, MP 480001",
      pincode: "480001",
    },
    coordinates: { lat: 22.0435, lng: 78.9465 },
    landmarks: [{ name: "Nagpur Highway", distanceKm: 0.9 }],
    images: [
      { url: IMG("photo-1524813686514-a57563d77965"), alt: "Plot S-12 view, Chhindwara" },
    ],
    amenities: ["Wider frontage", "24 ft road", "Compound wall"],
    approvals: ["Town Planning Approved Layout"],
    status: "Reserved",
    featured: false,
    isDemo: true,
    layoutPosition: { x: 30, y: 70, polygonPoints: "26,66 34,66 34,74 26,74" },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "670e20000000000000000008",
    title: "North-East Corner Plot in Sunrise Enclave, Chhindwara",
    slug: "north-east-corner-plot-chhindwara",
    plotNumber: "S-15",
    description:
      "A vastu-auspicious north-east facing corner plot with dual road access in Sunrise Enclave, Chhindwara.",
    propertyType: "Residential",
    project: DEMO_PROJECT_2_ID,
    price: 1480000,
    priceDisplay: "₹14.80 Lakhs",
    area: 1800,
    areaUnit: "sq.ft",
    pricePerUnit: Math.round(1480000 / 1800),
    dimensions: { length: 60, width: 30 },
    facing: "North-East",
    isCornerPlot: true,
    roadWidthFt: 24,
    boundaryWall: true,
    zoning: "Residential Plotted Layout",
    location: {
      locality: "Nagpur Road",
      city: "Chhindwara",
      state: "Madhya Pradesh",
      address: "Plot S-15, Sunrise Enclave, Nagpur Road, Chhindwara, MP 480001",
      pincode: "480001",
    },
    coordinates: { lat: 22.0430, lng: 78.9460 },
    landmarks: [
      { name: "Nagpur Road Highway", distanceKm: 1.0 },
      { name: "Proposed School Campus", distanceKm: 0.6 },
    ],
    images: [
      { url: IMG("photo-1560518883-ce09059eeffa"), alt: "Plot S-15 corner plot, Chhindwara" },
    ],
    amenities: ["Corner plot", "24 ft roads", "Compound wall"],
    approvals: ["Town Planning Approved Layout"],
    status: "Available",
    featured: true,
    isDemo: true,
    layoutPosition: { x: 58, y: 70, polygonPoints: "54,66 62,66 62,74 54,74" },
    createdAt: new Date().toISOString(),
  },
];

/* -------------------------------------------------------------------------- */
/* Query helpers with full filtering and sorting                              */
/* -------------------------------------------------------------------------- */
export function getDemoProjects(params?: { featured?: string; status?: string }) {
  let list = [...DEMO_PROJECTS];
  if (params?.featured === "true") list = list.filter((p) => p.featured);
  if (params?.status && params.status !== "all") {
    list = list.filter((p) => p.projectStatus === params.status);
  }
  return list;
}

export function getDemoProjectBySlug(slug: string) {
  const project = DEMO_PROJECTS.find((p) => p.slug === slug);
  if (!project) return null;
  const properties = DEMO_PROPERTIES.filter(
    (prop) => prop.project === project._id
  );
  return { project, properties };
}

export function getDemoProperties(params: {
  search?: string;
  city?: string;
  propertyType?: string;
  status?: string;
  facing?: string;
  project?: string;
  featured?: string;
  minPrice?: string;
  maxPrice?: string;
  minArea?: string;
  maxArea?: string;
  sort?: string;
  skip?: number;
  limit?: number;
}) {
  let list = [...DEMO_PROPERTIES];

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.plotNumber.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        (p.location.locality && p.location.locality.toLowerCase().includes(q))
    );
  }

  if (params.city && params.city !== "all") {
    list = list.filter(
      (p) => p.location.city.toLowerCase() === params.city?.toLowerCase()
    );
  }

  if (params.propertyType && params.propertyType !== "all") {
    list = list.filter((p) => p.propertyType === params.propertyType);
  }

  if (params.status && params.status !== "all") {
    list = list.filter((p) => p.status === params.status);
  }

  if (params.facing && params.facing !== "all") {
    list = list.filter((p) => p.facing === params.facing);
  }

  if (params.project && params.project !== "all") {
    list = list.filter((p) => p.project === params.project);
  }

  if (params.featured === "true") {
    list = list.filter((p) => p.featured);
  }

  if (params.minPrice) {
    const min = Number(params.minPrice);
    if (!isNaN(min)) list = list.filter((p) => p.price >= min);
  }

  if (params.maxPrice) {
    const max = Number(params.maxPrice);
    if (!isNaN(max)) list = list.filter((p) => p.price <= max);
  }

  if (params.minArea) {
    const min = Number(params.minArea);
    if (!isNaN(min)) list = list.filter((p) => p.area >= min);
  }

  if (params.maxArea) {
    const max = Number(params.maxArea);
    if (!isNaN(max)) list = list.filter((p) => p.area <= max);
  }

  // Sort
  const sort = params.sort || "newest";
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "area-asc") list.sort((a, b) => a.area - b.area);
  else if (sort === "area-desc") list.sort((a, b) => b.area - a.area);
  else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  const total = list.length;
  const skip = params.skip || 0;
  const limit = params.limit || 12;
  const paginated = list.slice(skip, skip + limit);

  return {
    data: paginated,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export function getDemoPropertyBySlug(slug: string) {
  const property = DEMO_PROPERTIES.find((p) => p.slug === slug);
  if (!property) return null;

  // Populate project
  const project = DEMO_PROJECTS.find((proj) => proj._id === property.project);
  const populated = {
    ...property,
    project: project || {
      _id: property.project,
      name: "Satpura Green Valley Township",
      slug: "satpura-green-valley-chhindwara",
      location: property.location,
      masterLayoutImage: "",
    },
  };

  const related = DEMO_PROPERTIES.filter(
    (p) => p._id !== property._id && p.status !== "Sold"
  ).slice(0, 3);

  return { property: populated, related };
}
