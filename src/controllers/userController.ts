import { Request, Response } from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            res.status(400).json({
                message: 'Please provide email and password',
            });
            return;
        }

        const user = await User.findOne({ 
            $or: [
                { email },
                { phoneNumber: email }
            ]
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id.toString(), 'user'),
            });
        } else {
            res.status(401).json({
                message: 'Invalid email or password',
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server error during login',
        });
    }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phoneNumber, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            res.status(400).json({
                message: 'Please provide name, email, and password',
            });
            return;
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({
                message: 'User already exists with this email',
            });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id.toString(), 'user'),
            });
        } else {
            res.status(400).json({
                message: 'Invalid user data',
            });
        }
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            message: 'Server error during registration',
        });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById((req as any).user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
            });
        } else {
            res.status(404).json({
                message: 'User not found',
            });
        }
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            message: 'Server error getting profile',
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById((req as any).user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phoneNumber: updatedUser.phoneNumber,
                token: generateToken(updatedUser._id.toString(), 'user'),
            });
        } else {
            res.status(404).json({
                message: 'User not found',
            });
        }
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            message: 'Server error updating profile',
        });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            message: 'Server error getting users',
        });
    }
};