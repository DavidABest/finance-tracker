import { render, screen } from '@testing-library/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../table'

describe('Table Components', () => {
  describe('Table', () => {
    it('renders table with container wrapper', () => {
      render(
        <Table data-testid="table">
          <tbody>
            <tr>
              <td>Cell content</td>
            </tr>
          </tbody>
        </Table>
      )
      
      const table = screen.getByTestId('table')
      expect(table).toBeInTheDocument()
      expect(table.tagName).toBe('TABLE')
      expect(table).toHaveAttribute('data-slot', 'table')
      expect(table).toHaveClass('w-full', 'caption-bottom', 'text-sm')
      
      // Check container wrapper
      const container = table.parentElement
      expect(container).toHaveAttribute('data-slot', 'table-container')
      expect(container).toHaveClass('relative', 'w-full', 'overflow-x-auto')
    })

    it('applies custom className', () => {
      render(<Table className="custom-table">Content</Table>)
      const table = screen.getByRole('table')
      expect(table).toHaveClass('custom-table', 'w-full')
    })
  })

  describe('TableHeader', () => {
    it('renders thead element with correct styling', () => {
      render(
        <Table>
          <TableHeader data-testid="header">
            <tr>
              <th>Header</th>
            </tr>
          </TableHeader>
        </Table>
      )
      
      const header = screen.getByTestId('header')
      expect(header).toBeInTheDocument()
      expect(header.tagName).toBe('THEAD')
      expect(header).toHaveAttribute('data-slot', 'table-header')
      expect(header).toHaveClass('[&_tr]:border-b')
    })
  })

  describe('TableBody', () => {
    it('renders tbody element with correct styling', () => {
      render(
        <Table>
          <TableBody data-testid="body">
            <tr>
              <td>Body content</td>
            </tr>
          </TableBody>
        </Table>
      )
      
      const body = screen.getByTestId('body')
      expect(body).toBeInTheDocument()
      expect(body.tagName).toBe('TBODY')
      expect(body).toHaveAttribute('data-slot', 'table-body')
      expect(body).toHaveClass('[&_tr:last-child]:border-0')
    })
  })

  describe('TableFooter', () => {
    it('renders tfoot element with correct styling', () => {
      render(
        <Table>
          <TableFooter data-testid="footer">
            <tr>
              <td>Footer content</td>
            </tr>
          </TableFooter>
        </Table>
      )
      
      const footer = screen.getByTestId('footer')
      expect(footer).toBeInTheDocument()
      expect(footer.tagName).toBe('TFOOT')
      expect(footer).toHaveAttribute('data-slot', 'table-footer')
      expect(footer).toHaveClass('bg-muted/50', 'border-t', 'font-medium')
    })
  })

  describe('TableRow', () => {
    it('renders tr element with interactive styling', () => {
      render(
        <Table>
          <TableBody>
            <TableRow data-testid="row">
              <td>Row content</td>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const row = screen.getByTestId('row')
      expect(row).toBeInTheDocument()
      expect(row.tagName).toBe('TR')
      expect(row).toHaveAttribute('data-slot', 'table-row')
      expect(row).toHaveClass(
        'hover:bg-muted/50',
        'data-[state=selected]:bg-muted',
        'border-b',
        'transition-colors'
      )
    })

    it('supports selected state', () => {
      render(
        <Table>
          <TableBody>
            <TableRow data-state="selected" data-testid="selected-row">
              <td>Selected row</td>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const row = screen.getByTestId('selected-row')
      expect(row).toHaveAttribute('data-state', 'selected')
    })
  })

  describe('TableHead', () => {
    it('renders th element with header styling', () => {
      render(
        <Table>
          <TableHeader>
            <tr>
              <TableHead data-testid="head">Column Header</TableHead>
            </tr>
          </TableHeader>
        </Table>
      )
      
      const head = screen.getByTestId('head')
      expect(head).toBeInTheDocument()
      expect(head.tagName).toBe('TH')
      expect(head).toHaveAttribute('data-slot', 'table-head')
      expect(head).toHaveClass(
        'text-foreground',
        'h-10',
        'px-2',
        'text-left',
        'align-middle',
        'font-medium',
        'whitespace-nowrap'
      )
      expect(head).toHaveTextContent('Column Header')
    })

    it('supports checkbox integration', () => {
      render(
        <Table>
          <TableHeader>
            <tr>
              <TableHead data-testid="checkbox-head">
                <input type="checkbox" role="checkbox" />
                Select All
              </TableHead>
            </tr>
          </TableHeader>
        </Table>
      )
      
      const head = screen.getByTestId('checkbox-head')
      expect(head).toHaveClass('[&:has([role=checkbox])]:pr-0')
    })
  })

  describe('TableCell', () => {
    it('renders td element with cell styling', () => {
      render(
        <Table>
          <TableBody>
            <tr>
              <TableCell data-testid="cell">Cell content</TableCell>
            </tr>
          </TableBody>
        </Table>
      )
      
      const cell = screen.getByTestId('cell')
      expect(cell).toBeInTheDocument()
      expect(cell.tagName).toBe('TD')
      expect(cell).toHaveAttribute('data-slot', 'table-cell')
      expect(cell).toHaveClass(
        'p-2',
        'align-middle',
        'whitespace-nowrap'
      )
      expect(cell).toHaveTextContent('Cell content')
    })

    it('supports checkbox integration', () => {
      render(
        <Table>
          <TableBody>
            <tr>
              <TableCell data-testid="checkbox-cell">
                <input type="checkbox" role="checkbox" />
                Row data
              </TableCell>
            </tr>
          </TableBody>
        </Table>
      )
      
      const cell = screen.getByTestId('checkbox-cell')
      expect(cell).toHaveClass('[&:has([role=checkbox])]:pr-0')
    })
  })

  describe('TableCaption', () => {
    it('renders caption element with correct styling', () => {
      render(
        <Table>
          <TableCaption data-testid="caption">Table Description</TableCaption>
          <TableBody>
            <tr>
              <td>Content</td>
            </tr>
          </TableBody>
        </Table>
      )
      
      const caption = screen.getByTestId('caption')
      expect(caption).toBeInTheDocument()
      expect(caption.tagName).toBe('CAPTION')
      expect(caption).toHaveAttribute('data-slot', 'table-caption')
      expect(caption).toHaveClass('text-muted-foreground', 'mt-4', 'text-sm')
      expect(caption).toHaveTextContent('Table Description')
    })
  })

  describe('Complete Table Structure', () => {
    it('renders a complete table with all components', () => {
      render(
        <Table data-testid="complete-table">
          <TableCaption>Employee Data</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
              <TableCell>Developer</TableCell>
            </TableRow>
            <TableRow data-state="selected">
              <TableCell>Jane Smith</TableCell>
              <TableCell>jane@example.com</TableCell>
              <TableCell>Designer</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total Employees</TableCell>
              <TableCell>2</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )

      // Check all components are rendered
      expect(screen.getByTestId('complete-table')).toBeInTheDocument()
      expect(screen.getByText('Employee Data')).toBeInTheDocument()
      
      // Check headers
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Role')).toBeInTheDocument()
      
      // Check data rows
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
      
      // Check footer
      expect(screen.getByText('Total Employees')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('maintains proper table semantics', () => {
      render(
        <Table>
          <TableCaption>Data Table</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Column 1</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Data 1</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
      
      // Check caption is associated with table
      expect(screen.getByText('Data Table')).toBeInTheDocument()
      
      // Check column headers
      const columnHeader = screen.getByText('Column 1')
      expect(columnHeader).toHaveAttribute('scope', 'col')
    })

    it('supports row headers', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableHead scope="row">Row Header</TableHead>
              <TableCell>Row Data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const rowHeader = screen.getByText('Row Header')
      expect(rowHeader).toHaveAttribute('scope', 'row')
    })
  })

  describe('Custom Classes', () => {
    it('applies custom classes to all components', () => {
      render(
        <Table className="table-custom">
          <TableHeader className="header-custom">
            <TableRow className="row-custom">
              <TableHead className="head-custom">Header</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="body-custom">
            <TableRow className="row-custom">
              <TableCell className="cell-custom">Cell</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter className="footer-custom">
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
          <TableCaption className="caption-custom">Caption</TableCaption>
        </Table>
      )

      expect(screen.getByRole('table')).toHaveClass('table-custom')
      expect(screen.getByText('Header').closest('thead')).toHaveClass('header-custom')
      expect(screen.getByText('Cell').closest('tbody')).toHaveClass('body-custom')
      expect(screen.getByText('Footer').closest('tfoot')).toHaveClass('footer-custom')
      expect(screen.getByText('Caption')).toHaveClass('caption-custom')
    })
  })
})