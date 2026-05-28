import { Router } from "express";
// Description: Handles routing for user-related operations
import {
  getCurrentUser,
  getAllJobSeekers,
  getAllEmployers,
  getUserJobs,

} from "../controllers/employerController.js";
import { getEmployerApplications, updateApplicationStatus } from "../controllers/applicationController.js";

//This is recruiters router
// All routes in this router are protected by the authorizePermissions middleware

const router = Router();


router.get("/all-seekers", getAllJobSeekers);
router.get("/current-user", getCurrentUser);
router.get("/my-jobs", getUserJobs);
router.get("/my-applications", getEmployerApplications);
router.patch("/applications/:id/status", updateApplicationStatus);




export default router;
