import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import NotFoundPage from '../NotFoundPage'

vi.mock('../Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar Component</div>
}))

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('NotFoundPage Component', () => {
  describe('Rendering', () => {
    it('renders with sidebar', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    })

    it('displays 404 error code', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      expect(screen.getByText('404')).toBeInTheDocument()
    })

    it('displays page not found message', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      expect(screen.getByText('Page Not Found')).toBeInTheDocument()
    })

    it('displays helpful description', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      expect(screen.getByText("The page you're looking for doesn't exist or has been moved.")).toBeInTheDocument()
    })
  })

  describe('Navigation Links', () => {
    it('provides link to dashboard', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      const dashboardLink = screen.getByRole('link', { name: /go to dashboard/i })
      expect(dashboardLink).toHaveAttribute('href', '/dashboard')
    })

    it('provides link to transactions', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      const transactionsLink = screen.getByRole('link', { name: /view transactions/i })
      expect(transactionsLink).toHaveAttribute('href', '/transactions')
    })

    it('renders navigation buttons with correct variants', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      const dashboardButton = screen.getByRole('button', { name: /go to dashboard/i })
      const transactionsButton = screen.getByRole('button', { name: /view transactions/i })

      // Dashboard button should be primary (no specific variant class for default)
      expect(dashboardButton).toHaveClass('bg-primary')
      
      // Transactions button should be outline variant
      expect(transactionsButton).toHaveClass('border', 'bg-background')
    })

    it('makes buttons full width', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      const dashboardButton = screen.getByRole('button', { name: /go to dashboard/i })
      const transactionsButton = screen.getByRole('button', { name: /view transactions/i })

      expect(dashboardButton).toHaveClass('w-full')
      expect(transactionsButton).toHaveClass('w-full')
    })
  })

  describe('Layout and Styling', () => {
    it('centers content on screen', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      const mainContent = screen.getByText('404').closest('div.min-h-screen')
      expect(mainContent).toHaveClass(
        'min-h-screen',
        'flex',
        'items-center',
        'justify-center'
      )
    })

    it('applies proper spacing to content', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      const mainContent = screen.getByText('404').closest('div.ml-20')
      expect(mainContent).toHaveClass('ml-20', 'p-6')
    })

    it('uses card layout for error content', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      const card = screen.getByText('404').closest('[data-slot="card"]')
      expect(card).toHaveClass('w-full', 'max-w-md')
    })

    it('styles 404 number prominently', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      const errorCode = screen.getByText('404')
      expect(errorCode).toHaveClass('text-6xl', 'mb-4')
    })

    it('applies proper spacing between buttons', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      const buttonContainer = screen.getByRole('button', { name: /go to dashboard/i }).closest('.space-y-3')
      expect(buttonContainer).toHaveClass('space-y-3')
    })
  })

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      const heading = screen.getByText(/page not found/i)
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveClass('text-2xl', 'mb-2')
    })

    it('provides descriptive link text', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      expect(screen.getByRole('link', { name: /go to dashboard/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /view transactions/i })).toBeInTheDocument()
    })

    it('has proper semantic structure', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      // Check for proper card structure
      expect(screen.getByText('404')).toBeInTheDocument()
      expect(screen.getByText(/page not found/i)).toBeInTheDocument()
      expect(screen.getAllByRole('link')).toHaveLength(2)
    })
  })

  describe('Theme Support', () => {
    it('applies dark mode classes', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      const mainContent = screen.getByText('404').closest('.bg-white')
      expect(mainContent).toHaveClass('bg-white', 'dark:bg-[#1e2124]')

      const description = screen.getByText(/doesn't exist or has been moved/)
      expect(description).toHaveClass('text-gray-600', 'dark:text-gray-300')
    })
  })

  describe('Card Structure', () => {
    it('uses proper card components', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      // Check card structure
      expect(screen.getByText('404').closest('[data-slot="card"]')).toBeInTheDocument()
      expect(screen.getByText('Page Not Found').closest('[data-slot="card-header"]')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /go to dashboard/i }).closest('[data-slot="card-content"]')).toBeInTheDocument()
    })

    it('applies card styling correctly', () => {
      render(
        <RouterWrapper>
          <NotFoundPage />
        </RouterWrapper>
      )

      const card = screen.getByText('404').closest('[data-slot="card"]')
      expect(card).toHaveClass('text-center', 'border-none', 'shadow-none')
    })
  })

  describe('Component Export', () => {
    it('exports the component as default', () => {
      expect(NotFoundPage).toBeDefined()
      expect(typeof NotFoundPage).toBe('function')
    })
  })
})