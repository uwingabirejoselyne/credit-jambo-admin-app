import { Admin, IAdmin } from '../models';
import { hashPassword, comparePassword } from '../utils/crypto';
import { generateToken } from '../utils/jwt';
import { AdminAuthDTO } from '../dtos';

/**
 * Auth Service - handles authentication logic
 */
export class AuthService {
  /**
   * Admin login
   */
  async login(email: string, password: string): Promise<AdminAuthDTO> {
    // Find admin with password field
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      throw new Error('Invalid email or password');
    }

    // Check if admin is active
    if (!admin.isActive) {
      throw new Error('Account is inactive. Please contact administrator.');
    }

    // Verify password
    const isPasswordValid = comparePassword(password, admin.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = generateToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    });

    return new AdminAuthDTO(admin, token);
  }

  /**
   * Create default admin if not exists
   */
  async createDefaultAdmin(
    email: string,
    password: string,
    name: string = 'Admin'
  ): Promise<IAdmin | null> {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return null;
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Create admin
    const admin = await Admin.create({
      email,
      password: hashedPassword,
      name,
      role: 'super_admin',
      isActive: true,
    });

    return admin;
  }

  /**
   * Get current admin profile
   */
  async getProfile(adminId: string): Promise<IAdmin | null> {
    return await Admin.findById(adminId);
  }
}

export default new AuthService();
