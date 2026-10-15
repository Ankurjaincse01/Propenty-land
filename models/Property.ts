import mongoose, { Document, Schema, Model } from "mongoose";
import { slugify } from "@/lib/utils";

export type PropertyType = "Residential" | "Commercial";
export type AreaUnit = "sq.ft" | "sq.yd" | "sq.m" | "guntha" | "acre";
export type PropertyStatus = "Available" | "Reserved" | "Sold";

export interface IImage {
  url: string;
  publicId?: string;
  alt?: string;
  order?: number;
}

export interface ILandmark {
  name: string;
  distanceKm?: number;
}

export interface IProperty extends Document {
  title: string;
  slug: string;
  plotNumber?: string;
  description: string;
  propertyType: PropertyType;
  project?: mongoose.Types.ObjectId | null;
  price: number;
  priceDisplay?: string;
  area: number;
  areaUnit: AreaUnit;
  pricePerUnit?: number;
  dimensions?: { length?: number; width?: number };
  facing?: string;
  isCornerPlot: boolean;
  roadWidthFt?: number;
  boundaryWall?: boolean;
  zoning?: string;
  location: {
    address?: string;
    locality?: string;
    city: string;
    state: string;
    pincode?: string;
  };
  coordinates?: { lat?: number; lng?: number };
  landmarks: ILandmark[];
  images: IImage[];
  layoutPlanUrl?: string;
  layoutPosition?: {
    x?: number | null;
    y?: number | null;
    polygonPoints?: string | null;
  };
  amenities: string[];
  approvals: string[];
  status: PropertyStatus;
  featured: boolean;
  isDemo: boolean;
  seo: { metaTitle?: string; metaDescription?: string };
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    alt: { type: String },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const LandmarkSchema = new Schema<ILandmark>(
  {
    name: { type: String, required: true },
    distanceKm: { type: Number },
  },
  { _id: false }
);

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, index: true },
    plotNumber: { type: String, trim: true },
    description: { type: String, required: true },
    propertyType: {
      type: String,
      enum: ["Residential", "Commercial"],
      required: true,
      index: true,
    },
    project: { type: Schema.Types.ObjectId, ref: "Project", default: null },
    price: { type: Number, required: true, min: 0, index: true },
    priceDisplay: { type: String },
    area: { type: Number, required: true, min: 0, index: true },
    areaUnit: {
      type: String,
      enum: ["sq.ft", "sq.yd", "sq.m", "guntha", "acre"],
      required: true,
      default: "sq.yd",
    },
    pricePerUnit: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
    },
    facing: { type: String },
    isCornerPlot: { type: Boolean, default: false },
    roadWidthFt: { type: Number },
    boundaryWall: { type: Boolean, default: false },
    zoning: { type: String },
    location: {
      address: { type: String },
      locality: { type: String },
      city: { type: String, required: true, index: true },
      state: { type: String, required: true },
      pincode: { type: String },
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    landmarks: { type: [LandmarkSchema], default: [] },
    images: { type: [ImageSchema], default: [] },
    layoutPlanUrl: { type: String },
    layoutPosition: {
      x: { type: Number, min: 0, max: 100, default: null },
      y: { type: Number, min: 0, max: 100, default: null },
      polygonPoints: { type: String, default: null },
    },
    amenities: { type: [String], default: [] },
    approvals: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["Available", "Reserved", "Sold"],
      default: "Available",
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    isDemo: { type: Boolean, default: true },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
    },
  },
  { timestamps: true }
);

PropertySchema.index({ title: "text", description: "text", "location.city": "text" });
PropertySchema.index({ createdAt: -1 });
PropertySchema.index({ price: 1, area: 1 });

PropertySchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title);
  }
  if (this.price && this.area && !this.pricePerUnit) {
    this.pricePerUnit = Math.round(this.price / this.area);
  }
  next();
});

const Property: Model<IProperty> =
  (mongoose.models.Property as Model<IProperty>) ||
  mongoose.model<IProperty>("Property", PropertySchema);

export default Property;
