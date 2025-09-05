import { render, screen } from '@testing-library/react'
import Comparison from '../Comparison'

describe('Comparison Component', () => {
  describe('Rendering', () => {
    it('renders the comparison figure', () => {
      const { container } = render(<Comparison />)

      const figure = container.querySelector('figure')
      expect(figure).toBeInTheDocument()
      expect(figure?.tagName).toBe('FIGURE')
    })

    it('has proper figure attributes', () => {
      const { container } = render(<Comparison />)

      const figure = container.querySelector('figure')
      expect(figure).toHaveClass('diff', 'aspect-16/9')
      expect(figure).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('Image Elements', () => {
    it('renders two comparison images', () => {
      const { container } = render(<Comparison />)

      const actualImages = container.querySelectorAll('img')
      expect(actualImages).toHaveLength(2)
    })

    it('has proper image sources', () => {
      render(<Comparison />)

      const images = screen.getAllByRole('img').filter(img => img.tagName === 'IMG')
      
      expect(images[0]).toHaveAttribute('src', 'https://img.daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a.webp')
      expect(images[1]).toHaveAttribute('src', 'https://img.daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a-blur.webp')
    })

    it('has proper alt text for images', () => {
      render(<Comparison />)

      const images = screen.getAllByAltText('daisy')
      expect(images).toHaveLength(2)
      
      images.forEach(img => {
        expect(img).toHaveAttribute('alt', 'daisy')
      })
    })
  })

  describe('Diff Structure', () => {
    it('has diff item containers', () => {
      const { container } = render(<Comparison />)

      const diffItem1 = container.querySelector('.diff-item-1')
      const diffItem2 = container.querySelector('.diff-item-2')

      expect(diffItem1).toBeInTheDocument()
      expect(diffItem2).toBeInTheDocument()
    })

    it('has proper role attributes on diff items', () => {
      const { container } = render(<Comparison />)

      const diffItem1 = container.querySelector('.diff-item-1')
      const diffItem2 = container.querySelector('.diff-item-2')

      expect(diffItem1).toHaveAttribute('role', 'img')
      expect(diffItem1).toHaveAttribute('tabIndex', '0')
      expect(diffItem2).toHaveAttribute('role', 'img')
    })

    it('includes diff resizer element', () => {
      const { container } = render(<Comparison />)

      const resizer = container.querySelector('.diff-resizer')
      expect(resizer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('is keyboard accessible', () => {
      const { container } = render(<Comparison />)

      const figure = container.querySelector('figure')
      const diffItem1 = container.querySelector('.diff-item-1')

      expect(figure).toHaveAttribute('tabIndex', '0')
      expect(diffItem1).toHaveAttribute('tabIndex', '0')
    })

    it('has proper ARIA roles', () => {
      const { container } = render(<Comparison />)

      const diffItems = container.querySelectorAll('[role="img"]')
      expect(diffItems).toHaveLength(2) // 2 diff items
    })

    it('provides meaningful alt text', () => {
      render(<Comparison />)

      const images = screen.getAllByAltText('daisy')
      expect(images).toHaveLength(2)
    })
  })

  describe('Component Structure', () => {
    it('wraps content in React fragment', () => {
      const { container } = render(<Comparison />)

      // The component should render its content directly (wrapped in fragment)
      expect(container.firstChild).toBeTruthy()
    })

    it('maintains proper nesting structure', () => {
      const { container } = render(<Comparison />)

      const figure = container.querySelector('figure.diff')
      const diffItem1 = figure?.querySelector('.diff-item-1')
      const diffItem2 = figure?.querySelector('.diff-item-2')
      const resizer = figure?.querySelector('.diff-resizer')

      expect(figure).toBeInTheDocument()
      expect(diffItem1).toBeInTheDocument()
      expect(diffItem2).toBeInTheDocument()
      expect(resizer).toBeInTheDocument()
    })
  })

  describe('DaisyUI Integration', () => {
    it('uses DaisyUI diff component classes', () => {
      const { container } = render(<Comparison />)

      expect(container.querySelector('.diff')).toBeInTheDocument()
      expect(container.querySelector('.diff-item-1')).toBeInTheDocument()
      expect(container.querySelector('.diff-item-2')).toBeInTheDocument()
      expect(container.querySelector('.diff-resizer')).toBeInTheDocument()
    })

    it('applies aspect ratio class', () => {
      const { container } = render(<Comparison />)

      const figure = container.querySelector('figure')
      expect(figure).toHaveClass('aspect-16/9')
    })
  })

  describe('Image Comparison Functionality', () => {
    it('shows before and after states', () => {
      render(<Comparison />)

      const images = screen.getAllByRole('img').filter(img => img.tagName === 'IMG')
      
      // First image is the original
      expect(images[0]).toHaveAttribute('src', expect.not.stringContaining('blur'))
      
      // Second image is the blurred version
      expect(images[1]).toHaveAttribute('src', expect.stringContaining('blur'))
    })
  })

  describe('External Dependencies', () => {
    it('uses external image sources', () => {
      render(<Comparison />)

      const images = screen.getAllByRole('img').filter(img => img.tagName === 'IMG')
      
      images.forEach(img => {
        expect(img.getAttribute('src')).toMatch(/^https:\/\/img\.daisyui\.com/)
      })
    })
  })

  describe('Component Export', () => {
    it('exports the component as default', () => {
      expect(Comparison).toBeDefined()
      expect(typeof Comparison).toBe('function')
    })
  })
})