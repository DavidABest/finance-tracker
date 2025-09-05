import { render, screen } from '@testing-library/react'
import { Badge } from '../badge'

describe('Badge Component', () => {
  describe('Rendering', () => {
    it('renders with default variant', () => {
      render(<Badge data-testid="badge">Default Badge</Badge>)
      const badge = screen.getByTestId('badge')
      
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveAttribute('data-slot', 'badge')
      expect(badge).toHaveClass('bg-primary', 'text-primary-foreground', 'border-transparent')
      expect(badge).toHaveTextContent('Default Badge')
    })

    it('renders as span by default', () => {
      render(<Badge>Test Badge</Badge>)
      const badge = screen.getByText('Test Badge')
      
      expect(badge.tagName).toBe('SPAN')
    })

    it('renders children correctly', () => {
      render(<Badge>Badge Content</Badge>)
      expect(screen.getByText('Badge Content')).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Badge variant="default" data-testid="badge">Default</Badge>)
      const badge = screen.getByTestId('badge')
      
      expect(badge).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('renders secondary variant', () => {
      render(<Badge variant="secondary" data-testid="badge">Secondary</Badge>)
      const badge = screen.getByTestId('badge')
      
      expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground')
    })

    it('renders destructive variant', () => {
      render(<Badge variant="destructive" data-testid="badge">Destructive</Badge>)
      const badge = screen.getByTestId('badge')
      
      expect(badge).toHaveClass('bg-destructive', 'text-white')
    })

    it('renders outline variant', () => {
      render(<Badge variant="outline" data-testid="badge">Outline</Badge>)
      const badge = screen.getByTestId('badge')
      
      expect(badge).toHaveClass('text-foreground')
      expect(badge).not.toHaveClass('bg-primary')
    })
  })

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(<Badge className="custom-class" data-testid="badge">Custom</Badge>)
      const badge = screen.getByTestId('badge')
      
      expect(badge).toHaveClass('custom-class')
      expect(badge).toHaveClass('bg-primary') // Still has default classes
    })

    it('forwards HTML attributes', () => {
      render(<Badge id="test-badge" title="Test Title">Badge</Badge>)
      const badge = screen.getByText('Badge')
      
      expect(badge).toHaveAttribute('id', 'test-badge')
      expect(badge).toHaveAttribute('title', 'Test Title')
    })

    it('applies common badge styling classes', () => {
      render(<Badge data-testid="badge">Test</Badge>)
      const badge = screen.getByTestId('badge')
      
      expect(badge).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'rounded-md',
        'border',
        'px-2',
        'py-0.5',
        'text-xs',
        'font-medium'
      )
    })
  })

  describe('AsChild Prop', () => {
    it('renders as child component when asChild is true', () => {
      render(
        <Badge asChild data-testid="link-badge">
          <a href="/test">Link Badge</a>
        </Badge>
      )
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
      expect(link).toHaveClass('bg-primary') // Should still have badge styles
      expect(link).toHaveAttribute('data-slot', 'badge')
    })

    it('can render as button when asChild is true', () => {
      render(
        <Badge asChild>
          <button onClick={() => {}}>Button Badge</button>
        </Badge>
      )
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-primary') // Should still have badge styles
      expect(button).toHaveTextContent('Button Badge')
    })
  })

  describe('Content Variations', () => {
    it('handles text content', () => {
      render(<Badge>Text Badge</Badge>)
      expect(screen.getByText('Text Badge')).toBeInTheDocument()
    })

    it('handles numeric content', () => {
      render(<Badge>42</Badge>)
      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('handles mixed content with icons', () => {
      render(
        <Badge data-testid="icon-badge">
          <svg data-testid="icon" width="12" height="12">
            <circle cx="6" cy="6" r="6" />
          </svg>
          With Icon
        </Badge>
      )
      
      expect(screen.getByTestId('icon-badge')).toBeInTheDocument()
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('With Icon')).toBeInTheDocument()
    })

    it('handles empty content', () => {
      render(<Badge data-testid="empty"></Badge>)
      const badge = screen.getByTestId('empty')
      
      expect(badge).toBeInTheDocument()
      expect(badge).toBeEmptyDOMElement()
    })
  })

  describe('Styling Classes', () => {
    it('has responsive and interactive classes', () => {
      render(<Badge data-testid="badge">Interactive</Badge>)
      const badge = screen.getByTestId('badge')
      
      expect(badge).toHaveClass(
        'w-fit',
        'whitespace-nowrap',
        'shrink-0',
        'focus-visible:border-ring',
        'transition-[color,box-shadow]'
      )
    })

    it('has proper icon sizing classes', () => {
      render(<Badge data-testid="badge">Test</Badge>)
      const badge = screen.getByTestId('badge')
      
      // Check for icon-related classes
      expect(badge.className).toMatch(/\[&>svg\]:size-3/)
      expect(badge.className).toMatch(/\[&>svg\]:pointer-events-none/)
    })
  })
})