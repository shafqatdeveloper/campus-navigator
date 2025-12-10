# Vercel Deployment - Quick Start

## 1. Copy Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your backend URL.

## 2. Test Locally

```bash
npm run dev
```

Open http://localhost:5173 and test navigation/ask features.

## 3. Deploy to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts, then deploy to production
vercel --prod
```

### Option B: Using GitHub + Vercel Dashboard

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your GitHub repo
5. Add environment variables:
   - `VITE_BACKEND_URL` = Your backend URL
6. Click "Deploy"

## 4. Set Environment Variables on Vercel

Via CLI:

```bash
vercel env add VITE_BACKEND_URL
# Enter your backend URL (ngrok or DynamicDNS)

vercel env add VITE_API_KEY
# Enter your API key
```

Via Dashboard:

1. Go to project settings
2. Environment Variables
3. Add:
   - `VITE_BACKEND_URL`: `https://your-backend-url.com`
   - `VITE_API_KEY`: `your-secret-key`

## 5. Redeploy

```bash
vercel --prod
```

Your site is now live! 🎉
