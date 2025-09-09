# Railway Deployment Guide

## 🚀 **Quick Deploy to Railway**

### **Prerequisites**
1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your code needs to be in GitHub
3. **Plaid Account**: For production API credentials (optional for demo)

## **Step 1: Deploy Backend to Railway**

### **1.1 Create New Railway Project**
```bash
# Install Railway CLI (optional)
npm install -g @railway/cli

# Or deploy via Railway Dashboard
```

### **1.2 Connect GitHub Repository**
1. Go to [railway.app/dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your **finance-tracker** repository
5. Select the **backend** folder as the deployment source

### **1.3 Configure Environment Variables**

In Railway Dashboard → Your Project → Variables, add:

```env
# Node.js Configuration
NODE_ENV=production
PORT=3001

# Supabase Configuration (use your existing values)
VITE_SUPABASE_URL=https://yehvpfiuxdnvdlzljxuu.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_eF9U_ECxlr-_7zWItkyk_Q_FZFBbHRi

# Plaid Configuration
VITE_PLAID_CLIENT_ID=your_plaid_client_id_here
PLAID_SECRET=your_plaid_secret_here
VITE_PLAID_ENV=sandbox

# Frontend Configuration (will be updated after frontend deployment)
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Production Settings
TEST_MODE=false
```

### **1.4 Railway Build Settings**
Railway should auto-detect your Node.js project. If not, create `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health"
  }
}
```

## **Step 2: Deploy Frontend to Vercel**

### **2.1 Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### **2.2 Configure Environment Variables**

In Vercel Dashboard → Project → Settings → Environment Variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://yehvpfiuxdnvdlzljxuu.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_eF9U_ECxlr-_7zWItkyk_Q_FZFBbHRi

# Plaid Configuration  
VITE_PLAID_CLIENT_ID=your_plaid_client_id_here
VITE_PLAID_ENV=sandbox

# API Configuration (use your Railway backend URL)
VITE_API_BASE_URL=https://your-railway-backend.railway.app/api

# Production Settings
TEST_MODE=false
```

## **Step 3: Update CORS Configuration**

After both deployments, update your backend's CORS configuration:

1. Go to Railway Dashboard → Your Backend → Variables
2. Update `FRONTEND_URL` to your actual Vercel domain:
   ```
   FRONTEND_URL=https://your-project.vercel.app
   ```

## **Step 4: Plaid Configuration Options**

### **🎯 Option 1: Demo Mode (Recommended for Career Fair)**
Keep using **sandbox mode** with demo data:
- No real banking connections
- Perfect for demonstrations
- 233 realistic transactions included
- No additional Plaid costs

### **🏦 Option 2: Production Plaid Setup**

#### **A. Get Production Credentials**
1. Log in to [Plaid Dashboard](https://dashboard.plaid.com)
2. Navigate to **Team Settings** → **Keys**
3. Request **Production Access** (requires verification)
4. Get your production `client_id` and `secret`

#### **B. Update Environment Variables**
```env
VITE_PLAID_CLIENT_ID=your_production_client_id
PLAID_SECRET=your_production_secret
VITE_PLAID_ENV=production
```

#### **C. Plaid Production Requirements**
- **Company verification** required
- **Privacy policy** and **terms of service** needed
- **Security questionnaire** must be completed
- **Compliance review** may take 1-2 weeks

## **Step 5: Verification & Testing**

### **5.1 Backend Health Check**
```bash
curl https://your-railway-backend.railway.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Clarity Finance Backend is running"
}
```

### **5.2 Frontend Functionality**
1. Visit your Vercel domain
2. Test authentication (sign up/sign in)
3. Verify dashboard loads with demo transactions
4. Check dark mode toggle works
5. Ensure all navigation works

### **5.3 Rate Limiting Verification**
Your production deployment will have:
- ✅ Rate limiting enforced (`TEST_MODE=false`)
- ✅ Security headers active
- ✅ CORS restricted to your domains
- ✅ All authentication protections enabled

## **🎯 Career Fair Deployment Strategy**

### **Recommended Configuration**
```env
# Keep these settings for your demo
VITE_PLAID_ENV=sandbox
TEST_MODE=false  # Shows production security features
# All rate limiting and security active but demo data available
```

### **Why This Works Perfectly**
1. **Professional Security**: All production features active
2. **Demo-Safe**: No real banking, no API costs
3. **Impressive Data**: 233 realistic transactions to showcase
4. **Zero Risk**: Can't break anything during demo
5. **Full Features**: Authentication, visualizations, filtering all work

## **📊 Monitoring & Maintenance**

### **Railway Monitoring**
- Check **Deployments** tab for build status
- Monitor **Metrics** for performance
- Review **Logs** for any issues

### **Vercel Monitoring**
- Check **Functions** tab for API performance
- Monitor **Analytics** for usage
- Review **Build logs** for issues

## **🚨 Troubleshooting**

### **Common Issues**

#### **CORS Errors**
- Verify `FRONTEND_URL` matches your Vercel domain exactly
- Check both HTTP and HTTPS versions

#### **API Connection Issues**
- Ensure `VITE_API_BASE_URL` ends with `/api`
- Verify Railway backend is running at `/api/health`

#### **Environment Variables**
- Railway: Check all backend vars are set
- Vercel: Ensure all frontend vars are set
- Redeploy after variable changes

#### **Build Failures**
- Check build logs in Railway/Vercel dashboards
- Verify all dependencies are in package.json
- Ensure Node.js version compatibility

## **💰 Cost Estimates**

### **Railway** (Backend)
- **Free Tier**: $0/month (500 hours)
- **Pro Plan**: $5/month (unlimited)

### **Vercel** (Frontend)
- **Hobby**: $0/month (perfect for demos)
- **Pro**: $20/month (custom domains)

### **Total Monthly Cost**
- **Demo Version**: $0-5/month
- **Full Production**: $5-25/month

## **🎉 Deployment Complete!**

After following this guide, you'll have:
- ✅ Professional production deployment
- ✅ Enterprise-grade security features
- ✅ Perfect demo for career fair
- ✅ Scalable architecture for real users
- ✅ Zero risk of demo failures

Your finance tracker will impress recruiters while being completely safe and cost-effective! 🚀