import { Router } from "express";
// Description: Handles routing for user-related operations
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
  authorizePermissions,
  validateUpdateUserInput,
  getAllUsers,
  updateEmployerStatus,
  updateEmployerQuota,
  getPendingEmployers,
} from "../controllers/userController.js";
import upload from "../middleware/multerMiddleware.js";

//

const router = Router();

router.get("/current-user", getCurrentUser);
router.get("/admin/app-stats", [
  authorizePermissions("admin"),
  getApplicationStats,
]);
// Admin: list pending employers
router.get("/admin/employers/pending", [authorizePermissions("admin"), getPendingEmployers]);
// Admin: approve/block employer
router.patch("/admin/employers/:id/status", [authorizePermissions("admin"), updateEmployerStatus]);
// Admin: update employer quota
router.patch("/admin/employers/:id/quota", [authorizePermissions("admin"), updateEmployerQuota]);
router.patch(
  "/update-user",
  upload.single("avatar"),
  validateUpdateUserInput,
  updateUser
);

router.get("/all-users", getAllUsers);

export default router;
