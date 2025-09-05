import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Label } from '../label'
import { Input } from '../input'
import { createRef } from 'react'

describe('Label Component', () => {
  describe('Rendering', () => {
    it('renders label element', () => {
      render(<Label data-testid="label">Test Label</Label>)
      const label = screen.getByTestId('label')
      
      expect(label).toBeInTheDocument()
      expect(label.tagName).toBe('LABEL')
      expect(label).toHaveTextContent('Test Label')
    })

    it('applies default classes', () => {
      render(<Label data-testid="label">Label</Label>)
      const label = screen.getByTestId('label')
      
      expect(label).toHaveClass(
        'text-sm',
        'font-medium',
        'leading-none',
        'peer-disabled:cursor-not-allowed',
        'peer-disabled:opacity-70'
      )
    })
  })

  describe('Props and Attributes', () => {
    it('accepts custom className', () => {
      render(<Label className="custom-class" data-testid="label">Label</Label>)
      const label = screen.getByTestId('label')
      
      expect(label).toHaveClass('custom-class')
      expect(label).toHaveClass('text-sm') // Still has default classes
    })

    it('forwards HTML label attributes', () => {
      render(
        <Label
          htmlFor="test-input"
          id="test-label"
          data-testid="label"
        >
          Test Label
        </Label>
      )
      const label = screen.getByTestId('label')
      
      expect(label).toHaveAttribute('for', 'test-input')
      expect(label).toHaveAttribute('id', 'test-label')
    })

    it('accepts children content', () => {
      render(
        <Label data-testid="label">
          <span>Complex</span> Label Content
        </Label>
      )
      const label = screen.getByTestId('label')
      
      expect(label).toContainElement(screen.getByText('Complex'))
      expect(label).toHaveTextContent('Complex Label Content')
    })
  })

  describe('Label Association', () => {
    it('associates with input using htmlFor', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" />
        </div>
      )
      
      const label = screen.getByText('Email Address')
      const input = screen.getByRole('textbox')
      
      // Click label should focus input
      await user.click(label)
      expect(input).toHaveFocus()
    })

    it('works with implicit association (wrapping)', async () => {
      const user = userEvent.setup()
      render(
        <Label>
          Username
          <Input type="text" />
        </Label>
      )
      
      const label = screen.getByText('Username')
      const input = screen.getByRole('textbox')
      
      // Click label should focus input
      await user.click(label)
      expect(input).toHaveFocus()
    })

    it('finds input by accessible name', () => {
      render(
        <div>
          <Label htmlFor="search">Search</Label>
          <Input id="search" />
        </div>
      )
      
      // Input should be findable by its accessible name
      const input = screen.getByLabelText('Search')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    it('forwards ref to label element', () => {
      const ref = createRef<HTMLLabelElement>()
      render(<Label ref={ref} data-testid="label">Label</Label>)
      
      expect(ref.current).toBeInstanceOf(HTMLLabelElement)
      expect(ref.current).toBe(screen.getByTestId('label'))
    })

    it('allows ref methods to be called', () => {
      const ref = createRef<HTMLLabelElement>()
      render(<Label ref={ref}>Label</Label>)
      
      expect(ref.current?.click).toBeDefined()
      expect(ref.current?.focus).toBeDefined()
    })
  })

  describe('Peer State Handling', () => {
    it('has peer-disabled classes for styling disabled inputs', () => {
      render(
        <div>
          <Label htmlFor="disabled-input" data-testid="label">
            Disabled Field
          </Label>
          <Input id="disabled-input" disabled className="peer" />
        </div>
      )
      
      const label = screen.getByTestId('label')
      expect(label).toHaveClass('peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70')
    })
  })

  describe('Accessibility', () => {
    it('supports form labels properly', () => {
      render(
        <form>
          <Label htmlFor="username">Username</Label>
          <Input id="username" required />
        </form>
      )
      
      const input = screen.getByLabelText('Username')
      expect(input).toBeRequired()
    })

    it('works with screen readers', () => {
      render(
        <div>
          <Label htmlFor="description">Description</Label>
          <Input id="description" aria-describedby="desc-help" />
          <div id="desc-help">Enter a brief description</div>
        </div>
      )
      
      const input = screen.getByLabelText('Description')
      expect(input).toHaveAttribute('aria-describedby', 'desc-help')
    })

    it('supports required field indicators', () => {
      render(
        <div>
          <Label htmlFor="required-field">
            Name <span aria-label="required">*</span>
          </Label>
          <Input id="required-field" required />
        </div>
      )
      
      expect(screen.getByLabelText('required')).toBeInTheDocument()
      expect(screen.getByLabelText('Name *')).toBeRequired()
    })
  })

  describe('Display Name', () => {
    it('has correct displayName for debugging', () => {
      expect(Label.displayName).toBe('Label')
    })
  })

  describe('Form Integration', () => {
    it('works in complete form scenarios', async () => {
      const handleSubmit = vi.fn()
      const user = userEvent.setup()
      
      render(
        <form onSubmit={handleSubmit}>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required />
          
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
          
          <button type="submit">Submit</button>
        </form>
      )
      
      // Fill out form via labels
      await user.click(screen.getByText('Email'))
      await user.type(screen.getByLabelText('Email'), 'test@example.com')
      
      await user.click(screen.getByText('Password'))
      await user.type(screen.getByLabelText('Password'), 'password123')
      
      expect(screen.getByLabelText('Email')).toHaveValue('test@example.com')
      expect(screen.getByLabelText('Password')).toHaveValue('password123')
    })
  })
})