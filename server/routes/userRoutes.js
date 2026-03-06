import express from "express";
const router = express.Router();
import * as userController from "../controllers/userController.js";
// JWT 驗證中介軟體（確保只有登入者能查）
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.js";

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

export default router;
