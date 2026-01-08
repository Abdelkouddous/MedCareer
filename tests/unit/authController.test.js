import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import authRouter from "../../routes/authRouter.js";
import Employer from "../../models/EmployerModel.js";
import { testUsers } from "../fixtures/testData.js";
import cookieParser from "cookie-parser";

// Create test app
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/auth", authRouter);

describe("Authentication Controller", () => {
  describe("POST /api/v1/auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(testUsers.employer)
        .expect(201);

      expect(response.body.msg).toBe("User registered successfully");
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

      expect(response.body.message).toContain("duplicate");
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

      expect(response.body.message).toBeDefined();
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      // Register a user before each login test
      await request(app).post("/api/v1/auth/register").send(testUsers.employer);
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

      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should return error for invalid password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: testUsers.employer.email,
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should return error for missing credentials", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({})
        .expect(401);

      expect(response.body.message).toBe("Please provide all values");
    });
  });

  describe("POST /api/v1/auth/logout", () => {
    it("should logout successfully", async () => {
      const response = await request(app)
        .post("/api/v1/auth/logout")
        .expect(200);

      expect(response.body.msg).toBe("Successfully logged out !");
      expect(response.headers["set-cookie"]).toBeDefined();
    });
  });

  describe("POST /api/v1/auth/guest", () => {
    it("should create guest session successfully", async () => {
      const response = await request(app)
        .post("/api/v1/auth/guest")
        .expect(200);

      expect(response.body.msg).toBe("Welcome guest!");
      expect(response.body.user.role).toBe("guest");
      expect(response.body.user.name).toBe("Guest");
      expect(response.body.token).toBeDefined();
    });

    it("should set guest cookie with shorter expiration", async () => {
      const response = await request(app)
        .post("/api/v1/auth/guest")
        .expect(200);

      expect(response.headers["set-cookie"]).toBeDefined();
      const cookie = response.headers["set-cookie"][0];
      expect(cookie).toContain("token=");
      expect(cookie).toContain("HttpOnly");
    });
  });
});
