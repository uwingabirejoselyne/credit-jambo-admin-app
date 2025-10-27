# Credit Jambo Admin Backend

Admin backend API for Credit Jambo Savings Management System.

## Features

- Admin authentication with JWT
- Customer management and device verification
- Transaction monitoring
- Dashboard statistics
- Security features (rate limiting, helmet, validation)

## Tech Stack

- Node.js + Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- SHA-512 Password Hashing

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── services/       # Business logic
│   ├── models/         # Database models
│   ├── dtos/           # Data Transfer Objects
│   ├── middlewares/    # Custom middlewares
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── server.ts       # Application entry point
├── tests/              # Test files
└── package.json
```

## API Endpoints

Documentation coming soon...

## License

ISC
