# Deploy to warelay.io

## Step 1: Add Domain in Vercel

1. Go to your Vercel dashboard: https://vercel.com/warelayagent/warelay-agent
2. Click on **Settings** → **Domains**
3. Add `warelay.io` and `www.warelay.io`
4. Vercel will provide DNS configuration instructions

## Step 2: Configure DNS Records

Go to your domain registrar (where you bought warelay.io) and add these DNS records:

### For Root Domain (warelay.io):
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

### For www Subdomain:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**OR** if you prefer to point root domain directly to Vercel:
```
Type: CNAME (if supported) or ALIAS
Name: @
Value: cname.vercel-dns.com
TTL: 3600
```

## Step 3: Wait for DNS Propagation

- DNS changes can take 1-48 hours to propagate
- Check status: https://dnschecker.org/#A/warelay.io
- Vercel will automatically issue SSL certificate once DNS is verified

## Step 4: Verify Deployment

Once DNS propagates:
- Visit https://warelay.io
- Visit https://warelay.io/live.html
- Confirm SSL certificate is active (🔒 in browser)

## Current Deployment

- **GitHub**: https://github.com/warelayagent/warelay-agent
- **Vercel**: https://warelay-agent.vercel.app (current)
- **Target**: https://warelay.io (custom domain)

## Auto-Deployment Active

Any push to `main` branch automatically deploys to both:
- warelay-agent.vercel.app
- warelay.io (once DNS configured)
