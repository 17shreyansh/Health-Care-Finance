# Health Credit Limit Card System

A full-stack MERN application with role-based authentication for managing health credit cards.

## Features

- **Role-based Authentication**: Admin, Employee, and User roles
- **JWT Authentication**: Secure HTTP-only cookies
- **Responsive Design**: Built with Ant Design
- **File Upload**: Profile image upload for users
- **Identity Card Generation**: Automatic card generation after registration
- **Dashboard Management**: Separate dashboards for each role

## Tech Stack

- **Frontend**: React + Vite + Ant Design
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT with HTTP-only cookies

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/health-credit-db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

4. Seed the database:
```bash
node seed.js
```

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Default Login Credentials

### Admin
- Email: admin@healthcredit.com
- Password: admin123

### Employee
- Email: john@company.com
- Password: employee123
- Employee ID: EMP001

## User Registration

Users can register using an employee's ID as a referral code. Use `EMP001` for testing.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Admin Routes
- `GET /api/admin/employees` - Get all employees
- `POST /api/admin/employees` - Create employee
- `DELETE /api/admin/employees/:id` - Delete employee
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user

### Employee Routes
- `GET /api/employees/dashboard` - Get dashboard data
- `GET /api/employees/referrals` - Get referrals

### User Routes
- `GET /api/users/profile/:userId` - Get user profile

## Project Structure

```
health-credit-app/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication & file upload
│   ├── uploads/         # Uploaded files
│   └── server.js        # Main server file
└── frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── contexts/    # React contexts
    │   ├── services/    # API services
    │   └── App.jsx      # Main app component
    └── public/          # Static files
```

## Deployment

### Backend Deployment
1. Set environment variables in production
2. Use PM2 or similar for process management
3. Configure reverse proxy (Nginx)

### Frontend Deployment
1. Build the application: `npm run build`
2. Serve static files from `dist` folder
3. Configure routing for SPA

## Security Features

- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt
- Role-based access control
- File upload validation
- Input validation and sanitization

## License

MIT License