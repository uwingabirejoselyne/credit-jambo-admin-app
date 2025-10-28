import mongoose, { Document, Schema } from 'mongoose';

/**
 * Device verification status
 */
export enum DeviceStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

/**
 * Device interface
 */
export interface IDevice {
  deviceId: string;
  deviceName?: string;
  status: DeviceStatus;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  rejectionReason?: string;
}

/**
 * User/Customer interface
 */
export interface IUser extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  balance: number;
  devices: IDevice[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Device Schema
 */
const DeviceSchema = new Schema<IDevice>(
  {
    deviceId: {
      type: String,
      required: [true, 'Device ID is required'],
      trim: true,
    },
    deviceName: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(DeviceStatus),
      default: DeviceStatus.PENDING,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    verifiedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

/**
 * User Schema
 */
const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative'],
    },
    devices: {
      type: [DeviceSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes
 */
UserSchema.index({ email: 1 });
UserSchema.index({ phoneNumber: 1 });
UserSchema.index({ 'devices.deviceId': 1 });
UserSchema.index({ 'devices.status': 1 });

/**
 * Check if user has a verified device
 */
UserSchema.methods.hasVerifiedDevice = function (deviceId?: string): boolean {
  if (deviceId) {
    return this.devices.some(
      (device: IDevice) => device.deviceId === deviceId && device.status === DeviceStatus.VERIFIED
    );
  }
  return this.devices.some((device: IDevice) => device.status === DeviceStatus.VERIFIED);
};

export default mongoose.model<IUser>('User', UserSchema);
