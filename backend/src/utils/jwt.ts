import jwt from 'jsonwebtoken';
import { env } from '../config/env';

/**
 * JWT Payload interface
 */
export interface JWTPayload {
  id: string;
  email: string;
  role?: string;
}

/**
 * Generate JWT token
 * @param payload - Token payload
 * @returns JWT token string
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Verify JWT token
 * @param token - JWT token string
 * @returns Decoded payload or null
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Decode JWT token without verification
 * @param token - JWT token string
 * @returns Decoded payload or null
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
};
