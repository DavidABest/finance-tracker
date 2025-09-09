// Environment configuration
export const config = {
  // API endpoints
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  
  // Supabase
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  
  // Plaid
  PLAID_CLIENT_ID: import.meta.env.VITE_PLAID_CLIENT_ID || '',
  PLAID_ENV: import.meta.env.VITE_PLAID_ENV || 'sandbox',
  
  // App settings
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Debug logging - only in development
export const logger = {
  log: (...args: any[]) => {
    if (config.isDevelopment) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (config.isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    if (config.isDevelopment) {
      console.error(...args);
    }
  },
};