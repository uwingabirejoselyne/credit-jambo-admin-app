import React, { useEffect, useState } from 'react';
import { Card, Table, Badge, Spinner, Input, Button, Modal } from '../components';
import { customerService, type PendingVerification, type Device } from '../services/customerService';
import showToast from '../utils/toast';

interface DeviceRequest {
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  device: Device;
}

const DeviceVerification: React.FC = () => {
  const [requests, setRequests] = useState<DeviceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DeviceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<DeviceRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'approve' | 'reject'>('approve');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm]);

  const fetchRequests = async () => {
    try {
      const pendingVerifications = await customerService.getPendingVerifications();

      // Flatten the data structure - each device becomes a separate request
      const deviceRequests: DeviceRequest[] = [];
      pendingVerifications.forEach(customer => {
        customer.pendingDevices.forEach(device => {
          deviceRequests.push({
            customerId: customer.id,
            customerName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            device: device
          });
        });
      });

      setRequests(deviceRequests);
      setFilteredRequests(deviceRequests);
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
          request.device.deviceId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const handleApprove = (request: DeviceRequest) => {
    setSelectedRequest(request);
    setModalAction('approve');
    setShowModal(true);
  };

  const handleReject = (request: DeviceRequest) => {
    setSelectedRequest(request);
    setModalAction('reject');
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedRequest) return;

    setIsProcessing(true);

    try {
      if (modalAction === 'approve') {
        await customerService.verifyDevice(selectedRequest.customerId, selectedRequest.device.deviceIdHash);
        showToast.success(`Device approved for ${selectedRequest.customerName}`);
      } else {
        await customerService.rejectDevice(selectedRequest.customerId, selectedRequest.device.deviceIdHash, 'Rejected by admin');
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

  const pendingCount = requests.length; // All requests from this API are pending

  const columns = [
    {
      header: 'Customer',
      accessor: (row: DeviceRequest) => (
        <div>
          <p className="font-semibold text-gray-900">{row.customerName}</p>
          <p className="text-sm text-gray-600">{row.email}</p>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessor: (row: DeviceRequest) => (
        <span className="text-gray-900">{row.phone}</span>
      ),
    },
    {
      header: 'Device ID',
      accessor: (row: DeviceRequest) => (
        <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded inline-block">
          {row.device.deviceId}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row: DeviceRequest) => (
        <Badge variant="warning" pill>
          Pending
        </Badge>
      ),
    },
    {
      header: 'Created At',
      accessor: (row: DeviceRequest) => (
        <span className="text-sm text-gray-600">{formatDate(row.device.createdAt)}</span>
      ),
    },
    {
      header: 'Last Login',
      accessor: (row: DeviceRequest) => (
        <span className="text-sm text-gray-600">
          {row.device.lastLoginAt ? formatDate(row.device.lastLoginAt) : 'Never'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: DeviceRequest) => (
        <div className="flex gap-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card padding="md" hover className="border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Verifications</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card padding="md" hover className="border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Unique Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(requests.map(r => r.customerId)).size}
              </p>
              <p className="text-xs text-gray-500 mt-1">With pending devices</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredRequests.length} of {requests.length} pending requests
        </div>
      </Card>

      {/* Requests Table */}
      <Card padding="none">
        <Table
          columns={columns}
          data={filteredRequests}
          keyExtractor={(row) => `${row.customerId}-${row.device.deviceIdHash}`}
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
                  <span className="text-sm text-gray-600">Phone:</span>
                  <p className="text-gray-900">{selectedRequest.phone}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Device ID:</span>
                  <p className="font-mono text-sm text-gray-900">{selectedRequest.device.deviceId}</p>
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
