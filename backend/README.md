# Credit Jambo Admin Backend

Admin backend API for Credit Jambo Savings Management System.

## Features

- Admin authentication with JWT
- Customer management and device verification
- Transaction monitoring and analytics
- Dashboard statistics
- Security features (rate limiting, helmet, input validation)
- SHA-512 password hashing
- DTOs for data sanitization
- Comprehensive error handling

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + SHA-512
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `ADMIN_EMAIL` & `ADMIN_PASSWORD`: Default admin credentials

3. **Start development server**:
```bash
npm run dev
```

4. **Build for production**:
```bash
npm run build
npm start
```

The server will run on `http://localhost:5001` (or your configured PORT).

## Default Admin Credentials

On first startup, a default admin account is created:
- **Email**: `admin@creditjambo.com`
- **Password**: `Admin@123`

**⚠️ Important**: Change these credentials immediately after first login!

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database & environment config
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── models/          # Mongoose models
│   ├── dtos/            # Data Transfer Objects
│   ├── middlewares/     # Auth & validation middleware
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.ts        # App entry point
├── tests/               # Test files
├── .env                 # Environment variables
├── .env.example         # Environment template
├── tsconfig.json        # TypeScript config
├── nodemon.json         # Nodemon config
└── package.json         # Dependencies
```

## API Endpoints

### Base URL
```
http://localhost:5001/api
```

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@creditjambo.com",
  "password": "Admin@123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "id": "...",
      "email": "admin@creditjambo.com",
      "name": "System Administrator",
      "role": "super_admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

---

### Customers

All customer endpoints require authentication.

#### Get All Customers
```http
GET /api/customers?page=1&limit=10&search=john
Authorization: Bearer {token}
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name, email, or phone

#### Get Customer by ID
```http
GET /api/customers/{id}
Authorization: Bearer {token}
```

#### Get Pending Verifications
```http
GET /api/customers/pending-verifications
Authorization: Bearer {token}
```

#### Verify Device
```http
POST /api/customers/{id}/verify-device
Authorization: Bearer {token}
Content-Type: application/json

{
  "deviceId": "device-unique-id"
}
```

#### Reject Device
```http
POST /api/customers/{id}/reject-device
Authorization: Bearer {token}
Content-Type: application/json

{
  "deviceId": "device-unique-id",
  "reason": "Suspicious device"
}
```

#### Toggle Customer Status
```http
PATCH /api/customers/{id}/toggle-status
Authorization: Bearer {token}
```

---

### Transactions

All transaction endpoints require authentication.

#### Get All Transactions
```http
GET /api/transactions?page=1&limit=10&type=deposit&status=completed
Authorization: Bearer {token}
```

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `type` (optional): `deposit` or `withdrawal`
- `status` (optional): `pending`, `completed`, `failed`
- `userId` (optional): Filter by user ID
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

#### Get Transaction by ID
```http
GET /api/transactions/{id}
Authorization: Bearer {token}
```

#### Get User Transactions
```http
GET /api/transactions/user/{userId}?page=1&limit=10
Authorization: Bearer {token}
```

#### Get Transaction Statistics
```http
GET /api/transactions/stats?startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer {token}
```

---

### Dashboard

#### Get Dashboard Statistics
```http
GET /api/dashboard/stats
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalCustomers": 150,
    "activeCustomers": 120,
    "totalBalance": 5000000,
    "todayTransactions": 45,
    "pendingVerifications": 8,
    "totalDeposits": 3000000,
    "totalWithdrawals": 1500000,
    "netFlow": 1500000
  }
}
```

#### Get Recent Activities
```http
GET /api/dashboard/recent-activities?limit=10
Authorization: Bearer {token}
```

---

### Health Check

```http
GET /api/health
```

**Response**:
```json
{
  "success": true,
  "message": "Credit Jambo Admin API is running",
  "timestamp": "2025-10-28T12:00:00.000Z",
  "environment": "development"
}
```

## Security Features

### Implemented Security

1. **Helmet**: Sets secure HTTP headers
2. **CORS**: Configured for frontend origin
3. **Rate Limiting**: 100 requests per 15 minutes per IP
4. **Input Validation**: Express Validator for all inputs
5. **JWT Authentication**: Secure token-based auth
6. **SHA-512 Hashing**: Strong password hashing
7. **DTOs**: Sanitized data responses (no sensitive fields)

### Best Practices

- Passwords are hashed with SHA-512
- JWT tokens expire after 24 hours
- Sensitive data excluded from API responses
- Rate limiting prevents brute force attacks
- Environment variables for sensitive config

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

**Common Status Codes**:
- `200`: Success
- `400`: Bad Request / Validation Error
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

## Development

### Run in Development Mode
```bash
npm run dev
```

Uses `nodemon` for auto-restart on file changes.

### Build TypeScript
```bash
npm run build
```

Compiles TypeScript to JavaScript in the `dist/` folder.

### Run Production Build
```bash
npm start
```

## Testing

```bash
npm test
```

(Tests to be implemented)

## Environment Variables

See `.env.example` for all available variables:

- `PORT`: Server port (default: 5001)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT signing
- `JWT_EXPIRES_IN`: Token expiration (default: 24h)
- `ADMIN_EMAIL`: Default admin email
- `ADMIN_PASSWORD`: Default admin password
- `FRONTEND_URL`: Frontend URL for CORS
- `RATE_LIMIT_WINDOW_MS`: Rate limit window
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window

## Contributing

1. Follow the existing code structure
2. Use TypeScript strictly
3. Add validation for all inputs
4. Use DTOs for responses
5. Write meaningful commit messages
6. Test endpoints before committing

## License

ISC
