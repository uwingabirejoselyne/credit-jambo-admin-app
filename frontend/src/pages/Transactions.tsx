import React, { useEffect, useState } from 'react';
import { Card, Table, Badge, Spinner, Input, Button } from '../components';
import { transactionService, type Transaction } from '../services/transactionService';
import showToast from '../utils/toast';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'deposit' | 'withdrawal'>('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, typeFilter]);

  const fetchTransactions = async () => {
    try {
      const response = await transactionService.getAll({ limit: 1000 });
      setTransactions(response.transactions);
      setFilteredTransactions(response.transactions);
    } catch (error: any) {
      showToast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          (transaction.userName && transaction.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (transaction.userEmail && transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((transaction) => transaction.type === typeFilter);
    }

    setFilteredTransactions(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalDeposits = transactions
    .filter((t) => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter((t) => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  const columns = [
    {
      header: 'Transaction ID',
      accessor: (row: Transaction) => (
        <span className="font-mono text-sm text-gray-900">{row.id.substring(0, 8)}...</span>
      ),
    },
    {
      header: 'Customer',
      accessor: (row: Transaction) => (
        <div>
          <p className="font-semibold text-gray-900">{row.userName || 'N/A'}</p>
          <p className="text-xs text-gray-500">{row.userEmail || `ID: ${row.userId}`}</p>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: (row: Transaction) => (
        <Badge
          variant={row.type === 'deposit' ? 'success' : 'warning'}
          icon={
            row.type === 'deposit' ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            )
          }
        >
          {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
        </Badge>
      ),
    },
    {
      header: 'Amount',
      accessor: (row: Transaction) => (
        <span className={`font-bold ${row.type === 'deposit' ? 'text-green-600' : 'text-orange-600'}`}>
          {row.type === 'deposit' ? '+' : '-'} {row.amount.toLocaleString()} RWF
        </span>
      ),
    },
    {
      header: 'Balance Before',
      accessor: (row: Transaction) => (
        <span className="text-gray-600">{row.balanceBefore.toLocaleString()} RWF</span>
      ),
    },
    {
      header: 'Balance After',
      accessor: (row: Transaction) => (
        <span className="font-semibold text-gray-900">{row.balanceAfter.toLocaleString()} RWF</span>
      ),
    },
    {
      header: 'Status',
      accessor: (row: Transaction) => (
        <Badge
          variant={
            row.status === 'completed'
              ? 'success'
              : row.status === 'pending'
              ? 'warning'
              : 'danger'
          }
          size="sm"
          pill
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
    },
    {
      header: 'Date & Time',
      accessor: (row: Transaction) => (
        <span className="text-sm text-gray-600">{formatDate(row.createdAt)}</span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="xl" text="Loading transactions..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
        <p className="text-gray-600">Monitor all customer transactions and balances</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="md" hover className="border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </Card>

        <Card padding="md" hover className="border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Deposits</p>
              <p className="text-2xl font-bold text-green-600">
                {totalDeposits.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {transactions.filter((t) => t.type === 'deposit').length} transactions
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
          </div>
        </Card>

        <Card padding="md" hover className="border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Withdrawals</p>
              <p className="text-2xl font-bold text-orange-600">
                {totalWithdrawals.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {transactions.filter((t) => t.type === 'withdrawal').length} transactions
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
          </div>
        </Card>

        <Card padding="md" hover className="border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Net Flow</p>
              <p className={`text-2xl font-bold ${totalDeposits > totalWithdrawals ? 'text-green-600' : 'text-red-600'}`}>
                {totalDeposits > totalWithdrawals ? '+' : ''}{(totalDeposits - totalWithdrawals).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">RWF</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search by transaction ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            <Button
              variant={typeFilter === 'all' ? 'primary' : 'secondary'}
              size="md"
              onClick={() => setTypeFilter('all')}
            >
              All
            </Button>
            <Button
              variant={typeFilter === 'deposit' ? 'success' : 'secondary'}
              size="md"
              onClick={() => setTypeFilter('deposit')}
            >
              Deposits
            </Button>
            <Button
              variant={typeFilter === 'withdrawal' ? 'warning' : 'secondary'}
              size="md"
              onClick={() => setTypeFilter('withdrawal')}
            >
              Withdrawals
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>
      </Card>

      {/* Transactions Table */}
      <Card padding="none">
        <Table
          columns={columns}
          data={filteredTransactions}
          keyExtractor={(row) => row.id}
          emptyMessage="No transactions found"
          hoverable
        />
      </Card>
    </div>
  );
};

export default Transactions;
