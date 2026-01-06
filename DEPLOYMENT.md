# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Gemini AI API key
- Git repository

## Environment Setup

1. **Create Environment File**

```bash
cp .env.local.example .env.local
```

2. **Add Required Variables**

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

## Vercel Deployment (Recommended)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/learnsmart)

### Manual Deployment

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy**

```bash
# From project root
vercel

# Production deployment
vercel --prod
```

4. **Set Environment Variables**

In Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add `NEXT_PUBLIC_GEMINI_API_KEY`
- Redeploy

### Continuous Deployment

Connect your Git repository to Vercel:

1. Visit [vercel.com](https://vercel.com)
2. Import your repository
3. Configure project settings
4. Add environment variables
5. Deploy

Every push to `main` will automatically deploy to production.

## Docker Deployment

### Build Docker Image

```bash
docker build -t learnsmart:latest .
```

### Run Container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_GEMINI_API_KEY=your_key \
  learnsmart:latest
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## Self-Hosting

### Build for Production

```bash
npm install
npm run build
```

### Start Server

```bash
npm start
```

The app will be available at `http://localhost:3000`

### Using PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start npm --name "learnsmart" -- start

# Save process list
pm2 save

# Setup startup script
pm2 startup
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Alternative Platforms

### Netlify

1. Connect repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy

### Railway

1. Connect repository
2. Add environment variables
3. Deploy automatically

### AWS Amplify

1. Connect repository
2. Configure build settings
3. Add environment variables
4. Deploy

## Post-Deployment Checklist

- [ ] Environment variables are set
- [ ] Build succeeds without errors
- [ ] All pages are accessible
- [ ] Dark mode toggle works
- [ ] Authentication flow works
- [ ] API routes respond correctly
- [ ] Mobile responsiveness verified
- [ ] Performance metrics checked
- [ ] Error monitoring setup (optional)
- [ ] Analytics configured (optional)

## Monitoring

### Vercel Analytics

Automatically enabled for Vercel deployments.

### Custom Monitoring

Consider adding:
- Sentry for error tracking
- Google Analytics for usage
- Vercel Speed Insights

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Restart dev server after changing `.env.local`
- Check variable names match exactly

### API Routes Failing

- Verify Gemini API key is valid
- Check API rate limits
- Review server logs

### Pages Not Rendering

- Check for TypeScript errors: `npm run type-check`
- Verify all imports are correct
- Check browser console for errors

## Performance Optimization

### Enable Caching

Add to `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  // ... existing config
  
  // Enable caching
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};
```

### CDN Configuration

For static assets, configure CDN in deployment platform:
- Vercel: Automatic
- Netlify: Automatic
- Others: Configure manually

## Security

### Best Practices

1. **Never commit `.env.local`**
2. **Use environment variables for secrets**
3. **Keep dependencies updated**: `npm audit fix`
4. **Enable HTTPS** (automatic on Vercel)
5. **Configure CSP headers** (future)

### Headers Configuration

Add to `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};
```

## Scaling

### Horizontal Scaling

- Use Vercel's automatic scaling
- Configure load balancer for self-hosted
- Use CDN for static assets

### Database Integration (Future)

When adding a database:
1. Choose provider (Vercel Postgres, Supabase, PlanetScale)
2. Add connection string to environment variables
3. Update API routes
4. Configure connection pooling

## Rollback

### Vercel

```bash
vercel rollback [deployment-url]
```

### Manual

```bash
git revert HEAD
git push
```

## Support

For deployment issues:
- Check Next.js documentation
- Review Vercel documentation
- Check project GitHub issues
- Review logs in deployment platform

---

**Happy Deploying! 🚀**
