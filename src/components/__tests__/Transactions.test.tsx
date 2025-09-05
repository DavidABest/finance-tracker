import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Transactions from '../Transactions'
import { getAllTransactions } from '../../supabaseClient'

vi.mock('../../supabaseClient', () => ({
  getAllTransactions: vi.fn(),
}))

vi.mock('../Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar Component</div>
}))

const mockGetAllTransactions = vi.mocked(getAllTransactions)

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

const mockTransactions = [
  {
    id: '1',
    description: 'Grocery Store Purchase',
    amount: 150,
    type: 'debit',
    category: 'Food',
    date: '2024-01-15',
  },
  {
    id: '2',
    description: 'Salary Payment',
    amount: 5000,
    type: 'credit',
    category: 'Income',
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
  {
    id: '4',
    description: 'Rent Payment',
    amount: 1200,
    type: 'debit',
    category: 'Housing',
    date: '2024-01-12',
  },
]

describe('Transactions Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Loading State', () => {
    it('displays loading message while fetching transactions', async () => {
      mockGetAllTransactions.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockTransactions), 100))
      )

      render(
        <RouterWrapper>
          <Transactions />
        </RouterWrapper>
      )

      expect(screen.getByText('Loading transactions...')).toBeInTheDocument()
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.queryByText('Loading transactions...')).not.toBeInTheDocument()
      })
    })
  })

  describe('Error State', () => {
    it('displays error message when fetch fails', async () => {
      const mockError = new Error('Failed to fetch transactions')
      mockGetAllTransactions.mockRejectedValue(mockError)

      render(
        <RouterWrapper>
          <Transactions />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Error: Failed to fetch transactions')).toBeInTheDocument()
      })

      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })

    it('allows retrying after error', async () => {
      const mockError = new Error('Network error')
      mockGetAllTransactions.mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce(mockTransactions)

      const user = userEvent.setup()
      render(
        <RouterWrapper>
          <Transactions />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Error: Network error')).toBeInTheDocument()
      })

      const retryButton = screen.getByRole('button', { name: /retry/i })
      await user.click(retryButton)

      await waitFor(() => {
        expect(screen.getByText('Transaction History')).toBeInTheDocument()
      })
    })
  })

  describe('Transaction Display', () => {
    beforeEach(() => {
      mockGetAllTransactions.mockResolvedValue(mockTransactions)
    })

    it('renders transaction history header', async () => {
      render(
        <RouterWrapper>
          <Transactions />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Transaction History')).toBeInTheDocument()
      })

      expect(screen.getByText('Showing 4 of 4 transactions')).toBeInTheDocument()
    })

    it('displays transactions in table format', async () => {
      render(
        <RouterWrapper>
          <Transactions />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Grocery Store Purchase')).toBeInTheDocument()
      })

      expect(screen.getByText('Salary Payment')).toBeInTheDocument()
      expect(screen.getByText('Coffee Shop')).toBeInTheDocument()
      expect(screen.getByText('Rent Payment')).toBeInTheDocument()
    })

    it('displays correct currency formatting', async () => {
      render(
        <RouterWrapper>
          <Transactions />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('+$5,000.00')).toBeInTheDocument() // Credit
      })

      expect(screen.getByText('-$150.00')).toBeInTheDocument() // Debit
      expect(screen.getByText('-$1,200.00')).toBeInTheDocument() // Debit
    })

    it('shows empty state when no transactions', async () => {
      mockGetAllTransactions.mockResolvedValue([])

      render(
        <RouterWrapper>
          <Transactions />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('No transactions found. Connect your bank account to import transaction data.')).toBeInTheDocument()
      })
    })
  })

  describe('Filtering', () => {
    beforeEach(() => {
      mockGetAllTransactions.mockResolvedValue(mockTransactions)
    })

    it('filters by search term', async () => {
      const user = userEvent.setup()
      render(
        <RouterWrapper>
          <Transactions />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Transaction History')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Search description or category...')
      await user.type(searchInput, 'grocery')

      await waitFor(() => {
        expect(screen.getByText('Showing 1 of 4 transactions')).toBeInTheDocument()
      })

      expect(screen.getByText('Grocery Store Purchase')).toBeInTheDocument()
      expect(screen.queryByText('Salary Payment')).not.toBeInTheDocument()
    })

    it('filters by category', async () => {
      const user = userEvent.setup()
      render(
        <RouterWrapper>
          <Transactions />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Transaction History')).toBeInTheDocument()
      })

      const categorySelect = screen.getByDisplayValue('All Categories')
      await user.selectOptions(categorySelect, 'Food')

      await waitFor(() => {
        expect(screen.getByText('Showing 2 of 4 transactions')).toBeInTheDocument()
      })

      expect(screen.getByText('Grocery Store Purchase')).toBeInTheDocument()
      expect(screen.getByText('Coffee Shop')).toBeInTheDocument()
      expect(screen.queryByText('Salary Payment')).not.toBeInTheDocument()
    })

    it('filters by type', async () => {
      const user = userEvent.setup()
      render(
        <RouterWrapper>
          <Transactions />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Transaction History')).toBeInTheDocument()
      })

      const typeSelect = screen.getByDisplayValue('All Types')
      await user.selectOptions(typeSelect, 'credit')

      await waitFor(() => {
        expect(screen.getByText('Showing 1 of 4 transactions')).toBeInTheDocument()
      })

      expect(screen.getByText('Salary Payment')).toBeInTheDocument()
      expect(screen.queryByText('Grocery Store Purchase')).not.toBeInTheDocument()
    })

    it('shows no results message when filters match nothing', async () => {
      const user = userEvent.setup()
      render(
        <RouterWrapper>
          <Transactions />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Transaction History')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Search description or category...')
      await user.type(searchInput, 'nonexistent')

      await waitFor(() => {
        expect(screen.getByText('No transactions match your current filters. Try adjusting your search or filters.')).toBeInTheDocument()
      })
    })
  })

  describe('Date and Currency Formatting', () => {
    beforeEach(() => {
      mockGetAllTransactions.mockResolvedValue(mockTransactions)
    })

    it('formats dates correctly', async () => {
      render(
        <RouterWrapper>
          <Transactions />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Jan 14, 2024')).toBeInTheDocument()
      })

      expect(screen.getByText('Jan 13, 2024')).toBeInTheDocument()
      expect(screen.getByText('Jan 12, 2024')).toBeInTheDocument()
      expect(screen.getByText('Jan 11, 2024')).toBeInTheDocument()
    })

    it('applies correct category colors', async () => {
      render(
        <RouterWrapper>
          <Transactions />
        </RouterWrapper>
      )

      await waitFor(() => {
        const incomeCategories = screen.getAllByText('Income')
        const tableIncomeCategory = incomeCategories.find(el => el.tagName === 'SPAN')
        expect(tableIncomeCategory).toHaveClass('bg-green-100', 'text-green-800')
      })

      const foodCategories = screen.getAllByText('Food')
      const tableFoodCategory = foodCategories.find(el => el.tagName === 'SPAN')
      expect(tableFoodCategory).toHaveClass('bg-orange-100', 'text-orange-800')

      const housingCategories = screen.getAllByText('Housing')
      const tableHousingCategory = housingCategories.find(el => el.tagName === 'SPAN')
      expect(tableHousingCategory).toHaveClass('bg-blue-100', 'text-blue-800')
    })
  })

  describe('Table Structure', () => {
    beforeEach(() => {
      mockGetAllTransactions.mockResolvedValue(mockTransactions)
    })

    it('has proper table headers', async () => {
      render(
        <RouterWrapper>
          <Transactions />
        </RouterWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Date')).toBeInTheDocument()
      })

      expect(screen.getByText('Description')).toBeInTheDocument()
      const categoryHeaders = screen.getAllByText('Category')
      expect(categoryHeaders.length).toBeGreaterThan(0)
      expect(screen.getByText('Amount')).toBeInTheDocument()
    })

    it('applies hover effects to table rows', async () => {
      render(
        <RouterWrapper>
          <Transactions />
        </RouterWrapper>
      )

      await waitFor(() => {
        const rows = screen.getAllByRole('row')
        // Skip header row
        expect(rows[1]).toHaveClass('hover:bg-gray-50')
      })
    })
  })
})