const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// JWT 驗證中介軟體（確保只有登入者能查）
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// 定義路徑與對應的controller函式
router.post("/login", userController.login);
router.get("/", authenticateToken, isAdmin, userController.getUserList);
router.post("/", authenticateToken, isAdmin, userController.createUser);
router.put("/:id", authenticateToken, isAdmin, userController.updateUser);
router.patch(
  "/:id/status",
  authenticateToken,
  isAdmin,
  userController.toggleUserStatus,
);

module.exports = router;
