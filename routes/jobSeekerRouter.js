import { Router } from "express";
import {
  guestJobSeeker,
  createJobSeeker,
  loginJobSeeker,
  logoutJobSeeker,
  getCurrentJobSeeker,
  updateCurrentJobSeeker,
  confirmEmail,
  resendOtp,
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
router.post("/register", createJobSeeker);
router.post("/login", loginJobSeeker);
router.post("/logout", logoutJobSeeker);
router.post("/confirm-email", confirmEmail);
router.post("/resend-otp", resendOtp);

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
