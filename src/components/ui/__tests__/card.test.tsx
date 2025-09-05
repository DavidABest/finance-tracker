import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '../card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default classes', () => {
      render(<Card data-testid="card">Card content</Card>)
      const card = screen.getByTestId('card')
      
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('bg-card', 'text-card-foreground', 'rounded-xl', 'border', 'shadow-sm')
      expect(card).toHaveAttribute('data-slot', 'card')
      expect(card).toHaveTextContent('Card content')
    })

    it('applies custom className', () => {
      render(<Card className="custom-class" data-testid="card">Content</Card>)
      const card = screen.getByTestId('card')
      
      expect(card).toHaveClass('custom-class')
      expect(card).toHaveClass('bg-card') // Still has default classes
    })

    it('forwards HTML attributes', () => {
      render(<Card id="test-card" role="region">Content</Card>)
      const card = screen.getByRole('region')
      
      expect(card).toHaveAttribute('id', 'test-card')
    })
  })

  describe('CardHeader', () => {
    it('renders with correct classes and data-slot', () => {
      render(<CardHeader data-testid="header">Header content</CardHeader>)
      const header = screen.getByTestId('header')
      
      expect(header).toBeInTheDocument()
      expect(header).toHaveAttribute('data-slot', 'card-header')
      expect(header).toHaveClass('@container/card-header', 'grid', 'px-6')
      expect(header).toHaveTextContent('Header content')
    })
  })

  describe('CardTitle', () => {
    it('renders with correct styling', () => {
      render(<CardTitle data-testid="title">Card Title</CardTitle>)
      const title = screen.getByTestId('title')
      
      expect(title).toBeInTheDocument()
      expect(title).toHaveAttribute('data-slot', 'card-title')
      expect(title).toHaveClass('leading-none', 'font-semibold')
      expect(title).toHaveTextContent('Card Title')
    })
  })

  describe('CardDescription', () => {
    it('renders with muted text styling', () => {
      render(<CardDescription data-testid="desc">Card description</CardDescription>)
      const desc = screen.getByTestId('desc')
      
      expect(desc).toBeInTheDocument()
      expect(desc).toHaveAttribute('data-slot', 'card-description')
      expect(desc).toHaveClass('text-muted-foreground', 'text-sm')
      expect(desc).toHaveTextContent('Card description')
    })
  })

  describe('CardAction', () => {
    it('renders with grid positioning classes', () => {
      render(<CardAction data-testid="action">Action</CardAction>)
      const action = screen.getByTestId('action')
      
      expect(action).toBeInTheDocument()
      expect(action).toHaveAttribute('data-slot', 'card-action')
      expect(action).toHaveClass('col-start-2', 'row-span-2', 'self-start', 'justify-self-end')
    })
  })

  describe('CardContent', () => {
    it('renders with padding', () => {
      render(<CardContent data-testid="content">Main content</CardContent>)
      const content = screen.getByTestId('content')
      
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'card-content')
      expect(content).toHaveClass('px-6')
      expect(content).toHaveTextContent('Main content')
    })
  })

  describe('CardFooter', () => {
    it('renders with flex layout', () => {
      render(<CardFooter data-testid="footer">Footer content</CardFooter>)
      const footer = screen.getByTestId('footer')
      
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveAttribute('data-slot', 'card-footer')
      expect(footer).toHaveClass('flex', 'items-center', 'px-6')
      expect(footer).toHaveTextContent('Footer content')
    })
  })

  describe('Complete Card Structure', () => {
    it('renders a complete card with all components', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
            <CardAction>Action Button</CardAction>
          </CardHeader>
          <CardContent>
            <p>Main content goes here</p>
          </CardContent>
          <CardFooter>
            <span>Footer text</span>
          </CardFooter>
        </Card>
      )

      expect(screen.getByTestId('complete-card')).toBeInTheDocument()
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Action Button')).toBeInTheDocument()
      expect(screen.getByText('Main content goes here')).toBeInTheDocument()
      expect(screen.getByText('Footer text')).toBeInTheDocument()
    })
  })
})