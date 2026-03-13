import express from "express";
const router = express.Router();
import * as taskController from "../controllers/taskController.js";
import { auth } from "../middleware/authMiddleware.js";

router.use(auth);

router.get("/", taskController.getTasks);
router.patch("/:id/completed", taskController.completeInterview);
router.patch("/:id/status", taskController.updateTaskStatus);

export default router;
