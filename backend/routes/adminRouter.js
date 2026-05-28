import { Router } from "express";
import { getCEOAnalytics } from "../controllers/adminAnalyticsController.js";
import { authenticatePlatformOwner } from "../middleware/authMiddleware.js";
import {
  getApplicationStats,
  updateEmployerStatus,
  updateEmployerQuota,
  getPendingEmployers,
} from "../controllers/adminController.js";
import { getAllEmployers } from "../controllers/employerController.js";

const router = Router();

// General app statistics for admin
router.get("/app-stats", getApplicationStats);

// CEO Analytics (Guarded further by two-factor platform owner check)
router.get("/ceo-analytics", [
  authenticatePlatformOwner,
  getCEOAnalytics,
]);

// Employers list for administration
router.get("/employers", getAllEmployers);

// Recruiter verification/review queue
router.get("/employers/pending", getPendingEmployers);

// Recruiter approval & blocking controls
router.patch("/employers/:id/status", updateEmployerStatus);

// Recruiter subscription & posting quota updates
router.patch("/employers/:id/quota", updateEmployerQuota);

export default router;