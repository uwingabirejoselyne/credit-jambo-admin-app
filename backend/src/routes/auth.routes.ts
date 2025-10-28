import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Admin login
 * @access  Public
 */
router.post('/login', authController.loginValidation, authController.login.bind(authController));

/**
 * @route   GET /api/auth/profile
 * @desc    Get current admin profile
 * @access  Private
 */
router.get('/profile', authenticate, authController.getProfile.bind(authController));

/**
 * @route   POST /api/auth/logout
 * @desc    Admin logout
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout.bind(authController));

export default router;
