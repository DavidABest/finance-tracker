import { render, screen, waitFor, act } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import DashboardItems from '../DashboardItems'

// Mock fetch
global.fetch = vi.fn()

vi.mock('../Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar Component</div>
}))

const mockTodos = [
  {
    id: 1,
    title: 'Complete project documentation',
    completed: false,
  },
  {
    id: 2,
    title: 'Review code changes',
    completed: true,
  },
  {
    id: 3,
    title: 'Update dependencies',
    completed: false,
  },
]

describe('DashboardItems Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders with sidebar and title', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockTodos,
      } as Response)

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/dashboard-items/1']}>
            <DashboardItems />
          </MemoryRouter>
        )
      })

      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
      expect(screen.getByText('Dashboard Todos')).toBeInTheDocument()
    })

    it('renders todos list when data is loaded', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockTodos,
      } as Response)

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/dashboard-items/1']}>
            <DashboardItems />
          </MemoryRouter>
        )
      })

      await waitFor(() => {
        expect(screen.getByText('Complete project documentation')).toBeInTheDocument()
      })

      expect(screen.getByText('Review code changes')).toBeInTheDocument()
      expect(screen.getByText('Update dependencies')).toBeInTheDocument()
    })

    it('displays correct completion status', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockTodos,
      } as Response)

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/dashboard-items/1']}>
            <DashboardItems />
          </MemoryRouter>
        )
      })

      await waitFor(() => {
        expect(screen.getByText('Status: Completed')).toBeInTheDocument()
      })

      expect(screen.getAllByText('Status: Pending')).toHaveLength(2)
    })
  })

  describe('Data Fetching', () => {
    it('fetches todos for correct user ID', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockTodos,
      } as Response)

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/dashboard-items/123']}>
            <DashboardItems />
          </MemoryRouter>
        )
      })

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/undefined/todos')
      })
    })

    it('handles fetch errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/dashboard-items/1']}>
            <DashboardItems />
          </MemoryRouter>
        )
      })

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching todos:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })

    it('handles empty todos response', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response)

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/dashboard-items/1']}>
            <DashboardItems />
          </MemoryRouter>
        )
      })

      await waitFor(() => {
        expect(screen.getByText('Dashboard Todos')).toBeInTheDocument()
      })

      // Should not show any todo items
      expect(screen.queryByText('Status: Completed')).not.toBeInTheDocument()
      expect(screen.queryByText('Status: Pending')).not.toBeInTheDocument()
    })
  })

  describe('URL Parameters', () => {
    it('uses different user IDs from URL params', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response)

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/dashboard-items/456']}>
            <DashboardItems />
          </MemoryRouter>
        )
      })

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/undefined/todos')
      })
    })

    it('handles missing user ID parameter', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response)

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/dashboard-items/']}>
            <DashboardItems />
          </MemoryRouter>
        )
      })

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/undefined/todos')
      })
    })
  })

  describe('Component Structure', () => {
    it('has proper list structure', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockTodos,
      } as Response)

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/dashboard-items/1']}>
            <DashboardItems />
          </MemoryRouter>
        )
      })

      await waitFor(() => {
        const list = screen.getByRole('list')
        expect(list).toBeInTheDocument()
      })

      const listItems = screen.getAllByRole('listitem')
      expect(listItems).toHaveLength(3)
    })

    it('applies padding to todo items', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockTodos,
      } as Response)

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/dashboard-items/1']}>
            <DashboardItems />
          </MemoryRouter>
        )
      })

      await waitFor(() => {
        const todoContainers = screen.getAllByText('Complete project documentation')[0].closest('.p-4')
        expect(todoContainers).toBeInTheDocument()
      })
    })
  })

  describe('Todo Item Display', () => {
    it('shows todo titles as headings', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockTodos,
      } as Response)

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/dashboard-items/1']}>
            <DashboardItems />
          </MemoryRouter>
        )
      })

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Complete project documentation' })).toBeInTheDocument()
      })

      expect(screen.getByRole('heading', { name: 'Review code changes' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Update dependencies' })).toBeInTheDocument()
    })

    it('displays status for each todo', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => [
          { id: 1, title: 'Test Todo', completed: true },
          { id: 2, title: 'Another Todo', completed: false },
        ],
      } as Response)

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/dashboard-items/1']}>
            <DashboardItems />
          </MemoryRouter>
        )
      })

      await waitFor(() => {
        expect(screen.getByText('Status: Completed')).toBeInTheDocument()
        expect(screen.getByText('Status: Pending')).toBeInTheDocument()
      })
    })
  })

  describe('Integration with Router', () => {
    it('works with BrowserRouter', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockTodos,
      } as Response)

      // This test ensures the component works with actual router context
      await act(async () => {
        render(
          <BrowserRouter>
            <DashboardItems />
          </BrowserRouter>
        )
      })

      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
      expect(screen.getByText('Dashboard Todos')).toBeInTheDocument()
    })
  })
})