import { Request, Response } from 'express';
import RoomImage from '../models/RoomImage.js';
import Room from '../models/Room.js';

// @desc    Get all room images
// @route   GET /api/roomimages
// @access  Public
export const getRoomImages = async (req: Request, res: Response): Promise<void> => {
    try {
        const roomImages = await RoomImage.find({}).populate('room_id');
        
        // Only log count, not full data
        console.log(`✅ Room images: ${roomImages.length} found`);
        
        res.json(roomImages);
    } catch (error) {
        console.error('Get room images error:', error);
        res.status(500).json({
            message: 'Server error getting room images',
        });
    }
};

// @desc    Get room images by room ID
// @route   GET /api/roomimages/room/:roomId
// @access  Public
export const getRoomImagesByRoomId = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Fetching images for room:", req.params.roomId);
        
        const roomImages = await RoomImage.find({ room_id: req.params.roomId }).populate('room_id');
        
        console.log("Images found for room:", roomImages.length);
        
        res.json(roomImages);
    } catch (error) {
        console.error('Get room images by room ID error:', error);
        res.status(500).json({
            message: 'Server error getting room images',
        });
    }
};

// @desc    Create a new room image
// @route   POST /api/roomimages
// @access  Private/Admin
export const createRoomImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { room_id, image_url, alt_text } = req.body;

        console.log("Creating room image with:", { room_id, image_url, alt_text });

        // Validation
        if (!room_id || !image_url) {
            res.status(400).json({
                message: 'Please provide room_id and image_url',
            });
            return;
        }

        // Verify room exists
        const room = await Room.findById(room_id);
        if (!room) {
            res.status(404).json({
                message: 'Room not found',
            });
            return;
        }

        const roomImage = await RoomImage.create({
            room_id,
            image_url,
            alt_text: alt_text || `Room image for ${room.name}`,
        });

        console.log("Room image created:", roomImage);

        res.status(201).json(roomImage);
    } catch (error) {
        console.error('Create room image error:', error);
        res.status(500).json({
            message: 'Server error creating room image',
        });
    }
};

// @desc    Update a room image
// @route   PUT /api/roomimages/:id
// @access  Private/Admin
export const updateRoomImage = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Updating room image:", req.params.id);

        let roomImage = await RoomImage.findById(req.params.id);

        if (!roomImage) {
            res.status(404).json({
                message: 'Room image not found',
            });
            return;
        }

        roomImage.image_url = req.body.image_url || roomImage.image_url;
        roomImage.alt_text = req.body.alt_text || roomImage.alt_text;

        const updatedRoomImage = await roomImage.save();
        
        console.log("Room image updated");

        res.json(updatedRoomImage);
    } catch (error) {
        console.error('Update room image error:', error);
        res.status(500).json({
            message: 'Server error updating room image',
        });
    }
};

// @desc    Delete a room image
// @route   DELETE /api/roomimages/:id
// @access  Private/Admin
export const deleteRoomImage = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Deleting room image:", req.params.id);

        const roomImage = await RoomImage.findById(req.params.id);

        if (!roomImage) {
            res.status(404).json({
                message: 'Room image not found',
            });
            return;
        }

        await RoomImage.findByIdAndDelete(req.params.id);
        
        console.log("Room image deleted");

        res.json({
            message: 'Room image deleted successfully',
        });
    } catch (error) {
        console.error('Delete room image error:', error);
        res.status(500).json({
            message: 'Server error deleting room image',
        });
    }
};