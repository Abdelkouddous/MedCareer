import { Router } from "express";
// Description: Handles routing for user-related operations
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
  authorizePermissions,
  validateUpdateUserInput,
  getAllUsers,
} from "../controllers/userController.js";
import upload from "../middleware/multerMiddleware.js";

//

const router = Router();

router.get("/current-user", getCurrentUser);
router.get("/admin/app-stats", [
  authorizePermissions("admin"),
  getApplicationStats,
]);
router.patch(
  "/update-user",
  upload.single("avatar"),
  validateUpdateUserInput,
  updateUser
);

router.get("/all-users", getAllUsers);

export default router;
