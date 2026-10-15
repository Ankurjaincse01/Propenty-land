import mongoose, { Document, Schema, Model } from "mongoose";
import { slugify } from "@/lib/utils";

export type ProjectStatus =
  | "Upcoming"
  | "Ongoing"
  | "Ready to Construct"
  | "Sold Out";

export interface IProjectImage {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface IProject extends Document {
  name: string;
  slug: string;
  description: string;
  location: {
    locality?: string;
    city: string;
    state: string;
  };
  coordinates?: { lat?: number; lng?: number };
  images: IProjectImage[];
  masterLayoutImage?: string;
  amenities: string[];
  plotSizeRange?: { min?: number; max?: number; unit?: string };
  startingPrice?: number;
  totalPlots?: number;
  projectStatus: ProjectStatus;
  featured: boolean;
  isDemo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectImageSchema = new Schema<IProjectImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    alt: { type: String },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    location: {
      locality: { type: String },
      city: { type: String, required: true, index: true },
      state: { type: String, required: true },
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    images: { type: [ProjectImageSchema], default: [] },
    masterLayoutImage: { type: String },
    amenities: { type: [String], default: [] },
    plotSizeRange: {
      min: { type: Number },
      max: { type: Number },
      unit: { type: String, default: "sq.yd" },
    },
    startingPrice: { type: Number },
    totalPlots: { type: Number, min: 0 },
    projectStatus: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Ready to Construct", "Sold Out"],
      default: "Ongoing",
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    isDemo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProjectSchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name);
  }
  next();
});

const Project: Model<IProject> =
  (mongoose.models.Project as Model<IProject>) ||
  mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
