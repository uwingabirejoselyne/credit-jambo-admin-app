# Credit Jambo Admin Panel - Frontend

A modern, responsive admin dashboard for managing Credit Jambo's Savings Management System.

## 🎨 Features

### Modern UI/UX
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### Pages

#### 1. 🔐 Login Page
- Email and password authentication
- Form validation with error messages
- JWT token-based authentication
- Auto-redirect after successful login
- Demo credentials display

**Demo Credentials:**
- Email: `admin@creditjambo.com`
- Password: `admin123`

#### 2. 📊 Dashboard
- **8 Statistics Cards:**
  - Total Customers
  - Active Customers
  - Total Balance (RWF)
  - Today's Transactions
  - Pending Verifications
  - Total Deposits
  - Total Withdrawals
  - Net Flow

- **Quick Actions Section:**
  - Verify Devices
  - View Customers
  - View Transactions

- **Analytics Section:**
  - Customer Status Distribution (progress bars)
  - Transaction Flow Analysis (progress bars)
  - System Health Indicators (circular progress charts)

#### 3. 👥 Customers Page
- **Summary Cards:** Total, Active, Total Balance, Unverified Devices
- **Search & Filter:** By name, email, phone, and status
- **Customer Table:**
  - Customer info (name, email)
  - Phone number
  - Balance (RWF)
  - Status badge
  - Device verification status
  - Join date
  - Last login

#### 4. 💰 Transactions Page
- **Summary Cards:** Total, Deposits, Withdrawals, Net Flow
- **Search & Filter:** By transaction ID, customer, and type
- **Transaction Table:**
  - Transaction ID
  - Customer info
  - Type (Deposit/Withdrawal with icons)
  - Amount (color-coded)
  - Balance before/after
  - Status
  - Timestamp

#### 5. 📱 Device Verification Page
- **Summary Cards:** Total, Pending, Approved, Rejected
- **Alert Banner:** Highlights pending verifications
- **Search & Filter:** By customer, email, device ID, and status
- **Verification Table:**
  - Customer info
  - Customer ID
  - Device ID
  - Status
  - Request timestamp
  - Approve/Reject actions

- **Confirmation Modal:**
  - Shows customer details
  - Color-coded (green/red)
  - Loading state during processing

## 🛠️ Technology Stack

- **React 19** - Latest React with TypeScript
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS 4** - Modern utility-first styling
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx       # Button with variants and loading state
│   │   ├── Input.tsx        # Input with validation and icons
│   │   ├── Card.tsx         # Card container with variants
│   │   ├── Modal.tsx        # Modal dialog with footer
│   │   ├── Badge.tsx        # Status badges
│   │   ├── Table.tsx        # Generic table component
│   │   ├── Spinner.tsx      # Loading spinner
│   │   ├── Layout.tsx       # Main layout with sidebar
│   │   ├── ToastProvider.tsx # Toast notifications wrapper
│   │   └── index.ts         # Component exports
│   ├── pages/               # Page components
│   │   ├── Login.tsx        # Login page
│   │   ├── Dashboard.tsx    # Dashboard with analytics
│   │   ├── Customers.tsx    # Customer management
│   │   ├── Transactions.tsx # Transaction history
│   │   ├── DeviceVerification.tsx # Device approval
│   │   └── index.ts         # Page exports
│   ├── services/            # API and data services
│   │   ├── api.ts           # Axios instance configuration
│   │   └── mockData.ts      # Mock data for development
│   ├── store/               # State management
│   │   └── AuthContext.tsx  # Authentication context
│   ├── utils/               # Utility functions
│   │   └── toast.ts         # Toast notification helpers
│   ├── App.tsx              # Main app with routing
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles and theme
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. **Clone the repository** (if not already done):
   ```bash
   git clone `https://github.com/uwingabirejoselyne/credit-jambo-admin-app`
   cd credit-jambo-admin-app/frontend
   ```

2. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Open browser:**
Navigate to `http://localhost:5174`

4. **Login with demo credentials:**
- Email: `admin@creditjambo.com`
- Password: `admin123`

### Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🎨 Design System

### Colors
- **Primary Green:** `#10b981` - Success, deposits, active status
- **Primary Blue:** `#3b82f6` - Primary actions, information
- **Primary Orange:** `#f97316` - Warnings, withdrawals
- **Gray Shades:** For text and backgrounds
- **Red:** `#ef4444` - Errors, rejections
- **Yellow:** `#f59e0b` - Pending, warnings

### Typography
- **Font:** System font stack (SF Pro, Segoe UI, Roboto)
- **Headings:** Bold, large sizes
- **Body:** Regular weight, readable sizes

### Spacing
- Consistent spacing scale (4px base unit)
- Card padding: sm (12px), md (24px), lg (32px)
- Gap between elements: 16px-24px

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5001/api
```

Currently using mock data. When ready to connect to real backend:
1. Update `VITE_API_URL` in `.env`
2. Replace mock API calls in pages with real API calls
3. The axios instance in `services/api.ts` is already configured


## 🔐 Authentication

- JWT token stored in localStorage
- Auth context provides global authentication state
- Protected routes with automatic redirect to login
- Auto-logout after 30 minutes of inactivity
- Session expires on browser close

## 📱 Responsive Design

- **Mobile:** Single column layout, hamburger menu
- **Tablet:** 2-column grids, collapsible sidebar
- **Desktop:** 4-column grids, persistent sidebar

## 🎯 Key Features

### Component Features
- **Reusable Components:** All UI elements are modular and reusable
- **TypeScript:** Full type safety with interfaces
- **Generic Table:** Type-safe table component for any data
- **Form Validation:** Client-side validation with error messages
- **Loading States:** Spinners and skeleton screens
- **Empty States:** Helpful messages when no data

### User Experience
- **Fast Navigation:** Instant client-side routing
- **Visual Feedback:** Toast notifications for all actions
- **Smooth Animations:** 200-300ms transitions
- **Hover Effects:** Interactive elements show hover states
- **Keyboard Support:** ESC to close modals
- **Loading Indicators:** Clear feedback during async operations

## 🐛 Troubleshooting

### Port already in use
If port 5173 is in use, Vite will automatically try port 5174.

### Module not found errors
Run `npm install` to ensure all dependencies are installed.

### TypeScript errors
Run `npm run build` to check for TypeScript errors.

## 📄 License

This project is part of Credit Jambo Ltd's Savings Management System.

## 👥 Credit Jambo Ltd

**Location:** NM 233 St, Nyamagumba, Musanze – Rwanda
**Contact:** +250 788 268 451
**Email:** hello@creditjambo.com
**Website:** www.creditjambo.com

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
