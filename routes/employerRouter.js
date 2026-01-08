import { Router } from "express";
// Description: Handles routing for user-related operations
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
  authorizePermissions,
  validateUpdateUserInput,
  getAllJobSeekers,
  getAllEmployers,
  getUserJobs,
  updateEmployerStatus,
  updateEmployerQuota,
  getPendingEmployers,
} from "../controllers/employerController.js";
import { getEmployerApplications } from "../controllers/applicationController.js";
import upload from "../middleware/multerMiddleware.js";

//This is recruiters and admin router
// All routes in this router are protected by the authorizePermissions middleware

const router = Router();
router.get("/all-employers", getAllEmployers);
router.get("/all-seekers", getAllJobSeekers);
router.get("/current-user", getCurrentUser);
router.get("/my-jobs", getUserJobs);
router.get("/my-applications", getEmployerApplications);

router.get("/admin/app-stats", [
  authorizePermissions("admin"),
  getApplicationStats,
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
