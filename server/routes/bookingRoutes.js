import express from "express";
const router = express.Router();
import * as bookingController from "../controllers/bookingController.js";
import { auth } from "../middleware/authMiddleware.js";

// 所有行程相關操作都需要登入
router.use(auth);

// 定義路徑與對應的controller函式
router.get("/", bookingController.getBookings);
router.post("/", bookingController.createBooking);
router.patch("/:id", bookingController.updateBooking);
router.delete("/:id", bookingController.removeBooking);

export default router;
