import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';
import { Admin } from '../models';

/**
 * Extend Express Request to include admin
 */
export interface AuthRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Authentication middleware - verify JWT token
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No token provided. Authorization required.',
      });
      return;
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token.',
      });
      return;
    }

    // Check if admin exists and is active
    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.isActive) {
      res.status(401).json({
        success: false,
        message: 'Admin account not found or inactive.',
      });
      return;
    }

    // Attach admin to request
    req.admin = {
      id: String(admin._id),
      email: admin.email,
      role: admin.role,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
};

/**
 * Authorization middleware - check admin role
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    if (!roles.includes(req.admin.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions.',
      });
      return;
    }

    next();
  };
};
