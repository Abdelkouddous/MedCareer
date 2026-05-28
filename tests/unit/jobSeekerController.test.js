import "express-async-errors";
import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import jobSeekerRouter from "../../backend/routes/jobSeekerRouter.js";
import JobSeeker from "../../backend/models/JobSeekerModel.js";
import { testUsers } from "../fixtures/testData.js";
import cookieParser from "cookie-parser";
import errorHandlerMiddleware from "../../backend/middleware/errorHandlerMiddleware.js";

// Create test app
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/jobseekers", jobSeekerRouter);
app.use(errorHandlerMiddleware);

describe("Job Seeker Controller", () => {
  describe("POST /api/v1/jobseekers/register", () => {
    it("should register a new job seeker successfully", async () => {
      const response = await request(app)
        .post("/api/v1/jobseekers/register")
        .send(testUsers.jobSeeker)
        .expect(201);

      expect(response.body.message).toContain("OTP :");
      expect(response.body.userId).toBeDefined();
    });

    it("should hash password before saving", async () => {
      await request(app)
        .post("/api/v1/jobseekers/register")
        .send(testUsers.jobSeeker)
        .expect(201);

      const user = await JobSeeker.findOne({ email: testUsers.jobSeeker.email });
      expect(user.password).not.toBe(testUsers.jobSeeker.password);
      expect(user.password).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash pattern
    });

    it("should return error for duplicate email", async () => {
      // Register first user
      await request(app)
        .post("/api/v1/jobseekers/register")
        .send(testUsers.jobSeeker)
        .expect(201);

      // Try to register with same email
      const response = await request(app)
        .post("/api/v1/jobseekers/register")
        .send(testUsers.jobSeeker)
        .expect(400);

      expect(response.body.message).toBe("Job seeker already exists");
    });

    it("should return error for missing email or password", async () => {
      const incompleteUser = {
        name: "Dr. Johnson",
      };

      const response = await request(app)
        .post("/api/v1/jobseekers/register")
        .send(incompleteUser)
        .expect(400);

      expect(response.body.message).toBe("Please provide email and password");
    });
  });

  describe("POST /api/v1/jobseekers/login", () => {
    beforeEach(async () => {
      // Register a user and confirm their email before each login test
      const res = await request(app).post("/api/v1/jobseekers/register").send(testUsers.jobSeeker);
      await JobSeeker.findByIdAndUpdate(res.body.userId, { isConfirmed: true });
    });

    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/v1/jobseekers/login")
        .send({
          email: testUsers.jobSeeker.email,
          password: testUsers.jobSeeker.password,
        })
        .expect(200);

      expect(response.body.jobSeeker.email).toBe(testUsers.jobSeeker.email);
      expect(response.body.token).toBeDefined();
    });

    it("should set httpOnly cookie on successful login", async () => {
      const response = await request(app)
        .post("/api/v1/jobseekers/login")
        .send({
          email: testUsers.jobSeeker.email,
          password: testUsers.jobSeeker.password,
        })
        .expect(200);

      expect(response.headers["set-cookie"]).toBeDefined();
      const cookie = response.headers["set-cookie"][0];
      expect(cookie).toContain("token=");
      expect(cookie).toContain("HttpOnly");
    });

    it("should return error for invalid email", async () => {
      const response = await request(app)
        .post("/api/v1/jobseekers/login")
        .send({
          email: "nonexistent@example.com",
          password: testUsers.jobSeeker.password,
        })
        .expect(400);

      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should return error for invalid password", async () => {
      const response = await request(app)
        .post("/api/v1/jobseekers/login")
        .send({
          email: testUsers.jobSeeker.email,
          password: "wrongpassword",
        })
        .expect(400);

      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should return error for missing credentials", async () => {
      const response = await request(app)
        .post("/api/v1/jobseekers/login")
        .send({})
        .expect(400);

      expect(response.body.message).toBe("Please provide email and password");
    });
  });

  describe("POST /api/v1/jobseekers/forgot-password", () => {
    beforeEach(async () => {
      const res = await request(app).post("/api/v1/jobseekers/register").send(testUsers.jobSeeker);
      await JobSeeker.findByIdAndUpdate(res.body.userId, { isConfirmed: true });
    });

    it("should request reset OTP and return OTP in development", async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const response = await request(app)
        .post("/api/v1/jobseekers/forgot-password")
        .send({ email: testUsers.jobSeeker.email })
        .expect(200);

      expect(response.body.message).toContain("a reset OTP has been sent");
      expect(response.body.devOtp).toBeDefined();

      process.env.NODE_ENV = originalEnv;
    });

    it("should return the same success message even if email is not registered", async () => {
      const response = await request(app)
        .post("/api/v1/jobseekers/forgot-password")
        .send({ email: "unregistered@example.com" })
        .expect(200);

      expect(response.body.message).toContain("a reset OTP has been sent");
      expect(response.body.devOtp).toBeUndefined();
    });
  });

  describe("POST /api/v1/jobseekers/reset-password", () => {
    let devOtp;
    beforeEach(async () => {
      const res = await request(app).post("/api/v1/jobseekers/register").send(testUsers.jobSeeker);
      await JobSeeker.findByIdAndUpdate(res.body.userId, { isConfirmed: true });
      
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const response = await request(app)
        .post("/api/v1/jobseekers/forgot-password")
        .send({ email: testUsers.jobSeeker.email });
      
      devOtp = response.body.devOtp;
      process.env.NODE_ENV = originalEnv;
    });

    it("should reset password successfully with valid OTP", async () => {
      const response = await request(app)
        .post("/api/v1/jobseekers/reset-password")
        .send({
          email: testUsers.jobSeeker.email,
          otp: devOtp,
          newPassword: "brandNewPassword123"
        })
        .expect(200);

      expect(response.body.message).toBe("Password reset successful");

      // Verify login works with the new password
      await request(app)
        .post("/api/v1/jobseekers/login")
        .send({
          email: testUsers.jobSeeker.email,
          password: "brandNewPassword123"
        })
        .expect(200);
    });

    it("should reject invalid OTP", async () => {
      const response = await request(app)
        .post("/api/v1/jobseekers/reset-password")
        .send({
          email: testUsers.jobSeeker.email,
          otp: "wrongOTP",
          newPassword: "brandNewPassword123"
        })
        .expect(400);

      expect(response.body.message).toBe("Invalid OTP");
    });
  });

  describe("POST /api/v1/jobseekers/become-recruiter", () => {
    let tokenCookie;
    beforeEach(async () => {
      const res = await request(app).post("/api/v1/jobseekers/register").send(testUsers.jobSeeker);
      await JobSeeker.findByIdAndUpdate(res.body.userId, { isConfirmed: true });

      const loginRes = await request(app)
        .post("/api/v1/jobseekers/login")
        .send({
          email: testUsers.jobSeeker.email,
          password: testUsers.jobSeeker.password,
        });
      tokenCookie = loginRes.headers["set-cookie"];
    });

    it("should successfully transition a job seeker to a recruiter with 1 trial quota", async () => {
      const response = await request(app)
        .post("/api/v1/jobseekers/become-recruiter")
        .set("Cookie", tokenCookie)
        .expect(200);

      expect(response.body.message).toBe("Successfully transitioned to Recruiter mode");
      expect(response.body.user.role).toBe("employer");
      expect(response.body.user.jobOffersQuota).toBe(1);
      expect(response.body.user.trialJobsLimit).toBe(1);
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should fail if not authenticated", async () => {
      await request(app)
        .post("/api/v1/jobseekers/become-recruiter")
        .expect(401);
    });
  });
});
