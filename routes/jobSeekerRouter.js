import { Router } from "express";
import {
  guestJobSeeker,
  createJobSeeker,
  loginJobSeeker,
  logoutJobSeeker,
  getCurrentJobSeeker,
  updateCurrentJobSeeker,
} from "../controllers/jobSeekerController.js";
import {
  applyToJob,
  getMyApplications,
  getMyStats,
  listNotifications,
  markNotificationRead,
} from "../controllers/applicationController.js";
import { authenticateJobSeeker } from "../middleware/authMiddleware.js";

const router = Router();

// Guest Job Seeker endpoint
router.get("/guest", guestJobSeeker);

// Public auth for job seekers
router.post("/", createJobSeeker);
router.post("/login", loginJobSeeker);
router.post("/logout", logoutJobSeeker);

// Self-only profile endpoints
router.get("/me", authenticateJobSeeker, getCurrentJobSeeker);
router.patch("/me", authenticateJobSeeker, updateCurrentJobSeeker);

// Applications & stats (self)
router.post("/apply/:jobId", authenticateJobSeeker, applyToJob);
router.get("/applications", authenticateJobSeeker, getMyApplications);
router.get("/stats", authenticateJobSeeker, getMyStats);

// Notifications (self, unique)
router.get("/notifications", authenticateJobSeeker, listNotifications);
router.patch(
  "/notifications/:id/read",
  authenticateJobSeeker,
  markNotificationRead
);

export default router;
