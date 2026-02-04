# AreYouPaidFairly

AI-powered salary comparison tool for Indian professionals.

## Features

- **Auto-detect documents**: Upload offer letters, salary slips, or resumes - AI identifies the type
- **Instant analysis**: Get percentile ranking against 23,000+ salary data points  
- **AI insights**: Powered by Claude API for personalized recommendations
- **Upsell products**: Salary negotiation help (₹999) + Naukri Pro integration

## Deployment

### Option 1: Vercel (Recommended - Easiest)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" → Import your repo
4. Vercel auto-detects Vite - just click "Deploy"
5. Add your custom domain in Project Settings → Domains

**Or deploy via CLI:**
```bash
npm i -g vercel
vercel
```

### Option 2: Netlify

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. "Add new site" → "Import an existing project"
4. Connect your repo
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Add custom domain in Domain settings

### Option 3: Manual / Any Host

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Upload the 'dist' folder to any static host
```

## Connecting Your Domain (areyoupaidfairly.com)

### For Vercel:
1. Go to your project → Settings → Domains
2. Add `areyoupaidfairly.com`
3. Vercel gives you DNS records to add
4. In your domain registrar, add:
   - Type: `A` Record → `76.76.21.21`
   - Type: `CNAME` for `www` → `cname.vercel-dns.com`

### For Netlify:
1. Go to Domain settings → Add custom domain
2. Add `areyoupaidfairly.com`
3. In your domain registrar, add:
   - Type: `A` Record → Netlify's load balancer IP
   - Type: `CNAME` for `www` → `your-site.netlify.app`

### DNS Propagation
Changes take 5 minutes to 48 hours to propagate globally.

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Tech Stack

- React 18
- Vite 5
- Claude API (Anthropic) for AI analysis
- No external CSS framework (inline styles)

## File Structure

```
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    └── App.jsx      # All components in single file
```

## Environment Variables

The Claude API is called directly from the frontend (for demo purposes).
For production, you should:

1. Create a backend API route
2. Store `ANTHROPIC_API_KEY` as environment variable
3. Proxy requests through your backend

Example `.env` for backend:
```
ANTHROPIC_API_KEY=sk-ant-...
```

## License

MIT
