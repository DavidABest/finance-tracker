import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../Login'
import { supabase } from '../../supabaseClient'

// Mock Supabase
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    }
  }
}))

const mockSupabase = vi.mocked(supabase)

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders login form by default', () => {
      render(<Login />)
      
      expect(screen.getByText('Welcome to Clarity Finance Tracker')).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in$/i })).toBeInTheDocument()
      expect(screen.queryByLabelText(/confirm password/i)).not.toBeInTheDocument()
    })

    it('renders OAuth buttons', () => {
      render(<Login />)
      
      expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in with github/i })).toBeInTheDocument()
    })

    it('shows sign up form when toggle is clicked', async () => {
      const user = userEvent.setup()
      render(<Login />)
      
      const toggleButton = screen.getByText(/don't have an account\? sign up/i)
      await user.click(toggleButton)
      
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign up$/i })).toBeInTheDocument()
      expect(screen.getByText(/already have an account\? sign in/i)).toBeInTheDocument()
    })
  })

  describe('Form Interactions', () => {
    it('updates email input', async () => {
      const user = userEvent.setup()
      render(<Login />)
      
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'test@example.com')
      
      expect(emailInput).toHaveValue('test@example.com')
    })

    it('updates password input', async () => {
      const user = userEvent.setup()
      render(<Login />)
      
      const passwordInput = screen.getByLabelText(/password/i)
      await user.type(passwordInput, 'password123')
      
      expect(passwordInput).toHaveValue('password123')
    })

    it('shows error for mismatched passwords in sign up', async () => {
      const user = userEvent.setup()
      render(<Login />)
      
      // Switch to sign up
      await user.click(screen.getByText(/don't have an account\? sign up/i))
      
      // Fill form with mismatched passwords
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'different')
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /sign up$/i }))
      
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  describe('Authentication', () => {
    it('calls Google OAuth when Google button is clicked', async () => {
      const user = userEvent.setup()
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({ data: {}, error: null })
      
      render(<Login />)
      
      await user.click(screen.getByRole('button', { name: /sign in with google/i }))
      
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
    })

    it('calls GitHub OAuth when GitHub button is clicked', async () => {
      const user = userEvent.setup()
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({ data: {}, error: null })
      
      render(<Login />)
      
      await user.click(screen.getByRole('button', { name: /sign in with github/i }))
      
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
    })

    it('handles email sign in', async () => {
      const user = userEvent.setup()
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: {}, error: null })
      
      render(<Login />)
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign in$/i }))
      
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })

    it('handles email sign up', async () => {
      const user = userEvent.setup()
      mockSupabase.auth.signUp.mockResolvedValue({ data: { user: { email_confirmed_at: null } }, error: null })
      
      render(<Login />)
      
      // Switch to sign up
      await user.click(screen.getByText(/don't have an account\? sign up/i))
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign up$/i }))
      
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })
    })
  })

  describe('Error Handling', () => {
    it('displays error from failed OAuth', async () => {
      const user = userEvent.setup()
      const mockError = new Error('OAuth failed')
      mockSupabase.auth.signInWithOAuth.mockRejectedValue(mockError)
      
      render(<Login />)
      
      await user.click(screen.getByRole('button', { name: /sign in with google/i }))
      
      await waitFor(() => {
        expect(screen.getByText('OAuth failed')).toBeInTheDocument()
      })
    })

    it('displays error from failed email sign in', async () => {
      const user = userEvent.setup()
      const mockError = new Error('Invalid credentials')
      mockSupabase.auth.signInWithPassword.mockRejectedValue(mockError)
      
      render(<Login />)
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: /sign in$/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      })
    })

    it('shows confirmation message for sign up', async () => {
      const user = userEvent.setup()
      mockSupabase.auth.signUp.mockResolvedValue({ 
        data: { user: { email_confirmed_at: null } }, 
        error: null 
      })
      
      render(<Login />)
      
      // Switch to sign up
      await user.click(screen.getByText(/don't have an account\? sign up/i))
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign up$/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Check your email to confirm your account')).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('shows loading state during authentication', async () => {
      const user = userEvent.setup()
      // Mock a delayed response
      mockSupabase.auth.signInWithPassword.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ data: {}, error: null }), 100))
      )
      
      render(<Login />)
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      
      const submitButton = screen.getByRole('button', { name: /sign in$/i })
      await user.click(submitButton)
      
      expect(screen.getByText('Please wait...')).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
      expect(screen.getByLabelText(/email/i)).toBeDisabled()
      expect(screen.getByLabelText(/password/i)).toBeDisabled()
    })
  })
})