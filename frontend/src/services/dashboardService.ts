import api from './api';

export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  totalBalance: number;
  todayTransactions: number;
  pendingVerifications: number;
  totalDeposits: number;
  totalWithdrawals: number;
  netFlow: number;
  depositCount: number;
  withdrawalCount: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  amount: number;
  transactionType: string;
  createdAt: string;
}

export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    const response = await api.get('/dashboard/stats');
    return response.data.data;
  },

  /**
   * Get recent activities
   */
  async getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
    const response = await api.get('/dashboard/recent-activities', {
      params: { limit }
    });
    return response.data.data;
  },
};
