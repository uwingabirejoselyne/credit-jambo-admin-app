import { IAdmin } from '../models';

/**
 * Admin DTO - sanitized admin data for API responses
 */
export class AdminDTO {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;

  constructor(admin: IAdmin) {
    this.id = (admin.id as any).toString();
    this.email = admin.email;
    this.name = admin.name;
    this.role = admin.role;
    this.isActive = admin.isActive;
    this.lastLogin = admin.lastLogin?.toISOString();
    this.createdAt = admin.createdAt.toISOString();
  }
}

/**
 * Admin Auth Response DTO
 */
export class AdminAuthDTO {
  admin: AdminDTO;
  token: string;

  constructor(admin: IAdmin, token: string) {
    this.admin = new AdminDTO(admin);
    this.token = token;
  }
}
