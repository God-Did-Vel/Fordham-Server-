import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import PaymentMethod from '../models/PaymentMethod.js';
import { generateDynamicNigerianBankDetails } from '../utils/paymentGenerator.js';
// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res) => {
    const { guest_name, guest_email, guest_phone, room_id, check_in_date, check_out_date, number_of_guests, total_amount, } = req.body;
    let user_id = undefined;
    if (req.user) {
        // Attached if user is logged in via optionalAuth
        user_id = req.user._id;
    }
    const room = await Room.findById(room_id);
    if (!room) {
        res.status(404);
        throw new Error('Room not found');
    }
    const booking = new Booking({
        guest_name,
        guest_email,
        guest_phone,
        room_id,
        user_id,
        check_in_date,
        check_out_date,
        number_of_guests,
        total_amount,
        booking_status: 'pending',
    });
    const createdBooking = await booking.save();
    // Generate Bank Details using PaymentMethod config or fallback to generator
    let paymentDetails;
    const paymentMethods = await PaymentMethod.find({ isActive: true });
    if (paymentMethods && paymentMethods.length > 0) {
        const randomMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        const prefixes = ["01", "02", "06", "04", "07"];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const random8Digits = Math.floor(10000000 + Math.random() * 90000000).toString();
        paymentDetails = {
            bankName: randomMethod.provider,
            accountNumber: `${prefix}${random8Digits}`,
            accountName: `N&B Italian Hotel - ${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            instructions: randomMethod.details
        };
    }
    else {
        paymentDetails = generateDynamicNigerianBankDetails();
    }
    res.status(201).json({
        booking: createdBooking,
        paymentDetails
    });
};
// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = async (req, res) => {
    const bookings = await Booking.find({}).populate('room_id', 'name slug price_per_night');
    res.json(bookings);
};
// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
        booking.booking_status = req.body.status || booking.booking_status;
        // If confirmed, make the room unavailable
        if (req.body.status === 'confirmed') {
            const room = await Room.findById(booking.room_id);
            if (room) {
                room.availability_status = false;
                await room.save();
            }
        }
        // If cancelled, make the room available
        if (req.body.status === 'cancelled') {
            const room = await Room.findById(booking.room_id);
            if (room) {
                room.availability_status = true;
                await room.save();
            }
        }
        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    }
    else {
        res.status(404);
        throw new Error('Booking not found');
    }
};
// @desc    Get user's own bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = async (req, res) => {
    // req.user is set by the protectUser middleware
    const bookings = await Booking.find({ user_id: req.user._id }).populate('room_id', 'name slug price_per_night images description');
    res.json(bookings);
};
//# sourceMappingURL=bookingController.js.map