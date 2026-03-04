const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// 定義路徑與對應的controller函式
router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router;