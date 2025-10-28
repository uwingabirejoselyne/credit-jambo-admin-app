import { Transaction, TransactionType, TransactionStatus } from '../models';
import { TransactionDTO, TransactionListDTO } from '../dtos';

/**
 * Transaction Service - handles transaction management logic
 */
export class TransactionService {
  /**
   * Get all transactions with pagination and filters
   */
  async getAllTransactions(
    page: number = 1,
    limit: number = 10,
    filters?: {
      type?: string;
      status?: string;
      userId?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (filters?.type) {
      query.type = filters.type;
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.userId) {
      query.user = filters.userId;
    }

    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.createdAt.$lte = filters.endDate;
      }
    }

    // Get transactions and total count
    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .populate('user', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(query),
    ]);

    return {
      transactions: transactions.map(transaction => new TransactionListDTO(transaction as any)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(transactionId: string): Promise<TransactionDTO> {
    const transaction = await Transaction.findById(transactionId)
      .populate('user', 'fullName email phoneNumber')
      .lean();

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return new TransactionDTO(transaction as any);
  }

  /**
   * Get transactions by user ID
   */
  async getTransactionsByUser(
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments({ user: userId }),
    ]);

    return {
      transactions: transactions.map(transaction => new TransactionDTO(transaction as any)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get transaction statistics
   */
  async getStatistics(startDate?: Date, endDate?: Date) {
    const matchStage: any = {};

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = startDate;
      if (endDate) matchStage.createdAt.$lte = endDate;
    }

    const stats = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      deposits: { total: 0, count: 0 },
      withdrawals: { total: 0, count: 0 },
    };

    stats.forEach(stat => {
      if (stat._id === TransactionType.DEPOSIT) {
        result.deposits = { total: stat.total, count: stat.count };
      } else if (stat._id === TransactionType.WITHDRAWAL) {
        result.withdrawals = { total: stat.total, count: stat.count };
      }
    });

    return result;
  }
}

export default new TransactionService();
