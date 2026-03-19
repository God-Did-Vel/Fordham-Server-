import express from 'express';
import {
    createBooking,
    getBookings,
    updateBookingStatus,
    getMyBookings,
} from '../controllers/bookingController.js';
import { protectAdmin, protectUser, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/mybookings').get(protectUser, getMyBookings);

// Create booking or get all bookings (admin)
router.route('/').post(optionalAuth, createBooking).get(protectAdmin, getBookings);

// Update booking status (PATCH is more appropriate than PUT for partial updates)
router.route('/:id/status').patch(protectAdmin, updateBookingStatus);

// Alternative PUT route for backwards compatibility
router.route('/:id').put(protectAdmin, updateBookingStatus);

export default router;