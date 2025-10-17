import request from "supertest";
import mongoose from "mongoose";
import User from "../../models/UserModel.js";
import Job from "../../models/JobModel.js";
import JobSeeker from "../../models/JobSeekerModel.js";
import { testUsers, testJobs } from "../fixtures/testData.js";

/**
 * Test utilities for MedCareer application
 */
export class TestUtils {
  /**
   * Create a test user and return auth token
   */
  static async createAuthenticatedUser(userType = "employer") {
    const userData = testUsers[userType];

    // Create user
    const user = await User.create(userData);

    // Login to get token
    const loginResponse = await request(global.app)
      .post("/api/v1/auth/login")
      .send({
        email: userData.email,
        password: userData.password,
      });

    return {
      user,
      token: loginResponse.body.token,
      cookie: loginResponse.headers["set-cookie"],
    };
  }

  /**
   * Create a test job
   */
  static async createTestJob(userId, jobData = testJobs.cardiologist) {
    const job = await Job.create({
      ...jobData,
      createdBy: userId,
    });
    return job;
  }

  /**
   * Create a test job seeker
   */
  static async createTestJobSeeker(jobSeekerData = testUsers.jobSeeker) {
    const jobSeeker = await JobSeeker.create(jobSeekerData);
    return jobSeeker;
  }

  /**
   * Clean up test data
   */
  static async cleanupTestData() {
    await User.deleteMany({});
    await Job.deleteMany({});
    await JobSeeker.deleteMany({});
  }

  /**
   * Generate test data for bulk operations
   */
  static generateBulkTestData(type, count = 10) {
    const data = [];

    for (let i = 0; i < count; i++) {
      switch (type) {
        case "users":
          data.push({
            ...testUsers.employer,
            email: `test${i}@example.com`,
            name: `Test User ${i}`,
          });
          break;
        case "jobs":
          data.push({
            ...testJobs.cardiologist,
            position: `Test Position ${i}`,
            company: `Test Company ${i}`,
          });
          break;
        case "jobSeekers":
          data.push({
            ...testUsers.jobSeeker,
            email: `jobseeker${i}@example.com`,
            name: `Test JobSeeker ${i}`,
          });
          break;
      }
    }

    return data;
  }

  /**
   * Wait for database operations to complete
   */
  static async waitForDB() {
    return new Promise((resolve) => setTimeout(resolve, 100));
  }

  /**
   * Mock external services
   */
  static mockExternalServices() {
    // Mock Cloudinary
    const mockCloudinary = {
      v2: {
        uploader: {
          upload: jest.fn().mockResolvedValue({
            public_id: "test-image",
            secure_url: "https://test-image.com/image.jpg",
          }),
          destroy: jest.fn().mockResolvedValue({ result: "ok" }),
        },
      },
    };

    // Mock email service
    const mockEmailService = {
      sendEmail: jest.fn().mockResolvedValue(true),
    };

    return { mockCloudinary, mockEmailService };
  }

  /**
   * Create test environment variables
   */
  static setupTestEnv() {
    process.env.NODE_ENV = "test";
    process.env.JWT_SECRET = "test-jwt-secret";
    process.env.JWT_LIFETIME = "30d";
    process.env.CLOUDINARY_NAME = "test-cloud";
    process.env.CLOUDINARY_API_KEY = "test-key";
    process.env.CLOUDINARY_API_SECRET = "test-secret";
    process.env.MONGO_URL = "mongodb://localhost:27017/medcareer-test";
  }

  /**
   * Assert response structure
   */
  static assertResponseStructure(response, expectedFields) {
    expectedFields.forEach((field) => {
      expect(response.body).toHaveProperty(field);
    });
  }

  /**
   * Assert error response
   */
  static assertErrorResponse(response, expectedStatus, expectedMessage) {
    expect(response.status).toBe(expectedStatus);
    expect(response.body.message).toBeDefined();
    if (expectedMessage) {
      expect(response.body.message).toContain(expectedMessage);
    }
  }

  /**
   * Create test file upload
   */
  static createTestFile(
    filename = "test-resume.pdf",
    content = "test content"
  ) {
    return {
      fieldname: "resume",
      originalname: filename,
      encoding: "7bit",
      mimetype: "application/pdf",
      buffer: Buffer.from(content),
      size: content.length,
    };
  }
}

/**
 * Database helper functions
 */
export class DatabaseUtils {
  /**
   * Connect to test database
   */
  static async connectTestDB() {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL);
    }
  }

  /**
   * Disconnect from test database
   */
  static async disconnectTestDB() {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }

  /**
   * Clear all collections
   */
  static async clearCollections() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }

  /**
   * Seed test data
   */
  static async seedTestData() {
    const users = await User.insertMany(
      TestUtils.generateBulkTestData("users", 5)
    );
    const jobs = await Job.insertMany(
      TestUtils.generateBulkTestData("jobs", 10)
    );
    const jobSeekers = await JobSeeker.insertMany(
      TestUtils.generateBulkTestData("jobSeekers", 5)
    );

    return { users, jobs, jobSeekers };
  }
}

/**
 * API testing helpers
 */
export class ApiTestHelpers {
  /**
   * Make authenticated request
   */
  static async authenticatedRequest(app, method, url, token, data = null) {
    const req = request(app)
      [method](url)
      .set("Authorization", `Bearer ${token}`);

    if (data) {
      req.send(data);
    }

    return req;
  }

  /**
   * Test pagination
   */
  static async testPagination(app, url, token = null) {
    const requests = [
      request(app).get(`${url}?page=1&limit=5`),
      request(app).get(`${url}?page=2&limit=5`),
      request(app).get(`${url}?page=1&limit=10`),
    ];

    if (token) {
      requests.forEach((req) => req.set("Authorization", `Bearer ${token}`));
    }

    const responses = await Promise.all(requests);

    responses.forEach((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("jobs");
      expect(response.body).toHaveProperty("totalJobs");
      expect(response.body).toHaveProperty("numOfPages");
    });

    return responses;
  }

  /**
   * Test search functionality
   */
  static async testSearch(app, url, searchTerms, token = null) {
    const requests = searchTerms.map((term) => {
      const req = request(app).get(`${url}?search=${term}`);
      if (token) {
        req.set("Authorization", `Bearer ${token}`);
      }
      return req;
    });

    const responses = await Promise.all(requests);

    responses.forEach((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("jobs");
    });

    return responses;
  }
}
