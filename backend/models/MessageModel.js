import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath:"senderModel"
    },
    senderModel:{
      type : String,
      enum: ["Employer", "JobSeeker"],
      required: true,
    },
    receiver:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath:"receiverModel"
    },
    receiverModel:{
      type : String,
      enum: ["Employer", "JobSeeker"],
      required: true,
    },
    content:{
      type: String,
      required: true,
    },
    read:{
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);