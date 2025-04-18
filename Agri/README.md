# Agrofix Platform

A modern agricultural e-commerce and management platform for buyers and admins. Built with React (frontend) and Node.js/Express + Google Cloud PostgreSQL (backend).

## Features
- **Buyer Registration & Login**: Secure authentication, JWT-based sessions.
- **Admin Login**: Separate admin authentication and dashboard.
- **Unified Login Page**: Choose Buyer or Admin role, routed to respective dashboard.
- **Order Placement**: Buyers can place orders; orders are linked to buyer accounts.
- **Order History**: Buyers can view their order history and profile in a modern dashboard.
- **Logout**: Secure logout for buyers.
- **Robust Form Validation**: All forms use react-hook-form and yup for validation.
- **Modern UI**: Clean, responsive design with Material UI and custom CSS modules.

## Project Structure
```
Agri/
├── agrofix-frontend/      # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── BuyerRegisterPage.js
│   │   │   ├── BuyerLoginPage.js
│   │   │   ├── BuyerDashboardPage.js
│   │   │   ├── AdminLoginPage.js
│   │   │   └── ...
│   │   ├── components/
│   │   └── ...
├── agrofix-backend/       # Node.js/Express backend
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/
│   │   │   ├── buyer.js
│   │   │   └── ...
│   │   ├── models/
│   │   │   ├── Buyer.js
│   │   │   └── ...
│   │   └── ...
└── README.md
```

## Database Setup: Google Cloud PostgreSQL
This project now uses **Google Cloud PostgreSQL** for all backend data storage. MongoDB is no longer required.

- **Provision a PostgreSQL instance** on Google Cloud SQL and note your connection details.
- Update your backend `.env` file:
  ```
  DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>
  JWT_SECRET=your_jwt_secret
  ```
- Ensure your backend code uses an ORM/driver like Prisma, Sequelize, or pg to connect to PostgreSQL.
- If you previously used Neon, note that Neon serverless can go idle; Google Cloud SQL is recommended for production.

### Prisma Example (Recommended)
If you use Prisma, initialize it in your backend directory:
```bash
npx prisma init
```
Edit `prisma/schema.prisma` to match your data models (Buyer, Order, etc.) and run:
```bash
npx prisma migrate dev --name init
```

## Setup Instructions

### 1. Backend
- Install dependencies:
  ```bash
  cd agrofix-backend
  npm install
  ```
- Start the backend server:
  ```bash
  npm start
  ```

### 2. Frontend
- Install dependencies:
  ```bash
  cd agrofix-frontend
  npm install
  ```
- Start the frontend dev server:
  ```bash
  npm start
  ```
- The frontend will run on [http://localhost:3000](http://localhost:3000)

## Usage
- Register as a buyer at `/buyer-register`.
- Login as buyer or admin at `/admin-login`.
- Buyers can view their dashboard at `/buyer-dashboard`.
- Admins can view the admin dashboard at `/admin`.
- The home page now greets logged-in buyers by name (personalized greeting).

## Troubleshooting
- Make sure your Google Cloud SQL (or PostgreSQL) instance is accessible from your backend server (check IP/firewall settings).
- If registration fails, check the backend logs for database connection errors (e.g., `P1001: Can't reach database server`).
- Ensure your `.env` file in `agrofix-backend` has the correct `DATABASE_URL` and credentials for your PostgreSQL server.
- For 404 errors, ensure your proxy in `agrofix-frontend/package.json` and backend API routes are correct, and both servers are restarted after changes.
- If you change your Prisma schema, run `npx prisma migrate deploy` in the backend directory and ensure the database is reachable.

## License
MIT
