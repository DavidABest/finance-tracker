# Personal Finance Tracker

A modern web application for analyzing personal financial data and spending patterns. Import your bank transaction history and gain insights into your financial habits through interactive visualizations and filtering tools.

## Features

- **Transaction Management**: Import and view bank transaction history
- **Smart Filtering**: Search transactions by description, category, or amount
- **Category Analysis**: Automatic categorization with color-coded displays
- **Responsive Design**: Clean, mobile-friendly interface
- **Real-time Search**: Instant filtering as you type
- **Secure Data Storage**: Supabase backend with environment-based configuration

## Tech Stack

- **Frontend**: React 19 with Vite
- **Styling**: TailwindCSS v4
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts (planned)
- **Icons**: Lucide React & Font Awesome
- **Routing**: React Router DOM

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
Add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
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

## Roadmap

- [ ] Plaid integration for automatic bank data import
- [ ] Dashboard with spending insights and charts
- [ ] Monthly/yearly spending reports
- [ ] Budget tracking and alerts
- [ ] Export functionality (PDF, CSV)
- [ ] Multi-account support
- [ ] Mobile app (React Native)

## Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!

## License

MIT License - see LICENSE file for details
