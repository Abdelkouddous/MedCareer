// This is admin router
import { Router } from "express";
const router = Router();
import { getCEOAnalytics } from "../controllers/adminAnalyticsController.js";
import { authenticatePlatformOwner } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";
import {
  updateEmployerStatus,
  updateEmployerQuota,
  getPendingEmployers,
    getAllEmployers,
  validateUpdateUserInput,
  updateUser,
  authorizePermissions
} from "../controllers/employerController.js";

// Admin: CEO Analytics Dashboard — guarded by the TWO-FACTOR platform owner check.
// authorizePermissions("admin") alone is NOT sufficient; the user's email must
// also match the ADMIN_EMAIL env variable. No employer can access this.


router.get("/admin/ceo-analytics", [
  authenticatePlatformOwner,
  getCEOAnalytics,
]);
// Admin: list pending employers
router.get("/admin/employers/pending", [
  authorizePermissions("admin"),
  getPendingEmployers,
]);
// Admin: approve/block employer
router.patch("/admin/employers/:id/status", [
  authorizePermissions("admin"),
  updateEmployerStatus,
]);
// Admin: update employer quota
router.patch("/admin/employers/:id/quota", [
  authorizePermissions("admin"),
  updateEmployerQuota,
]);
router.patch(
  "/update-user",
  upload.single("avatar"),
  validateUpdateUserInput,
  updateUser
);
router.get("/admin/employers", [
  authorizePermissions("admin"),
  getAllEmployers,
]);

export default router;