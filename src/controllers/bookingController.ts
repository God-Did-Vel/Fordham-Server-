import { Request, Response } from 'express';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import RoomImage from '../models/RoomImage.js';
import PaymentMethod from '../models/PaymentMethod.js';
import { generateDynamicNigerianBankDetails } from '../utils/paymentGenerator.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req: Request, res: Response) => {
    const {
        guest_name,
        guest_email,
        guest_phone,
        room_id,
        check_in_date,
        check_out_date,
        number_of_guests,
        total_amount,
    } = req.body;

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
            bankName: randomMethod!.provider,
            accountNumber: `${prefix}${random8Digits}`,
            accountName: `N&B Italian Hotel - ${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            instructions: randomMethod!.details
        };
    } else {
        paymentDetails = generateDynamicNigerianBankDetails();
    }

    res.status(201).json({
        booking: createdBooking,
        paymentDetails
    });
};

// @desc    Get all bookings (Admin view - includes user_id population)
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = async (req: Request, res: Response) => {
    try {
        // FIXED: Populate both room_id AND user_id so admin sees user info
        const bookings = await Booking.find({})
            .populate('room_id', 'name slug price_per_night')
            .populate('user_id', 'name email')
            .sort({ createdAt: -1 });
        
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { booking_status } = req.body;

        if (!booking_status) {
            res.status(400).json({ message: 'booking_status is required' });
            return;
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }

        // Update booking status
        booking.booking_status = booking_status;
        const updatedBooking = await booking.save();

        // If approved, room should still be available for other dates
        // If cancelled, no action needed (room stays available)
        // If confirmed, room becomes unavailable
        if (booking_status === 'confirmed') {
            const room = await Room.findById(booking.room_id);
            if (room) {
                room.availability_status = false;
                await room.save();
            }
        }

        // Populate before sending response
        const populatedBooking = await Booking.findById(updatedBooking._id)
            .populate('room_id', 'name slug price_per_night')
            .populate('user_id', 'name email');

        res.json(populatedBooking);
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ message: 'Error updating booking status' });
    }
};

// @desc    Get user's own bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = async (req: Request, res: Response) => {
    try {
        // FIXED: req.user is set by the protectUser middleware
        const bookings = await Booking.find({ user_id: req.user._id })
            .populate('room_id', 'name slug price_per_night description')
            .sort({ createdAt: -1 })
            .lean();

        // Add room images to each booking
        for (const booking of bookings) {
            if (booking.room_id) {
                const images = await RoomImage.find({ room_id: (booking.room_id as any)._id });
                (booking.room_id as any).images = images.map(img => img.image_url);
            }
        }

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ message: 'Error fetching your bookings' });
    }
};