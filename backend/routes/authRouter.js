import { Router } from "express";
import {
  register,
  login,
  logout,
  guestLogin,
  confirmEmailUser,
  resendOtpUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { validateRegisterInput, validateLoginInput } from "../middleware/validationMiddleware.js";

const router = Router();

router.post("/register", validateRegisterInput, register);
router.post("/login", validateLoginInput, login);
router.post("/confirm-email", confirmEmailUser);
router.post("/resend-otp", resendOtpUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/logout", logout);
router.get("/guest", guestLogin);

export default router;
