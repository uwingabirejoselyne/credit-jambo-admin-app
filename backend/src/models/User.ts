import mongoose, { Document, Schema } from 'mongoose';

/**
 * Device interface - must match client app schema
 */
export interface IDevice {
  deviceId: string;
  deviceIdHash: string;
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  lastLoginAt?: Date;
  createdAt: Date;
}

/**
 * Customer interface - must match client app schema
 */
export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  balance: number;
  lowBalanceThreshold: number;
  devices: IDevice[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  fullName?: string; // Virtual field
}

/**
 * Device Schema - matches client app
 */
const DeviceSchema = new Schema<IDevice>({
  deviceId: {
    type: String,
    required: true,
  },
  deviceIdHash: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: {
    type: Date,
  },
  verifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
  },
  lastLoginAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Customer Schema - matches client app
 */
const CustomerSchema = new Schema<ICustomer>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
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
    lowBalanceThreshold: {
      type: Number,
      default: 10000,
      min: [0, 'Threshold cannot be negative'],
    },
    devices: [DeviceSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete (ret as any).password;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

/**
 * Indexes for better query performance
 */
CustomerSchema.index({ email: 1 });
CustomerSchema.index({ phone: 1 });
CustomerSchema.index({ 'devices.deviceIdHash': 1 });

/**
 * Virtual for full name
 */
CustomerSchema.virtual('fullName').get(function (this: ICustomer) {
  return `${this.firstName} ${this.lastName}`;
});

/**
 * Method to check if device is verified
 */
CustomerSchema.methods.isDeviceVerified = function (deviceIdHash: string): boolean {
  const device = this.devices.find((d: IDevice) => d.deviceIdHash === deviceIdHash);
  return device ? device.isVerified : false;
};

// Export with explicit collection name 'customers' to match client app
export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema, 'customers');

// Also export as User for backward compatibility in admin app
export default Customer;

// Export interface as IUser for backward compatibility
export type IUser = ICustomer;
