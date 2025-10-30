# Credit Jambo Admin App

A comprehensive admin application for Credit Jambo's Savings Management System, featuring both a robust backend API and a modern, responsive frontend dashboard.

##  Overview

This project is a two-part application that provides administrative capabilities for managing the Credit Jambo Savings Management System:

- **Backend**: A Node.js/Express API with TypeScript that handles authentication, customer management, transaction monitoring, and analytics
- **Frontend**: A React-based admin dashboard with responsive design for efficient management of customers, transactions, and device verifications

## Backend Features

- **Admin Authentication**: JWT-based authentication with SHA-512 password hashing
- **Customer Management**: Complete CRUD operations for customer accounts and device verification
- **Transaction Monitoring**: Comprehensive tracking and analytics for deposits and withdrawals
- **Dashboard Statistics**: Real-time metrics and insights
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Tech Stack**: Node.js, Express.js, TypeScript, MongoDB, Mongoose

## Frontend Features

- **Modern UI/UX**: Responsive design that works on desktop, tablet, and mobile
- **Dashboard**: 8 statistics cards with quick actions and analytics
- **Customer Management**: Searchable and filterable customer tables
- **Transaction Tracking**: Comprehensive transaction history with status indicators
- **Device Verification**: Approval/rejection system for customer device verification
- **Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS, Axios

## Technology Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + SHA-512

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v6
- **HTTP Client**: Axios

## Getting Started

### Backend Setup
1. Navigate to the `backend` directory
2. Install dependencies: `npm install`
3. Configure environment variables: `cp .env.example .env`
4. Start development server: `npm run dev`
5. The server will run on `http://localhost:5001`

### Frontend Setup
1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open browser at `http://localhost:5174`
5. Login with demo credentials:
   - Email: `admin@creditjambo.com`
   - Password: `admin123`

For detailed information about each component, see the individual README files in the `backend` and `frontend` directories.