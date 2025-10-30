import api from './api';
import type { PaginationData } from './customerService';

export interface Transaction {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionListItem {
  userEmail: any;
  id: string;
  userId: string;
  userName: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: string;
  createdAt: string;
}

export interface TransactionsResponse {
  transactions: TransactionListItem[];
  pagination: PaginationData;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: 'deposit' | 'withdrawal';
  status?: 'pending' | 'completed' | 'failed';
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface TransactionStats {
  deposits: {
    total: number;
    count: number;
  };
  withdrawals: {
    total: number;
    count: number;
  };
}

export const transactionService = {
  /**
   * Get all transactions with filters
   */
  async getAll(filters?: TransactionFilters): Promise<TransactionsResponse> {
    const response = await api.get('/transactions', { params: filters });
    return response.data.data;
  },

  /**
   * Get transaction by ID
   */
  async getById(id: string): Promise<Transaction> {
    const response = await api.get(`/transactions/${id}`);
    return response.data.data;
  },

  /**
   * Get transactions by user ID
   */
  async getByUser(userId: string, page: number = 1, limit: number = 10): Promise<TransactionsResponse> {
    const response = await api.get(`/transactions/user/${userId}`, {
      params: { page, limit }
    });
    return response.data.data;
  },

  /**
   * Get transaction statistics
   */
  async getStats(startDate?: string, endDate?: string): Promise<TransactionStats> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get('/transactions/stats', { params });
    return response.data.data;
  },
};
