# Deployment Guide

## Deploy to Vercel (Recommended)

### Method 1: Using Vercel Dashboard (Easiest)

1. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit: Pongal contest website"
   git branch -M main
   git remote add origin https://github.com/yourusername/pongal-contest.git
   git push -u origin main
   \`\`\`

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click **New Project**
   - Import your GitHub repository
   - Configure:
     - Framework Preset: **Vite**
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add Environment Variables:
     - `VITE_SUPABASE_URL`: your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: your Supabase anon key
     - `VITE_CONTEST_END_DATE`: `2026-01-20T23:59:59`
   - Click **Deploy**

3. **Done!** 🎉
   - Your site will be live at `https://your-project.vercel.app`
   - Vercel provides SSL certificate automatically
   - Continuous deployment from GitHub

### Method 2: Using Vercel CLI

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Setup and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? pongal-contest
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_CONTEST_END_DATE

# Deploy to production
vercel --prod
\`\`\`

---

## Deploy to Netlify

### Method 1: Using Netlify Dashboard

1. **Push to GitHub** (same as above)

2. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click **Add New Site** → **Import an existing project**
   - Choose GitHub and select your repository
   - Configure:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add Environment Variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_CONTEST_END_DATE`
   - Click **Deploy**

### Method 2: Using Netlify CLI

\`\`\`bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
\`\`\`

---

## Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Add environment variables
5. Railway will auto-detect Vite and deploy

---

## Deploy to Render

1. Go to [render.com](https://render.com)
2. Click **New** → **Static Site**
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
5. Add environment variables
6. Click **Create Static Site**

---

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records at your domain registrar:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `cname.vercel-dns.com`

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records:
   - Type: `CNAME`
   - Name: `www`
   - Value: `your-site.netlify.app`

---

## Post-Deployment Checklist

- [ ] Website loads correctly
- [ ] Registration form works
- [ ] Admin login functional
- [ ] Realtime updates working
- [ ] SSL certificate active (https)
- [ ] Custom domain configured (if applicable)
- [ ] Environment variables set correctly
- [ ] Test registration end-to-end
- [ ] Test admin dashboard features
- [ ] Mobile responsiveness verified
- [ ] Share contest link! 🎉

---

## Monitoring & Analytics (Optional)

### Add Google Analytics

1. Get tracking ID from Google Analytics
2. Add to `index.html`:
   \`\`\`html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   \`\`\`

### Monitor with Vercel Analytics

1. Go to your project on Vercel
2. Click **Analytics** tab
3. Enable Analytics
4. View real-time visitor data

---

## Backup & Recovery

### Backup Supabase Data

\`\`\`bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Or export from Supabase Dashboard:
# Database → Backups → Download
\`\`\`

### Restore from Backup

\`\`\`bash
# Using Supabase CLI
supabase db reset
supabase db push backup.sql
\`\`\`

---

## Performance Optimization

### Already Included:
- ✅ Vite for fast builds
- ✅ Tree shaking
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Optimized images
- ✅ Minified CSS/JS

### Additional Optimizations:

1. **Enable Compression** (automatic on Vercel/Netlify)
2. **Use CDN** (included with Vercel/Netlify)
3. **Cache Strategy** (configured in build)
4. **Lighthouse Score** (should be 90+)

---

## Troubleshooting Deployment

### Build Fails
- Check Node.js version (use v18+)
- Verify all dependencies in `package.json`
- Check build logs for errors

### Environment Variables Not Working
- Restart deployment after adding variables
- Variables must start with `VITE_`
- No quotes around values in deployment platform

### Site Shows 404
- Verify publish directory is `dist`
- Check build completed successfully
- Clear cache and redeploy

### Admin Login Issues in Production
- Verify Supabase URL is production URL
- Check admin user exists in Supabase
- Confirm auth is enabled in Supabase

---

## Cost Estimate

### Free Tier (Perfect for Contest):
- ✅ **Vercel**: Free (Hobby plan)
- ✅ **Supabase**: Free up to 50,000 rows
- ✅ **Domain**: ~$10-15/year (optional)

### Estimated Traffic Capacity (Free Tier):
- **Users**: 10,000+ registrations
- **Bandwidth**: 100GB/month
- **Database**: 500MB storage
- **Auth**: Unlimited users

**Total Cost**: **$0** (or ~$12/year with custom domain)

---

## Support & Updates

### Stay Updated
\`\`\`bash
# Pull latest dependencies
npm update

# Rebuild and redeploy
npm run build
vercel --prod
\`\`\`

### Monitor Site Health
- Set up uptime monitoring (e.g., UptimeRobot)
- Check Supabase dashboard regularly
- Monitor registration count

---

**Happy Deploying! 🚀**
