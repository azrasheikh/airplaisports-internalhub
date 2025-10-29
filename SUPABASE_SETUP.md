# Supabase Setup Guide

Follow these steps to set up Supabase for your Airplai Sports Hub.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click **"New Project"**
4. Fill in the project details:
   - **Name**: Airplai Sports Hub
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click **"Create new project"**
6. Wait for the project to be set up (takes ~2 minutes)

## Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to the **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of `supabase/schema.sql` from this repository
4. Paste it into the SQL editor
5. Click **"Run"** or press `Ctrl/Cmd + Enter`
6. You should see "Success. No rows returned" - this means the schema was created successfully

## Step 3: Configure Authentication

1. Go to **Authentication** → **Providers** in the left sidebar
2. Enable **Google** provider:
   - Click on **Google**
   - Toggle **"Enable Sign in with Google"**
   - You have two options:

     **Option A - Use Supabase's Google OAuth (Easiest):**
     - Just toggle it on, that's it! Supabase provides a default OAuth setup

     **Option B - Use Your Own Google OAuth (More Control):**
     - Go to [Google Cloud Console](https://console.cloud.google.com/)
     - Create a new project or select existing one
     - Enable Google+ API
     - Go to **Credentials** → **Create Credentials** → **OAuth Client ID**
     - Application type: **Web application**
     - Add authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
     - Copy **Client ID** and **Client Secret**
     - Paste them in Supabase Google provider settings

3. Click **"Save"**

## Step 4: Get Your Supabase Credentials

1. Go to **Settings** → **API** (in left sidebar)
2. You'll see:
   - **Project URL**: `https://xxxxxxxxxx.supabase.co`
   - **Project API keys**:
     - **anon/public key**: This is safe for client-side use
     - **service_role key**: Keep this secret! (We won't use this in the frontend)

3. Copy these values - you'll need them in the next step

## Step 5: Create Environment Variables File

1. In your project root, create a file called `.env.local`
2. Add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace the values with your actual credentials from Step 4
4. Save the file

**Important**: The `.env.local` file is already in `.gitignore`, so it won't be committed to Git (keeping your keys safe!)

## Step 6: Set Up Your First Admin User

After you run the app and sign in for the first time:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find your user in the list
3. Go to Supabase Dashboard → **Table Editor** → **profiles**
4. Find your profile row
5. Click **Edit** and change the `role` field from `viewer` to `admin`
6. Save the changes
7. Refresh your app - you now have admin permissions!

## Step 7: Verify Everything Works

1. Make sure your `.env.local` file is created with the correct values
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000
4. Click **"Sign in with Google"**
5. You should see the real Google sign-in popup
6. After signing in, you should see your Google profile info
7. Try creating a page, editing content, etc.

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` file
- Make sure variable names start with `NEXT_PUBLIC_`
- Restart your dev server after creating `.env.local`

### Google Sign-In doesn't work
- Make sure you enabled Google provider in Supabase
- Check that the redirect URI is correctly configured
- Try using Supabase's default Google OAuth first

### Can't create or edit pages (permission denied)
- Check your role in the `profiles` table
- Make sure it's set to `admin` or `editor`
- Sign out and sign back in

### Database queries fail
- Make sure you ran the entire `schema.sql` file
- Check the Supabase logs in Dashboard → **Logs**
- Verify Row Level Security policies are set up correctly

## Next Steps

Once Supabase is set up, the application will:
- ✅ Use real Google authentication
- ✅ Save pages to the database
- ✅ Persist activity logs
- ✅ Store version history
- ✅ Work across devices and sessions

You're ready to deploy to Vercel!
