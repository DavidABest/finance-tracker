import { render, screen } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from '../alert'

describe('Alert Components', () => {
  describe('Alert', () => {
    it('renders with default variant and role', () => {
      render(<Alert data-testid="alert">Alert content</Alert>)
      const alert = screen.getByTestId('alert')
      
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveAttribute('role', 'alert')
      expect(alert).toHaveAttribute('data-slot', 'alert')
      expect(alert).toHaveClass('bg-card', 'text-card-foreground', 'rounded-lg', 'border')
      expect(alert).toHaveTextContent('Alert content')
    })

    it('renders destructive variant', () => {
      render(<Alert variant="destructive" data-testid="alert">Error</Alert>)
      const alert = screen.getByTestId('alert')
      
      expect(alert).toHaveClass('text-destructive', 'bg-card')
    })

    it('applies custom className', () => {
      render(<Alert className="custom-class" data-testid="alert">Content</Alert>)
      const alert = screen.getByTestId('alert')
      
      expect(alert).toHaveClass('custom-class')
      expect(alert).toHaveClass('bg-card') // Still has default classes
    })

    it('forwards HTML attributes', () => {
      render(<Alert id="test-alert">Content</Alert>)
      const alert = screen.getByRole('alert')
      
      expect(alert).toHaveAttribute('id', 'test-alert')
    })
  })

  describe('AlertTitle', () => {
    it('renders with correct classes and data-slot', () => {
      render(<AlertTitle data-testid="title">Alert Title</AlertTitle>)
      const title = screen.getByTestId('title')
      
      expect(title).toBeInTheDocument()
      expect(title).toHaveAttribute('data-slot', 'alert-title')
      expect(title).toHaveClass('col-start-2', 'font-medium', 'tracking-tight')
      expect(title).toHaveTextContent('Alert Title')
    })

    it('applies custom className', () => {
      render(<AlertTitle className="custom-title" data-testid="title">Title</AlertTitle>)
      const title = screen.getByTestId('title')
      
      expect(title).toHaveClass('custom-title')
      expect(title).toHaveClass('font-medium') // Still has default classes
    })
  })

  describe('AlertDescription', () => {
    it('renders with correct styling', () => {
      render(<AlertDescription data-testid="desc">Alert description</AlertDescription>)
      const desc = screen.getByTestId('desc')
      
      expect(desc).toBeInTheDocument()
      expect(desc).toHaveAttribute('data-slot', 'alert-description')
      expect(desc).toHaveClass('text-muted-foreground', 'col-start-2', 'text-sm')
      expect(desc).toHaveTextContent('Alert description')
    })

    it('handles paragraph content correctly', () => {
      render(
        <AlertDescription data-testid="desc">
          <p>First paragraph</p>
          <p>Second paragraph</p>
        </AlertDescription>
      )
      const desc = screen.getByTestId('desc')
      
      expect(desc).toContainElement(screen.getByText('First paragraph'))
      expect(desc).toContainElement(screen.getByText('Second paragraph'))
    })
  })

  describe('Complete Alert Structure', () => {
    it('renders a complete alert with title and description', () => {
      render(
        <Alert data-testid="complete-alert">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>This is a warning message</AlertDescription>
        </Alert>
      )

      const alert = screen.getByTestId('complete-alert')
      expect(alert).toBeInTheDocument()
      expect(screen.getByText('Warning')).toBeInTheDocument()
      expect(screen.getByText('This is a warning message')).toBeInTheDocument()
    })

    it('renders destructive alert with icon space', () => {
      render(
        <Alert variant="destructive" data-testid="error-alert">
          <svg data-testid="icon">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z"/>
          </svg>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something went wrong</AlertDescription>
        </Alert>
      )

      expect(screen.getByTestId('error-alert')).toHaveClass('text-destructive')
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper alert role', () => {
      render(<Alert>Important message</Alert>)
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('alert role is implicit for screen readers', () => {
      render(<Alert>Screen reader will announce this</Alert>)
      const alert = screen.getByRole('alert')
      expect(alert).toHaveTextContent('Screen reader will announce this')
    })
  })
})