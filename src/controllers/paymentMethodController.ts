import { Request, Response } from 'express';
import PaymentMethod from '../models/PaymentMethod.js';

// @desc    Get all active payment methods
// @route   GET /api/paymentmethods
// @access  Public
export const getPaymentMethods = async (req: Request, res: Response): Promise<void> => {
    try {
        const paymentMethods = await PaymentMethod.find({ isActive: true });
        res.json(paymentMethods);
    } catch (error) {
        console.error('Get payment methods error:', error);
        res.status(500).json({
            message: 'Server error getting payment methods',
        });
    }
};

// @desc    Create a new payment method
// @route   POST /api/paymentmethods
// @access  Private/Admin
export const createPaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
        const { provider, details, isActive } = req.body;

        // Validation
        if (!provider || !details) {
            res.status(400).json({
                message: 'Please provide provider and details',
            });
            return;
        }

        const paymentMethod = await PaymentMethod.create({
            provider,
            details,
            isActive: isActive !== false, // Default to true if not specified
        });

        res.status(201).json(paymentMethod);
    } catch (error) {
        console.error('Create payment method error:', error);
        res.status(500).json({
            message: 'Server error creating payment method',
        });
    }
};

// @desc    Update a payment method
// @route   PUT /api/paymentmethods/:id
// @access  Private/Admin
export const updatePaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
        let paymentMethod = await PaymentMethod.findById(req.params.id);

        if (!paymentMethod) {
            res.status(404).json({
                message: 'Payment method not found',
            });
            return;
        }

        paymentMethod.provider = req.body.provider || paymentMethod.provider;
        paymentMethod.details = req.body.details || paymentMethod.details;
        paymentMethod.isActive = req.body.isActive !== undefined ? req.body.isActive : paymentMethod.isActive;

        const updatedPaymentMethod = await paymentMethod.save();
        res.json(updatedPaymentMethod);
    } catch (error) {
        console.error('Update payment method error:', error);
        res.status(500).json({
            message: 'Server error updating payment method',
        });
    }
};

// @desc    Delete a payment method
// @route   DELETE /api/paymentmethods/:id
// @access  Private/Admin
export const deletePaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
        const paymentMethod = await PaymentMethod.findById(req.params.id);

        if (!paymentMethod) {
            res.status(404).json({
                message: 'Payment method not found',
            });
            return;
        }

        await PaymentMethod.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Payment method deleted successfully',
        });
    } catch (error) {
        console.error('Delete payment method error:', error);
        res.status(500).json({
            message: 'Server error deleting payment method',
        });
    }
};