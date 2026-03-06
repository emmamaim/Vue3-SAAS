import express from "express";
const router = express.Router();
import * as taskController from "../controllers/taskController.js";

// 定義路徑與對應的controller函式
router.get("/", taskController.getAllTasks);
router.post("/", taskController.createTasks);
router.patch("/:id", taskController.updateTask);
router.delete("/:id", taskController.removeTask);

export default router;
