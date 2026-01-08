import { Router } from "express";
import { getStatus } from "../controllers/statusController.js";

const router = Router();

router.get("/", getStatus);

export default router;
