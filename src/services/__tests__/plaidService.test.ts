import { PlaidService, plaidConfig } from '../plaidService'

// Mock fetch
global.fetch = vi.fn()

describe('PlaidService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createLinkToken', () => {
    it('creates link token successfully', async () => {
      const mockResponse = { link_token: 'link-token-123' }
      
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await PlaidService.createLinkToken('user-123')

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/plaid/create-link-token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: 'user-123' }),
        }
      )

      expect(result).toBe('link-token-123')
    })

    it('throws error when request fails', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
      } as Response)

      await expect(PlaidService.createLinkToken('user-123'))
        .rejects
        .toThrow('Failed to create link token')
    })

    it('handles network errors', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

      await expect(PlaidService.createLinkToken('user-123'))
        .rejects
        .toThrow('Network error')
    })

    it('sends correct request payload', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ link_token: 'token' }),
      } as Response)

      await PlaidService.createLinkToken('test-user-id')

      const callArgs = vi.mocked(fetch).mock.calls[0]
      expect(callArgs[0]).toBe('http://localhost:3001/api/plaid/create-link-token')
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual({
        userId: 'test-user-id'
      })
    })
  })

  describe('exchangePublicToken', () => {
    it('exchanges public token successfully', async () => {
      const mockResponse = {
        accessToken: 'access-token-123',
        itemId: 'item-123'
      }
      
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await PlaidService.exchangePublicToken('public-token-123')

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/plaid/exchange-token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ public_token: 'public-token-123' }),
        }
      )

      expect(result).toEqual(mockResponse)
    })

    it('throws error when exchange fails', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
      } as Response)

      await expect(PlaidService.exchangePublicToken('invalid-token'))
        .rejects
        .toThrow('Failed to exchange public token')
    })

    it('returns complete response data', async () => {
      const mockData = {
        accessToken: 'access-abc123',
        itemId: 'item-xyz789',
        requestId: 'req-123'
      }

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      } as Response)

      const result = await PlaidService.exchangePublicToken('public-token')
      expect(result).toEqual(mockData)
    })
  })

  describe('syncTransactions', () => {
    it('syncs transactions successfully', async () => {
      const mockResponse = { 
        transactions: [
          { id: 1, amount: 100, description: 'Test' }
        ],
        total_transactions: 1
      }
      
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await PlaidService.syncTransactions(
        'access-token-123',
        '2024-01-01',
        '2024-01-31'
      )

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/plaid/sync-transactions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: 'access-token-123',
            start_date: '2024-01-01',
            end_date: '2024-01-31'
          }),
        }
      )

      expect(result).toEqual(mockResponse)
    })

    it('throws error when sync fails', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
      } as Response)

      await expect(PlaidService.syncTransactions(
        'access-token',
        '2024-01-01',
        '2024-01-31'
      )).rejects.toThrow('Failed to sync transactions')
    })

    it('handles date range correctly', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response)

      await PlaidService.syncTransactions(
        'token',
        '2023-12-01',
        '2023-12-31'
      )

      const requestBody = JSON.parse(
        vi.mocked(fetch).mock.calls[0][1]?.body as string
      )
      
      expect(requestBody.start_date).toBe('2023-12-01')
      expect(requestBody.end_date).toBe('2023-12-31')
    })
  })

  describe('Service Configuration', () => {
    it('uses correct base URL', () => {
      expect(PlaidService['baseUrl']).toBe('http://localhost:3001/api')
    })

    it('sets proper headers for all requests', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response)

      await PlaidService.createLinkToken('user')
      await PlaidService.exchangePublicToken('token')
      await PlaidService.syncTransactions('token', '2024-01-01', '2024-01-31')

      const calls = vi.mocked(fetch).mock.calls
      
      calls.forEach(call => {
        const options = call[1] as RequestInit
        expect(options.headers).toEqual({
          'Content-Type': 'application/json',
        })
        expect(options.method).toBe('POST')
      })
    })
  })

  describe('Error Handling', () => {
    it('handles HTTP error responses', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      } as Response)

      await expect(PlaidService.createLinkToken('user'))
        .rejects
        .toThrow('Failed to create link token')
    })

    it('handles malformed JSON responses', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => { throw new Error('Invalid JSON') },
      } as Response)

      await expect(PlaidService.createLinkToken('user'))
        .rejects
        .toThrow('Invalid JSON')
    })

    it('handles network connectivity issues', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('fetch failed'))

      await expect(PlaidService.createLinkToken('user'))
        .rejects
        .toThrow('fetch failed')
    })
  })
})

describe('plaidConfig', () => {
  describe('Environment Variables', () => {
    it('exposes client ID from environment', () => {
      expect(plaidConfig.clientId).toBe(import.meta.env.VITE_PLAID_CLIENT_ID)
    })

    it('exposes environment from environment variables', () => {
      expect(plaidConfig.env).toBe(import.meta.env.VITE_PLAID_ENV)
    })
  })

  describe('Configuration Object', () => {
    it('has correct structure', () => {
      expect(plaidConfig).toHaveProperty('clientId')
      expect(plaidConfig).toHaveProperty('env')
    })

    it('is read-only configuration', () => {
      // Verify it's a simple object (not a class instance)
      expect(typeof plaidConfig).toBe('object')
      expect(plaidConfig.constructor).toBe(Object)
    })
  })
})