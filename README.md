# Smart Finance Tracker

A full-stack personal finance management application for tracking income, expenses, budgets, and financial goals with real-time analytics and insights.

## Overview

This application was built to solve the common problem of scattered financial records and disconnected tracking methods. It consolidates all personal finance data into a single dashboard with visual analytics, making it easier to understand spending patterns and maintain financial discipline.

Key capabilities include transaction logging with CSV import support, category-based organization, budget tracking with automated alerts, goal setting with progress visualization, and comprehensive analytics through interactive charts.

## Features

### Transaction Management
- Add, edit, and delete income and expense transactions
- Categorize transactions for better organization
- Import transactions via CSV files
- View transaction history with pagination and filtering
- Real-time transaction summary (total income, expenses, net amount)

### Category System
- Create custom categories with color coding
- Track spending by category with pie chart visualization
- Category-based expense breakdown

### Budget Tracking
- Set budgets for different categories
- Support for multiple time periods (daily, weekly, monthly, yearly)
- Visual progress indicators showing budget utilization
- Automatic alerts when approaching or exceeding budget limits
- Historical budget performance trends

### Goals & Savings
- Create financial goals with target amounts and deadlines
- Track progress towards each goal
- Visual analytics showing goal completion rates
- Set start dates and deadlines for accountability

### Analytics & Insights
- Monthly transaction trends
- Expense distribution by category
- Budget performance analytics
- Transaction summaries and statistics
- Interactive charts and visualizations

### Security
- JWT-based authentication with refresh tokens
- Secure password hashing with bcrypt
- Protected API routes with middleware authentication
- Rate limiting to prevent abuse

## Tech Stack

### Frontend
- **React 19** with TypeScript for type-safe component development
- **Vite** for fast build times and hot module replacement
- **TailwindCSS** for utility-first styling with custom design system
- **Recharts** for responsive data visualizations
- **Zustand** for lightweight state management
- **React Hook Form** for performant form validation
- **Axios** with interceptors for API communication


### Backend
- **Node.js** with Express for RESTful API
- **TypeScript** for type safety across the stack
- **Prisma ORM** for type-safe database queries
- **PostgreSQL** for reliable data persistence
- **JWT** for stateless authentication with refresh token rotation
- **bcrypt** for secure password hashing
- **Express Rate Limit** to prevent brute force attacks
- **Multer** for handling file uploads
- **csv-parser** for transaction import functionality
- **Google Generative AI** for smart financial insights

### Development Tools
- Prisma Studio for database management

## Project Structure

```
Smart-Finance-Tracker/
├── backend/
│   ├── app.ts                 # Express app configuration
│   ├── config/
│   │   └── authenticate.ts    # Auth middleware
│   ├── controller/            # Request handlers
│   ├── db/                    # Database queries
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   ├── route/                 # API routes
│   ├── services/              # Business logic
│   └── utils/                 # Helper functions
│
└── frontend/
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── pages/             # Page components
    │   ├── store/             # Zustand state management
    │   ├── lib/               # Utilities and API client
    │   └── assets/            # Static assets
    └── public/                # Public files
```

## Database Schema

The application uses PostgreSQL with Prisma ORM for type-safe database access:

- **User**: Stores authentication credentials, profile information, and refresh tokens
- **Transaction**: Records all income and expense entries with timestamps and category relationships
- **Category**: Custom categories with color coding for visual organization
- **Budget**: Time-based budget allocations linked to categories with active/inactive states
- **Goal**: Financial goals with target amounts, deadlines, and progress tracking

All models include proper relationships with foreign keys, timestamps, and validation constraints enforced at the database level.


## Key Features Implementation

### Authentication Flow
- User registration with validation and password hashing
- Login with JWT access token and HTTP-only refresh token
- Automatic token refresh on expiration
- Secure logout with token invalidation

### Transaction System
- CRUD operations for income and expense tracking
- CSV import for bulk transaction uploads
- Real-time summary calculations
- Date-based filtering and sorting

### Budget Management
- Category-specific budget allocation
- Multiple time period support (daily, weekly, monthly, yearly)
- Budget vs actual spending comparison
- Alert system for budget thresholds

### Goal Tracking
- Target amount and deadline setting
- Progress calculation and visualization
- Goal completion analytics
- Historical goal performance

### Analytics Dashboard
- Monthly spending trends with line charts
- Category-wise expense distribution with pie charts
- Budget utilization progress bars
- Transaction statistics and summaries



## Security Considerations

- All passwords are hashed using bcrypt with salt rounds
- JWT tokens use separate secrets for access and refresh
- Refresh tokens stored as HTTP-only cookies
- Rate limiting on authentication endpoints
- SQL injection prevention through Prisma parameterized queries
- XSS protection via React's default escaping
- CORS configured for specific origins in production


## License

MIT License - This is a personal project created for educational and portfolio purposes.

