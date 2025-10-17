import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(mongoUri);
});

// Cleanup after each test
afterEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Cleanup after all tests
afterAll(async () => {
  // Close database connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  // Stop the in-memory MongoDB instance
  await mongoServer.stop();
});

// Mock environment variables for testing
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.JWT_LIFETIME = "30d";
process.env.CLOUDINARY_NAME = "test-cloud";
process.env.CLOUDINARY_API_KEY = "test-key";
process.env.CLOUDINARY_API_SECRET = "test-secret";

