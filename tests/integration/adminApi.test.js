import "express-async-errors";
import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { testUsers, testJobs } from "../fixtures/testData.js";

// Models
import Employer from "../../backend/models/EmployerModel.js";
import Job from "../../backend/models/JobModel.js";

// Routers and middlewares
import adminRouter from "../../backend/routes/adminRouter.js";
import authRouter from "../../backend/routes/authRouter.js";
import errorHandlerMiddleware from "../../backend/middleware/errorHandlerMiddleware.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../../backend/middleware/authMiddleware.js";

// Ensure tests use the correct admin email
process.env.ADMIN_EMAIL = testUsers.admin.email;

const app = express();
app.use(cookieParser());
app.use(express.json());

// Mount routers
app.use("/api/v1/auth", authRouter);
app.use(
  "/api/v1/admin",
  authenticateUser,
  authorizePermissions("admin"),
  adminRouter
);
app.use(errorHandlerMiddleware);

describe("Admin API Integration Tests", () => {
  let adminToken;
  let employerToken;
  let employerId;

  beforeEach(async () => {
    // 1. Clear database collections (managed by tests/setup.js afterEach but good to ensure)
    await Employer.deleteMany({});
    await Job.deleteMany({});

    // 2. Register and confirm Admin
    const adminRegRes = await request(app)
      .post("/api/v1/auth/register")
      .send(testUsers.admin);
    const adminId = adminRegRes.body.user.userId;
    await Employer.findByIdAndUpdate(adminId, { isConfirmed: true });

    // Login Admin
    const adminLoginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: testUsers.admin.email,
        password: testUsers.admin.password,
      });
    adminToken = adminLoginRes.body.token;

    // 3. Register and confirm regular Recruiter (Employer)
    const empRegRes = await request(app)
      .post("/api/v1/auth/register")
      .send(testUsers.employer);
    employerId = empRegRes.body.user.userId;
    await Employer.findByIdAndUpdate(employerId, { isConfirmed: true });

    // Login Employer
    const empLoginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: testUsers.employer.email,
        password: testUsers.employer.password,
      });
    employerToken = empLoginRes.body.token;
  });

  describe("Security Access Control Checks", () => {
    it("should reject unauthenticated requests to admin routes with 401", async () => {
      await request(app).get("/api/v1/admin/app-stats").expect(401);
    });

    it("should reject non-admin users (employers) with 403", async () => {
      const res = await request(app)
        .get("/api/v1/admin/app-stats")
        .set("Cookie", `token=${employerToken}`)
        .expect(403);
      expect(res.body.msg).toContain("Not authorized");
    });

    it("should reject admin to CEO analytics if email does not match platform owner ADMIN_EMAIL", async () => {
      const originalAdminEmail = process.env.ADMIN_EMAIL;
      process.env.ADMIN_EMAIL = "differentowner@vitalwork.com"; // mismatch email

      const res = await request(app)
        .get("/api/v1/admin/ceo-analytics")
        .set("Cookie", `token=${adminToken}`)
        .expect(403);
      expect(res.body.msg).toContain("Access denied");

      process.env.ADMIN_EMAIL = originalAdminEmail; // restore
    });
  });

  describe("GET /api/v1/admin/app-stats", () => {
    it("should retrieve global application stats successfully for admin", async () => {
      // Create a test job
      await Job.create({
        ...testJobs.cardiologist,
        createdBy: employerId,
      });

      const response = await request(app)
        .get("/api/v1/admin/app-stats")
        .set("Cookie", `token=${adminToken}`)
        .expect(200);

      expect(response.body.totalJobs).toBe(1);
      expect(response.body.totalUsers).toBe(2); // 1 admin, 1 employer
      expect(response.body.msg).toContain("Successfully");
    });
  });

  describe("GET /api/v1/admin/ceo-analytics", () => {
    it("should retrieve complete platform metrics and financials for platform owner", async () => {
      const response = await request(app)
        .get("/api/v1/admin/ceo-analytics")
        .set("Cookie", `token=${adminToken}`)
        .expect(200);

      expect(response.body.kpis).toBeDefined();
      expect(response.body.financials).toBeDefined();
      expect(response.body.health).toBeDefined();
      expect(response.body.growth).toBeDefined();
    });
  });

  describe("Employer Administration Flow", () => {
    it("should get all employers list", async () => {
      const response = await request(app)
        .get("/api/v1/admin/employers")
        .set("Cookie", `token=${adminToken}`)
        .expect(200);

      expect(response.body.users).toHaveLength(2); // admin, employer
    });

    it("should change recruiter status to blocked and back to approved", async () => {
      // Block
      const blockRes = await request(app)
        .patch(`/api/v1/admin/employers/${employerId}/status`)
        .set("Cookie", `token=${adminToken}`)
        .send({ status: "blocked" })
        .expect(200);

      expect(blockRes.body.user.status).toBe("blocked");

      // Verify in DB
      const dbUserBlock = await Employer.findById(employerId);
      expect(dbUserBlock.status).toBe("blocked");

      // Approve
      const approveRes = await request(app)
        .patch(`/api/v1/admin/employers/${employerId}/status`)
        .set("Cookie", `token=${adminToken}`)
        .send({ status: "approved" })
        .expect(200);

      expect(approveRes.body.user.status).toBe("approved");
    });

    it("should change recruiter job posting quota limit and subscription plan", async () => {
      const updateRes = await request(app)
        .patch(`/api/v1/admin/employers/${employerId}/quota`)
        .set("Cookie", `token=${adminToken}`)
        .send({
          jobOffersQuota: 15,
          plan: "pro",
        })
        .expect(200);

      expect(updateRes.body.user.jobOffersQuota).toBe(15);
      expect(updateRes.body.user.plan).toBe("pro");

      // Verify in DB
      const dbUser = await Employer.findById(employerId);
      expect(dbUser.jobOffersQuota).toBe(15);
      expect(dbUser.plan).toBe("pro");
    });
  });
});
