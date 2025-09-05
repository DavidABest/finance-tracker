import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../input'
import { createRef } from 'react'

describe('Input Component', () => {
  describe('Rendering', () => {
    it('renders input element', () => {
      render(<Input data-testid="input" />)
      const input = screen.getByTestId('input')
      
      expect(input).toBeInTheDocument()
      expect(input.tagName).toBe('INPUT')
    })

    it('applies default classes', () => {
      render(<Input data-testid="input" />)
      const input = screen.getByTestId('input')
      
      expect(input).toHaveClass(
        'flex',
        'h-10',
        'w-full',
        'rounded-md',
        'border',
        'border-input',
        'bg-background',
        'px-3',
        'py-2',
        'text-sm'
      )
    })

    it('has correct focus and disabled styles', () => {
      render(<Input data-testid="input" />)
      const input = screen.getByTestId('input')
      
      expect(input).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50'
      )
    })
  })

  describe('Props and Attributes', () => {
    it('accepts different input types', () => {
      render(<Input type="email" data-testid="email-input" />)
      const input = screen.getByTestId('email-input')
      
      expect(input).toHaveAttribute('type', 'email')
    })

    it('accepts placeholder text', () => {
      render(<Input placeholder="Enter your name" />)
      const input = screen.getByPlaceholderText('Enter your name')
      
      expect(input).toBeInTheDocument()
      expect(input).toHaveClass('placeholder:text-muted-foreground')
    })

    it('accepts custom className', () => {
      render(<Input className="custom-class" data-testid="input" />)
      const input = screen.getByTestId('input')
      
      expect(input).toHaveClass('custom-class')
      expect(input).toHaveClass('h-10') // Still has default classes
    })

    it('forwards HTML input attributes', () => {
      render(
        <Input
          id="test-input"
          name="testName"
          value="test value"
          readOnly
          data-testid="input"
        />
      )
      const input = screen.getByTestId('input') as HTMLInputElement
      
      expect(input).toHaveAttribute('id', 'test-input')
      expect(input).toHaveAttribute('name', 'testName')
      expect(input.value).toBe('test value')
      expect(input).toHaveAttribute('readonly')
    })

    it('can be disabled', () => {
      render(<Input disabled data-testid="input" />)
      const input = screen.getByTestId('input')
      
      expect(input).toBeDisabled()
    })

    it('can be required', () => {
      render(<Input required data-testid="input" />)
      const input = screen.getByTestId('input')
      
      expect(input).toBeRequired()
    })
  })

  describe('User Interactions', () => {
    it('handles text input', async () => {
      const user = userEvent.setup()
      render(<Input data-testid="input" />)
      const input = screen.getByTestId('input')
      
      await user.type(input, 'Hello World')
      
      expect(input).toHaveValue('Hello World')
    })

    it('handles onChange events', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(<Input onChange={handleChange} data-testid="input" />)
      const input = screen.getByTestId('input')
      
      await user.type(input, 'test')
      
      expect(handleChange).toHaveBeenCalled()
      expect(handleChange).toHaveBeenCalledTimes(4) // Once for each character
    })

    it('handles onFocus and onBlur events', async () => {
      const handleFocus = vi.fn()
      const handleBlur = vi.fn()
      const user = userEvent.setup()
      render(
        <Input
          onFocus={handleFocus}
          onBlur={handleBlur}
          data-testid="input"
        />
      )
      const input = screen.getByTestId('input')
      
      await user.click(input)
      expect(handleFocus).toHaveBeenCalledTimes(1)
      
      await user.tab()
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('does not trigger events when disabled', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(<Input disabled onChange={handleChange} data-testid="input" />)
      const input = screen.getByTestId('input')
      
      await user.type(input, 'test')
      
      expect(handleChange).not.toHaveBeenCalled()
      expect(input).toHaveValue('')
    })
  })

  describe('Input Types', () => {
    it('works as password input', async () => {
      const user = userEvent.setup()
      render(<Input type="password" data-testid="password" />)
      const input = screen.getByTestId('password')
      
      await user.type(input, 'secret123')
      
      expect(input).toHaveAttribute('type', 'password')
      expect(input).toHaveValue('secret123')
    })

    it('works as email input', () => {
      render(<Input type="email" data-testid="email" />)
      const input = screen.getByTestId('email')
      
      expect(input).toHaveAttribute('type', 'email')
    })

    it('works as number input', async () => {
      const user = userEvent.setup()
      render(<Input type="number" data-testid="number" />)
      const input = screen.getByTestId('number')
      
      await user.type(input, '123')
      
      expect(input).toHaveAttribute('type', 'number')
      expect(input).toHaveValue(123)
    })

    it('works as file input', () => {
      render(<Input type="file" data-testid="file" />)
      const input = screen.getByTestId('file')
      
      expect(input).toHaveAttribute('type', 'file')
      expect(input).toHaveClass('file:border-0', 'file:bg-transparent')
    })
  })

  describe('Ref Forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = createRef<HTMLInputElement>()
      render(<Input ref={ref} data-testid="input" />)
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
      expect(ref.current).toBe(screen.getByTestId('input'))
    })

    it('allows ref methods to be called', () => {
      const ref = createRef<HTMLInputElement>()
      render(<Input ref={ref} />)
      
      expect(ref.current?.focus).toBeDefined()
      expect(ref.current?.blur).toBeDefined()
      expect(ref.current?.select).toBeDefined()
    })
  })

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<Input aria-label="Search field" />)
      const input = screen.getByLabelText('Search field')
      
      expect(input).toBeInTheDocument()
    })

    it('supports aria-describedby', () => {
      render(
        <div>
          <Input aria-describedby="help-text" data-testid="input" />
          <div id="help-text">Helper text</div>
        </div>
      )
      const input = screen.getByTestId('input')
      
      expect(input).toHaveAttribute('aria-describedby', 'help-text')
    })

    it('supports aria-invalid', () => {
      render(<Input aria-invalid="true" data-testid="input" />)
      const input = screen.getByTestId('input')
      
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('Display Name', () => {
    it('has correct displayName for debugging', () => {
      expect(Input.displayName).toBe('Input')
    })
  })
})