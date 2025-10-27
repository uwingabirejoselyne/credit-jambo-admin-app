import crypto from 'crypto';

/**
 * Hash password using SHA-512
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = (password: string): string => {
  return crypto.createHash('sha512').update(password).digest('hex');
};

/**
 * Compare password with hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password to compare against
 * @returns True if passwords match
 */
export const comparePassword = (password: string, hashedPassword: string): boolean => {
  const hash = hashPassword(password);
  return hash === hashedPassword;
};

/**
 * Generate a random token
 * @param length - Length of the token (default: 32)
 * @returns Random hex token
 */
export const generateToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};
