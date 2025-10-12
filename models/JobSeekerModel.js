import mongoose from "mongoose";

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
  curriculumVitae: {
    type: String, // URL to stored PDF file
    // made optional for MVP registration
    required: false,
  },
  location: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  isPremium : {
    type : Boolean,
    default : false 
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
});

const JobSeekerModel = mongoose.model("JobSeeker", JobSeekerSchema);
export default JobSeekerModel;
