
import express from 'express';
import {
    getRoomImages,
    getRoomImagesByRoomId,
    createRoomImage,
    updateRoomImage,
    deleteRoomImage,
} from '../controllers/roomImageController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getRoomImages);
router.get('/room/:roomId', getRoomImagesByRoomId);

// Admin routes
router.post('/', protectAdmin, createRoomImage);
router.put('/:id', protectAdmin, updateRoomImage);
router.delete('/:id', protectAdmin, deleteRoomImage);

export default router;