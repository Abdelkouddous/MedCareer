import { Router } from "express";
import { uploadCV } from "../controllers/cvController.js";
import upload from "../middleware/multerMiddleware.js";
import { authenticateJobSeeker } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/upload", authenticateJobSeeker, upload.single("cv"), uploadCV);

export default router;
