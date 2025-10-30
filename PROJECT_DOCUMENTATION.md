# Airplai Sports Internal Hub - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Setup Journey](#project-setup-journey)
4. [Architecture](#architecture)
5. [Database Schema](#database-schema)
6. [Authentication Setup](#authentication-setup)
7. [Deployment](#deployment)
8. [Troubleshooting History](#troubleshooting-history)
9. [Features](#features)
10. [Customization Guide](#customization-guide)
11. [Maintenance](#maintenance)

---

## Project Overview

**Airplai Sports Internal Hub** is a Next.js-based internal documentation platform with real-time collaboration features, version control, and activity tracking. The application provides a centralized location for company documentation with a drag-and-drop page editor.

**Live URL:** https://airplaisports-internalhub.vercel.app/

**Key Features:**
- Google OAuth authentication
- Real-time database persistence via Supabase
- Drag-and-drop page editor
- Role-based access control (Admin, Editor, Viewer)
- Version history tracking
- Activity logging
- Search functionality
- Nested page structure support

---

## Tech Stack

### Frontend
- **Next.js 14** - React framework with Pages Router
- **React 18** - UI library
- **Tailwind CSS 3** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend & Database
- **Supabase** - PostgreSQL database with built-in authentication
- **PostgreSQL** - Relational database with JSONB support
- **Row Level Security (RLS)** - Database-level access control

### Hosting & Deployment
- **Vercel** - Hosting platform with automatic deployments
- **Git** - Version control

### Authentication
- **Google OAuth** - Sign in with Google Workspace accounts
- **Supabase Auth** - Authentication provider

---

## Project Setup Journey

### Initial Setup (Day 1)

1. **Project Initialization**
   ```bash
   npx create-next-app@latest airplaisports-internalhub
   cd airplaisports-internalhub
   ```

2. **Dependencies Installed**
   ```bash
   npm install @supabase/supabase-js lucide-react
   npm install -D tailwindcss postcss autoprefixer
   ```

3. **Project Structure Created**
   ```
   airplaisports-internalhub/
   ├── pages/
   │   ├── index.js          # Main application
   │   ├── env-test.js       # Diagnostic page (can be removed)
   │   └── db-test.js        # Diagnostic page (can be removed)
   ├── lib/
   │   ├── supabase/
   │   │   └── client.js     # Supabase client configuration
   │   └── db/
   │       ├── pages.js      # Page CRUD operations
   │       ├── activity.js   # Activity log operations
   │       └── versions.js   # Version history operations
   ├── supabase/
   │   └── schema.sql        # Database schema
   ├── styles/
   │   └── globals.css       # Global styles with Tailwind
   └── public/              # Static assets
   ```

---

## Architecture

### Application Flow

```
User Request
    ↓
Next.js Pages Router
    ↓
React Components (pages/index.js)
    ↓
Supabase Client (lib/supabase/client.js)
    ↓
Database Operations (lib/db/*.js)
    ↓
Supabase PostgreSQL Database
```

### Authentication Flow

```
1. User clicks "Sign in with Google"
2. Supabase redirects to Google OAuth
3. User authorizes in Google Workspace
4. Google redirects back to app with token
5. Supabase verifies token and creates session
6. App loads user profile from database
7. App loads pages and data based on user role
```

### Component Architecture

The app uses a single-page architecture with React state management:

- **Main Component:** `pages/index.js` - Contains all UI and logic
- **Supabase Client:** `lib/supabase/client.js` - Browser-only client initialization
- **Database Layer:** `lib/db/*.js` - Abstracted database operations
- **State Management:** React hooks (useState, useEffect)

---

## Database Schema

### Tables

#### 1. `profiles`
Stores user profiles with role-based permissions.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Roles:**
- `admin` - Full access: create, edit, delete pages
- `editor` - Can edit existing pages
- `viewer` - Read-only access

#### 2. `pages`
Stores documentation pages with JSONB components.

```sql
CREATE TABLE pages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT DEFAULT 'FileText',
  parent_id TEXT REFERENCES pages(id) ON DELETE CASCADE,
  components JSONB DEFAULT '[]',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Component Structure:**
```json
[
  {
    "id": 1,
    "type": "heading",
    "content": "Welcome",
    "level": 1
  },
  {
    "id": 2,
    "type": "text",
    "content": "This is a paragraph"
  }
]
```

**Supported Component Types:**
- `heading` - H1-H6 headings
- `text` - Paragraphs
- `list` - Bulleted lists
- `alert` - Info boxes
- `code` - Code blocks

#### 3. `navigation_items`
Stores sidebar navigation structure.

```sql
CREATE TABLE navigation_items (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT DEFAULT 'FileText',
  page_id TEXT REFERENCES pages(id) ON DELETE CASCADE,
  parent_id TEXT REFERENCES navigation_items(id),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. `activity_logs`
Tracks user actions for audit purposes.

```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  page_id TEXT REFERENCES pages(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Example Actions:**
- "Created page: Welcome"
- "Edited page: Documentation"
- "Deleted page: Old Guide"

#### 5. `version_history`
Stores page version snapshots.

```sql
CREATE TABLE version_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  components JSONB NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_by_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)

All tables have RLS enabled with policies that allow:
- Authenticated users can read all data
- Admins can insert, update, and delete
- Editors can update existing records
- Viewers have read-only access

Example RLS Policy:
```sql
CREATE POLICY "Allow authenticated users to read profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);
```

---

## Authentication Setup

### Google OAuth Configuration

1. **Supabase Configuration:**
   - Navigate to: Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Configure OAuth consent screen in Google Cloud Console
   - Add authorized redirect URI: `https://[project-ref].supabase.co/auth/v1/callback`

2. **Workspace Restriction:**
   To restrict sign-ins to your Google Workspace domain:
   - Google Cloud Console → APIs & Services → OAuth consent screen
   - Set User type to "Internal"
   - This limits access to users in your workspace only

3. **Environment Variables:**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Supabase Client Implementation

**File: `lib/supabase/client.js`**

```javascript
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  // Browser-only client (returns null on server-side)
  if (typeof window === 'undefined') {
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables not configured');
    return null;
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
```

**Key Design Decision:** We use the standard `@supabase/supabase-js` client instead of `@supabase/ssr` because:
- The app runs entirely client-side (no server-side data fetching)
- SSR client requires complex cookie configuration
- Browser client is simpler and more reliable for this use case

---

## Deployment

### Vercel Setup

1. **Connect Repository:**
   - Go to Vercel Dashboard
   - Click "New Project"
   - Import Git repository: `azrasheikh/airplaisports-internalhub`
   - Select branch: `claude/setup-new-project-011CUbwUNecisekqcTrKbmCR`

2. **Environment Variables:**
   Configure in Vercel Dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://ywghmhdqnosuxviooddr.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
   ```

3. **Build Settings:**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Deploy:**
   - Vercel automatically deploys on every push
   - Production URL: https://airplaisports-internalhub.vercel.app/

### Git Workflow

**Development Branch:**
```bash
git checkout claude/setup-new-project-011CUbwUNecisekqcTrKbmCR
```

**Making Changes:**
```bash
git add .
git commit -m "Your commit message"
git push origin claude/setup-new-project-011CUbwUNecisekqcTrKbmCR
```

**Auto-Deploy:**
- Every push triggers automatic Vercel deployment
- Check deployment status in Vercel Dashboard
- Typically takes 1-2 minutes

---

## Troubleshooting History

### Issue 1: Wrong Branch Deployed (SOLVED)
**Problem:** Vercel build failed with "Couldn't find any pages or app directory"

**Cause:** Vercel was deploying from `main` branch, but code was on `claude/setup-new-project-011CUbwUNecisekqcTrKbmCR`

**Solution:** Changed deployment branch in Vercel settings

---

### Issue 2: SSR Environment Variables (SOLVED)
**Problem:** Build failed during server-side rendering

**Cause:** Supabase client was being initialized during SSR without environment variables

**Solution:**
- Modified `lib/supabase/client.js` to check `typeof window === 'undefined'`
- Return `null` during SSR
- Initialize client in `useEffect` (client-side only)

**Code:**
```javascript
if (typeof window === 'undefined') {
  return null; // Don't create client on server
}
```

---

### Issue 3: Infinite Loading Spinner (SOLVED)
**Problem:** After Google sign-in, app showed loading spinner indefinitely

**Symptoms:**
- User authenticated successfully
- Profile created in database
- No network requests in browser DevTools
- Queries appeared to hang without timing out

**Root Cause:** Using wrong Supabase package

**Investigation Steps:**
1. Verified environment variables were present
2. Confirmed user and profile in database
3. Checked Network tab - NO Supabase requests
4. Added extensive debug logging
5. Added timeout detection (10s for queries)
6. Created diagnostic page (`db-test.js`)
7. Discovered queries hung at "Querying pages table..."

**Solution:** Changed from `@supabase/ssr` to `@supabase/supabase-js`

**Before (broken):**
```javascript
import { createBrowserClient } from '@supabase/ssr'
// This hung indefinitely
```

**After (working):**
```javascript
import { createClient } from '@supabase/supabase-js'
// This works correctly
```

**Why this fixed it:**
- `@supabase/ssr` package is designed for SSR scenarios with cookie management
- It requires complex configuration for cookie handling
- Our app is client-side only, so standard client works better
- Standard client makes network requests properly

---

### Issue 4: Duplicate Auth State Changes (SOLVED)
**Problem:** Profile and data loaded multiple times on sign-in

**Cause:** Supabase auth listener triggered multiple events:
- `SIGNED_IN`
- `INITIAL_SESSION`
- Multiple duplicate calls

**Solution:** Added deduplication logic

```javascript
let lastUserId = null;
client.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    const userId = session.user.id;

    // Skip duplicate INITIAL_SESSION events
    if (lastUserId === userId && event === 'INITIAL_SESSION') {
      return;
    }

    lastUserId = userId;
    // Only reload on actual SIGNED_IN event
    if (event === 'SIGNED_IN') {
      await loadUserProfile(userId, client);
      await loadData(client);
    }
  }
});
```

---

## Features

### 1. Page Management
- **Create Pages:** Click "+ New Page" button (admin only)
- **Edit Pages:** Click edit icon, use drag-and-drop editor
- **Delete Pages:** Delete icon in page list (admin only)
- **Nested Pages:** Select parent page when creating

### 2. Component Editor
Drag and drop components to build pages:
- **Heading:** Add H1-H6 headings
- **Text:** Add paragraphs
- **List:** Add bullet point lists
- **Alert:** Add info boxes
- **Code:** Add code blocks

### 3. Version History
- Click clock icon when editing a page
- View all previous versions
- See who made changes and when
- Restore previous versions

### 4. Activity Log
- Click Activity icon in sidebar
- View all user actions
- Filter by user or action type
- Audit trail for compliance

### 5. Search
- Search box in top navigation
- Searches page titles and content
- Real-time filtering

### 6. Role-Based Access
- **Admin:** Full CRUD access
- **Editor:** Can edit pages
- **Viewer:** Read-only access

---

## Customization Guide

### Adding New Users

1. Have user sign in with Google
2. Go to Supabase Dashboard → Table Editor → `profiles`
3. Find their row (by email)
4. Click Edit
5. Change `role` to `admin`, `editor`, or `viewer`
6. Save

### Changing Branding

**File: `pages/index.js`**

**Company Name:**
```javascript
// Line ~234
<div className="text-2xl font-bold text-blue-600">
  Airplai Sports Hub  {/* Change this */}
</div>
```

**Logo:** Add your logo to `public/` folder and reference it:
```javascript
<img src="/logo.png" alt="Logo" className="h-8" />
```

**Colors:** Modify Tailwind classes throughout the file:
- `bg-blue-600` → Change to your brand color
- `text-blue-600` → Change to your brand color

### Adding New Page Component Types

**File: `pages/index.js`**

Add to `componentTypes` array (around line 64):
```javascript
const componentTypes = [
  // Existing types...
  {
    type: 'image',
    label: 'Image',
    icon: ImageIcon,
    default: { url: '', alt: 'Image' }
  }
];
```

Then add render logic in the `renderComponent` function:
```javascript
case 'image':
  return <img src={component.url} alt={component.alt} />;
```

### Modifying Database Schema

1. Write SQL migration in Supabase Dashboard → SQL Editor
2. Test on development database first
3. Back up data before running on production
4. Update TypeScript types if using TypeScript

---

## Maintenance

### Regular Tasks

**Weekly:**
- Check activity logs for suspicious activity
- Review user roles and access

**Monthly:**
- Review and archive old pages
- Check database storage usage
- Review version history storage

### Backup Strategy

**Automatic Backups:** Supabase provides automatic daily backups (retention depends on plan)

**Manual Backup:**
1. Supabase Dashboard → Database → Backups
2. Click "Create Backup"
3. Download backup file

**Restore from Backup:**
1. Supabase Dashboard → Database → Backups
2. Select backup
3. Click "Restore"

### Monitoring

**Vercel Dashboard:**
- Check deployment status
- Monitor build times
- Review error logs

**Supabase Dashboard:**
- Monitor database usage
- Check API request counts
- Review authentication logs
- Monitor database performance

### Scaling Considerations

**Current Limits (Free Tier):**
- Supabase: 500MB database, 2GB bandwidth/month
- Vercel: 100GB bandwidth/month

**When to Upgrade:**
- Database > 400MB → Upgrade Supabase plan
- Traffic > 80GB/month → Upgrade Vercel plan
- > 50 concurrent users → Consider performance optimization

### Performance Optimization

**If app becomes slow:**

1. **Add Indexes:**
   ```sql
   CREATE INDEX idx_pages_created_at ON pages(created_at);
   CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
   ```

2. **Implement Pagination:**
   - Load pages in batches
   - Add "Load More" button
   - Limit activity log to recent entries

3. **Add Caching:**
   - Cache page data in React state
   - Use React Query for data fetching
   - Implement service workers for offline support

---

## Useful Commands

### Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start
```

### Database
```sql
-- View all users
SELECT * FROM profiles;

-- Make user admin
UPDATE profiles SET role = 'admin' WHERE email = 'user@example.com';

-- View recent activity
SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 20;

-- Count pages
SELECT COUNT(*) FROM pages;

-- View page with most versions
SELECT page_id, COUNT(*) as version_count
FROM version_history
GROUP BY page_id
ORDER BY version_count DESC;
```

### Git
```bash
# Check current branch
git branch

# View recent commits
git log --oneline -10

# Push changes
git push origin claude/setup-new-project-011CUbwUNecisekqcTrKbmCR
```

---

## Files Reference

### Core Application Files

| File | Purpose | Key Functions |
|------|---------|---------------|
| `pages/index.js` | Main application | All UI components, state management |
| `lib/supabase/client.js` | Supabase client | Browser client initialization |
| `lib/db/pages.js` | Page operations | CRUD functions for pages |
| `lib/db/activity.js` | Activity logging | Create and fetch activity logs |
| `lib/db/versions.js` | Version control | Save and restore page versions |
| `supabase/schema.sql` | Database schema | All table definitions and RLS policies |
| `styles/globals.css` | Global styles | Tailwind CSS configuration |
| `next.config.js` | Next.js config | Framework configuration |
| `tailwind.config.js` | Tailwind config | CSS utility configuration |

### Diagnostic Files (Can be removed)

| File | Purpose | Remove? |
|------|---------|---------|
| `pages/env-test.js` | Test environment variables | Yes, after confirming deployment works |
| `pages/db-test.js` | Test database connection | Yes, after confirming database works |

---

## Support & Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Community
- [Next.js Discord](https://nextjs.org/discord)
- [Supabase Discord](https://discord.supabase.com)

### Project Repositories
- GitHub: `azrasheikh/airplaisports-internalhub`
- Branch: `claude/setup-new-project-011CUbwUNecisekqcTrKbmCR`

---

## Success Metrics

### What We Accomplished

✅ **Setup Complete:**
- Next.js project initialized
- Supabase database configured
- Google OAuth authentication working
- Deployed to Vercel

✅ **Features Working:**
- User authentication and profiles
- Page CRUD operations
- Drag-and-drop editor
- Version history
- Activity logging
- Role-based access control
- Search functionality

✅ **Technical Achievements:**
- Resolved SSR environment variable issues
- Fixed infinite loading bug (wrong Supabase package)
- Implemented deduplication for auth events
- Cleaned up production code
- Database with proper RLS policies

✅ **Production Ready:**
- Live at: https://airplaisports-internalhub.vercel.app/
- Admin user configured
- Database populated with default content
- All core features tested and working

---

## Changelog

### 2025-10-30 - Initial Release

**Added:**
- Complete Next.js application with Supabase integration
- Google OAuth authentication
- Page management system with CRUD operations
- Drag-and-drop component editor
- Version history tracking
- Activity logging
- Role-based access control
- Vercel deployment

**Fixed:**
- SSR environment variable issues
- Infinite loading spinner (switched from @supabase/ssr to @supabase/supabase-js)
- Duplicate auth state change calls
- RLS policy configuration

**Removed:**
- Excessive debug logging from production code
- Demo mode functionality

---

## License

Internal use only - Airplai Sports

---

## Contact

For questions or issues with this project:
- Email: azra@airplaisports.com
- Project maintained by: Airplai Sports Team

---

**Last Updated:** October 30, 2025
**Version:** 1.0.0
**Status:** Production Ready ✅
