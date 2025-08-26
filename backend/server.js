const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Plaid configuration
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.VITE_PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.VITE_PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// Supabase client (for user verification if needed)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Clarity Finance Backend is running' });
});

// Create link token
app.post('/api/plaid/create-link-token', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const configs = {
      user: {
        client_user_id: userId,
      },
      client_name: 'Clarity Finance',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    };

    const createTokenResponse = await plaidClient.linkTokenCreate(configs);
    res.json(createTokenResponse.data);
  }
  catch (error) {
    console.error('Error creating link token:', error);
    res.status(500).json({ 
      error: 'Unable to create link token',
      details: error.response?.data || error.message 
    });
  }
});

// Exchange public token for access token
app.post('/api/plaid/exchange-token', async (req, res) => {
  try {
    const { public_token } = req.body;
    
    if (!public_token) {
      return res.status(400).json({ error: 'Public token is required' });
    }

    const response = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    res.json({
      accessToken,
      itemId,
    });
  }
  catch (error) {
    console.error('Error exchanging token:', error);
    res.status(500).json({ 
      error: 'Unable to exchange token',
      details: error.response?.data || error.message 
    });
  }
});

// Sync transactions
app.post('/api/plaid/sync-transactions', async (req, res) => {
  try {
    const { access_token, start_date, end_date } = req.body;
    
    if (!access_token || !start_date || !end_date) {
      return res.status(400).json({ 
        error: 'Access token, start date, and end date are required' 
      });
    }

    const response = await plaidClient.transactionsGet({
      access_token: access_token,
      start_date: start_date,
      end_date: end_date,
    });

    res.json({
      transactions: response.data.transactions,
      accounts: response.data.accounts,
      total_transactions: response.data.total_transactions,
    });
  }
  catch (error) {
    console.error('Error syncing transactions:', error);
    res.status(500).json({ 
      error: 'Unable to sync transactions',
      details: error.response?.data || error.message 
    });
  }
});

// Get account info
app.post('/api/plaid/accounts', async (req, res) => {
  try {
    const { access_token } = req.body;
    
    if (!access_token) {
      return res.status(400).json({ error: 'Access token is required' });
    }

    const response = await plaidClient.accountsGet({
      access_token: access_token,
    });

    res.json({
      accounts: response.data.accounts,
    });
  }
  catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ 
      error: 'Unable to fetch accounts',
      details: error.response?.data || error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Clarity Finance Backend running on port ${PORT}`);
  console.log(`Plaid environment: ${process.env.VITE_PLAID_ENV}`);
});