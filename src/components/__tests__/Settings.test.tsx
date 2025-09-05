import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Settings from '../Settings'

vi.mock('../Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar Component</div>
}))

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Settings Component', () => {
  describe('Rendering', () => {
    it('renders with sidebar', () => {
      render(
        <RouterWrapper>
          <Settings />
        </RouterWrapper>
      )

      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    })

    it('displays the settings message', () => {
      render(
        <RouterWrapper>
          <Settings />
        </RouterWrapper>
      )

      expect(screen.getByText('This is my settings page. Look and see that it is barren.')).toBeInTheDocument()
    })

    it('renders the message as a heading', () => {
      render(
        <RouterWrapper>
          <Settings />
        </RouterWrapper>
      )

      const heading = screen.getByRole('heading', { 
        name: 'This is my settings page. Look and see that it is barren.' 
      })
      expect(heading).toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    it('contains sidebar and main content', () => {
      const { container } = render(
        <RouterWrapper>
          <Settings />
        </RouterWrapper>
      )

      // Check that component has the expected structure
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
      expect(screen.getByRole('heading')).toBeInTheDocument()
      
      // Ensure it's wrapped in a fragment (React.Fragment)
      expect(container.firstChild).toBeTruthy()
    })

    it('is a simple component with minimal functionality', () => {
      render(
        <RouterWrapper>
          <Settings />
        </RouterWrapper>
      )

      // Verify it's indeed a simple placeholder component
      const allElements = screen.getAllByText(/./);
      expect(allElements.length).toBeLessThanOrEqual(2); // Only sidebar text and settings text
    })
  })

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(
        <RouterWrapper>
          <Settings />
        </RouterWrapper>
      )

      const heading = screen.getByRole('heading')
      expect(heading.tagName).toBe('H1')
    })

    it('contains meaningful text content', () => {
      render(
        <RouterWrapper>
          <Settings />
        </RouterWrapper>
      )

      // The message indicates this is a placeholder/empty settings page
      expect(screen.getByText(/barren/)).toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    it('works with router context', () => {
      render(
        <RouterWrapper>
          <Settings />
        </RouterWrapper>
      )

      // Should render without router-related errors
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    })

    it('renders consistently', () => {
      const { rerender } = render(
        <RouterWrapper>
          <Settings />
        </RouterWrapper>
      )

      const initialText = screen.getByText('This is my settings page. Look and see that it is barren.')
      
      rerender(
        <RouterWrapper>
          <Settings />
        </RouterWrapper>
      )

      // Should render the same content consistently
      expect(screen.getByText('This is my settings page. Look and see that it is barren.')).toBeInTheDocument()
    })
  })

  describe('Component Export', () => {
    it('exports the component as default', () => {
      // This test ensures the component is properly exported
      expect(Settings).toBeDefined()
      expect(typeof Settings).toBe('function')
    })
  })
})