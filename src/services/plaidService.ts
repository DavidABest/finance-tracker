// Client-side Plaid service - only handles operations that don't require secret key

export interface PlaidLinkToken {
  link_token: string;
}

export interface PlaidPublicTokenExchange {
  public_token: string;
}

// Client-side service calls to your backend API
export class PlaidService {
  private static baseUrl = 'http://localhost:3001/api'; // Express backend API

  // Create link token (calls your backend)
  static async createLinkToken(userId: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/plaid/create-link-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create link token');
    }

    const data = await response.json();
    return data.link_token;
  }

  // Exchange public token for access token (calls your backend)
  static async exchangePublicToken(publicToken: string): Promise<{ accessToken: string; itemId: string }> {
    const response = await fetch(`${this.baseUrl}/plaid/exchange-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_token: publicToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange public token');
    }

    return await response.json();
  }

  // Sync transactions (calls your backend)
  static async syncTransactions(accessToken: string, startDate: string, endDate: string) {
    const response = await fetch(`${this.baseUrl}/plaid/sync-transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        access_token: accessToken, 
        start_date: startDate, 
        end_date: endDate 
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to sync transactions');
    }

    return await response.json();
  }
}

// Plaid Link configuration (client-side safe)
export const plaidConfig = {
  clientId: import.meta.env.VITE_PLAID_CLIENT_ID,
  env: import.meta.env.VITE_PLAID_ENV,
};