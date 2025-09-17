import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    jobSeeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSeeker",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "viewed", "accepted", "rejected"],
      default: "applied",
    },
    compatibilityScore: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

ApplicationSchema.index({ job: 1, jobSeeker: 1 }, { unique: true });

const Application = mongoose.model("Application", ApplicationSchema);
export default Application;