import { User, Transaction, TransactionType } from '../models';

/**
 * Dashboard Service - handles dashboard statistics
 */
export class DashboardService {
  /**
   * Get dashboard statistics
   */
  async getStatistics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all statistics in parallel
    const [
      totalCustomers,
      activeCustomers,
      totalBalanceResult,
      todayTransactions,
      pendingVerifications,
      depositStats,
      withdrawalStats,
    ] = await Promise.all([
      // Total customers
      User.countDocuments(),

      // Active customers (with verified devices)
      User.countDocuments({
        'devices.isVerified': true,
        isActive: true,
      }),

      // Total balance across all customers
      User.aggregate([
        {
          $group: {
            _id: null,
            totalBalance: { $sum: '$balance' },
          },
        },
      ]),

      // Today's transactions count
      Transaction.countDocuments({
        createdAt: { $gte: today },
      }),

      // Pending device verifications
      User.aggregate([
        {
          $match: {
            'devices.isVerified': false,
          },
        },
        {
          $project: {
            pendingCount: {
              $size: {
                $filter: {
                  input: '$devices',
                  as: 'device',
                  cond: { $eq: ['$$device.isVerified', false] },
                },
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$pendingCount' },
          },
        },
      ]),

      // Total deposits
      Transaction.aggregate([
        {
          $match: {
            type: TransactionType.DEPOSIT,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),

      // Total withdrawals
      Transaction.aggregate([
        {
          $match: {
            type: TransactionType.WITHDRAWAL,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const totalBalance = totalBalanceResult[0]?.totalBalance || 0;
    const totalDeposits = depositStats[0]?.total || 0;
    const totalWithdrawals = withdrawalStats[0]?.total || 0;
    const pendingVerificationsCount = pendingVerifications[0]?.total || 0;

    return {
      totalCustomers,
      activeCustomers,
      totalBalance,
      todayTransactions,
      pendingVerifications: pendingVerificationsCount,
      totalDeposits,
      totalWithdrawals,
      netFlow: totalDeposits - totalWithdrawals,
      depositCount: depositStats[0]?.count || 0,
      withdrawalCount: withdrawalStats[0]?.count || 0,
    };
  }

  /**
   * Get recent activities
   */
  async getRecentActivities(limit: number = 10) {
    const recentTransactions = await Transaction.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return recentTransactions.map(transaction => ({
      id: (transaction._id as any).toString(),
      type: 'transaction',
      description: `${transaction.type} of ${transaction.amount} RWF by ${
        (transaction.user as any).firstName
      } ${(transaction.user as any).lastName}`,
      amount: transaction.amount,
      transactionType: transaction.type,
      createdAt: transaction.createdAt.toISOString(),
    }));
  }
}

export default new DashboardService();
