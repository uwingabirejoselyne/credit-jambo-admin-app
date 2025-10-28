import { User } from '../models';
import { UserDTO, UserListDTO } from '../dtos';

/**
 * Customer Service - handles customer management logic
 */
export class CustomerService {
  /**
   * Get all customers with pagination
   */
  async getAllCustomers(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    // Build search query
    const query: any = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Get customers and total count
    const [customers, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    return {
      customers: customers.map(customer => new UserListDTO(customer as any)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(customerId: string): Promise<UserDTO> {
    const customer = await User.findById(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    return new UserDTO(customer);
  }

  /**
   * Get customers with pending device verifications
   */
  async getPendingVerifications() {
    const customers = await User.find({
      'devices.isVerified': false,
    }).sort({ createdAt: -1 });

    return customers.map(customer => ({
      id: (customer._id as any).toString(),
      firstName: customer.firstName,
      lastName: customer.lastName,
      fullName: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      phone: customer.phone,
      pendingDevices: customer.devices.filter(d => !d.isVerified).map(device => ({
        deviceId: device.deviceId,
        deviceIdHash: device.deviceIdHash,
        isVerified: device.isVerified,
        createdAt: device.createdAt.toISOString(),
        lastLoginAt: device.lastLoginAt?.toISOString(),
      })),
      createdAt: customer.createdAt.toISOString(),
    }));
  }

  /**
   * Verify customer device by deviceIdHash
   */
  async verifyDevice(
    customerId: string,
    deviceIdHash: string,
    adminId: string
  ): Promise<UserDTO> {
    const customer = await User.findById(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const device = customer.devices.find(d => d.deviceIdHash === deviceIdHash);

    if (!device) {
      throw new Error('Device not found');
    }

    if (device.isVerified) {
      throw new Error('Device is already verified');
    }

    // Update device verification
    device.isVerified = true;
    device.verifiedBy = adminId as any;
    device.verifiedAt = new Date();

    await customer.save();

    return new UserDTO(customer);
  }

  /**
   * Reject customer device
   */
  async rejectDevice(
    customerId: string,
    deviceIdHash: string,
    adminId: string,
    reason?: string
  ): Promise<UserDTO> {
    const customer = await User.findById(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const device = customer.devices.find(d => d.deviceIdHash === deviceIdHash);

    if (!device) {
      throw new Error('Device not found');
    }

    // Mark device as rejected (not verified) and record who rejected it
    device.isVerified = false;
    device.verifiedBy = adminId as any;
    device.verifiedAt = new Date();

    await customer.save();

    return new UserDTO(customer);
  }

  /**
   * Toggle customer active status
   */
  async toggleCustomerStatus(customerId: string): Promise<UserDTO> {
    const customer = await User.findById(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    customer.isActive = !customer.isActive;
    await customer.save();

    return new UserDTO(customer);
  }
}

export default new CustomerService();
