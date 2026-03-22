import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "userType",
    required: true,
  },
  userType: {
    type: String,
    enum: ["Employer", "JobSeeker"],
    required: true,
  },
  content: {
    type: String,
    required: [true, "Comment content is required"],
    maxLength: [500, "Comment cannot exceed 500 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Blog title is required"],
    maxLength: [200, "Title cannot exceed 200 characters"],
  },
  content: {
    type: String,
    required: [true, "Blog content is required"],
    minLength: [50, "Blog content must be at least 50 characters"],
  },
  excerpt: {
    type: String,
    maxLength: [300, "Excerpt cannot exceed 300 characters"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "authorType",
    required: true,
  },
  authorType: {
    type: String,
    enum: ["Employer", "JobSeeker"],
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Medical News",
      "Career Advice",
      "Technology",
      "Research",
      "Education",
      "Personal Stories",
      "Industry Insights",
    ],
    default: "Medical News",
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  featuredImage: {
    type: String,
    default: "",
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "likes.userType",
      },
      userType: {
        type: String,
        enum: ["Employer", "JobSeeker"],
      },
    },
  ],
  comments: [CommentSchema],
  isPublished: {
    type: Boolean,
    default: true,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual for like count
BlogSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// Virtual for comment count
BlogSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// Ensure virtual fields are serialized
BlogSchema.set("toJSON", { prepare: true });

// Update the updatedAt field before saving
BlogSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better search performance
BlogSchema.index({ title: "text", content: "text", tags: "text" });
BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ category: 1 });

export default mongoose.model("Blog", BlogSchema);
