import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    employerId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    jobSeekerId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSeeker",
      required: true,
    },
    messages:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    jobId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);