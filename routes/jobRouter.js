import { Router } from "express";
import {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  getAllJobsCount,
  showStats,
  getJobById,
} from "../controllers/jobController.js";
import {
  authenticateUser,
  authorizePermissions,
  allowGuestForViewing,
} from "../middleware/authMiddleware.js";

const router = Router();

// Public routes (accessible by guests)
// IMPORTANT: Specific routes must come BEFORE parameterized routes

// Specific routes first
router.get("/all-jobs", allowGuestForViewing, getAllJobsCount);
router.get("/show-stats", authenticateUser, showStats);
// Parameterized routes after specific routes
router.get("/", allowGuestForViewing, getAllJobs);
router.get("/:id", allowGuestForViewing, getJobById);

// Protected routes (not accessible by guests)
router.post(
  "/",
  authenticateUser,
  authorizePermissions("employer", "admin"),
  createJob
);
router.patch(
  "/:id",
  authenticateUser,
  authorizePermissions("employer", "admin"),
  updateJob
);
router.delete(
  "/:id",
  authenticateUser,
  authorizePermissions("employer", "admin"),
  deleteJob
);

export default router;
