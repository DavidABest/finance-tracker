# Deployment Guide

## Pre-deployment Security Checklist ✅

- [x] **Environment Variables**: All sensitive data moved to environment variables
- [x] **Console Statements**: All console.log statements replaced with environment-aware logging
- [x] **CORS Configuration**: Production CORS settings configured with domain restrictions
- [x] **Authentication**: Supabase RLS properly configured, no hardcoded credentials
- [x] **API Security**: All API endpoints protected with authentication middleware
- [x] **Rate Limiting**: Comprehensive rate limiting implemented with tiered protection levels
- [x] **Security Headers**: Helmet.js configured for XSS, CSRF, and clickjacking protection
- [x] **Build Process**: Production build tested and working
- [x] **Demo Mode**: Test data available for career fair demonstration

## Frontend Deployment

### Environment Setup
1. Copy `.env.production` and update with your production values:
   ```bash
   cp .env.production .env.production.local
   ```

2. Update these variables:
   ```
   VITE_API_BASE_URL=https://your-backend-domain.com/api
   VITE_PLAID_CLIENT_ID=your_production_plaid_client_id
   PLAID_SECRET=your_production_plaid_secret
   VITE_PLAID_ENV=production
   TEST_MODE=false
   ```

### Build and Deploy
```bash
# Build for production
npm run build

# Test locally
npm run preview

# Deploy dist/ folder to your hosting service
```

### Recommended Hosting Services
- **Vercel**: Automatic builds from GitHub
- **Netlify**: Easy drag-and-drop deployment
- **AWS S3 + CloudFront**: Scalable static hosting

## Backend Deployment

### Environment Setup
Create `.env` file in backend/ directory:
```
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://yehvpfiuxdnvdlzljxuu.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
PLAID_CLIENT_ID=your_production_plaid_client_id
PLAID_SECRET=your_production_plaid_secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Deploy Backend
```bash
cd backend
npm install
npm start
```

### Recommended Backend Hosting
- **Railway**: Easy Node.js deployment
- **Heroku**: Simple git-based deployment  
- **AWS EC2**: Full control and scalability
- **DigitalOcean App Platform**: Managed Node.js hosting

## Domain Configuration

### CORS Setup
Update `backend/server.js` line 15-20 with your domains:
```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, /\.yourdomain\.com$/]
    : [...development origins],
  credentials: true
};
```

### SSL/HTTPS
- Both frontend and backend MUST use HTTPS in production
- Most hosting services provide free SSL certificates

## Career Fair Demo Setup

### Demo Mode Features
- **233 realistic transactions** loaded from JSON
- **No real banking required** - perfect for demonstrations
- **Full UI functionality** - filtering, sorting, visualizations
- **Authentication system** - showcases security implementation

### Demo Script
1. "This is Clarity Finance Tracker, built with React and TypeScript"
2. "It features secure authentication through Supabase"
3. "Demo mode shows 233 realistic transactions without connecting real accounts"
4. "Includes data visualization, filtering, and financial insights"
5. "Backend API built with Express.js, integrated with Plaid for real banking"

## Post-Deployment Verification

### Frontend Checks
- [ ] Application loads without errors
- [ ] Authentication works (sign up/sign in)
- [ ] Demo mode displays transactions
- [ ] All pages navigate correctly
- [ ] Dark mode toggle functions

### Backend Checks
- [ ] API endpoints respond correctly
- [ ] CORS allows frontend requests
- [ ] Authentication middleware working
- [ ] Environment variables loaded
- [ ] Logs show production environment

### Security Validation
- [ ] No console logs in browser production build
- [ ] API credentials not exposed in frontend
- [ ] HTTPS enforced on both domains
- [ ] CORS restricted to your domains only
- [ ] No development URLs in production build

## Monitoring & Maintenance

### Key Metrics to Monitor
- Application uptime and response times
- Authentication success rates
- API error rates
- User engagement with demo features

### Regular Maintenance
- Monitor Supabase usage and billing
- Update dependencies monthly
- Review security logs
- Backup user data if transitioning from demo

## Rate Limiting Configuration

Your application now includes comprehensive rate limiting for production security:

### **Rate Limiting Tiers**

**Global Rate Limiting:**
- **100 requests per 15 minutes** per IP address
- **Progressive delays** after 50 requests (starts at 500ms, max 5 seconds)
- Applies to all endpoints

**Authentication Endpoints:**
- **5 requests per 15 minutes** for token operations
- Protects against brute force attacks
- Applied to: `/api/plaid/create-link-token`, `/api/plaid/exchange-token`

**Plaid API Endpoints:**
- **10 requests per minute** for external API calls
- Prevents costly API abuse
- Applied to: `/api/plaid/sync-transactions`, `/api/plaid/accounts`

**Database Operations:**
- **5 requests per minute** for write operations
- **Maximum 1000 transactions** per save request
- Applied to: `/api/plaid/save-transactions`

### **Development vs Production**

- **Development Mode** (`TEST_MODE=true`): Rate limits are **disabled** for testing
- **Production Mode** (`NODE_ENV=production`, `TEST_MODE=false`): All limits **enforced**

### **Security Headers**

Helmet.js provides comprehensive security headers:
- **XSS Protection**: Prevents cross-site scripting attacks
- **CSRF Protection**: Cross-site request forgery prevention
- **Clickjacking Protection**: X-Frame-Options and CSP headers
- **HTTPS Enforcement**: Strict-Transport-Security headers

### **Rate Limit Response Format**

When rate limits are exceeded, users receive:
```json
{
  "error": "Too many API requests",
  "message": "You have exceeded the 100 requests per 15 minutes limit.",
  "retryAfter": 900
}
```

With HTTP status code **429 Too Many Requests** and standard rate limit headers.

### **Monitoring Rate Limits**

Rate limit violations are automatically logged for security monitoring:
- All rate limit breaches logged with IP address and endpoint
- Production logs can be monitored for suspicious activity
- Headers include remaining requests and reset time

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check domain configuration in backend
2. **Build Failures**: Verify all environment variables are set
3. **API Connectivity**: Ensure backend URL is correct in frontend config
4. **Authentication Issues**: Verify Supabase keys and RLS policies

### Support
- Check browser console for frontend errors
- Review backend logs for API issues
- Verify environment variable configuration
- Test locally with production build before deploying