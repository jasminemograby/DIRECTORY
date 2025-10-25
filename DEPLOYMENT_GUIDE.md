# 🚀 Deployment Guide - Directory Microservice

## 📋 **REQUIRED SECRETS & CREDENTIALS**

Before deployment, you need to set up the following secrets in your GitHub repository:

### **GitHub Repository Secrets**
Go to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

#### **1. Vercel Secrets (Frontend Deployment)**
```bash
VERCEL_TOKEN=<<YOUR_VERCEL_TOKEN>>
VERCEL_ORG_ID=<<YOUR_VERCEL_ORG_ID>>
VERCEL_PROJECT_ID=<<YOUR_VERCEL_PROJECT_ID>>
```

**How to get:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to `Settings` → `Tokens` → Create new token
3. Go to your project → `Settings` → Copy Org ID and Project ID

#### **2. Railway Secrets (Backend Deployment)**
```bash
RAILWAY_TOKEN=<<YOUR_RAILWAY_TOKEN>>
RAILWAY_PROJECT_ID=<<YOUR_RAILWAY_PROJECT_ID>>
```

**How to get:**
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Go to `Account Settings` → `Tokens` → Create new token
3. Create a new project and copy the Project ID

#### **3. Supabase Secrets (Database)**
```bash
SUPABASE_URL=<<YOUR_SUPABASE_URL>>
SUPABASE_SERVICE_KEY=<<YOUR_SUPABASE_SERVICE_KEY>>
```

**How to get:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to `Settings` → `API` → Copy URL and service_role key

---

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: Set Up Secrets**
1. Add all the secrets above to your GitHub repository
2. Verify all secrets are properly set

### **Step 2: Trigger Deployment**
The deployment will automatically trigger when you push to the `main` branch, or you can manually trigger it:

1. Go to `Actions` tab in your GitHub repository
2. Select the workflow you want to run:
   - `Deploy Frontend to Vercel`
   - `Deploy Backend to Railway`
   - `Database Migration and Seeding`
3. Click `Run workflow`

### **Step 3: Monitor Deployment**
1. Watch the GitHub Actions logs
2. Check deployment status in respective platforms
3. Verify all services are running

---

## 🌐 **EXPECTED DEPLOYMENT URLs**

After successful deployment, you should have:

- **Frontend:** `https://your-project.vercel.app`
- **Backend:** `https://your-project.railway.app`
- **Database:** `https://your-project.supabase.co`

---

## ✅ **POST-DEPLOYMENT VERIFICATION**

1. **Frontend Health Check:**
   ```bash
   curl https://your-frontend-url.vercel.app
   ```

2. **Backend Health Check:**
   ```bash
   curl https://your-backend-url.railway.app/health
   ```

3. **API Endpoints Test:**
   ```bash
   curl https://your-backend-url.railway.app/api/mock/companies
   ```

---

## 🔧 **ENVIRONMENT VARIABLES**

### **Frontend (Vercel)**
Set these in Vercel dashboard → Project Settings → Environment Variables:
```bash
VITE_API_URL=https://your-backend-url.railway.app
VITE_USE_MOCK=false
```

### **Backend (Railway)**
Set these in Railway dashboard → Project → Variables:
```bash
NODE_ENV=production
PORT=3001
USE_MOCK=false
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
JWT_SECRET=your-jwt-secret-key
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

---

## 🆘 **TROUBLESHOOTING**

### **Common Issues:**
1. **Secrets not found:** Verify all secrets are set in GitHub
2. **Build failures:** Check GitHub Actions logs
3. **CORS errors:** Verify CORS_ORIGINS includes frontend URL
4. **Database connection:** Verify DATABASE_URL is correct

### **Support:**
- Check GitHub Actions logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure all secrets have proper permissions

---

*Ready for deployment! 🚀*
