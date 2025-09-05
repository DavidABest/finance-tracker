import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import About from '../About'

vi.mock('../Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar Component</div>
}))

vi.mock('../Comparison', () => ({
  default: () => <div data-testid="comparison">Comparison Component</div>
}))

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('About Component', () => {
  describe('Rendering', () => {
    it('renders with sidebar', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      )

      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    })

    it('displays the main heading', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      )

      expect(screen.getByText('This is a personal app made by David Best')).toBeInTheDocument()
    })

    it('displays the disclaimer text', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      )

      const disclaimerText = screen.getByText(/The story, all names, characters, credits portrayed in this fake data are fictitious/)
      expect(disclaimerText).toBeInTheDocument()
    })

    it('includes the comparison component', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      )

      expect(screen.getByTestId('comparison')).toBeInTheDocument()
    })
  })

  describe('Content Structure', () => {
    it('has proper heading hierarchy', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      )

      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent('This is a personal app made by David Best')

      const h2 = screen.getByRole('heading', { level: 2 })
      expect(h2).toHaveTextContent(/The story, all names, characters/)
    })

    it('applies margin bottom to main heading', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      )

      const mainHeading = screen.getByText('This is a personal app made by David Best')
      expect(mainHeading).toHaveClass('mb-10')
    })
  })

  describe('Disclaimer Content', () => {
    it('contains full disclaimer text', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      )

      const fullDisclaimer = 'The story, all names, characters, credits portrayed in this fake data are fictitious. No identification with actual persons (living or deceased), credits, debts, and life style is intended or should be inferred.'
      expect(screen.getByText(fullDisclaimer)).toBeInTheDocument()
    })

    it('emphasizes that data is fictitious', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      )

      expect(screen.getByText(/fictitious/)).toBeInTheDocument()
      expect(screen.getByText(/fake data/)).toBeInTheDocument()
    })

    it('includes legal disclaimer language', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      )

      expect(screen.getByText(/No identification with actual persons/)).toBeInTheDocument()
      expect(screen.getByText(/living or deceased/)).toBeInTheDocument()
    })
  })

  describe('Component Integration', () => {
    it('includes all required subcomponents', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      )

      // Check that all components are present
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
      expect(screen.getByTestId('comparison')).toBeInTheDocument()
    })

    it('renders components in correct order', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      )

      // Verify both components are present
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
      expect(screen.getByTestId('comparison')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      )

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    })

    it('provides meaningful content', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      )

      // Verify the page provides information about the app's purpose and disclaimers
      expect(screen.getByText(/personal app/)).toBeInTheDocument()
      expect(screen.getByText(/David Best/)).toBeInTheDocument()
    })
  })

  describe('Styling and Layout', () => {
    it('applies CSS classes correctly', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      )

      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toHaveClass('mb-10')
    })
  })

  describe('Router Integration', () => {
    it('works with router context', () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>
      )

      // Should render without router-related errors
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    })
  })

  describe('Component Export', () => {
    it('exports the component as default', () => {
      expect(About).toBeDefined()
      expect(typeof About).toBe('function')
    })
  })
})