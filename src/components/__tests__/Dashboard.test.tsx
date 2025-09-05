import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../Dashboard'
import { getAllTransactions, getSpendingByCategory } from '../../supabaseClient'
import { useAuth } from '../../contexts/AuthContext'

// Mock dependencies
vi.mock('../../supabaseClient', () => ({
  getAllTransactions: vi.fn(),
  getSpendingByCategory: vi.fn(),
}))

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar Component</div>
}))

const mockGetAllTransactions = vi.mocked(getAllTransactions)
const mockGetSpendingByCategory = vi.mocked(getSpendingByCategory)
const mockUseAuth = vi.mocked(useAuth)

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

const mockTransactions = [
  {
    id: '1',
    description: 'Salary',
    amount: 5000,
    type: 'credit',
    category: 'Income',
    date: '2024-01-15',
  },
  {
    id: '2',
    description: 'Grocery Store',
    amount: 150,
    type: 'debit',
    category: 'Food',
    date: '2024-01-14',
  },
  {
    id: '3',
    description: 'Coffee Shop',
    amount: 25,
    type: 'debit',
    category: 'Food',
    date: '2024-01-13',
  },
]

const mockSpendingData = [
  { category: 'Food', amount: 175 },
  { category: 'Transport', amount: 100 },
  { category: 'Entertainment', amount: 50 },
]

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      signOut: vi.fn(),
      loading: false,
    })
  })

  describe('Loading State', () => {
    it('displays loading message while fetching data', async () => {
      mockGetAllTransactions.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockTransactions), 100))
      )
      mockGetSpendingByCategory.mockResolvedValue(mockSpendingData)

      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument()
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.queryByText('Loading dashboard data...')).not.toBeInTheDocument()
      })
    })
  })

  describe('Error State', () => {
    it('displays error message when data fetch fails', async () => {
      const mockError = new Error('Failed to fetch data')
      mockGetAllTransactions.mockRejectedValue(mockError)
      mockGetSpendingByCategory.mockRejectedValue(mockError)

      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Error: Failed to fetch data')).toBeInTheDocument()
      })

      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })

    it('allows retrying data fetch on error', async () => {
      const mockError = new Error('Failed to fetch data')
      mockGetAllTransactions.mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce(mockTransactions)
      mockGetSpendingByCategory.mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce(mockSpendingData)

      const user = userEvent.setup()
      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Error: Failed to fetch data')).toBeInTheDocument()
      })

      const retryButton = screen.getByRole('button', { name: /retry/i })
      await user.click(retryButton)

      await waitFor(() => {
        expect(screen.getByText('Financial Dashboard')).toBeInTheDocument()
      })
    })
  })

  describe('Dashboard Content', () => {
    beforeEach(async () => {
      mockGetAllTransactions.mockResolvedValue(mockTransactions)
      mockGetSpendingByCategory.mockResolvedValue(mockSpendingData)
    })

    it('renders dashboard header', async () => {
      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Financial Dashboard')).toBeInTheDocument()
      })

      expect(screen.getByText('Overview of your financial activity')).toBeInTheDocument()
    })

    it('displays financial summary cards', async () => {
      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Total Income')).toBeInTheDocument()
      })

      expect(screen.getByText('Total Expenses')).toBeInTheDocument()
      expect(screen.getByText('Net Balance')).toBeInTheDocument()
    })

    it('calculates and displays correct financial totals', async () => {
      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('$5,000.00')).toBeInTheDocument() // Total Income
      })

      expect(screen.getByText('$175.00')).toBeInTheDocument() // Total Expenses
      expect(screen.getByText('$4,825.00')).toBeInTheDocument() // Net Balance
    })

    it('displays correct transaction counts', async () => {
      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('From 1 transactions')).toBeInTheDocument() // Income transactions
      })

      expect(screen.getByText('From 2 transactions')).toBeInTheDocument() // Expense transactions
    })

    it('shows correct badge for positive net balance', async () => {
      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Positive')).toBeInTheDocument()
      })
    })

    it('shows correct badge for negative net balance', async () => {
      const negativeTransactions = [
        {
          id: '1',
          description: 'Small income',
          amount: 100,
          type: 'credit',
          category: 'Income',
          date: '2024-01-15',
        },
        {
          id: '2',
          description: 'Large expense',
          amount: 500,
          type: 'debit',
          category: 'Bills',
          date: '2024-01-14',
        },
      ]
      
      mockGetAllTransactions.mockResolvedValue(negativeTransactions)

      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Negative')).toBeInTheDocument()
      })
    })
  })

  describe('Recent Transactions', () => {
    beforeEach(() => {
      mockGetAllTransactions.mockResolvedValue(mockTransactions)
      mockGetSpendingByCategory.mockResolvedValue(mockSpendingData)
    })

    it('displays recent transactions section', async () => {
      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
      })
    })

    it('shows transaction details correctly', async () => {
      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Salary')).toBeInTheDocument()
      })

      expect(screen.getByText('Grocery Store')).toBeInTheDocument()
      expect(screen.getByText('Coffee Shop')).toBeInTheDocument()
      expect(screen.getByText(/• Income/)).toBeInTheDocument()
    })

    it('displays correct transaction amounts with signs', async () => {
      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('+$5,000.00')).toBeInTheDocument() // Credit transaction
      })

      expect(screen.getByText('-$150.00')).toBeInTheDocument() // Debit transaction
      expect(screen.getByText('-$25.00')).toBeInTheDocument() // Debit transaction
    })

    it('shows View All Transactions button', async () => {
      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        const viewAllButton = screen.getByRole('link', { name: /view all transactions/i })
        expect(viewAllButton).toHaveAttribute('href', '/transactions')
      })
    })

    it('shows empty state when no transactions', async () => {
      mockGetAllTransactions.mockResolvedValue([])

      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('No transactions found. Connect your bank account to start tracking.')).toBeInTheDocument()
      })
    })
  })

  describe('Spending by Category', () => {
    beforeEach(() => {
      mockGetAllTransactions.mockResolvedValue(mockTransactions)
      mockGetSpendingByCategory.mockResolvedValue(mockSpendingData)
    })

    it('displays spending by category section', async () => {
      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Spending by Category')).toBeInTheDocument()
      })
    })

    it('shows category badges and amounts', async () => {
      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Food')).toBeInTheDocument()
      })

      expect(screen.getByText('Transport')).toBeInTheDocument()
      expect(screen.getByText('Entertainment')).toBeInTheDocument()
    })

    it('calculates correct percentages', async () => {
      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        // Food: 175 out of 175 total expenses = 100.0%
        expect(screen.getByText(/\$175\.00.*100\.0%\)/)).toBeInTheDocument()
      })
    })

    it('does not show category section when no spending data', async () => {
      mockGetSpendingByCategory.mockResolvedValue([])

      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Financial Dashboard')).toBeInTheDocument()
      })

      expect(screen.queryByText('Spending by Category')).not.toBeInTheDocument()
    })
  })

  describe('Data Fetching', () => {
    it('calls both data fetching functions on mount', async () => {
      mockGetAllTransactions.mockResolvedValue(mockTransactions)
      mockGetSpendingByCategory.mockResolvedValue(mockSpendingData)

      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(mockGetAllTransactions).toHaveBeenCalledTimes(1)
        expect(mockGetSpendingByCategory).toHaveBeenCalledTimes(1)
      })
    })

    it('handles partial data fetch failures', async () => {
      mockGetAllTransactions.mockRejectedValue(new Error('Transaction error'))
      mockGetSpendingByCategory.mockResolvedValue(mockSpendingData)

      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Error: Transaction error')).toBeInTheDocument()
      })
    })
  })

  describe('Currency Formatting', () => {
    it('formats currency correctly', async () => {
      const transactionWithDecimals = [{
        id: '1',
        description: 'Test',
        amount: 1234.56,
        type: 'credit',
        category: 'Income',
        date: '2024-01-15',
      }]
      
      mockGetAllTransactions.mockResolvedValue(transactionWithDecimals)
      mockGetSpendingByCategory.mockResolvedValue([])

      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )

      await waitFor(() => {
        const amounts = screen.getAllByText('$1,234.56')
        expect(amounts.length).toBeGreaterThan(0)
      })
    })
  })
})