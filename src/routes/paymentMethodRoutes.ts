import express from 'express';
import {
    getPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
} from '../controllers/paymentMethodController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - get all active payment methods
router.get('/', getPaymentMethods);

// Admin routes - require admin authentication
router.post('/', protectAdmin, createPaymentMethod);
router.put('/:id', protectAdmin, updatePaymentMethod);
router.delete('/:id', protectAdmin, deletePaymentMethod);

export default router;