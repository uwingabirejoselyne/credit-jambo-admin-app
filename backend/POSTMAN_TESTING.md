# Postman Testing Guide - Credit Jambo Admin API

This guide provides step-by-step instructions for testing the Admin API using Postman.

## Base URL
```
http://localhost:5001/api
```

---

## 1. Health Check (No Auth Required)

### Request
```
GET http://localhost:5001/api/health
```

### Expected Response
```json
{
  "success": true,
  "message": "Credit Jambo Admin API is running",
  "timestamp": "2025-10-28T12:00:00.000Z",
  "environment": "development"
}
```

---

## 2. Admin Login

### Request
```
POST http://localhost:5001/api/auth/login
Content-Type: application/json
```

### Body (raw JSON)
```json
{
  "email": "admin@creditjambo.com",
  "password": "Admin@123"
}
```

### Expected Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "id": "67210a3c5f8e9a001234abcd",
      "email": "admin@creditjambo.com",
      "name": "System Administrator",
      "role": "super_admin",
      "isActive": true,
      "createdAt": "2025-10-28T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjEw..."
  }
}
```

**Important:** Copy the `token` value from the response. You'll need it for all subsequent requests.

---

## 3. Set Up Authorization Header

For all requests below, add this header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

**In Postman:**
1. Go to the **Headers** tab
2. Add a new header:
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (paste your token after "Bearer ")

**OR use Postman's Authorization tab:**
1. Select **Authorization** tab
2. Type: **Bearer Token**
3. Token: Paste your token

---

## 4. Get Admin Profile

### Request
```
GET http://localhost:5001/api/auth/profile
Authorization: Bearer YOUR_TOKEN
```

### Expected Response
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "67210a3c5f8e9a001234abcd",
    "email": "admin@creditjambo.com",
    "name": "System Administrator",
    "role": "super_admin",
    "isActive": true,
    "createdAt": "2025-10-28T10:00:00.000Z"
  }
}
```

---

## 5. Get Dashboard Statistics

### Request
```
GET http://localhost:5001/api/dashboard/stats
Authorization: Bearer YOUR_TOKEN
```

### Expected Response
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalCustomers": 0,
    "activeCustomers": 0,
    "totalBalance": 0,
    "todayTransactions": 0,
    "pendingVerifications": 0,
    "totalDeposits": 0,
    "totalWithdrawals": 0,
    "netFlow": 0,
    "depositCount": 0,
    "withdrawalCount": 0
  }
}
```

---

## 6. Get All Customers (with Pagination)

### Request
```
GET http://localhost:5001/api/customers?page=1&limit=10
Authorization: Bearer YOUR_TOKEN
```

### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name, email, or phone

### Example with Search
```
GET http://localhost:5001/api/customers?page=1&limit=10&search=john
```

### Expected Response
```json
{
  "success": true,
  "message": "Customers retrieved successfully",
  "data": {
    "customers": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "pages": 0
    }
  }
}
```

---

## 7. Get Customer by ID

### Request
```
GET http://localhost:5001/api/customers/67210a3c5f8e9a001234abcd
Authorization: Bearer YOUR_TOKEN
```

Replace `67210a3c5f8e9a001234abcd` with actual customer ID.

### Expected Response
```json
{
  "success": true,
  "message": "Customer retrieved successfully",
  "data": {
    "id": "67210a3c5f8e9a001234abcd",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+250788123456",
    "balance": 50000,
    "devices": [
      {
        "deviceId": "device-123-abc",
        "deviceName": "Samsung Galaxy S21",
        "status": "pending",
        "verifiedAt": null,
        "rejectionReason": null
      }
    ],
    "isActive": true,
    "createdAt": "2025-10-28T10:00:00.000Z",
    "updatedAt": "2025-10-28T10:00:00.000Z"
  }
}
```

---

## 8. Get Pending Device Verifications

### Request
```
GET http://localhost:5001/api/customers/pending-verifications
Authorization: Bearer YOUR_TOKEN
```

### Expected Response
```json
{
  "success": true,
  "message": "Pending verifications retrieved successfully",
  "data": [
    {
      "id": "67210a3c5f8e9a001234abcd",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+250788123456",
      "pendingDevices": [
        {
          "deviceId": "device-123-abc",
          "deviceName": "Samsung Galaxy S21",
          "status": "pending"
        }
      ],
      "createdAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

---

## 9. Verify Customer Device

### Request
```
POST http://localhost:5001/api/customers/67210a3c5f8e9a001234abcd/verify-device
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

### Body (raw JSON)
```json
{
  "deviceId": "device-123-abc"
}
```

### Expected Response
```json
{
  "success": true,
  "message": "Device verified successfully",
  "data": {
    "id": "67210a3c5f8e9a001234abcd",
    "fullName": "John Doe",
    "email": "john@example.com",
    "devices": [
      {
        "deviceId": "device-123-abc",
        "deviceName": "Samsung Galaxy S21",
        "status": "verified",
        "verifiedAt": "2025-10-28T12:00:00.000Z"
      }
    ]
  }
}
```

---

## 10. Reject Customer Device

### Request
```
POST http://localhost:5001/api/customers/67210a3c5f8e9a001234abcd/reject-device
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

### Body (raw JSON)
```json
{
  "deviceId": "device-123-abc",
  "reason": "Suspicious device activity detected"
}
```

### Expected Response
```json
{
  "success": true,
  "message": "Device rejected successfully",
  "data": {
    "id": "67210a3c5f8e9a001234abcd",
    "fullName": "John Doe",
    "devices": [
      {
        "deviceId": "device-123-abc",
        "status": "rejected",
        "rejectionReason": "Suspicious device activity detected",
        "verifiedAt": "2025-10-28T12:00:00.000Z"
      }
    ]
  }
}
```

---

## 11. Toggle Customer Status

### Request
```
PATCH http://localhost:5001/api/customers/67210a3c5f8e9a001234abcd/toggle-status
Authorization: Bearer YOUR_TOKEN
```

### Expected Response
```json
{
  "success": true,
  "message": "Customer status updated successfully",
  "data": {
    "id": "67210a3c5f8e9a001234abcd",
    "fullName": "John Doe",
    "isActive": false
  }
}
```

---

## 12. Get All Transactions

### Request
```
GET http://localhost:5001/api/transactions?page=1&limit=10
Authorization: Bearer YOUR_TOKEN
```

### Query Parameters
- `page` (optional): Page number
- `limit` (optional): Items per page
- `type` (optional): `deposit` or `withdrawal`
- `status` (optional): `pending`, `completed`, `failed`
- `userId` (optional): Filter by user ID
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

### Example with Filters
```
GET http://localhost:5001/api/transactions?page=1&limit=10&type=deposit&status=completed
```

### Expected Response
```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "data": {
    "transactions": [
      {
        "id": "67210b1c5f8e9a001234def0",
        "userId": "67210a3c5f8e9a001234abcd",
        "userName": "John Doe",
        "type": "deposit",
        "amount": 10000,
        "status": "completed",
        "createdAt": "2025-10-28T11:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

---

## 13. Get Transaction by ID

### Request
```
GET http://localhost:5001/api/transactions/67210b1c5f8e9a001234def0
Authorization: Bearer YOUR_TOKEN
```

### Expected Response
```json
{
  "success": true,
  "message": "Transaction retrieved successfully",
  "data": {
    "id": "67210b1c5f8e9a001234def0",
    "userId": "67210a3c5f8e9a001234abcd",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "type": "deposit",
    "amount": 10000,
    "balanceBefore": 40000,
    "balanceAfter": 50000,
    "status": "completed",
    "description": "Mobile money deposit",
    "reference": "TXN-20251028-1234567890",
    "createdAt": "2025-10-28T11:00:00.000Z",
    "updatedAt": "2025-10-28T11:00:00.000Z"
  }
}
```

---

## 14. Get User Transactions

### Request
```
GET http://localhost:5001/api/transactions/user/67210a3c5f8e9a001234abcd?page=1&limit=10
Authorization: Bearer YOUR_TOKEN
```

### Expected Response
```json
{
  "success": true,
  "message": "User transactions retrieved successfully",
  "data": {
    "transactions": [
      {
        "id": "67210b1c5f8e9a001234def0",
        "type": "deposit",
        "amount": 10000,
        "status": "completed",
        "createdAt": "2025-10-28T11:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

---

## 15. Get Transaction Statistics

### Request
```
GET http://localhost:5001/api/transactions/stats
Authorization: Bearer YOUR_TOKEN
```

### With Date Range
```
GET http://localhost:5001/api/transactions/stats?startDate=2025-01-01&endDate=2025-12-31
```

### Expected Response
```json
{
  "success": true,
  "message": "Transaction statistics retrieved successfully",
  "data": {
    "deposits": {
      "total": 150000,
      "count": 15
    },
    "withdrawals": {
      "total": 50000,
      "count": 5
    }
  }
}
```

---

## 16. Get Recent Activities

### Request
```
GET http://localhost:5001/api/dashboard/recent-activities?limit=10
Authorization: Bearer YOUR_TOKEN
```

### Expected Response
```json
{
  "success": true,
  "message": "Recent activities retrieved successfully",
  "data": [
    {
      "id": "67210b1c5f8e9a001234def0",
      "type": "transaction",
      "description": "deposit of 10000 RWF by John Doe",
      "amount": 10000,
      "transactionType": "deposit",
      "createdAt": "2025-10-28T11:00:00.000Z"
    }
  ]
}
```

---

## 17. Logout

### Request
```
POST http://localhost:5001/api/auth/logout
Authorization: Bearer YOUR_TOKEN
```

### Expected Response
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

---

## Error Responses

### 401 Unauthorized (No Token)
```json
{
  "success": false,
  "message": "No token provided. Authorization required."
}
```

### 401 Unauthorized (Invalid Token)
```json
{
  "success": false,
  "message": "Invalid or expired token."
}
```

### 400 Bad Request (Validation Error)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Customer not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Postman Collection Setup

### 1. Create Environment Variables

Create a Postman environment with these variables:

- `base_url`: `http://localhost:5001/api`
- `token`: (leave empty, will be set after login)

### 2. Auto-set Token After Login

In the **Login** request, go to **Tests** tab and add:

```javascript
// Parse response
var jsonData = pm.response.json();

// Set token to environment variable
if (jsonData.success && jsonData.data.token) {
    pm.environment.set("token", jsonData.data.token);
    console.log("Token saved: " + jsonData.data.token);
}
```

### 3. Use Variables in Requests

Replace URLs with:
```
{{base_url}}/customers
```

Replace Authorization header with:
```
Bearer {{token}}
```

---

## Testing Workflow

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test Health Check** - Ensure server is running

3. **Login** - Get authentication token

4. **Test Dashboard** - Check statistics (will be 0 initially)

5. **Test Customers** - Get empty list (no customers yet)

6. **Test Transactions** - Get empty list (no transactions yet)

This API is designed to work with the client app where customers can register and perform transactions. The admin app monitors and manages these activities.

---

## Notes

- All dates are in ISO 8601 format
- All amounts are in RWF (Rwandan Francs)
- Token expires after 24 hours
- Rate limit: 100 requests per 15 minutes per IP
- Default admin credentials are created on first server start

---

## Need Help?

If you encounter any issues:
1. Check the server logs in the terminal
2. Verify MongoDB is connected
3. Ensure `.env` file is configured correctly
4. Check that the token is valid and properly formatted in headers
