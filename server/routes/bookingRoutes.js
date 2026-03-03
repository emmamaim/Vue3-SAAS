const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// 定義路徑與對應的controller函式
router.get('/',bookingController.getAllBookings);
router.post('/',bookingController.createBooking);
router.patch('/:id',bookingController.updateBooking);
router.delete('/:id',bookingController.removeBooking);

module.exports = router;