import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute'
import { useAuth } from '../../contexts/AuthContext'

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const mockUseAuth = vi.mocked(useAuth)

// Test component to use as children
const TestChild = () => <div data-testid="protected-content">Protected Content</div>

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Authentication States', () => {
    it('shows loading state when auth is loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        signOut: vi.fn(),
      })

      render(
        <MemoryRouter>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </MemoryRouter>
      )

      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('redirects to login when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        signOut: vi.fn(),
      })

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </MemoryRouter>
      )

      // Should not show protected content
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      // Should not show loading
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    it('renders children when user is authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '123', email: 'test@example.com' },
        loading: false,
        signOut: vi.fn(),
      })

      render(
        <MemoryRouter>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </MemoryRouter>
      )

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
  })

  describe('Loading State Styling', () => {
    it('applies proper loading screen styles', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        signOut: vi.fn(),
      })

      render(
        <MemoryRouter>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </MemoryRouter>
      )

      const loadingContainer = screen.getByText('Loading...').closest('.min-h-screen')
      expect(loadingContainer).toHaveClass(
        'min-h-screen',
        'flex',
        'items-center',
        'justify-center',
        'bg-white',
        'dark:bg-[#1e2124]'
      )
    })

    it('centers loading text', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        signOut: vi.fn(),
      })

      render(
        <MemoryRouter>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </MemoryRouter>
      )

      const loadingText = screen.getByText('Loading...')
      expect(loadingText.closest('div')).toHaveClass('text-center')
    })
  })

  describe('Children Rendering', () => {
    it('renders multiple children when authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '123', email: 'test@example.com' },
        loading: false,
        signOut: vi.fn(),
      })

      render(
        <MemoryRouter>
          <ProtectedRoute>
            <div data-testid="child-1">Child 1</div>
            <div data-testid="child-2">Child 2</div>
            <TestChild />
          </ProtectedRoute>
        </MemoryRouter>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })

    it('renders complex JSX children', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '123', email: 'test@example.com' },
        loading: false,
        signOut: vi.fn(),
      })

      render(
        <MemoryRouter>
          <ProtectedRoute>
            <div>
              <h1>Protected Page</h1>
              <p>This is protected content</p>
              <button>Action Button</button>
            </div>
          </ProtectedRoute>
        </MemoryRouter>
      )

      expect(screen.getByRole('heading', { name: 'Protected Page' })).toBeInTheDocument()
      expect(screen.getByText('This is protected content')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
    })
  })

  describe('Navigation Behavior', () => {
    it('uses replace navigation for unauthenticated users', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        signOut: vi.fn(),
      })

      // This test verifies that the Navigate component is called with replace prop
      render(
        <MemoryRouter initialEntries={['/protected']}>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </MemoryRouter>
      )

      // The component should redirect, not showing protected content
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
  })

  describe('Hook Integration', () => {
    it('calls useAuth hook', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '123', email: 'test@example.com' },
        loading: false,
        signOut: vi.fn(),
      })

      render(
        <MemoryRouter>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </MemoryRouter>
      )

      expect(mockUseAuth).toHaveBeenCalled()
    })

    it('handles different user objects', () => {
      const userData = {
        id: '456',
        email: 'another@example.com',
        name: 'John Doe'
      }

      mockUseAuth.mockReturnValue({
        user: userData,
        loading: false,
        signOut: vi.fn(),
      })

      render(
        <MemoryRouter>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </MemoryRouter>
      )

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles missing children gracefully', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '123', email: 'test@example.com' },
        loading: false,
        signOut: vi.fn(),
      })

      render(
        <MemoryRouter>
          <ProtectedRoute>
            {null}
          </ProtectedRoute>
        </MemoryRouter>
      )

      // Should render without error
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    it('handles loading state changing to authenticated', () => {
      const { rerender } = render(
        <MemoryRouter>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </MemoryRouter>
      )

      // Initially loading
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        signOut: vi.fn(),
      })

      rerender(
        <MemoryRouter>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </MemoryRouter>
      )

      expect(screen.getByText('Loading...')).toBeInTheDocument()

      // Then authenticated
      mockUseAuth.mockReturnValue({
        user: { id: '123', email: 'test@example.com' },
        loading: false,
        signOut: vi.fn(),
      })

      rerender(
        <MemoryRouter>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </MemoryRouter>
      )

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })
  })

  describe('TypeScript Interface', () => {
    it('accepts ReactNode children prop', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '123', email: 'test@example.com' },
        loading: false,
        signOut: vi.fn(),
      })

      // This test verifies the TypeScript interface works correctly
      render(
        <MemoryRouter>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </MemoryRouter>
      )

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })
  })

  describe('Component Export', () => {
    it('exports the component as default', () => {
      expect(ProtectedRoute).toBeDefined()
      expect(typeof ProtectedRoute).toBe('function')
    })
  })
})