import { ITransaction } from '../models';

/**
 * Transaction DTO - sanitized transaction data for API responses
 */
export class TransactionDTO {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: string;
  description?: string;
  reference: string;
  createdAt: string;
  updatedAt: string;

  constructor(transaction: ITransaction & { user?: any }) {
    this.id = (transaction._id as any).toString();
    this.userId = transaction.user._id?.toString() || transaction.user.toString();

    // Include user details if populated
    if (transaction.user.fullName) {
      this.userName = transaction.user.fullName;
      this.userEmail = transaction.user.email;
    }

    this.type = transaction.type;
    this.amount = transaction.amount;
    this.balanceBefore = transaction.balanceBefore;
    this.balanceAfter = transaction.balanceAfter;
    this.status = transaction.status;
    this.description = transaction.description;
    this.reference = transaction.reference;
    this.createdAt = transaction.createdAt.toISOString();
    this.updatedAt = transaction.updatedAt.toISOString();
  }
}

/**
 * Transaction List DTO - minimal transaction data for list views
 */
export class TransactionListDTO {
  id: string;
  userId: string;
  userName: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;

  constructor(transaction: ITransaction & { user?: any }) {
    this.id = (transaction._id as any).toString();
    this.userId = transaction.user._id?.toString() || transaction.user.toString();
    this.userName = transaction.user.fullName || 'Unknown';
    this.type = transaction.type;
    this.amount = transaction.amount;
    this.status = transaction.status;
    this.createdAt = transaction.createdAt.toISOString();
  }
}
