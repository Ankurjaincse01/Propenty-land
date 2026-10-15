import { z } from "zod";

const areaUnit = z.enum(["sq.ft", "sq.yd", "sq.m", "guntha", "acre"]);

export const propertySchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters").max(160),
  plotNumber: z.string().max(40).optional().or(z.literal("")),
  description: z.string().min(20, "Description must be at least 20 characters"),
  propertyType: z.enum(["Residential", "Commercial"]),
  project: z.string().optional().nullable().or(z.literal("")),
  price: z.coerce.number().nonnegative("Price cannot be negative"),
  priceDisplay: z.string().optional().or(z.literal("")),
  area: z.coerce.number().positive("Area must be greater than 0"),
  areaUnit,
  pricePerUnit: z.coerce.number().nonnegative().optional(),
  dimensions: z
    .object({
      length: z.coerce.number().nonnegative().optional(),
      width: z.coerce.number().nonnegative().optional(),
    })
    .optional(),
  facing: z.string().optional().or(z.literal("")),
  isCornerPlot: z.coerce.boolean().optional(),
  roadWidthFt: z.coerce.number().nonnegative().optional(),
  boundaryWall: z.coerce.boolean().optional(),
  zoning: z.string().optional().or(z.literal("")),
  location: z.object({
    address: z.string().optional().or(z.literal("")),
    locality: z.string().optional().or(z.literal("")),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pincode: z.string().optional().or(z.literal("")),
  }),
  coordinates: z
    .object({
      lat: z.coerce.number().optional(),
      lng: z.coerce.number().optional(),
    })
    .optional(),
  landmarks: z
    .array(
      z.object({
        name: z.string().min(1),
        distanceKm: z.coerce.number().nonnegative().optional(),
      })
    )
    .optional(),
  images: z
    .array(
      z.object({
        url: z.string().url("Invalid image URL"),
        publicId: z.string().optional(),
        alt: z.string().optional(),
        order: z.coerce.number().optional(),
      })
    )
    .optional(),
  layoutPlanUrl: z.string().optional().or(z.literal("")),
  layoutPosition: z
    .object({
      x: z.coerce.number().min(0).max(100).nullable().optional(),
      y: z.coerce.number().min(0).max(100).nullable().optional(),
      polygonPoints: z.string().nullable().optional().or(z.literal("")),
    })
    .optional(),
  amenities: z.array(z.string()).optional(),
  approvals: z.array(z.string()).optional(),
  status: z.enum(["Available", "Reserved", "Sold"]).default("Available"),
  featured: z.coerce.boolean().optional(),
  isDemo: z.coerce.boolean().optional(),
  seo: z
    .object({
      metaTitle: z.string().optional().or(z.literal("")),
      metaDescription: z.string().optional().or(z.literal("")),
    })
    .optional(),
});

export const projectSchema = z.object({
  name: z.string().min(3, "Project name is required").max(160),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.object({
    locality: z.string().optional().or(z.literal("")),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
  }),
  coordinates: z
    .object({ lat: z.coerce.number().optional(), lng: z.coerce.number().optional() })
    .optional(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string().optional(),
        alt: z.string().optional(),
      })
    )
    .optional(),
  masterLayoutImage: z.string().optional().or(z.literal("")),
  amenities: z.array(z.string()).optional(),
  plotSizeRange: z
    .object({
      min: z.coerce.number().optional(),
      max: z.coerce.number().optional(),
      unit: z.string().optional(),
    })
    .optional(),
  startingPrice: z.coerce.number().nonnegative().optional(),
  totalPlots: z.coerce.number().nonnegative().optional(),
  projectStatus: z.enum(["Upcoming", "Ongoing", "Ready to Construct", "Sold Out"]).default("Ongoing"),
  featured: z.coerce.boolean().optional(),
  isDemo: z.coerce.boolean().optional(),
});

export const enquirySchema = z.object({
  customerName: z.string().min(2, "Please enter your name").max(120),
  phone: z
    .string()
    .min(8, "Please enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  property: z.string().optional().nullable().or(z.literal("")),
  project: z.string().optional().nullable().or(z.literal("")),
  preferredVisitDate: z.string().optional().or(z.literal("")),
  message: z.string().min(5, "Please add a short message").max(2000),
  source: z
    .enum(["Property Page", "Project Page", "Contact Page", "Quick Callback", "WhatsApp"])
    .default("Contact Page"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const enquiryUpdateSchema = z.object({
  followUpStatus: z
    .enum(["New", "Contacted", "Site Visit Scheduled", "Qualified", "Closed"])
    .optional(),
  note: z.string().max(2000).optional(),
});

export const settingsSchema = z.object({
  businessName: z.string().min(2),
  tagline: z.string().optional().or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
  phone: z.string().min(5),
  whatsappNumber: z.string().min(5),
  email: z.string().email(),
  officeAddress: z.string().min(2),
  workingHours: z.string().optional().or(z.literal("")),
  mapCoordinates: z
    .object({ lat: z.coerce.number().optional(), lng: z.coerce.number().optional() })
    .optional(),
  socialLinks: z
    .object({
      facebook: z.string().optional().or(z.literal("")),
      instagram: z.string().optional().or(z.literal("")),
      linkedin: z.string().optional().or(z.literal("")),
      youtube: z.string().optional().or(z.literal("")),
      twitter: z.string().optional().or(z.literal("")),
    })
    .optional(),
  seoDefaults: z
    .object({
      title: z.string().optional().or(z.literal("")),
      description: z.string().optional().or(z.literal("")),
    })
    .optional(),
  currency: z.string().optional().or(z.literal("")),
});

export function zodErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    out[issue.path.join(".")] = issue.message;
  }
  return out;
}
