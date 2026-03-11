import express from "express";
import * as interviewController from "../controllers/interviewController.js";
import { auth, isStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

// isStaff 權限
router.post("/", auth, isStaff, interviewController.createInterview);
router.patch("/:id", auth, isStaff, interviewController.updateInterview);
router.delete("/:id", auth, isStaff, interviewController.cancelInterview);

export default router;
