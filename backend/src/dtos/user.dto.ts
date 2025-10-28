import { IUser, IDevice } from '../models';

/**
 * Device DTO - sanitized device data for API responses
 */
export class DeviceDTO {
  deviceId: string;
  deviceName?: string;
  status: string;
  verifiedAt?: string;
  rejectionReason?: string;

  constructor(device: IDevice) {
    this.deviceId = device.deviceId;
    this.deviceName = device.deviceName;
    this.status = device.status;
    this.verifiedAt = device.verifiedAt?.toISOString();
    this.rejectionReason = device.rejectionReason;
  }
}

/**
 * User DTO - sanitized user data for API responses
 */
export class UserDTO {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  balance: number;
  devices: DeviceDTO[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  constructor(user: IUser) {
    this.id = user._id.toString();
    this.fullName = user.fullName;
    this.email = user.email;
    this.phoneNumber = user.phoneNumber;
    this.balance = user.balance;
    this.devices = user.devices.map(device => new DeviceDTO(device));
    this.isActive = user.isActive;
    this.createdAt = user.createdAt.toISOString();
    this.updatedAt = user.updatedAt.toISOString();
  }
}

/**
 * User List DTO - minimal user data for list views
 */
export class UserListDTO {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  balance: number;
  hasVerifiedDevice: boolean;
  pendingDevices: number;
  isActive: boolean;
  createdAt: string;

  constructor(user: IUser) {
    this.id = user._id.toString();
    this.fullName = user.fullName;
    this.email = user.email;
    this.phoneNumber = user.phoneNumber;
    this.balance = user.balance;
    this.hasVerifiedDevice = user.devices.some(d => d.status === 'verified');
    this.pendingDevices = user.devices.filter(d => d.status === 'pending').length;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt.toISOString();
  }
}
