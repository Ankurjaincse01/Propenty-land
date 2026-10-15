import mongoose, { Document, Schema, Model } from "mongoose";

export interface ISocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  twitter?: string;
}

export interface ISiteSettings extends Document {
  businessName: string;
  tagline: string;
  logoUrl?: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  officeAddress: string;
  workingHours: string;
  mapCoordinates?: { lat?: number; lng?: number };
  socialLinks: ISocialLinks;
  seoDefaults: { title: string; description: string };
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    businessName: { type: String, required: true, default: "GreenLand Estates" },
    tagline: {
      type: String,
      default: "Find Your Perfect Plot. Build Your Future.",
    },
    logoUrl: { type: String },
    phone: { type: String, required: true, default: "+91 XXXXX XXXXX" },
    whatsappNumber: { type: String, required: true, default: "91XXXXXXXXXX" },
    email: { type: String, required: true, default: "info@greenlandestates.com" },
    officeAddress: { type: String, required: true, default: "Business Address" },
    workingHours: { type: String, default: "Mon - Sat: 9:30 AM - 7:00 PM" },
    mapCoordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      youtube: { type: String },
      twitter: { type: String },
    },
    seoDefaults: {
      title: {
        type: String,
        default: "Find Your Perfect Plot. Build Your Future.",
      },
      description: {
        type: String,
        default:
          "Discover premium residential and commercial plots across India.",
      },
    },
    currency: { type: String, default: "₹" },
  },
  { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> =
  (mongoose.models.SiteSettings as Model<ISiteSettings>) ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;

/** Singleton accessor */
export async function getSettings(): Promise<ISiteSettings> {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  return settings;
}
