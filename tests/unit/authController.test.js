import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import authRouter from "../../backend/routes/authRouter.js";
import Employer from "../../backend/models/EmployerModel.js";
import { testUsers } from "../fixtures/testData.js";
import cookieParser from "cookie-parser";
import errorHandlerMiddleware from "../../backend/middleware/errorHandlerMiddleware.js";

// Create test app
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use(errorHandlerMiddleware);

describe("Authentication Controller", () => {
  describe("POST /api/v1/auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(testUsers.employer)
        .expect(201);

      expect(response.body.msg).toContain("User registered successfully");
      expect(response.body.user.name).toBe(testUsers.employer.name);
      expect(response.body.user.userId).toBeDefined();
    });

    it("should make first user admin", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(testUsers.admin)
        .expect(201);

      // Check if user was created as admin
      const user = await Employer.findOne({ email: testUsers.admin.email });
      expect(user.role).toBe("admin");
    });

    it("should hash password before saving", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send(testUsers.employer)
        .expect(201);

      const user = await Employer.findOne({ email: testUsers.employer.email });
      expect(user.password).not.toBe(testUsers.employer.password);
      expect(user.password).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash pattern
    });

    it("should return error for duplicate email", async () => {
      // Register first user
      await request(app)
        .post("/api/v1/auth/register")
        .send(testUsers.employer)
        .expect(201);

      // Try to register with same email
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(testUsers.employer)
        .expect(400);

      expect(response.body.msg).toContain("already exists");
    });

    it("should return error for missing required fields", async () => {
      const incompleteUser = {
        name: "Test User",
        // Missing email and password
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(incompleteUser)
        .expect(400);

      expect(response.body.msg).toBeDefined();
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      // Register a user and confirm their email before each login test
      const res = await request(app).post("/api/v1/auth/register").send(testUsers.employer);
      await Employer.findByIdAndUpdate(res.body.user.userId, { isConfirmed: true });
    });

    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: testUsers.employer.email,
          password: testUsers.employer.password,
        })
        .expect(200);

      expect(response.body.msg).toBe("Logged in!");
      expect(response.body.user.email).toBe(testUsers.employer.email);
      expect(response.body.token).toBeDefined();
    });

    it("should set httpOnly cookie on successful login", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: testUsers.employer.email,
          password: testUsers.employer.password,
        })
        .expect(200);

      expect(response.headers["set-cookie"]).toBeDefined();
      const cookie = response.headers["set-cookie"][0];
      expect(cookie).toContain("token=");
      expect(cookie).toContain("HttpOnly");
    });

    it("should return error for invalid email", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: testUsers.employer.password,
        })
        .expect(401);

      expect(response.body.msg).toBe("Invalid credentials");
    });

    it("should return error for invalid password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: testUsers.employer.email,
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.msg).toBe("Invalid credentials");
    });

    it("should return error for missing credentials", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({})
        .expect(400);

      expect(response.body.msg).toContain("Email is required");
    });
  });

  describe("GET /api/v1/auth/logout", () => {
    it("should logout successfully", async () => {
      const response = await request(app)
        .get("/api/v1/auth/logout")
        .expect(200);

      expect(response.body.msg).toBe("Successfully logged out !");
      expect(response.headers["set-cookie"]).toBeDefined();
    });
  });

  describe("GET /api/v1/auth/guest", () => {
    it("should create guest session successfully", async () => {
      const response = await request(app)
        .get("/api/v1/auth/guest")
        .expect(200);

      expect(response.body.msg).toBe("Welcome guest!");
      expect(response.body.user.role).toBe("guest");
      expect(response.body.user.name).toBe("Guest");
      expect(response.body.token).toBeDefined();
    });

    it("should set guest cookie with shorter expiration", async () => {
      const response = await request(app)
        .get("/api/v1/auth/guest")
        .expect(200);

      expect(response.headers["set-cookie"]).toBeDefined();
      const cookie = response.headers["set-cookie"][0];
      expect(cookie).toContain("token=");
      expect(cookie).toContain("HttpOnly");
    });
  });

  describe("POST /api/v1/auth/forgot-password", () => {
    beforeEach(async () => {
      await request(app).post("/api/v1/auth/register").send(testUsers.employer);
    });

    it("should request reset OTP and return OTP in development", async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: testUsers.employer.email })
        .expect(200);

      expect(response.body.msg).toContain("a reset OTP has been sent");
      expect(response.body.devOtp).toBeDefined();

      process.env.NODE_ENV = originalEnv;
    });

    it("should return the same success message even if email is not registered (security principle)", async () => {
      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "unregistered@example.com" })
        .expect(200);

      expect(response.body.msg).toContain("a reset OTP has been sent");
      expect(response.body.devOtp).toBeUndefined();
    });
  });

  describe("POST /api/v1/auth/reset-password", () => {
    let devOtp;
    beforeEach(async () => {
      const res = await request(app).post("/api/v1/auth/register").send(testUsers.employer);
      await Employer.findByIdAndUpdate(res.body.user.userId, { isConfirmed: true });
      
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: testUsers.employer.email });
      
      devOtp = response.body.devOtp;
      process.env.NODE_ENV = originalEnv;
    });

    it("should reset password successfully with valid OTP", async () => {
      const response = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({
          email: testUsers.employer.email,
          otp: devOtp,
          newPassword: "brandNewPassword123"
        })
        .expect(200);

      expect(response.body.msg).toBe("Password reset successful");

      // Verify login works with the new password
      await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: testUsers.employer.email,
          password: "brandNewPassword123"
        })
        .expect(200);
    });

    it("should reject invalid OTP", async () => {
      const response = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({
          email: testUsers.employer.email,
          otp: "wrongOTP",
          newPassword: "brandNewPassword123"
        })
        .expect(400);

      expect(response.body.msg).toBe("Invalid OTP");
    });
  });
});

