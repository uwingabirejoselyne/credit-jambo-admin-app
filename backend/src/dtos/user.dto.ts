import { ICustomer, IDevice } from '../models';

/**
 * Device DTO - sanitized device data for API responses
 */
export class DeviceDTO {
  deviceId: string;
  deviceIdHash: string;
  isVerified: boolean;
  verifiedAt?: string;
  lastLoginAt?: string;
  createdAt: string;

  constructor(device: IDevice) {
    this.deviceId = device.deviceId;
    this.deviceIdHash = device.deviceIdHash;
    this.isVerified = device.isVerified;
    this.verifiedAt = device.verifiedAt?.toISOString();
    this.lastLoginAt = device.lastLoginAt?.toISOString();
    this.createdAt = device.createdAt.toISOString();
  }
}

/**
 * Customer/User DTO - sanitized customer data for API responses
 */
export class UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  balance: number;
  lowBalanceThreshold: number;
  devices: DeviceDTO[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;

  constructor(customer: ICustomer) {
    this.id = (customer._id as any).toString();
    this.firstName = customer.firstName;
    this.lastName = customer.lastName;
    this.fullName = `${customer.firstName} ${customer.lastName}`;
    this.email = customer.email;
    this.phone = customer.phone;
    this.balance = customer.balance;
    this.lowBalanceThreshold = customer.lowBalanceThreshold;
    this.devices = customer.devices.map(device => new DeviceDTO(device));
    this.isActive = customer.isActive;
    this.lastLoginAt = customer.lastLoginAt?.toISOString();
    this.createdAt = customer.createdAt.toISOString();
    this.updatedAt = customer.updatedAt.toISOString();
  }
}

/**
 * Customer List DTO - minimal customer data for list views
 */
export class UserListDTO {
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

  constructor(customer: ICustomer) {
    this.id = (customer._id as any).toString();
    this.firstName = customer.firstName;
    this.lastName = customer.lastName;
    this.fullName = `${customer.firstName} ${customer.lastName}`;
    this.email = customer.email;
    this.phone = customer.phone;
    this.balance = customer.balance;
    this.hasVerifiedDevice = customer.devices.some(d => d.isVerified === true);
    this.pendingDevices = customer.devices.filter(d => d.isVerified === false).length;
    this.isActive = customer.isActive;
    this.createdAt = customer.createdAt.toISOString();
  }
}
