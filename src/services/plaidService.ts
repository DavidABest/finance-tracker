// Client-side Plaid service - only handles operations that don't require secret key
import { supabase } from '../supabaseClient';
import { Transaction } from '../types';
import { config, logger } from '../config/environment';

export interface PlaidLinkToken {
  link_token: string;
}

export interface PlaidTransaction {
  transaction_id: string;
  account_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name?: string;
  category: string[];
  account_owner: string | null;
}

export interface PlaidPublicTokenExchange {
  public_token: string;
}

// Client-side service calls to your backend API
export class PlaidService {
  private static baseUrl = config.API_BASE_URL;

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

// Save Plaid transactions to Supabase via backend
export async function savePlaidTransactionsToSupabase(
  plaidTransactions: PlaidTransaction[],
  userId: string,
  authToken: string
): Promise<{ success: boolean; count: number }> {
  try {
    logger.log('Saving transactions through backend API...');
    
    const response = await fetch(`${config.API_BASE_URL}/plaid/save-transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        transactions: plaidTransactions,
        userId: userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      logger.error('Backend save error:', errorData);
      throw new Error(`Failed to save transactions: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    logger.log('Transactions saved successfully via backend:', result);
    return result;

  } catch (error) {
    logger.error('Failed to save Plaid transactions via backend:', error);
    throw error;
  }
}

// Plaid Link configuration - credentials handled by backend only
export const plaidConfig = {
  // Client ID and secrets are handled securely by the backend
  // Frontend only needs to call backend endpoints
};