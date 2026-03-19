import express from 'express';
import { createBooking, getBookings, updateBookingStatus, getMyBookings, } from '../controllers/bookingController.js';
import { protectAdmin, protectUser, optionalAuth } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').post(optionalAuth, createBooking).get(protectAdmin, getBookings);
router.route('/mybookings').get(protectUser, getMyBookings);
router.route('/:id').put(protectAdmin, updateBookingStatus);
router.route('/:id/status').patch(protectAdmin, updateBookingStatus);
export default router;
//# sourceMappingURL=bookingRoutes.js.map