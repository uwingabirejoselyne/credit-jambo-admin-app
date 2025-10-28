import api from './api';

export interface Device {
  deviceId: string;
  deviceIdHash: string;
  isVerified: boolean;
  verifiedAt?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  balance: number;
  lowBalanceThreshold: number;
  devices: Device[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerListItem {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  balance: number;
  hasVerifiedDevice: boolean;
  pendingDevices: number;
  isActive: boolean;
  createdAt: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CustomersResponse {
  customers: CustomerListItem[];
  pagination: PaginationData;
}

export interface PendingVerification {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  pendingDevices: Device[];
  createdAt: string;
}

export const customerService = {
  /**
   * Get all customers with pagination
   */
  async getAll(page: number = 1, limit: number = 10, search?: string): Promise<CustomersResponse> {
    const params: any = { page, limit };
    if (search) params.search = search;

    const response = await api.get('/customers', { params });
    return response.data.data;
  },

  /**
   * Get customer by ID
   */
  async getById(id: string): Promise<Customer> {
    const response = await api.get(`/customers/${id}`);
    return response.data.data;
  },

  /**
   * Get pending device verifications
   */
  async getPendingVerifications(): Promise<PendingVerification[]> {
    const response = await api.get('/customers/pending-verifications');
    return response.data.data;
  },

  /**
   * Verify customer device
   */
  async verifyDevice(customerId: string, deviceIdHash: string): Promise<Customer> {
    const response = await api.post(`/customers/${customerId}/verify-device`, { deviceIdHash });
    return response.data.data;
  },

  /**
   * Reject customer device
   */
  async rejectDevice(customerId: string, deviceIdHash: string, reason?: string): Promise<Customer> {
    const response = await api.post(`/customers/${customerId}/reject-device`, {
      deviceIdHash,
      reason
    });
    return response.data.data;
  },

  /**
   * Toggle customer status
   */
  async toggleStatus(customerId: string): Promise<Customer> {
    const response = await api.patch(`/customers/${customerId}/toggle-status`);
    return response.data.data;
  },
};
