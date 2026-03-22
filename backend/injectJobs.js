import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Employer from "./models/EmployerModel.js";
import { readFile } from "fs/promises";
import Job from "./models/JobModel.js";

try {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to MongoDB");
  // get user
  const user = await Employer.findOne({ email: "medcareer@gg.co" });
  // Read JSON file
  const jsonData = await readFile(
    new URL("./utils/jobMocks2.json", import.meta.url)
  );
  // parse JSON data
  const parsedData = JSON.parse(jsonData);
  const jobs = parsedData.map((job) => ({
    ...job,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: user._id,
  }));

  await Job.deleteMany({ createdBy: user._id });
  console.log("Data deleted successfully");
  // Insert data into MongoDB
  await Job.create(jobs);
  console.log("Data inserted successfully");
} catch (error) {
  console.error("Error inserting data:", error);
} finally {
  // Close the MongoDB connection
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
}
process.exit(0);
