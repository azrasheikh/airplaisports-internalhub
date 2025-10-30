-- Run this SQL in Supabase Dashboard > SQL Editor to add documentation pages to your app
-- This will create 5 comprehensive documentation pages

-- 1. Project Overview & Setup
INSERT INTO pages (id, title, icon, parent_id, components, created_at, updated_at) VALUES
('project-overview', 'Project Overview & Setup', 'BookOpen', NULL, '[
  {
    "id": 1,
    "type": "heading",
    "content": "Airplai Sports Internal Hub - Project Documentation",
    "level": 1
  },
  {
    "id": 2,
    "type": "alert",
    "content": "This documentation covers everything about how this application was built, deployed, and is maintained."
  },
  {
    "id": 3,
    "type": "heading",
    "content": "Project Overview",
    "level": 2
  },
  {
    "id": 4,
    "type": "text",
    "content": "Airplai Sports Internal Hub is a Next.js-based internal documentation platform with real-time collaboration features, version control, and activity tracking."
  },
  {
    "id": 5,
    "type": "text",
    "content": "Live URL: https://airplaisports-internalhub.vercel.app/"
  },
  {
    "id": 6,
    "type": "heading",
    "content": "Key Features",
    "level": 3
  },
  {
    "id": 7,
    "type": "list",
    "items": [
      "Google OAuth authentication",
      "Real-time database persistence via Supabase",
      "Drag-and-drop page editor",
      "Role-based access control (Admin, Editor, Viewer)",
      "Version history tracking",
      "Activity logging",
      "Search functionality",
      "Nested page structure support"
    ]
  },
  {
    "id": 8,
    "type": "heading",
    "content": "Tech Stack",
    "level": 2
  },
  {
    "id": 9,
    "type": "heading",
    "content": "Frontend",
    "level": 3
  },
  {
    "id": 10,
    "type": "list",
    "items": [
      "Next.js 14 - React framework with Pages Router",
      "React 18 - UI library",
      "Tailwind CSS 3 - Utility-first CSS framework",
      "Lucide React - Icon library"
    ]
  },
  {
    "id": 11,
    "type": "heading",
    "content": "Backend & Database",
    "level": 3
  },
  {
    "id": 12,
    "type": "list",
    "items": [
      "Supabase - PostgreSQL database with built-in authentication",
      "PostgreSQL - Relational database with JSONB support",
      "Row Level Security (RLS) - Database-level access control"
    ]
  },
  {
    "id": 13,
    "type": "heading",
    "content": "Hosting & Deployment",
    "level": 3
  },
  {
    "id": 14,
    "type": "list",
    "items": [
      "Vercel - Hosting platform with automatic deployments",
      "Git - Version control",
      "Google OAuth - Sign in with Google Workspace accounts"
    ]
  },
  {
    "id": 15,
    "type": "heading",
    "content": "Project Structure",
    "level": 2
  },
  {
    "id": 16,
    "type": "code",
    "content": "airplaisports-internalhub/\n├── pages/\n│   ├── index.js          # Main application\n│   ├── env-test.js       # Diagnostic page\n│   └── db-test.js        # Diagnostic page\n├── lib/\n│   ├── supabase/\n│   │   └── client.js     # Supabase client\n│   └── db/\n│       ├── pages.js      # Page CRUD operations\n│       ├── activity.js   # Activity logs\n│       └── versions.js   # Version history\n├── supabase/\n│   └── schema.sql        # Database schema\n└── styles/\n    └── globals.css       # Global styles"
  },
  {
    "id": 17,
    "type": "heading",
    "content": "Initial Setup Steps",
    "level": 2
  },
  {
    "id": 18,
    "type": "text",
    "content": "1. Created Next.js project with create-next-app"
  },
  {
    "id": 19,
    "type": "text",
    "content": "2. Installed dependencies: @supabase/supabase-js, lucide-react, tailwindcss"
  },
  {
    "id": 20,
    "type": "text",
    "content": "3. Set up Supabase project and database schema"
  },
  {
    "id": 21,
    "type": "text",
    "content": "4. Configured Google OAuth authentication"
  },
  {
    "id": 22,
    "type": "text",
    "content": "5. Deployed to Vercel with environment variables"
  },
  {
    "id": 23,
    "type": "text",
    "content": "6. Resolved multiple technical challenges (see Troubleshooting page)"
  }
]'::jsonb, NOW(), NOW());

-- 2. Architecture & Database Schema
INSERT INTO pages (id, title, icon, parent_id, components, created_at, updated_at) VALUES
('architecture-database', 'Architecture & Database Schema', 'Code', NULL, '[
  {
    "id": 1,
    "type": "heading",
    "content": "Application Architecture",
    "level": 1
  },
  {
    "id": 2,
    "type": "heading",
    "content": "Application Flow",
    "level": 2
  },
  {
    "id": 3,
    "type": "code",
    "content": "User Request\n    ↓\nNext.js Pages Router\n    ↓\nReact Components (pages/index.js)\n    ↓\nSupabase Client (lib/supabase/client.js)\n    ↓\nDatabase Operations (lib/db/*.js)\n    ↓\nSupabase PostgreSQL Database"
  },
  {
    "id": 4,
    "type": "heading",
    "content": "Authentication Flow",
    "level": 2
  },
  {
    "id": 5,
    "type": "list",
    "items": [
      "User clicks Sign in with Google",
      "Supabase redirects to Google OAuth",
      "User authorizes in Google Workspace",
      "Google redirects back with token",
      "Supabase verifies token and creates session",
      "App loads user profile from database",
      "App loads pages and data based on user role"
    ]
  },
  {
    "id": 6,
    "type": "heading",
    "content": "Database Schema",
    "level": 1
  },
  {
    "id": 7,
    "type": "heading",
    "content": "1. profiles Table",
    "level": 2
  },
  {
    "id": 8,
    "type": "text",
    "content": "Stores user profiles with role-based permissions."
  },
  {
    "id": 9,
    "type": "heading",
    "content": "Roles:",
    "level": 3
  },
  {
    "id": 10,
    "type": "list",
    "items": [
      "admin - Full access: create, edit, delete pages",
      "editor - Can edit existing pages",
      "viewer - Read-only access"
    ]
  },
  {
    "id": 11,
    "type": "heading",
    "content": "2. pages Table",
    "level": 2
  },
  {
    "id": 12,
    "type": "text",
    "content": "Stores documentation pages with JSONB components. Each page can have multiple components (heading, text, list, alert, code)."
  },
  {
    "id": 13,
    "type": "heading",
    "content": "Component Types:",
    "level": 3
  },
  {
    "id": 14,
    "type": "list",
    "items": [
      "heading - H1-H6 headings with level property",
      "text - Paragraph text",
      "list - Bulleted lists with items array",
      "alert - Info boxes for important messages",
      "code - Code blocks with syntax"
    ]
  },
  {
    "id": 15,
    "type": "heading",
    "content": "3. navigation_items Table",
    "level": 2
  },
  {
    "id": 16,
    "type": "text",
    "content": "Stores sidebar navigation structure with support for nested items and custom ordering."
  },
  {
    "id": 17,
    "type": "heading",
    "content": "4. activity_logs Table",
    "level": 2
  },
  {
    "id": 18,
    "type": "text",
    "content": "Tracks user actions for audit purposes. Records who did what and when."
  },
  {
    "id": 19,
    "type": "heading",
    "content": "Example Actions:",
    "level": 3
  },
  {
    "id": 20,
    "type": "list",
    "items": [
      "Created page: Welcome",
      "Edited page: Documentation",
      "Deleted page: Old Guide",
      "Restored version for page: About Us"
    ]
  },
  {
    "id": 21,
    "type": "heading",
    "content": "5. version_history Table",
    "level": 2
  },
  {
    "id": 22,
    "type": "text",
    "content": "Stores page version snapshots. Every time a page is edited, a version is saved so you can restore previous versions."
  },
  {
    "id": 23,
    "type": "heading",
    "content": "Row Level Security (RLS)",
    "level": 2
  },
  {
    "id": 24,
    "type": "text",
    "content": "All tables have RLS enabled with policies that enforce role-based access:"
  },
  {
    "id": 25,
    "type": "list",
    "items": [
      "Authenticated users can read all data",
      "Admins can insert, update, and delete",
      "Editors can update existing records",
      "Viewers have read-only access"
    ]
  },
  {
    "id": 26,
    "type": "heading",
    "content": "Key Design Decisions",
    "level": 2
  },
  {
    "id": 27,
    "type": "alert",
    "content": "We use the standard @supabase/supabase-js client instead of @supabase/ssr because the app runs entirely client-side with no server-side data fetching. This is simpler and more reliable for our use case."
  },
  {
    "id": 28,
    "type": "text",
    "content": "Components are stored as JSONB in PostgreSQL, giving us flexibility to add new component types without schema changes."
  }
]'::jsonb, NOW(), NOW());

-- 3. Troubleshooting Guide
INSERT INTO pages (id, title, icon, parent_id, components, created_at, updated_at) VALUES
('troubleshooting-guide', 'Troubleshooting Guide', 'AlertCircle', NULL, '[
  {
    "id": 1,
    "type": "heading",
    "content": "Troubleshooting Guide",
    "level": 1
  },
  {
    "id": 2,
    "type": "text",
    "content": "This page documents all major issues we encountered during development and how they were resolved."
  },
  {
    "id": 3,
    "type": "heading",
    "content": "Issue 1: Wrong Branch Deployed",
    "level": 2
  },
  {
    "id": 4,
    "type": "text",
    "content": "Problem: Vercel build failed with \"Could not find any pages or app directory\""
  },
  {
    "id": 5,
    "type": "text",
    "content": "Cause: Vercel was deploying from main branch, but code was on claude/setup-new-project branch"
  },
  {
    "id": 6,
    "type": "text",
    "content": "Solution: Changed deployment branch in Vercel settings to the correct branch"
  },
  {
    "id": 7,
    "type": "heading",
    "content": "Issue 2: SSR Environment Variables",
    "level": 2
  },
  {
    "id": 8,
    "type": "text",
    "content": "Problem: Build failed during server-side rendering"
  },
  {
    "id": 9,
    "type": "text",
    "content": "Cause: Supabase client was being initialized during SSR without environment variables"
  },
  {
    "id": 10,
    "type": "text",
    "content": "Solution: Modified lib/supabase/client.js to check for browser context and return null during SSR. Initialize client in useEffect (client-side only)."
  },
  {
    "id": 11,
    "type": "heading",
    "content": "Issue 3: Infinite Loading Spinner (CRITICAL)",
    "level": 2
  },
  {
    "id": 12,
    "type": "alert",
    "content": "This was the most challenging issue to debug and took extensive investigation to resolve."
  },
  {
    "id": 13,
    "type": "text",
    "content": "Problem: After Google sign-in, app showed loading spinner indefinitely"
  },
  {
    "id": 14,
    "type": "heading",
    "content": "Symptoms:",
    "level": 3
  },
  {
    "id": 15,
    "type": "list",
    "items": [
      "User authenticated successfully",
      "Profile created in database",
      "No network requests in browser DevTools",
      "Queries appeared to hang without timing out"
    ]
  },
  {
    "id": 16,
    "type": "heading",
    "content": "Investigation Steps:",
    "level": 3
  },
  {
    "id": 17,
    "type": "list",
    "items": [
      "Verified environment variables were present",
      "Confirmed user and profile in database",
      "Checked Network tab - NO Supabase requests being made",
      "Added extensive debug logging",
      "Added timeout detection (10s for queries)",
      "Created diagnostic page (db-test.js)",
      "Discovered queries hung at querying pages table"
    ]
  },
  {
    "id": 18,
    "type": "heading",
    "content": "Root Cause:",
    "level": 3
  },
  {
    "id": 19,
    "type": "text",
    "content": "Using @supabase/ssr package instead of @supabase/supabase-js. The SSR package requires special cookie configuration and was causing queries to hang."
  },
  {
    "id": 20,
    "type": "heading",
    "content": "Solution:",
    "level": 3
  },
  {
    "id": 21,
    "type": "text",
    "content": "Changed from createBrowserClient from @supabase/ssr to createClient from @supabase/supabase-js in lib/supabase/client.js"
  },
  {
    "id": 22,
    "type": "text",
    "content": "Why this worked: The standard client works correctly for browser-only apps and makes network requests properly without requiring complex cookie configuration."
  },
  {
    "id": 23,
    "type": "heading",
    "content": "Issue 4: Duplicate Auth State Changes",
    "level": 2
  },
  {
    "id": 24,
    "type": "text",
    "content": "Problem: Profile and data loaded multiple times on sign-in"
  },
  {
    "id": 25,
    "type": "text",
    "content": "Cause: Supabase auth listener triggered multiple events (SIGNED_IN, INITIAL_SESSION, duplicates)"
  },
  {
    "id": 26,
    "type": "text",
    "content": "Solution: Added deduplication logic to track last user ID and skip duplicate INITIAL_SESSION events. Only reload on actual SIGNED_IN events."
  },
  {
    "id": 27,
    "type": "heading",
    "content": "Common Issues & Quick Fixes",
    "level": 2
  },
  {
    "id": 28,
    "type": "heading",
    "content": "Cannot see New Page button",
    "level": 3
  },
  {
    "id": 29,
    "type": "text",
    "content": "Solution: Check your role in Supabase profiles table. Change role to admin to see the button."
  },
  {
    "id": 30,
    "type": "heading",
    "content": "Changes not showing after deployment",
    "level": 3
  },
  {
    "id": 31,
    "type": "text",
    "content": "Solution: Hard refresh browser (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac) to clear cache."
  },
  {
    "id": 32,
    "type": "heading",
    "content": "Database queries timing out",
    "level": 3
  },
  {
    "id": 33,
    "type": "text",
    "content": "Solution: Check Supabase dashboard for service status. Verify RLS policies are not blocking queries. Test with db-test page."
  }
]'::jsonb, NOW(), NOW());

-- 4. Features & Customization
INSERT INTO pages (id, title, icon, parent_id, components, created_at, updated_at) VALUES
('features-customization', 'Features & Customization', 'Settings', NULL, '[
  {
    "id": 1,
    "type": "heading",
    "content": "Features & Customization",
    "level": 1
  },
  {
    "id": 2,
    "type": "heading",
    "content": "Core Features",
    "level": 2
  },
  {
    "id": 3,
    "type": "heading",
    "content": "1. Page Management",
    "level": 3
  },
  {
    "id": 4,
    "type": "list",
    "items": [
      "Create Pages: Click + New Page button (admin only)",
      "Edit Pages: Click edit icon, use drag-and-drop editor",
      "Delete Pages: Delete icon in page list (admin only)",
      "Nested Pages: Select parent page when creating"
    ]
  },
  {
    "id": 5,
    "type": "heading",
    "content": "2. Component Editor",
    "level": 3
  },
  {
    "id": 6,
    "type": "text",
    "content": "Drag and drop components to build pages. Available component types:"
  },
  {
    "id": 7,
    "type": "list",
    "items": [
      "Heading: Add H1-H6 headings",
      "Text: Add paragraphs",
      "List: Add bullet point lists",
      "Alert: Add info boxes",
      "Code: Add code blocks"
    ]
  },
  {
    "id": 8,
    "type": "heading",
    "content": "3. Version History",
    "level": 3
  },
  {
    "id": 9,
    "type": "list",
    "items": [
      "Click clock icon when editing a page",
      "View all previous versions",
      "See who made changes and when",
      "Restore previous versions"
    ]
  },
  {
    "id": 10,
    "type": "heading",
    "content": "4. Activity Log",
    "level": 3
  },
  {
    "id": 11,
    "type": "list",
    "items": [
      "Click Activity icon in sidebar",
      "View all user actions",
      "Filter by user or action type",
      "Audit trail for compliance"
    ]
  },
  {
    "id": 12,
    "type": "heading",
    "content": "5. Search",
    "level": 3
  },
  {
    "id": 13,
    "type": "list",
    "items": [
      "Search box in top navigation",
      "Searches page titles and content",
      "Real-time filtering"
    ]
  },
  {
    "id": 14,
    "type": "heading",
    "content": "6. Role-Based Access",
    "level": 3
  },
  {
    "id": 15,
    "type": "list",
    "items": [
      "Admin: Full CRUD access",
      "Editor: Can edit pages",
      "Viewer: Read-only access"
    ]
  },
  {
    "id": 16,
    "type": "heading",
    "content": "Customization Guide",
    "level": 2
  },
  {
    "id": 17,
    "type": "heading",
    "content": "Adding New Users",
    "level": 3
  },
  {
    "id": 18,
    "type": "text",
    "content": "1. Have user sign in with Google"
  },
  {
    "id": 19,
    "type": "text",
    "content": "2. Go to Supabase Dashboard → Table Editor → profiles"
  },
  {
    "id": 20,
    "type": "text",
    "content": "3. Find their row (by email)"
  },
  {
    "id": 21,
    "type": "text",
    "content": "4. Click Edit and change role to admin, editor, or viewer"
  },
  {
    "id": 22,
    "type": "text",
    "content": "5. Save changes"
  },
  {
    "id": 23,
    "type": "heading",
    "content": "Changing Branding",
    "level": 3
  },
  {
    "id": 24,
    "type": "text",
    "content": "To customize the company name, colors, or logo, edit pages/index.js in the code repository."
  },
  {
    "id": 25,
    "type": "list",
    "items": [
      "Company Name: Search for Airplai Sports Hub and replace",
      "Colors: Change bg-blue-600 and text-blue-600 Tailwind classes",
      "Logo: Add logo to public/ folder and reference it"
    ]
  },
  {
    "id": 26,
    "type": "heading",
    "content": "Adding New Component Types",
    "level": 3
  },
  {
    "id": 27,
    "type": "text",
    "content": "To add new component types (like images, videos, tables):"
  },
  {
    "id": 28,
    "type": "text",
    "content": "1. Add to componentTypes array in pages/index.js"
  },
  {
    "id": 29,
    "type": "text",
    "content": "2. Add render logic in renderComponent function"
  },
  {
    "id": 30,
    "type": "text",
    "content": "3. Add edit form in component editor section"
  },
  {
    "id": 31,
    "type": "alert",
    "content": "Tip: Use existing components as templates when adding new ones!"
  },
  {
    "id": 32,
    "type": "heading",
    "content": "Useful SQL Commands",
    "level": 2
  },
  {
    "id": 33,
    "type": "heading",
    "content": "View all users:",
    "level": 3
  },
  {
    "id": 34,
    "type": "code",
    "content": "SELECT * FROM profiles;"
  },
  {
    "id": 35,
    "type": "heading",
    "content": "Make user admin:",
    "level": 3
  },
  {
    "id": 36,
    "type": "code",
    "content": "UPDATE profiles SET role = ''admin'' \nWHERE email = ''user@example.com'';"
  },
  {
    "id": 37,
    "type": "heading",
    "content": "View recent activity:",
    "level": 3
  },
  {
    "id": 38,
    "type": "code",
    "content": "SELECT * FROM activity_logs \nORDER BY created_at DESC \nLIMIT 20;"
  },
  {
    "id": 39,
    "type": "heading",
    "content": "Count pages:",
    "level": 3
  },
  {
    "id": 40,
    "type": "code",
    "content": "SELECT COUNT(*) FROM pages;"
  }
]'::jsonb, NOW(), NOW());

-- 5. Maintenance & Resources
INSERT INTO pages (id, title, icon, parent_id, components, created_at, updated_at) VALUES
('maintenance-resources', 'Maintenance & Resources', 'Settings', NULL, '[
  {
    "id": 1,
    "type": "heading",
    "content": "Maintenance & Resources",
    "level": 1
  },
  {
    "id": 2,
    "type": "heading",
    "content": "Regular Maintenance Tasks",
    "level": 2
  },
  {
    "id": 3,
    "type": "heading",
    "content": "Weekly Tasks",
    "level": 3
  },
  {
    "id": 4,
    "type": "list",
    "items": [
      "Check activity logs for suspicious activity",
      "Review user roles and access",
      "Verify all features are working"
    ]
  },
  {
    "id": 5,
    "type": "heading",
    "content": "Monthly Tasks",
    "level": 3
  },
  {
    "id": 6,
    "type": "list",
    "items": [
      "Review and archive old pages",
      "Check database storage usage",
      "Review version history storage",
      "Update dependencies if needed"
    ]
  },
  {
    "id": 7,
    "type": "heading",
    "content": "Backup Strategy",
    "level": 2
  },
  {
    "id": 8,
    "type": "text",
    "content": "Automatic Backups: Supabase provides automatic daily backups (retention depends on plan)"
  },
  {
    "id": 9,
    "type": "heading",
    "content": "Manual Backup:",
    "level": 3
  },
  {
    "id": 10,
    "type": "text",
    "content": "1. Supabase Dashboard → Database → Backups"
  },
  {
    "id": 11,
    "type": "text",
    "content": "2. Click Create Backup"
  },
  {
    "id": 12,
    "type": "text",
    "content": "3. Download backup file"
  },
  {
    "id": 13,
    "type": "heading",
    "content": "Restore from Backup:",
    "level": 3
  },
  {
    "id": 14,
    "type": "text",
    "content": "1. Supabase Dashboard → Database → Backups"
  },
  {
    "id": 15,
    "type": "text",
    "content": "2. Select backup to restore"
  },
  {
    "id": 16,
    "type": "text",
    "content": "3. Click Restore button"
  },
  {
    "id": 17,
    "type": "heading",
    "content": "Monitoring",
    "level": 2
  },
  {
    "id": 18,
    "type": "heading",
    "content": "Vercel Dashboard:",
    "level": 3
  },
  {
    "id": 19,
    "type": "list",
    "items": [
      "Check deployment status",
      "Monitor build times",
      "Review error logs",
      "Check bandwidth usage"
    ]
  },
  {
    "id": 20,
    "type": "heading",
    "content": "Supabase Dashboard:",
    "level": 3
  },
  {
    "id": 21,
    "type": "list",
    "items": [
      "Monitor database usage",
      "Check API request counts",
      "Review authentication logs",
      "Monitor database performance"
    ]
  },
  {
    "id": 22,
    "type": "heading",
    "content": "Scaling Considerations",
    "level": 2
  },
  {
    "id": 23,
    "type": "heading",
    "content": "Current Limits (Free Tier):",
    "level": 3
  },
  {
    "id": 24,
    "type": "list",
    "items": [
      "Supabase: 500MB database, 2GB bandwidth/month",
      "Vercel: 100GB bandwidth/month"
    ]
  },
  {
    "id": 25,
    "type": "heading",
    "content": "When to Upgrade:",
    "level": 3
  },
  {
    "id": 26,
    "type": "list",
    "items": [
      "Database > 400MB → Upgrade Supabase plan",
      "Traffic > 80GB/month → Upgrade Vercel plan",
      "> 50 concurrent users → Consider performance optimization"
    ]
  },
  {
    "id": 27,
    "type": "heading",
    "content": "Performance Optimization",
    "level": 2
  },
  {
    "id": 28,
    "type": "text",
    "content": "If app becomes slow, consider these optimizations:"
  },
  {
    "id": 29,
    "type": "list",
    "items": [
      "Add database indexes on frequently queried columns",
      "Implement pagination for large datasets",
      "Add caching with React Query",
      "Implement service workers for offline support",
      "Optimize images and assets"
    ]
  },
  {
    "id": 30,
    "type": "heading",
    "content": "Documentation & Resources",
    "level": 2
  },
  {
    "id": 31,
    "type": "heading",
    "content": "Official Documentation:",
    "level": 3
  },
  {
    "id": 32,
    "type": "list",
    "items": [
      "Next.js: https://nextjs.org/docs",
      "Supabase: https://supabase.com/docs",
      "Vercel: https://vercel.com/docs",
      "Tailwind CSS: https://tailwindcss.com/docs"
    ]
  },
  {
    "id": 33,
    "type": "heading",
    "content": "Project Information:",
    "level": 3
  },
  {
    "id": 34,
    "type": "list",
    "items": [
      "Repository: azrasheikh/airplaisports-internalhub",
      "Branch: claude/setup-new-project-011CUbwUNecisekqcTrKbmCR",
      "Live URL: https://airplaisports-internalhub.vercel.app/",
      "Supabase Project: airplaisports-internalhub"
    ]
  },
  {
    "id": 35,
    "type": "heading",
    "content": "Success Metrics",
    "level": 2
  },
  {
    "id": 36,
    "type": "alert",
    "content": "All core features are working and production-ready!"
  },
  {
    "id": 37,
    "type": "heading",
    "content": "Completed:",
    "level": 3
  },
  {
    "id": 38,
    "type": "list",
    "items": [
      "Next.js project with Supabase integration",
      "Google OAuth authentication",
      "Page CRUD operations",
      "Drag-and-drop editor",
      "Version history tracking",
      "Activity logging",
      "Role-based access control",
      "Deployed to Vercel",
      "All technical issues resolved"
    ]
  },
  {
    "id": 39,
    "type": "heading",
    "content": "Contact",
    "level": 2
  },
  {
    "id": 40,
    "type": "text",
    "content": "For questions or issues: azra@airplaisports.com"
  },
  {
    "id": 41,
    "type": "text",
    "content": "Last Updated: October 30, 2025"
  },
  {
    "id": 42,
    "type": "text",
    "content": "Version: 1.0.0 - Production Ready ✓"
  }
]'::jsonb, NOW(), NOW());

-- Add navigation items for all documentation pages
INSERT INTO navigation_items (id, label, icon, page_id, position) VALUES
('nav-project-overview', 'Project Overview', 'BookOpen', 'project-overview', 100),
('nav-architecture', 'Architecture & Database', 'Code', 'architecture-database', 101),
('nav-troubleshooting', 'Troubleshooting Guide', 'AlertCircle', 'troubleshooting-guide', 102),
('nav-features', 'Features & Customization', 'Settings', 'features-customization', 103),
('nav-maintenance', 'Maintenance & Resources', 'Settings', 'maintenance-resources', 104);

-- Log the activity
INSERT INTO activity_logs (user_id, user_name, action) VALUES
((SELECT id FROM auth.users LIMIT 1), 'System', 'Created comprehensive documentation pages');
