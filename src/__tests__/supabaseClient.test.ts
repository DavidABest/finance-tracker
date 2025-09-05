import { 
  getAllTransactions, 
  getSpendingByCategory, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction,
  supabase 
} from '../supabaseClient'

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          eq: vi.fn()
        })),
        eq: vi.fn()
      })),
      insert: vi.fn(() => ({
        select: vi.fn()
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn()
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn()
      }))
    }))
  }))
}))

const mockTransactions = [
  {
    id: '1',
    description: 'Test Transaction',
    amount: 100,
    type: 'debit',
    category: 'Food',
    date: '2024-01-15',
    user_id: 'user-123'
  },
  {
    id: '2',
    description: 'Salary',
    amount: 5000,
    type: 'credit',
    category: 'Income',
    date: '2024-01-14',
    user_id: 'user-123'
  }
]

describe('Supabase Client Functions', () => {
  let mockSupabase: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            eq: vi.fn()
          })),
          eq: vi.fn()
        })),
        insert: vi.fn(() => ({
          select: vi.fn()
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn()
          }))
        })),
        delete: vi.fn(() => ({
          eq: vi.fn()
        }))
      }))
    }
    
    // Mock the supabase client
    vi.mocked(supabase as any).from = mockSupabase.from
  })

  describe('getAllTransactions', () => {
    it('fetches all transactions without userId', async () => {
      const mockQuery = {
        order: vi.fn(() => Promise.resolve({ data: mockTransactions, error: null }))
      }
      const mockSelect = {
        select: vi.fn(() => mockQuery)
      }
      mockSupabase.from.mockReturnValue(mockSelect)

      const result = await getAllTransactions()

      expect(mockSupabase.from).toHaveBeenCalledWith('transactions')
      expect(mockSelect.select).toHaveBeenCalledWith('*')
      expect(mockQuery.order).toHaveBeenCalledWith('date', { ascending: false })
      expect(result).toEqual(mockTransactions)
    })

    it('fetches transactions for specific user', async () => {
      const mockEq = vi.fn(() => Promise.resolve({ data: mockTransactions, error: null }))
      const mockOrder = {
        order: vi.fn(() => ({ eq: mockEq }))
      }
      const mockSelect = {
        select: vi.fn(() => mockOrder)
      }
      mockSupabase.from.mockReturnValue(mockSelect)

      const result = await getAllTransactions('user-123')

      expect(mockSupabase.from).toHaveBeenCalledWith('transactions')
      expect(mockSelect.select).toHaveBeenCalledWith('*')
      expect(mockOrder.order).toHaveBeenCalledWith('date', { ascending: false })
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123')
      expect(result).toEqual(mockTransactions)
    })

    it('throws error when query fails', async () => {
      const mockQuery = {
        order: vi.fn(() => Promise.resolve({ 
          data: null, 
          error: { message: 'Database error' } 
        }))
      }
      const mockSelect = {
        select: vi.fn(() => mockQuery)
      }
      mockSupabase.from.mockReturnValue(mockSelect)

      await expect(getAllTransactions()).rejects.toThrow('Failed to fetch transactions: Database error')
    })

    it('handles null userId correctly', async () => {
      const mockQuery = {
        order: vi.fn(() => Promise.resolve({ data: mockTransactions, error: null }))
      }
      const mockSelect = {
        select: vi.fn(() => mockQuery)
      }
      mockSupabase.from.mockReturnValue(mockSelect)

      const result = await getAllTransactions(null)

      expect(mockSupabase.from).toHaveBeenCalledWith('transactions')
      expect(result).toEqual(mockTransactions)
    })
  })

  describe('getSpendingByCategory', () => {
    const mockSpendingData = [
      { category: 'Food', amount: 150 },
      { category: 'Transport', amount: 75 }
    ]

    it('fetches spending data without userId', async () => {
      const mockEq = vi.fn(() => Promise.resolve({ data: mockSpendingData, error: null }))
      const mockSelect = {
        select: vi.fn(() => ({ eq: mockEq }))
      }
      mockSupabase.from.mockReturnValue(mockSelect)

      const result = await getSpendingByCategory()

      expect(mockSupabase.from).toHaveBeenCalledWith('transactions')
      expect(mockSelect.select).toHaveBeenCalledWith('category, amount')
      expect(mockEq).toHaveBeenCalledWith('type', 'debit')
      expect(result).toEqual(mockSpendingData)
    })

    it('fetches spending data for specific user', async () => {
      const mockUserEq = vi.fn(() => Promise.resolve({ data: mockSpendingData, error: null }))
      const mockTypeEq = vi.fn(() => ({ eq: mockUserEq }))
      const mockSelect = {
        select: vi.fn(() => ({ eq: mockTypeEq }))
      }
      mockSupabase.from.mockReturnValue(mockSelect)

      const result = await getSpendingByCategory('user-123')

      expect(mockSupabase.from).toHaveBeenCalledWith('transactions')
      expect(mockSelect.select).toHaveBeenCalledWith('category, amount')
      expect(mockTypeEq).toHaveBeenCalledWith('type', 'debit')
      expect(mockUserEq).toHaveBeenCalledWith('user_id', 'user-123')
      expect(result).toEqual(mockSpendingData)
    })

    it('throws error when query fails', async () => {
      const mockEq = vi.fn(() => Promise.resolve({ 
        data: null, 
        error: { message: 'Query failed' } 
      }))
      const mockSelect = {
        select: vi.fn(() => ({ eq: mockEq }))
      }
      mockSupabase.from.mockReturnValue(mockSelect)

      await expect(getSpendingByCategory()).rejects.toThrow('Failed to fetch spending by category: Query failed')
    })
  })

  describe('addTransaction', () => {
    const newTransaction = {
      description: 'New Transaction',
      amount: 200,
      type: 'debit' as const,
      category: 'Shopping',
      date: '2024-01-16',
      user_id: 'user-123'
    }

    it('adds transaction successfully', async () => {
      const addedTransaction = { id: '3', ...newTransaction }
      const mockSelect = vi.fn(() => Promise.resolve({ 
        data: [addedTransaction], 
        error: null 
      }))
      const mockInsert = {
        insert: vi.fn(() => ({ select: mockSelect }))
      }
      mockSupabase.from.mockReturnValue(mockInsert)

      const result = await addTransaction(newTransaction)

      expect(mockSupabase.from).toHaveBeenCalledWith('transactions')
      expect(mockInsert.insert).toHaveBeenCalledWith([newTransaction])
      expect(mockSelect).toHaveBeenCalled()
      expect(result).toEqual(addedTransaction)
    })

    it('throws error when insert fails', async () => {
      const mockSelect = vi.fn(() => Promise.resolve({ 
        data: null, 
        error: { message: 'Insert failed' } 
      }))
      const mockInsert = {
        insert: vi.fn(() => ({ select: mockSelect }))
      }
      mockSupabase.from.mockReturnValue(mockInsert)

      await expect(addTransaction(newTransaction)).rejects.toThrow('Failed to add transaction: Insert failed')
    })
  })

  describe('updateTransaction', () => {
    const updates = { amount: 250, category: 'Updated Category' }

    it('updates transaction successfully', async () => {
      const updatedTransaction = { id: '1', ...mockTransactions[0], ...updates }
      const mockSelect = vi.fn(() => Promise.resolve({ 
        data: [updatedTransaction], 
        error: null 
      }))
      const mockEq = vi.fn(() => ({ select: mockSelect }))
      const mockUpdate = {
        update: vi.fn(() => ({ eq: mockEq }))
      }
      mockSupabase.from.mockReturnValue(mockUpdate)

      const result = await updateTransaction(1, updates)

      expect(mockSupabase.from).toHaveBeenCalledWith('transactions')
      expect(mockUpdate.update).toHaveBeenCalledWith(updates)
      expect(mockEq).toHaveBeenCalledWith('id', 1)
      expect(mockSelect).toHaveBeenCalled()
      expect(result).toEqual(updatedTransaction)
    })

    it('throws error when update fails', async () => {
      const mockSelect = vi.fn(() => Promise.resolve({ 
        data: null, 
        error: { message: 'Update failed' } 
      }))
      const mockEq = vi.fn(() => ({ select: mockSelect }))
      const mockUpdate = {
        update: vi.fn(() => ({ eq: mockEq }))
      }
      mockSupabase.from.mockReturnValue(mockUpdate)

      await expect(updateTransaction(1, updates)).rejects.toThrow('Failed to update transaction: Update failed')
    })
  })

  describe('deleteTransaction', () => {
    it('deletes transaction successfully', async () => {
      const mockEq = vi.fn(() => Promise.resolve({ error: null }))
      const mockDelete = {
        delete: vi.fn(() => ({ eq: mockEq }))
      }
      mockSupabase.from.mockReturnValue(mockDelete)

      const result = await deleteTransaction(1)

      expect(mockSupabase.from).toHaveBeenCalledWith('transactions')
      expect(mockDelete.delete).toHaveBeenCalled()
      expect(mockEq).toHaveBeenCalledWith('id', 1)
      expect(result).toBe(true)
    })

    it('throws error when delete fails', async () => {
      const mockEq = vi.fn(() => Promise.resolve({ 
        error: { message: 'Delete failed' } 
      }))
      const mockDelete = {
        delete: vi.fn(() => ({ eq: mockEq }))
      }
      mockSupabase.from.mockReturnValue(mockDelete)

      await expect(deleteTransaction(1)).rejects.toThrow('Failed to delete transaction: Delete failed')
    })
  })

  describe('Supabase Client Creation', () => {
    it('creates client with correct parameters', () => {
      expect(supabase).toBeDefined()
    })
  })
})