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
  forgotPasswordJobSeeker,
  resetPasswordJobSeeker,
} from "../controllers/jobSeekerController.js";
import {
  applyToJob,
  getMyApplications,
  getMyStats,
  listNotifications,
  markNotificationRead,
} from "../controllers/applicationController.js";
import {
  getJobSeekerConversations,
  sendMessageAsJobSeeker,
  getMessagesAsJobSeeker,
} from "../controllers/messageController.js";
import { authenticateJobSeeker } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = Router();

// Guest Job Seeker endpoint
router.get("/guest", guestJobSeeker);

// Public auth for job seekers
router.post("/register", upload.single('cv'), createJobSeeker);
router.post("/login", loginJobSeeker);
router.post("/logout", logoutJobSeeker);
router.post("/confirm-email", confirmEmail);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPasswordJobSeeker);
router.post("/reset-password", resetPasswordJobSeeker);

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

// Messaging (self — only accepted applications)
router.get("/conversations", authenticateJobSeeker, getJobSeekerConversations);
router.post("/messages/send", authenticateJobSeeker, sendMessageAsJobSeeker);
router.get("/messages/:conversationId", authenticateJobSeeker, getMessagesAsJobSeeker);

export default router;
