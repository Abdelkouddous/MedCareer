import mongoose from "mongoose";
import { MEDICAL_SPECIALIZATION } from "../utils/constants.js";

const JobSeekerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Please provide a last name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    validate: {
      validator: function (email) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
      },
      message: "Please provide a valid email address",
    },
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  specialization: {
    type: String,
    enum: Object.values(MEDICAL_SPECIALIZATION),
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  experience: {
    type: String,
    trim: true,
  },
  education: {
    type: String,
    trim: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  languages: {
    type: [String],
    default: [],
  },
  curriculumVitae: {
    type: String, // URL to stored PDF file
    // made optional for MVP registration
    required: false,
  },
  activeCV: {
    type: String,
    enum: ["uploaded", "generated"],
    default: "generated", // Default implies they have a template automatically available
  },
  location: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String, // URL to stored image
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  confirmOTP: {
    type: String,
    select: false,
  },
  otpExpires: {
    type: Date,
    select: false,
  },
  resetPasswordOTP: {
    type: String,
    select: false,
  },
  resetPasswordExpires: {
    type: Date,
    select: false,
  },
});

const JobSeekerModel = mongoose.model("JobSeeker", JobSeekerSchema);
export default JobSeekerModel;
