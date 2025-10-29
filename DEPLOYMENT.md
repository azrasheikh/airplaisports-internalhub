# Deployment Guide

This guide will help you deploy your Airplai Sports Hub to Vercel (or other platforms).

## Prerequisites

Before deploying, make sure you've completed:
- ✅ Supabase setup (see `SUPABASE_SETUP.md`)
- ✅ Created `.env.local` with your Supabase credentials
- ✅ Tested locally that authentication and database operations work

## Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest platform for deploying Next.js applications and offers a generous free tier.

### Step 1: Prepare Your Repository

1. Make sure all your changes are committed and pushed to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push
   ```

### Step 2: Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended) or your email
4. Authorize Vercel to access your GitHub repositories

### Step 3: Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Select **"Import Git Repository"**
3. Find `airplaisports-internalhub` in your repository list
4. Click **"Import"**

### Step 4: Configure Environment Variables

This is **CRITICAL** - your app won't work without these!

1. In the **"Configure Project"** screen, expand **"Environment Variables"**
2. Add the following variables:

   **Variable 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase URL (from `.env.local`)
   - Environment: Select all (Production, Preview, Development)

   **Variable 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon key (from `.env.local`)
   - Environment: Select all (Production, Preview, Development)

3. Click **"Add"** for each variable

### Step 5: Deploy

1. Leave other settings as default (Vercel auto-detects Next.js)
2. Click **"Deploy"**
3. Wait 2-3 minutes for the build to complete
4. You'll see "Congratulations!" when it's done

### Step 6: Update Supabase Redirect URLs

After deployment, you need to add your Vercel URL to Supabase:

1. Copy your Vercel deployment URL (e.g., `https://your-project.vercel.app`)
2. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
3. Add to **"Redirect URLs"**:
   - `https://your-project.vercel.app`
   - `https://your-project.vercel.app/**` (with wildcard)
4. Save changes

### Step 7: Test Your Deployment

1. Visit your Vercel URL
2. Click **"Sign in with Google"**
3. Complete authentication
4. Try creating a page, editing content, etc.
5. Everything should work exactly like it did locally!

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to your main branch
- **Preview**: Every push to other branches or pull requests

This means your app stays up-to-date automatically!

## Custom Domain (Optional)

Want to use your own domain like `hub.airplai.com`?

1. Go to your project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow the DNS configuration instructions
5. Update the domain in Supabase redirect URLs

## Option 2: Deploy to Other Platforms

### Netlify

1. Go to [netlify.com](https://netlify.com)
2. Import from GitHub
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables (same as Vercel)
6. Deploy!

### Railway

1. Go to [railway.app](https://railway.app)
2. **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Add environment variables
5. Railway will detect Next.js and deploy automatically

### Self-Hosted (VPS/Docker)

If you want to self-host:

1. Build the production version:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

3. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "airplai-hub" -- start
   pm2 save
   pm2 startup
   ```

4. Set up a reverse proxy (Nginx/Caddy) with SSL
5. Point your domain to your server

## Environment Variables Reference

Your production environment needs these variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important Notes:**
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser (safe for Supabase public keys)
- Never commit `.env.local` to Git (it's in `.gitignore`)
- Always use the anon key, never the service_role key in the frontend

## Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Make sure you added both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check for typos in variable names
- Make sure you selected all environments when adding them

**Error: Module not found**
- Vercel might have cached an old build
- Go to Settings → General → Clear Cache and redeploy

### Authentication Doesn't Work

**Google sign-in redirects to error page**
- Make sure your Vercel URL is added to Supabase redirect URLs
- Check that you're using `https://` not `http://`
- Wait 5 minutes after adding redirect URLs (Supabase needs time to update)

**"Invalid API key" error**
- Double-check your environment variables in Vercel
- Make sure they match exactly what's in your Supabase dashboard
- Try redeploying after fixing them

### Pages Don't Load

**Blank page or infinite loading**
- Check the Vercel deployment logs (Functions tab)
- Make sure your database schema was created correctly
- Verify Row Level Security policies allow authenticated users to read

### Can't Create or Edit Pages

**Permission denied errors**
- Check your user's role in the `profiles` table
- Make sure it's set to `admin` or `editor`
- Sign out and sign back in after changing roles

## Performance Optimization

Once deployed, consider these optimizations:

1. **Enable Vercel Analytics**:
   - Go to project Settings → Analytics
   - Enable Web Analytics (free tier available)

2. **Add Caching Headers**:
   - Static pages can be cached for better performance
   - Vercel handles most of this automatically

3. **Monitor Supabase Usage**:
   - Check your Supabase dashboard for usage stats
   - Free tier includes 500MB database and 2GB bandwidth/month
   - Upgrade if you need more

4. **Optimize Images**:
   - Use Next.js Image component for user-uploaded images
   - Images are automatically optimized by Vercel

## Monitoring

Keep an eye on your deployment:

- **Vercel Dashboard**: Monitor deployments, errors, and performance
- **Supabase Dashboard**: Check database usage, auth logs, and API calls
- **Error Tracking**: Consider adding Sentry for error monitoring

## Scaling

As your team grows:

1. **Upgrade Supabase**: Move to Pro plan ($25/month) for more resources
2. **Upgrade Vercel**: Pro plan ($20/month) for better analytics and support
3. **Add CDN**: Use Vercel's Edge Network (included) for global performance
4. **Database Optimization**: Add indexes, optimize queries as needed

## Security Checklist

Before going to production:

- ✅ Environment variables are set correctly
- ✅ `.env.local` is not committed to Git
- ✅ Supabase Row Level Security policies are enabled
- ✅ Google OAuth is configured correctly
- ✅ Custom domain has SSL (Vercel provides this automatically)
- ✅ First user's role is set to 'admin' in database
- ✅ Supabase redirect URLs include your production domain

## Next Steps

After deployment:

1. **Share the URL** with your team
2. **Set up admin users** by changing roles in the `profiles` table
3. **Create your documentation** pages and content
4. **Customize branding** (see main README)
5. **Monitor usage** and optimize as needed

Need help? Check the [Vercel Docs](https://vercel.com/docs) or [Supabase Docs](https://supabase.com/docs)!
