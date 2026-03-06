import express from "express";
const router = express.Router();
import * as bookingController from "../controllers/bookingController.js";

// 定義路徑與對應的controller函式
router.get('/',bookingController.getAllBookings);
router.post('/',bookingController.createBooking);
router.patch('/:id',bookingController.updateBooking);
router.delete('/:id',bookingController.removeBooking);

export default router;