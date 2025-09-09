# Clarity Finance Tracker

A personal finance management application built with modern web technologies. Features enterprise-level security, real banking integration via Plaid API, and comprehensive financial data visualization.

## Features

- **Real Banking Integration**: Secure connection to 11,000+ financial institutions via Plaid API
- **Enterprise Security**: Rate limiting, Helmet.js security headers, CORS protection, JWT authentication
- **Interactive Dashboard**: Comprehensive spending analysis with charts and visualizations
- **Transaction Management**: Advanced filtering, searching, and categorization
- **Dark Mode Support**: Fully responsive design with theme switching
- **Production Ready**: Environment-aware configuration, comprehensive logging, deployment automation

## Tech Stack

- **Frontend**: React + TypeScript, Vite build system
- **UI Library**: shadcn/ui components with Tailwind CSS
- **Backend**: Node.js + Express.js with comprehensive middleware
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Financial Data**: Plaid API integration
- **Security**: Rate limiting, CORS, Helmet.js headers
- **Deployment**: Railway full-stack hosting
- **Charts**: Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd finance-tracker
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Add your configuration:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox
JWT_SECRET=your_jwt_secret
```

4. Start the development server
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── Transactions.jsx # Transaction viewer with filtering
│   ├── Dashboard.jsx   # Overview dashboard (planned)
│   └── Reports.jsx     # Analytics and reports (planned)
├── supabaseClient.js   # Database client and API functions
└── App.jsx             # Main application component
```

## Database Schema

The application expects a `transactions` table with the following structure:

```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(10) CHECK (type IN ('credit', 'debit')),
  category VARCHAR(50),
  subcategory VARCHAR(50),
  account_id VARCHAR(50)
);
```

## Current Status

✅ **Completed Features**
- Full-stack application with React + TypeScript frontend
- Express.js backend with comprehensive security middleware
- Plaid API integration for real banking data
- Interactive dashboard with spending visualizations
- Enterprise-level security (rate limiting, CORS, security headers)
- Dark mode support with consistent theming
- Railway deployment with production configuration

🚀 **Future Enhancements**
- Machine learning for spending insights and predictions
- Real-time WebSocket notifications for account changes
- Progressive Web App (PWA) capabilities
- Investment portfolio tracking integration
- Budget optimization algorithms
- Multi-currency support for international accounts
- Microservices architecture scaling

## Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!

## License

MIT License - see LICENSE file for details
