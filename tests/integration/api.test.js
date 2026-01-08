import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import Employer from "../../models/EmployerModel.js";
import Job from "../../models/JobModel.js";
import { testUsers, testJobs } from "../fixtures/testData.js";

// Import routes and middleware
import jobRouter from "../../routes/jobRouter.js";
import authRouter from "../../routes/authRouter.js";
import userRouter from "../../routes/userRouter.js";
import jobSeekerRouter from "../../routes/jobSeekerRouter.js";
import errorHandlerMiddleware from "../../middleware/errorHandlerMiddleware.js";
import {
  authenticateUser,
  allowGuestForViewing,
} from "../../middleware/authMiddleware.js";
import cookieParser from "cookie-parser";

// Create test app instance
let app;

describe("API Integration Tests", () => {
  let authToken;
  let userId;
  let jobId;

  beforeAll(async () => {
    // Create test app
    app = express();
    app.use(cookieParser());
    app.use(express.json());

    // Add routes
    app.use("/api/v1/jobs", jobRouter);
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/users", authenticateUser, userRouter);
    app.use("/api/v1/jobseekers", jobSeekerRouter);

    // Add error handler
    app.use(errorHandlerMiddleware);
  });

  describe("Authentication Flow", () => {
    it("should complete full authentication flow", async () => {
      // 1. Register a new user
      const registerResponse = await request(app)
        .post("/api/v1/auth/register")
        .send(testUsers.employer)
        .expect(201);

      expect(registerResponse.body.msg).toBe("User registered successfully");
      userId = registerResponse.body.user.userId;

      // 2. Login with the registered user
      const loginResponse = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: testUsers.employer.email,
          password: testUsers.employer.password,
        })
        .expect(200);

      expect(loginResponse.body.msg).toBe("Logged in!");
      authToken = loginResponse.body.token;

      // 3. Verify token works by accessing protected route
      const profileResponse = await request(app)
        .get("/api/v1/users/profile")
        .set("Cookie", `token=${authToken}`)
        .expect(200);

      expect(profileResponse.body.user.email).toBe(testUsers.employer.email);
    });
  });

  describe("Job Management Flow", () => {
    beforeEach(async () => {
      // Ensure we have an authenticated user
      if (!authToken) {
        const loginResponse = await request(app)
          .post("/api/v1/auth/login")
          .send({
            email: testUsers.employer.email,
            password: testUsers.employer.password,
          });
        authToken = loginResponse.body.token;
      }
    });

    it("should create, read, update, and delete a job", async () => {
      // 1. Create a job
      const createResponse = await request(app)
        .post("/api/v1/jobs")
        .set("Cookie", `token=${authToken}`)
        .send(testJobs.cardiologist)
        .expect(201);

      expect(createResponse.body.msg).toBe("Job created successfully");
      jobId = createResponse.body.job._id;

      // 2. Get all jobs
      const getAllResponse = await request(app).get("/api/v1/jobs").expect(200);

      expect(getAllResponse.body.jobs).toHaveLength(1);
      expect(getAllResponse.body.jobs[0].position).toBe(
        testJobs.cardiologist.position
      );

      // 3. Get specific job
      const getOneResponse = await request(app)
        .get(`/api/v1/jobs/${jobId}`)
        .expect(200);

      expect(getOneResponse.body.job.position).toBe(
        testJobs.cardiologist.position
      );

      // 4. Update job
      const updateData = {
        ...testJobs.cardiologist,
        position: "Senior Cardiologist - Updated",
      };
      const updateResponse = await request(app)
        .patch(`/api/v1/jobs/${jobId}`)
        .set("Cookie", `token=${authToken}`)
        .send(updateData)
        .expect(200);

      expect(updateResponse.body.msg).toBe("Job updated successfully");
      expect(updateResponse.body.job.position).toBe(
        "Senior Cardiologist - Updated"
      );

      // 5. Delete job
      const deleteResponse = await request(app)
        .delete(`/api/v1/jobs/${jobId}`)
        .set("Cookie", `token=${authToken}`)
        .expect(200);

      expect(deleteResponse.body.msg).toBe("Job deleted successfully");

      // 6. Verify job is deleted
      const getDeletedResponse = await request(app)
        .get(`/api/v1/jobs/${jobId}`)
        .expect(404);

      expect(getDeletedResponse.body.message).toBe("Job not found");
    });

    it("should handle job search and filtering", async () => {
      // Create multiple jobs
      await request(app)
        .post("/api/v1/jobs")
        .set("Cookie", `token=${authToken}`)
        .send(testJobs.cardiologist);

      await request(app)
        .post("/api/v1/jobs")
        .set("Cookie", `token=${authToken}`)
        .send(testJobs.pediatrician);

      // Search by position
      const searchResponse = await request(app)
        .get("/api/v1/jobs?search=cardiologist")
        .expect(200);

      expect(searchResponse.body.jobs).toHaveLength(1);
      expect(searchResponse.body.jobs[0].position).toContain("Cardiologist");

      // Filter by job type
      const filterResponse = await request(app)
        .get("/api/v1/jobs?jobType=full-time")
        .expect(200);

      expect(filterResponse.body.jobs).toHaveLength(2);
    });
  });

  describe("Job Seeker Flow", () => {
    let jobSeekerToken;
    let jobSeekerId;

    it("should complete job seeker registration and profile management", async () => {
      // 1. Register as job seeker
      const registerResponse = await request(app)
        .post("/api/v1/jobseekers/register")
        .send(testUsers.jobSeeker)
        .expect(201);

      expect(registerResponse.body.msg).toBe(
        "Job seeker registered successfully"
      );
      jobSeekerId = registerResponse.body.jobSeeker._id;

      // 2. Login as job seeker
      const loginResponse = await request(app)
        .post("/api/v1/jobseekers/login")
        .send({
          email: testUsers.jobSeeker.email,
          password: testUsers.jobSeeker.password,
        })
        .expect(200);

      jobSeekerToken = loginResponse.body.token;

      // 3. Update profile
      const profileUpdate = {
        ...testUsers.jobSeeker,
        experience: "6 years",
        skills: ["Pediatrics", "Emergency Medicine", "Child Psychology"],
      };

      const updateResponse = await request(app)
        .patch("/api/v1/jobseekers/profile")
        .set("Cookie", `token=${jobSeekerToken}`)
        .send(profileUpdate)
        .expect(200);

      expect(updateResponse.body.msg).toBe("Profile updated successfully");
      expect(updateResponse.body.jobSeeker.experience).toBe("6 years");
    });

    it("should handle job application process", async () => {
      // Create a job first
      const jobResponse = await request(app)
        .post("/api/v1/jobs")
        .set("Cookie", `token=${authToken}`)
        .send(testJobs.pediatrician);

      const jobId = jobResponse.body.job._id;

      // Apply for the job
      const applicationData = {
        jobId: jobId,
        coverLetter: "I am very interested in this pediatric position...",
        resume: "resume.pdf",
      };

      const applyResponse = await request(app)
        .post("/api/v1/jobseekers/applications")
        .set("Cookie", `token=${jobSeekerToken}`)
        .send(applicationData)
        .expect(201);

      expect(applyResponse.body.msg).toBe("Application submitted successfully");

      // Check application status
      const applicationsResponse = await request(app)
        .get("/api/v1/jobseekers/applications")
        .set("Cookie", `token=${jobSeekerToken}`)
        .expect(200);

      expect(applicationsResponse.body.applications).toHaveLength(1);
      expect(applicationsResponse.body.applications[0].status).toBe("pending");
    });
  });

  describe("Error Handling", () => {
    it("should handle unauthorized access", async () => {
      const response = await request(app)
        .get("/api/v1/users/profile")
        .expect(401);

      expect(response.body.message).toBe("Authentication invalid");
    });

    it("should handle invalid job ID", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/invalid-id")
        .expect(400);

      expect(response.body.message).toBe("Invalid job ID");
    });

    it("should handle non-existent job", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/507f1f77bcf86cd799439011")
        .expect(404);

      expect(response.body.message).toBe("Job not found");
    });
  });

  describe("Guest Access", () => {
    it("should allow guest to view jobs", async () => {
      // Create a job
      await request(app)
        .post("/api/v1/jobs")
        .set("Cookie", `token=${authToken}`)
        .send(testJobs.cardiologist);

      // Access jobs as guest
      const response = await request(app).get("/api/v1/jobs").expect(200);

      expect(response.body.jobs).toBeDefined();
      expect(response.body.jobs.length).toBeGreaterThan(0);
    });

    it("should prevent guest from creating jobs", async () => {
      const response = await request(app)
        .post("/api/v1/jobs")
        .send(testJobs.cardiologist)
        .expect(401);

      expect(response.body.message).toBe("Authentication invalid");
    });
  });
});
