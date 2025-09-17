import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";

// cloudinary import
import cloudinary from "cloudinary";
// cloudinary invoke
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//routes imports

import jobRouter from "./routes/jobRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import jobSeekerRouter from "./routes/jobSeekerRouter.js";

//middlewares imports

import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import {
  authenticateUser,
  allowGuestForViewing,
} from "./middleware/authMiddleware.js";
import cookieParser from "cookie-parser";
import { logout } from "./controllers/authController.js";
// dirname public
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { getAllUsers } from "./controllers/userController.js";
import { getAllJobsCount } from "./controllers/jobController.js";

const app = express();
const port = process.env.PORT || 5100;

// Middleware section

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cookieParser());
app.use(express.json());

// app.use(express.urlencoded({ extended: true }));
// static files section
const __dirname = dirname(fileURLToPath(import.meta.url));
// use path .resolve not path.join
// deprecated
// app.use(express.static(path.resolve(__dirname, "./public")));
app.use(express.static(path.resolve(__dirname, "./client/dist")));
// Make sure uploads directory is accessible
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "./public/uploads"))
);

// Routes section
app.use("/api/v1/jobs", jobRouter); // Remove authenticateUser to allow guest access
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticateUser, userRouter);
// job Seekers API call endpoint
app.use("/api/v1/jobseekers", jobSeekerRouter);
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Site Maintenance</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .maintenance-container {
            text-align: center;
            padding: 2rem;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
            margin-bottom: 1rem;
          }
          p {
            color: #666;
            font-size: 1.1rem;
          }
        </style>
      </head>
      <body>
        <div class="maintenance-container">
          <h1>🛠️ Site Under Maintenance</h1>
          <p>We're currently updating our systems to serve you better.</p>
          <p>Please check back soon!</p>
        </div>
      </body>
    </html>
  `);
});
//
app.get("/api/v1/test", (req, res) => {
  res.json("Test route is working!");
});

app.get("/api/v1/auth/logout", authenticateUser, logout);
// added global apis to check users and jobs
app.use("/api/v1/all-users", getAllUsers);
app.get("/api/v1/all-jobs", allowGuestForViewing, getAllJobsCount);
//

// Connect to MongoDB with retry logics
const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      console.log(
        "Connecting to MongoDB with URL:",
        process.env.MONGO_URL,
        "..."
      ); // Log connection string
      await mongoose.connect(process.env.MONGO_URL, {
        // useNewUrlParser: true, // Added option
        // useUnifiedTopology: true, // Added option
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        retryWrites: true,
        retryReads: true,
      });
      console.log("Connected to MongoDB successfully!");
      return true;
    } catch (error) {
      retries++;
      console.error(
        `Connection attempt ${retries} failed:`,
        error,
        error.message
      );
      if (retries === MAX_RETRIES) {
        console.error(" Max retries reached. Exiting...");
        return false;
      }
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

//connect

// Start server
const start = async () => {
  try {
    const connected = await connectDB();
    if (connected) {
      app.listen(port, () => {
        console.log(`Server running on port ${port}...`);
      });
    } else {
      process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

start();
//
app.use("*", (req, res) => {
  // deprecated
  // res.sendFile(path.resolve(__dirname, "./public", "index.html"));
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});
// Error handling middleware
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Invalid URL, please check your endpoint!",
  });
});
app.use(errorHandlerMiddleware);
