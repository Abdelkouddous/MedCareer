import mongoose from "mongoose";

const CVSchema = new mongoose.Schema(
  {
    jobSeekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSeeker",
      required: true,
      unique: true,
    },
    cvType: {
      type: String,
      enum: ["uploaded", "generated"], // "uploaded" for PDFs, "generated" for app-built CVs
      default: "uploaded",
    },
    cvUrl: {
      type: String, 
      required: false, // Made optional to support generated CVs
    },
    cvPublicId: {
      type: String,
      required: false, // Made optional to support generated CVs
    },
    originalFileName: {
      type: String,
      required: false,
    },
    generatedData: {
      type: Object, // Could hold complex JSON for app-built CVs
      required: false,
      default: {},
    }
  },
  { timestamps: true }
);

export default mongoose.model("CV", CVSchema);
