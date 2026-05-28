import { Router } from "express";
// Description: Handles routing for user-related operations
import {
  getCurrentUser,
  updateUser,
  validateUpdateUserInput,
  getAllJobSeekers,
  getAllEmployers,
  getUserJobs,
} from "../controllers/employerController.js";
import {
  getEmployerApplications,
  updateApplicationStatus,
  getEmployerAppStats,
} from "../controllers/applicationController.js";
import upload from "../middleware/multerMiddleware.js";

// This is recruiters/employers router
const router = Router();
router.get("/all-employers", getAllEmployers);
router.get("/all-seekers", getAllJobSeekers);
router.get("/current-user", getCurrentUser);
router.get("/my-jobs", getUserJobs);
router.get("/my-applications", getEmployerApplications);
router.get("/app-stats", getEmployerAppStats);
router.patch("/applications/:id/status", updateApplicationStatus);

router.patch(
  "/update-user",
  upload.single("avatar"),
  validateUpdateUserInput,
  updateUser
);

export default router;
