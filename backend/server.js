const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const helmet = require('helmet');
const path = require('path');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
// Always load from ../.env for local development
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

// Trust proxy - required for Railway/production deployment
app.set('trust proxy', true);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "https://cdn.plaid.com"],
      imgSrc: ["'self'", "data:", "https:"],
      frameSrc: ["https://cdn.plaid.com"],
      childSrc: ["https://cdn.plaid.com"],
      connectSrc: ["'self'", "https://*.supabase.co", "https://accounts.google.com", "https://*.plaid.com"],
      frameAncestors: ["'self'"],
    }
  }
}));

// CORS middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, /\.yourdomain\.com$/]
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Rate limiting configuration
const createRateLimitMessage = (type, limit, windowMs) => {
  const windowMinutes = Math.ceil(windowMs / 60000);
  return {
    error: `Too many ${type} requests`,
    message: `You have exceeded the ${limit} requests per ${windowMinutes} minute${windowMinutes > 1 ? 's' : ''} limit.`,
    retryAfter: Math.ceil(windowMs / 1000)
  };
};

// Global rate limiting - applies to all endpoints
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes per IP
  message: createRateLimitMessage('API', 100, 15 * 60 * 1000),
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in test mode for development
    return process.env.NODE_ENV !== 'production' && process.env.TEST_MODE === 'true';
  },
  handler: (req, res) => {
    const message = createRateLimitMessage('API', 100, 15 * 60 * 1000);
    logError(`Rate limit exceeded for IP ${req.ip} on ${req.path}`);
    res.status(429).json(message);
  }
});

// Global slow down - progressive delays
const globalSlowDown = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Start slowing down after 50 requests
  delayMs: () => 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 5000, // Maximum delay of 5 seconds
  skip: (req) => {
    return process.env.NODE_ENV !== 'production' && process.env.TEST_MODE === 'true';
  },
  validate: {
    delayMs: false // Disable the warning
  }
});

// Authentication rate limiting - stricter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: createRateLimitMessage('authentication', 5, 15 * 60 * 1000),
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return process.env.NODE_ENV !== 'production' && process.env.TEST_MODE === 'true';
  },
  handler: (req, res) => {
    const message = createRateLimitMessage('authentication', 5, 15 * 60 * 1000);
    logError(`Auth rate limit exceeded for IP ${req.ip} on ${req.path}`);
    res.status(429).json(message);
  }
});

// Plaid API rate limiting - protect expensive external API calls
const plaidLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: createRateLimitMessage('Plaid API', 10, 60 * 1000),
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return process.env.NODE_ENV !== 'production' && process.env.TEST_MODE === 'true';
  },
  handler: (req, res) => {
    const message = createRateLimitMessage('Plaid API', 10, 60 * 1000);
    logError(`Plaid rate limit exceeded for IP ${req.ip} on ${req.path}`);
    res.status(429).json(message);
  }
});

// Database operation rate limiting - protect write operations
const dbLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 database writes per minute
  message: createRateLimitMessage('database operation', 5, 60 * 1000),
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return process.env.NODE_ENV !== 'production' && process.env.TEST_MODE === 'true';
  },
  handler: (req, res) => {
    const message = createRateLimitMessage('database operation', 5, 60 * 1000);
    logError(`Database rate limit exceeded for IP ${req.ip} on ${req.path}`);
    res.status(429).json(message);
  }
});

// Apply global middleware
app.use(globalLimiter);
app.use(globalSlowDown);

// Request logging middleware (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    if (req.method === 'POST' && req.body) {
      console.log('Request body keys:', Object.keys(req.body));
    }
    next();
  });
}

// Plaid configuration
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// Supabase client (for user verification)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    // Check if we're in test mode
    if (process.env.TEST_MODE === 'true') {
      // In test mode, create a mock user object
      req.user = {
        id: process.env.TEST_USER_ID,
        email: 'test@example.com'
      };
      return next();
    }

    // Normal authentication flow
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Clarity Finance Backend is running' });
});

// Production-safe logging
const log = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
};

const logError = (...args) => {
  console.error(...args); // Always log errors
};

// Create link token
app.post('/api/plaid/create-link-token', authLimiter, plaidLimiter, authenticateUser, async (req, res) => {
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
app.post('/api/plaid/exchange-token', authLimiter, plaidLimiter, authenticateUser, async (req, res) => {
  try {
    const { public_token } = req.body;
    
    log('POST /api/plaid/exchange-token - User:', req.user.id);
    
    if (!public_token) {
      return res.status(400).json({ error: 'Public token is required' });
    }

    log('Exchanging public token with Plaid...');
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    log('Token exchange successful, item ID:', itemId);

    res.json({
      accessToken,
      itemId,
    });
  }
  catch (error) {
    logError('Error exchanging token:', error);
    res.status(500).json({ 
      error: 'Unable to exchange token',
      details: error.response?.data || error.message 
    });
  }
});

// Sync transactions
app.post('/api/plaid/sync-transactions', plaidLimiter, authenticateUser, async (req, res) => {
  try {
    const { access_token, start_date, end_date } = req.body;
    
    log('POST /api/plaid/sync-transactions - User:', req.user.id);
    log('Date range:', start_date, 'to', end_date);
    
    if (!access_token || !start_date || !end_date) {
      return res.status(400).json({ 
        error: 'Access token, start date, and end date are required' 
      });
    }

    log('Fetching transactions from Plaid...');
    const response = await plaidClient.transactionsGet({
      access_token: access_token,
      start_date: start_date,
      end_date: end_date,
    });

    log('Transactions fetched successfully:', response.data.transactions.length);

    res.json({
      transactions: response.data.transactions,
      accounts: response.data.accounts,
      total_transactions: response.data.total_transactions,
    });
  }
  catch (error) {
    logError('Error syncing transactions:', error);
    res.status(500).json({ 
      error: 'Unable to sync transactions',
      details: error.response?.data || error.message 
    });
  }
});

// Save transactions to Supabase 
app.post('/api/plaid/save-transactions', dbLimiter, authenticateUser, async (req, res) => {
  try {
    const { transactions, userId } = req.body;
    
    log('POST /api/plaid/save-transactions - User:', req.user.id);
    log('Transactions to save:', transactions?.length || 0);
    
    if (!transactions || !userId) {
      return res.status(400).json({ error: 'Transactions and userId are required' });
    }

    // Validate transaction count to prevent database flooding
    if (transactions.length > 1000) {
      logError(`Excessive transaction count (${transactions.length}) from user ${req.user.id}`);
      return res.status(400).json({ 
        error: 'Too many transactions',
        message: 'Maximum 1000 transactions allowed per request'
      });
    }

    // Transform Plaid transactions to our Transaction format
    const transformedTransactions = transactions.map(plaidTx => ({
      date: plaidTx.date,
      description: plaidTx.name,
      amount: Math.abs(plaidTx.amount), // Always positive
      type: (plaidTx.amount > 0 ? 'credit' : 'debit'),
      category: plaidTx.category && plaidTx.category.length > 0 ? plaidTx.category[0] : 'Other',
      subcategory: plaidTx.category && plaidTx.category.length > 1 ? plaidTx.category[1] : '',
      account_id: plaidTx.account_id,
      user_id: userId,
    }));

    log('Saving to Supabase...');

    // Try to use service role key if available, otherwise use regular client
    let supabaseClient;
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      log('Using service role key for admin access');
      const { createClient } = require('@supabase/supabase-js');
      supabaseClient = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
    } else {
      log('Using regular client (service role key not configured)');
      supabaseClient = supabase;
    }

    const { data, error } = await supabaseClient
      .from('transactions')
      .insert(transformedTransactions);

    if (error) {
      logError('Supabase insert error:', error);
      throw error;
    }

    log(`Successfully saved ${transformedTransactions.length} transactions`);
    res.json({ success: true, count: transformedTransactions.length });

  } catch (error) {
    logError('Error saving transactions:', error);
    res.status(500).json({ 
      error: 'Unable to save transactions',
      details: error.message 
    });
  }
});

// Get account info
app.post('/api/plaid/accounts', plaidLimiter, authenticateUser, async (req, res) => {
  try {
    const { access_token } = req.body;
    
    log('POST /api/plaid/accounts - User:', req.user.id);
    
    if (!access_token) {
      return res.status(400).json({ error: 'Access token is required' });
    }

    log('Fetching account info from Plaid...');
    const response = await plaidClient.accountsGet({
      access_token: access_token,
    });

    log('Accounts fetched successfully:', response.data.accounts.length);

    res.json({
      accounts: response.data.accounts,
    });
  }
  catch (error) {
    logError('Error fetching accounts:', error);
    res.status(500).json({ 
      error: 'Unable to fetch accounts',
      details: error.response?.data || error.message 
    });
  }
});

// Serve frontend static files
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Fallback to index.html
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`✅ Server listening on http://${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Plaid environment: ${process.env.PLAID_ENV}`);
  console.log(`Serving static files from: ${distPath}`);
});