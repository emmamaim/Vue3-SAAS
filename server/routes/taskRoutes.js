const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// 定義路徑與對應的controller函式
router.get("/", taskController.getAllTasks);
router.post("/", taskController.createTasks);
router.patch("/:id", taskController.updateTask);
router.delete("/:id", taskController.removeTask);

module.exports = router;
