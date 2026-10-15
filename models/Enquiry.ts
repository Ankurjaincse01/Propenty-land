import mongoose, { Document, Schema, Model } from "mongoose";

export type FollowUpStatus =
  | "New"
  | "Contacted"
  | "Site Visit Scheduled"
  | "Qualified"
  | "Closed";

export type EnquirySource =
  | "Property Page"
  | "Project Page"
  | "Contact Page"
  | "Quick Callback"
  | "WhatsApp";

export interface INote {
  note: string;
  addedAt: Date;
}

export interface IEnquiry extends Document {
  customerName: string;
  phone: string;
  email?: string;
  property?: mongoose.Types.ObjectId | null;
  project?: mongoose.Types.ObjectId | null;
  preferredVisitDate?: Date;
  message: string;
  source: EnquirySource;
  followUpStatus: FollowUpStatus;
  internalNotes: INote[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    note: { type: String, required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const EnquirySchema = new Schema<IEnquiry>(
  {
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, lowercase: true, trim: true },
    property: { type: Schema.Types.ObjectId, ref: "Property", default: null },
    project: { type: Schema.Types.ObjectId, ref: "Project", default: null },
    preferredVisitDate: { type: Date },
    message: { type: String, required: true },
    source: {
      type: String,
      enum: [
        "Property Page",
        "Project Page",
        "Contact Page",
        "Quick Callback",
        "WhatsApp",
      ],
      default: "Contact Page",
    },
    followUpStatus: {
      type: String,
      enum: ["New", "Contacted", "Site Visit Scheduled", "Qualified", "Closed"],
      default: "New",
      index: true,
    },
    internalNotes: { type: [NoteSchema], default: [] },
  },
  { timestamps: true }
);

EnquirySchema.index({ createdAt: -1 });

const Enquiry: Model<IEnquiry> =
  (mongoose.models.Enquiry as Model<IEnquiry>) ||
  mongoose.model<IEnquiry>("Enquiry", EnquirySchema);

export default Enquiry;
