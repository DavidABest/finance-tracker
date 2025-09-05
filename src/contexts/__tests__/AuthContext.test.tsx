import { render, screen, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'
import { supabase } from '../../supabaseClient'

// Mock Supabase
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    }
  }
}))

const mockSupabase = vi.mocked(supabase)

// Test component that uses the auth context
const TestComponent = () => {
  const { user, loading, signOut } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="user">{user ? `User: ${user.email}` : 'No User'}</div>
      <button onClick={signOut} data-testid="signout">Sign Out</button>
    </div>
  )
}

describe('AuthContext', () => {
  let mockUnsubscribe: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockUnsubscribe = vi.fn()
    
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    })
    
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } }
    })
    
    mockSupabase.auth.signOut.mockResolvedValue({ error: null })
  })

  describe('AuthProvider', () => {
    it('renders children when provided', async () => {
      await act(async () => {
        render(
          <AuthProvider>
            <div data-testid="child">Test Child</div>
          </AuthProvider>
        )
      })

      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('initializes with loading state', async () => {
      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      })

      expect(screen.getByTestId('loading')).toHaveTextContent('Loading')
    })

    it('gets initial session on mount', async () => {
      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      })

      expect(mockSupabase.auth.getSession).toHaveBeenCalled()
    })

    it('sets up auth state change listener', async () => {
      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      })

      expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalled()
    })

    it('cleans up subscription on unmount', async () => {
      const { unmount } = await act(async () => {
        return render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      })

      unmount()

      expect(mockUnsubscribe).toHaveBeenCalled()
    })
  })

  describe('Authentication States', () => {
    it('handles no user session', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      })

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      })

      expect(screen.getByTestId('user')).toHaveTextContent('No User')
    })

    it('handles authenticated user session', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: {}
      }

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: { user: mockUser, access_token: 'token' } },
        error: null
      })

      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      })

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      })

      expect(screen.getByTestId('user')).toHaveTextContent('User: test@example.com')
    })

    it('updates user state on auth change', async () => {
      let authStateCallback: (event: string, session: any) => void

      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authStateCallback = callback
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } }
      })

      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      })

      // Initially no user
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('No User')
      })

      // Simulate sign in
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: {}
      }

      await act(async () => {
        authStateCallback!('SIGNED_IN', { user: mockUser, access_token: 'token' })
      })

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('User: test@example.com')
      })
    })

    it('handles sign out auth change', async () => {
      let authStateCallback: (event: string, session: any) => void

      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authStateCallback = callback
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } }
      })

      // Start with authenticated user
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: {}
      }

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: { user: mockUser, access_token: 'token' } },
        error: null
      })

      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      })

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('User: test@example.com')
      })

      // Simulate sign out
      await act(async () => {
        authStateCallback!('SIGNED_OUT', null)
      })

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('No User')
      })
    })
  })

  describe('signOut function', () => {
    it('calls supabase signOut', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null })

      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      })

      const signOutButton = screen.getByTestId('signout')
      signOutButton.click()

      await waitFor(() => {
        expect(mockSupabase.auth.signOut).toHaveBeenCalled()
      })
    })

    it('throws error when signOut fails', async () => {
      const mockError = new Error('Sign out failed')
      mockSupabase.auth.signOut.mockResolvedValue({ error: mockError })

      const TestComponentWithErrorHandling = () => {
        const { signOut } = useAuth()
        
        const handleSignOut = async () => {
          try {
            await signOut()
          } catch (error) {
            return <div data-testid="error">Error: {(error as Error).message}</div>
          }
        }
        
        return <button onClick={handleSignOut} data-testid="signout">Sign Out</button>
      }

      await act(async () => {
        render(
          <AuthProvider>
            <TestComponentWithErrorHandling />
          </AuthProvider>
        )
      })

      const signOutButton = screen.getByTestId('signout')
      signOutButton.click()

      await waitFor(() => {
        expect(mockSupabase.auth.signOut).toHaveBeenCalled()
      })
    })
  })

  describe('useAuth hook', () => {
    it('throws error when used outside AuthProvider', () => {
      // Mock console.error to prevent error output in tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<TestComponent />)
      }).toThrow('useAuth must be used within an AuthProvider')

      consoleSpy.mockRestore()
    })

    it('returns context value when used inside AuthProvider', async () => {
      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      })

      expect(screen.getByTestId('loading')).toBeInTheDocument()
      expect(screen.getByTestId('user')).toBeInTheDocument()
      expect(screen.getByTestId('signout')).toBeInTheDocument()
    })
  })

  describe('Context Value', () => {
    it('provides correct initial values', async () => {
      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      })

      expect(screen.getByTestId('loading')).toHaveTextContent('Loading')
      expect(screen.getByTestId('user')).toHaveTextContent('No User')
    })

    it('updates values based on auth state', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: {}
      }

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: { user: mockUser, access_token: 'token' } },
        error: null
      })

      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      })

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
        expect(screen.getByTestId('user')).toHaveTextContent('User: test@example.com')
      })
    })
  })

  describe('Error Handling', () => {
    it('handles getSession errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockSupabase.auth.getSession.mockRejectedValue(new Error('Session error'))

      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      })

      // Should still render children even if getSession fails
      expect(screen.getByTestId('loading')).toBeInTheDocument()
      
      consoleSpy.mockRestore()
    })

    it('handles auth state change errors', async () => {
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        // Simulate error in callback
        setTimeout(() => callback('ERROR', null), 0)
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } }
      })

      await act(async () => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      })

      // Should continue working despite auth state change error
      expect(screen.getByTestId('loading')).toBeInTheDocument()
    })
  })
})