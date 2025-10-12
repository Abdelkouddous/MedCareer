import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "name",
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
  },
  lastName: {
    type: String,
    default: "lastName",
  },
  location: {
    type: String,
    default: "MyCity",
  },
  specialty: {
    type: String,
    enum: [
      "General Practitioner",
      "Cardiologist",
      "Dermatologist",
      "Gastroenterologist",
      "Neurologist",
      "Oncologist",
      "Psychiatrist",
      "Rheumatologist",
      "Urologist",
      "Endocrinologist",
      "Ophthalmologist",
      "Orthopedic Specialist",
      "Pediatrician",
      "Pulmonologist",
      "Surgery Specialist",
      "Vascular Specialist",
    ],
    default: "General Practitioner",
  },
  role: {
    type: String,
    enum: ["user", "admin", "guest"],
    default: "user",
  },
  // avatar setup
  avatar: String,
  avatarPublicId: String,
  //
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "declined", "blocked"],
    default: "approved",
  },
  // Employer posting controls
  trialJobsLimit: { type: Number, default: 3 },
  lifetimeJobOffersCreated: { type: Number, default: 0 },
  jobOffersQuota: { type: Number, default: 3 },
  plan: {
    type: String,
    enum: ["trial", "basic", "pro", "enterprise"],
    default: "trial",
  },
  quotaExpiresAt: { type: Date },
});

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
export default mongoose.model("User", UserSchema);
