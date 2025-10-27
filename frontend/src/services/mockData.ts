// Mock data for development - will be replaced with real API calls

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  status: 'active' | 'inactive' | 'suspended';
  deviceId: string;
  deviceVerified: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface DeviceVerificationRequest {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  deviceId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
}

export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  totalBalance: number;
  todayTransactions: number;
  pendingVerifications: number;
  totalDeposits: number;
  totalWithdrawals: number;
}

// Mock customers data
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+250788123456',
    balance: 150000,
    status: 'active',
    deviceId: 'device-001-abc',
    deviceVerified: true,
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-10-26T08:15:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+250788234567',
    balance: 75000,
    status: 'active',
    deviceId: 'device-002-def',
    deviceVerified: true,
    createdAt: '2024-02-20T14:20:00Z',
    lastLogin: '2024-10-25T16:45:00Z',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    phone: '+250788345678',
    balance: 250000,
    status: 'active',
    deviceId: 'device-003-ghi',
    deviceVerified: true,
    createdAt: '2024-03-10T09:00:00Z',
    lastLogin: '2024-10-26T12:30:00Z',
  },
  {
    id: '4',
    name: 'Mary Williams',
    email: 'mary.w@example.com',
    phone: '+250788456789',
    balance: 50000,
    status: 'inactive',
    deviceId: 'device-004-jkl',
    deviceVerified: false,
    createdAt: '2024-04-05T11:15:00Z',
    lastLogin: '2024-10-20T10:00:00Z',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.b@example.com',
    phone: '+250788567890',
    balance: 180000,
    status: 'active',
    deviceId: 'device-005-mno',
    deviceVerified: true,
    createdAt: '2024-05-12T15:45:00Z',
    lastLogin: '2024-10-26T07:20:00Z',
  },
];

// Mock transactions data
export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    customerId: '1',
    customerName: 'John Doe',
    type: 'deposit',
    amount: 50000,
    balanceBefore: 100000,
    balanceAfter: 150000,
    timestamp: '2024-10-26T08:30:00Z',
    status: 'completed',
  },
  {
    id: 'txn-002',
    customerId: '2',
    customerName: 'Jane Smith',
    type: 'withdrawal',
    amount: 25000,
    balanceBefore: 100000,
    balanceAfter: 75000,
    timestamp: '2024-10-26T09:15:00Z',
    status: 'completed',
  },
  {
    id: 'txn-003',
    customerId: '3',
    customerName: 'Robert Johnson',
    type: 'deposit',
    amount: 100000,
    balanceBefore: 150000,
    balanceAfter: 250000,
    timestamp: '2024-10-26T10:45:00Z',
    status: 'completed',
  },
  {
    id: 'txn-004',
    customerId: '5',
    customerName: 'David Brown',
    type: 'deposit',
    amount: 80000,
    balanceBefore: 100000,
    balanceAfter: 180000,
    timestamp: '2024-10-26T11:20:00Z',
    status: 'completed',
  },
  {
    id: 'txn-005',
    customerId: '1',
    customerName: 'John Doe',
    type: 'withdrawal',
    amount: 20000,
    balanceBefore: 170000,
    balanceAfter: 150000,
    timestamp: '2024-10-25T14:30:00Z',
    status: 'completed',
  },
];

// Mock device verification requests
export const mockDeviceRequests: DeviceVerificationRequest[] = [
  {
    id: 'req-001',
    customerId: '6',
    customerName: 'Sarah Miller',
    email: 'sarah.m@example.com',
    deviceId: 'device-006-pqr',
    status: 'pending',
    requestedAt: '2024-10-26T13:45:00Z',
  },
  {
    id: 'req-002',
    customerId: '7',
    customerName: 'Michael Davis',
    email: 'michael.d@example.com',
    deviceId: 'device-007-stu',
    status: 'pending',
    requestedAt: '2024-10-26T14:20:00Z',
  },
  {
    id: 'req-003',
    customerId: '8',
    customerName: 'Emily Wilson',
    email: 'emily.w@example.com',
    deviceId: 'device-008-vwx',
    status: 'pending',
    requestedAt: '2024-10-26T15:00:00Z',
  },
];

// Mock dashboard stats
export const mockDashboardStats: DashboardStats = {
  totalCustomers: 8,
  activeCustomers: 5,
  totalBalance: 705000,
  todayTransactions: 4,
  pendingVerifications: 3,
  totalDeposits: 230000,
  totalWithdrawals: 45000,
};

// Helper function to simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
  // Auth
  login: async (email: string, password: string) => {
    await delay();
    if (email === 'admin@creditjambo.com' && password === 'admin123') {
      return {
        success: true,
        data: {
          admin: {
            id: 'admin-001',
            email: 'admin@creditjambo.com',
            name: 'Admin User',
            role: 'super_admin',
          },
          token: 'mock-jwt-token-' + Date.now(),
        },
      };
    }
    throw new Error('Invalid credentials');
  },

  // Customers
  getCustomers: async () => {
    await delay();
    return { success: true, data: mockCustomers };
  },

  getCustomerById: async (id: string) => {
    await delay();
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) throw new Error('Customer not found');
    return { success: true, data: customer };
  },

  // Transactions
  getTransactions: async () => {
    await delay();
    return { success: true, data: mockTransactions };
  },

  getTransactionsByCustomer: async (customerId: string) => {
    await delay();
    const transactions = mockTransactions.filter(t => t.customerId === customerId);
    return { success: true, data: transactions };
  },

  // Device Verifications
  getDeviceRequests: async () => {
    await delay();
    return { success: true, data: mockDeviceRequests };
  },

  approveDevice: async (requestId: string) => {
    await delay();
    const request = mockDeviceRequests.find(r => r.id === requestId);
    if (!request) throw new Error('Request not found');
    request.status = 'approved';
    return { success: true, message: 'Device approved successfully' };
  },

  rejectDevice: async (requestId: string) => {
    await delay();
    const request = mockDeviceRequests.find(r => r.id === requestId);
    if (!request) throw new Error('Request not found');
    request.status = 'rejected';
    return { success: true, message: 'Device rejected successfully' };
  },

  // Dashboard
  getDashboardStats: async () => {
    await delay();
    return { success: true, data: mockDashboardStats };
  },
};
