import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middlewares/auth';
import { AdminDTO } from '../dtos';

/**
 * Auth Controller - handles authentication endpoints
 */
export class AuthController {
  /**
   * Validation rules for login
   */
  loginValidation = [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ];

  /**
   * Admin login
   * POST /api/auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        sendError(res, 'Validation failed', 400, errors.array());
        return;
      }

      const { email, password } = req.body;

      // Authenticate admin
      const authData = await authService.login(email, password);

      sendSuccess(res, authData, 'Login successful');
    } catch (error: any) {
      console.error('Login error:', error);
      sendError(res, error.message || 'Login failed', 401);
    }
  }

  /**
   * Get current admin profile
   * GET /api/auth/profile
   */
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.admin) {
        sendError(res, 'Not authenticated', 401);
        return;
      }

      const admin = await authService.getProfile(req.admin.id);

      if (!admin) {
        sendError(res, 'Admin not found', 404);
        return;
      }

      sendSuccess(res, new AdminDTO(admin), 'Profile retrieved successfully');
    } catch (error: any) {
      console.error('Get profile error:', error);
      sendError(res, 'Failed to retrieve profile', 500);
    }
  }

  /**
   * Logout (client-side token removal)
   * POST /api/auth/logout
   */
  async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      sendSuccess(res, null, 'Logout successful');
    } catch (error: any) {
      console.error('Logout error:', error);
      sendError(res, 'Logout failed', 500);
    }
  }
}

export default new AuthController();
