import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Sidebar from '../Sidebar'
import { useAuth } from '../../contexts/AuthContext'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const mockUseAuth = vi.mocked(useAuth)

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaHome: ({ size }: { size: string }) => <div data-testid="home-icon" data-size={size}>Home Icon</div>,
  FaMoneyCheckAlt: ({ size }: { size: string }) => <div data-testid="transactions-icon" data-size={size}>Transactions Icon</div>,
  FaCog: ({ size }: { size: string }) => <div data-testid="settings-icon" data-size={size}>Settings Icon</div>,
  FaInfoCircle: ({ size }: { size: string }) => <div data-testid="about-icon" data-size={size}>About Icon</div>,
  FaSignOutAlt: ({ size }: { size: string }) => <div data-testid="logout-icon" data-size={size}>Logout Icon</div>,
}))

// Wrapper component for tests that need Router
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Sidebar Component', () => {
  const mockSignOut = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      signOut: mockSignOut,
      user: null,
      loading: false,
    })
  })

  describe('Rendering', () => {
    it('renders sidebar with title', () => {
      render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      expect(screen.getByText('Finance Tracker')).toBeInTheDocument()
    })

    it('renders with fixed positioning and styling', () => {
      render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      const sidebar = screen.getByText('Finance Tracker').closest('div')
      expect(sidebar).toHaveClass(
        'fixed',
        'top-0',
        'left-0',
        'h-screen',
        'w-16',
        'bg-gray-900',
        'text-white',
        'shadow-lg'
      )
    })
  })

  describe('Navigation Links', () => {
    it('renders all navigation links', () => {
      render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard')
      expect(screen.getByRole('link', { name: /transactions/i })).toHaveAttribute('href', '/transactions')
      expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings')
      expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about')
    })

    it('renders correct icons with proper sizes', () => {
      render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      expect(screen.getByTestId('home-icon')).toHaveAttribute('data-size', '28')
      expect(screen.getByTestId('transactions-icon')).toHaveAttribute('data-size', '28')
      expect(screen.getByTestId('settings-icon')).toHaveAttribute('data-size', '28')
      expect(screen.getByTestId('about-icon')).toHaveAttribute('data-size', '28')
      expect(screen.getByTestId('logout-icon')).toHaveAttribute('data-size', '28')
    })

    it('applies correct styling to dashboard link', () => {
      render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
      expect(dashboardLink).toHaveClass('text-red-950')
    })
  })

  describe('SideBarIcon Component', () => {
    it('renders tooltips for each navigation item', () => {
      render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Transactions')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('About')).toBeInTheDocument()
      expect(screen.getByText('Logout')).toBeInTheDocument()
    })

    it('applies sidebar-icon and group classes', () => {
      render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      const icons = screen.getAllByText(/Dashboard|Transactions|Settings|About|Logout/)
      icons.forEach(tooltip => {
        const iconContainer = tooltip.closest('.sidebar-icon')
        expect(iconContainer).toHaveClass('sidebar-icon', 'group')
      })
    })

    it('applies tooltip styling classes', () => {
      render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      // Check for spans with the tooltip classes
      const container = screen.getByText('Finance Tracker').closest('div')
      const tooltipSpans = container?.querySelectorAll('span.sidebar-tooltip')
      
      expect(tooltipSpans).toBeTruthy()
      if (tooltipSpans) {
        expect(tooltipSpans.length).toBeGreaterThan(0)
        tooltipSpans.forEach(span => {
          expect(span).toHaveClass('sidebar-tooltip', 'group-hover:scale-100')
        })
      }
    })
  })

  describe('Logout Functionality', () => {
    it('renders logout button', () => {
      render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      const logoutButton = screen.getByRole('button', { name: /logout/i })
      expect(logoutButton).toBeInTheDocument()
      expect(logoutButton).toHaveClass('w-full')
    })

    it('calls signOut when logout button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      const logoutButton = screen.getByRole('button', { name: /logout/i })
      await user.click(logoutButton)

      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })

    it('handles logout errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockError = new Error('Logout failed')
      mockSignOut.mockRejectedValue(mockError)

      const user = userEvent.setup()
      render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      const logoutButton = screen.getByRole('button', { name: /logout/i })
      await user.click(logoutButton)

      expect(mockSignOut).toHaveBeenCalledTimes(1)
      expect(consoleSpy).toHaveBeenCalledWith('Error signing out:', mockError)
      
      consoleSpy.mockRestore()
    })
  })

  describe('Structure and Accessibility', () => {
    it('uses semantic list structure', () => {
      render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
      expect(list).toHaveStyle({ listStyle: 'none', padding: '0', margin: '0' })
    })

    it('has proper list items', () => {
      render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      const listItems = screen.getAllByRole('listitem')
      expect(listItems).toHaveLength(5) // Dashboard, Transactions, Settings, About, Logout
    })

    it('provides accessible navigation', () => {
      render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      // All links should be keyboard accessible
      const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
      const transactionsLink = screen.getByRole('link', { name: /transactions/i })
      const settingsLink = screen.getByRole('link', { name: /settings/i })
      const aboutLink = screen.getByRole('link', { name: /about/i })
      const logoutButton = screen.getByRole('button', { name: /logout/i })

      expect(dashboardLink).toBeInTheDocument()
      expect(transactionsLink).toBeInTheDocument()
      expect(settingsLink).toBeInTheDocument()
      expect(aboutLink).toBeInTheDocument()
      expect(logoutButton).toBeInTheDocument()
    })
  })

  describe('Integration with AuthContext', () => {
    it('uses signOut from AuthContext', () => {
      render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      expect(mockUseAuth).toHaveBeenCalled()
    })

    it('handles different auth states', () => {
      // Test with different auth context values
      mockUseAuth.mockReturnValue({
        signOut: mockSignOut,
        user: { id: '123', email: 'test@example.com' },
        loading: false,
      })

      render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      // Sidebar should still render normally regardless of auth state
      expect(screen.getByText('Finance Tracker')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
    })
  })

  describe('Visual Layout', () => {
    it('has proper container structure', () => {
      render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      const container = screen.getByText('Finance Tracker').closest('div')
      expect(container).toHaveClass('flex', 'flex-col')
    })

    it('renders break element for spacing', () => {
      const { container } = render(
        <RouterWrapper>
          <Sidebar />
        </RouterWrapper>
      )

      const breakElement = container.querySelector('br')
      expect(breakElement).toBeInTheDocument()
    })
  })
})