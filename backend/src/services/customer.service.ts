import { User, DeviceStatus } from '../models';
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
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
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
      'devices.status': DeviceStatus.PENDING,
    }).sort({ createdAt: -1 });

    return customers.map(customer => ({
      id: customer._id.toString(),
      fullName: customer.fullName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      pendingDevices: customer.devices.filter(d => d.status === DeviceStatus.PENDING),
      createdAt: customer.createdAt.toISOString(),
    }));
  }

  /**
   * Verify customer device
   */
  async verifyDevice(
    customerId: string,
    deviceId: string,
    adminId: string
  ): Promise<UserDTO> {
    const customer = await User.findById(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const device = customer.devices.find(d => d.deviceId === deviceId);

    if (!device) {
      throw new Error('Device not found');
    }

    if (device.status !== DeviceStatus.PENDING) {
      throw new Error('Device is not pending verification');
    }

    // Update device status
    device.status = DeviceStatus.VERIFIED;
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
    deviceId: string,
    adminId: string,
    reason?: string
  ): Promise<UserDTO> {
    const customer = await User.findById(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const device = customer.devices.find(d => d.deviceId === deviceId);

    if (!device) {
      throw new Error('Device not found');
    }

    if (device.status !== DeviceStatus.PENDING) {
      throw new Error('Device is not pending verification');
    }

    // Update device status
    device.status = DeviceStatus.REJECTED;
    device.verifiedBy = adminId as any;
    device.verifiedAt = new Date();
    device.rejectionReason = reason || 'No reason provided';

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
