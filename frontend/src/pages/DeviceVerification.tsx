import React, { useEffect, useState } from 'react';
import { Card, Table, Badge, Spinner, Input, Button, Modal } from '../components';
import { mockApi, DeviceVerificationRequest } from '../services/mockData';
import showToast from '../utils/toast';

const DeviceVerification: React.FC = () => {
  const [requests, setRequests] = useState<DeviceVerificationRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DeviceVerificationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedRequest, setSelectedRequest] = useState<DeviceVerificationRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'approve' | 'reject'>('approve');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

  const fetchRequests = async () => {
    try {
      const response = await mockApi.getDeviceRequests();
      setRequests(response.data);
      setFilteredRequests(response.data);
    } catch (error: any) {
      showToast.error('Failed to load device verification requests');
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...requests];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.deviceId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  };

  const handleApprove = (request: DeviceVerificationRequest) => {
    setSelectedRequest(request);
    setModalAction('approve');
    setShowModal(true);
  };

  const handleReject = (request: DeviceVerificationRequest) => {
    setSelectedRequest(request);
    setModalAction('reject');
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedRequest) return;

    setIsProcessing(true);

    try {
      if (modalAction === 'approve') {
        await mockApi.approveDevice(selectedRequest.id);
        showToast.success(`Device approved for ${selectedRequest.customerName}`);
      } else {
        await mockApi.rejectDevice(selectedRequest.id);
        showToast.error(`Device rejected for ${selectedRequest.customerName}`);
      }

      // Refresh the list
      await fetchRequests();
      setShowModal(false);
      setSelectedRequest(null);
    } catch (error: any) {
      showToast.error(error.message || 'Failed to process request');
    } finally {
      setIsProcessing(false);
    }
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

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  const columns = [
    {
      header: 'Customer',
      accessor: (row: DeviceVerificationRequest) => (
        <div>
          <p className="font-semibold text-gray-900">{row.customerName}</p>
          <p className="text-sm text-gray-600">{row.email}</p>
        </div>
      ),
    },
    {
      header: 'Customer ID',
      accessor: (row: DeviceVerificationRequest) => (
        <span className="font-mono text-sm text-gray-900">{row.customerId}</span>
      ),
    },
    {
      header: 'Device ID',
      accessor: (row: DeviceVerificationRequest) => (
        <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded inline-block">
          {row.deviceId}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row: DeviceVerificationRequest) => (
        <Badge
          variant={
            row.status === 'approved'
              ? 'success'
              : row.status === 'pending'
              ? 'warning'
              : 'danger'
          }
          pill
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
    },
    {
      header: 'Requested At',
      accessor: (row: DeviceVerificationRequest) => (
        <span className="text-sm text-gray-600">{formatDate(row.requestedAt)}</span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: DeviceVerificationRequest) => (
        <div className="flex gap-2">
          {row.status === 'pending' ? (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={() => handleApprove(row)}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleReject(row)}
              >
                Reject
              </Button>
            </>
          ) : (
            <span className="text-sm text-gray-500">
              {row.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
            </span>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="xl" text="Loading device verification requests..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Device Verification</h1>
        <p className="text-gray-600">Manage customer device verification requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="md" hover className="border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card padding="md" hover className="border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card padding="md" hover className="border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card padding="md" hover className="border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Alert for pending requests */}
      {pendingCount > 0 && (
        <Card padding="md" className="bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-semibold text-yellow-800">
                {pendingCount} device verification {pendingCount === 1 ? 'request' : 'requests'} pending
              </p>
              <p className="text-sm text-yellow-700">
                Please review and approve or reject device verification requests.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search by customer name, email, or device ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'primary' : 'secondary'}
              size="md"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'warning' : 'secondary'}
              size="md"
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === 'approved' ? 'success' : 'secondary'}
              size="md"
              onClick={() => setStatusFilter('approved')}
            >
              Approved
            </Button>
            <Button
              variant={statusFilter === 'rejected' ? 'danger' : 'secondary'}
              size="md"
              onClick={() => setStatusFilter('rejected')}
            >
              Rejected
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredRequests.length} of {requests.length} requests
        </div>
      </Card>

      {/* Requests Table */}
      <Card padding="none">
        <Table
          columns={columns}
          data={filteredRequests}
          keyExtractor={(row) => row.id}
          emptyMessage="No device verification requests found"
          hoverable
        />
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => !isProcessing && setShowModal(false)}
        title={modalAction === 'approve' ? 'Approve Device' : 'Reject Device'}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant={modalAction === 'approve' ? 'success' : 'danger'}
              onClick={confirmAction}
              isLoading={isProcessing}
            >
              {modalAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </>
        }
      >
        {selectedRequest && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to <strong>{modalAction}</strong> the device verification request for:
            </p>
            <Card variant="bordered" padding="md">
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Customer:</span>
                  <p className="font-semibold text-gray-900">{selectedRequest.customerName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="text-gray-900">{selectedRequest.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Device ID:</span>
                  <p className="font-mono text-sm text-gray-900">{selectedRequest.deviceId}</p>
                </div>
              </div>
            </Card>
            {modalAction === 'approve' ? (
              <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                ✓ The customer will be able to log in with this device.
              </p>
            ) : (
              <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                ✗ The customer will NOT be able to log in with this device.
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DeviceVerification;
