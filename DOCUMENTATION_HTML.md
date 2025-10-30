# Documentation Pages - HTML Format for Copy/Paste

Copy the HTML below for each page and paste into Text components in your app.

---

## PAGE 1: Project Overview & Setup

**Page Title:** Project Overview & Setup
**Icon:** BookOpen

**Component 1 - Heading:**
```
Airplai Sports Internal Hub - Project Documentation
```
(Set level to H1)

**Component 2 - Alert:**
```
This documentation covers everything about how this application was built, deployed, and is maintained.
```

**Component 3 - Text:**
```html
<h2>Project Overview</h2>
<p>Airplai Sports Internal Hub is a Next.js-based internal documentation platform with real-time collaboration features, version control, and activity tracking.</p>
<p><strong>Live URL:</strong> <a href="https://airplaisports-internalhub.vercel.app/" target="_blank">https://airplaisports-internalhub.vercel.app/</a></p>

<h3>Key Features</h3>
<ul>
  <li>Google OAuth authentication</li>
  <li>Real-time database persistence via Supabase</li>
  <li>Drag-and-drop page editor</li>
  <li>Role-based access control (Admin, Editor, Viewer)</li>
  <li>Version history tracking</li>
  <li>Activity logging</li>
  <li>Search functionality</li>
  <li>Nested page structure support</li>
</ul>

<h2>Tech Stack</h2>

<h3>Frontend</h3>
<ul>
  <li><strong>Next.js 14</strong> - React framework with Pages Router</li>
  <li><strong>React 18</strong> - UI library</li>
  <li><strong>Tailwind CSS 3</strong> - Utility-first CSS framework</li>
  <li><strong>Lucide React</strong> - Icon library</li>
</ul>

<h3>Backend & Database</h3>
<ul>
  <li><strong>Supabase</strong> - PostgreSQL database with built-in authentication</li>
  <li><strong>PostgreSQL</strong> - Relational database with JSONB support</li>
  <li><strong>Row Level Security (RLS)</strong> - Database-level access control</li>
</ul>

<h3>Hosting & Deployment</h3>
<ul>
  <li><strong>Vercel</strong> - Hosting platform with automatic deployments</li>
  <li><strong>Git</strong> - Version control</li>
  <li><strong>Google OAuth</strong> - Sign in with Google Workspace accounts</li>
</ul>

<h2>Project Structure</h2>
<pre><code>airplaisports-internalhub/
├── pages/
│   ├── index.js          # Main application
│   ├── env-test.js       # Diagnostic page
│   └── db-test.js        # Diagnostic page
├── lib/
│   ├── supabase/
│   │   └── client.js     # Supabase client
│   └── db/
│       ├── pages.js      # Page CRUD operations
│       ├── activity.js   # Activity logs
│       └── versions.js   # Version history
├── supabase/
│   └── schema.sql        # Database schema
└── styles/
    └── globals.css       # Global styles
</code></pre>

<h2>Initial Setup Steps</h2>
<ol>
  <li>Created Next.js project with create-next-app</li>
  <li>Installed dependencies: @supabase/supabase-js, lucide-react, tailwindcss</li>
  <li>Set up Supabase project and database schema</li>
  <li>Configured Google OAuth authentication</li>
  <li>Deployed to Vercel with environment variables</li>
  <li>Resolved multiple technical challenges (see Troubleshooting page)</li>
</ol>
```

---

## PAGE 2: Architecture & Database Schema

**Page Title:** Architecture & Database Schema
**Icon:** Code

**Component 1 - Text:**
```html
<h1>Application Architecture</h1>

<h2>Application Flow</h2>
<pre><code>User Request
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
</code></pre>

<h2>Authentication Flow</h2>
<ol>
  <li>User clicks "Sign in with Google"</li>
  <li>Supabase redirects to Google OAuth</li>
  <li>User authorizes in Google Workspace</li>
  <li>Google redirects back with token</li>
  <li>Supabase verifies token and creates session</li>
  <li>App loads user profile from database</li>
  <li>App loads pages and data based on user role</li>
</ol>

<h1>Database Schema</h1>

<h2>1. profiles Table</h2>
<p>Stores user profiles with role-based permissions.</p>

<h3>Roles:</h3>
<ul>
  <li><strong>admin</strong> - Full access: create, edit, delete pages</li>
  <li><strong>editor</strong> - Can edit existing pages</li>
  <li><strong>viewer</strong> - Read-only access</li>
</ul>

<h2>2. pages Table</h2>
<p>Stores documentation pages with JSONB components. Each page can have multiple components (heading, text, list, alert, code).</p>

<h3>Component Types:</h3>
<ul>
  <li><strong>heading</strong> - H1-H6 headings with level property</li>
  <li><strong>text</strong> - Paragraph text (supports HTML)</li>
  <li><strong>list</strong> - Bulleted lists with items array</li>
  <li><strong>alert</strong> - Info boxes for important messages</li>
  <li><strong>code</strong> - Code blocks with syntax</li>
</ul>

<h2>3. navigation_items Table</h2>
<p>Stores sidebar navigation structure with support for nested items and custom ordering.</p>

<h2>4. activity_logs Table</h2>
<p>Tracks user actions for audit purposes. Records who did what and when.</p>

<h3>Example Actions:</h3>
<ul>
  <li>"Created page: Welcome"</li>
  <li>"Edited page: Documentation"</li>
  <li>"Deleted page: Old Guide"</li>
  <li>"Restored version for page: About Us"</li>
</ul>

<h2>5. version_history Table</h2>
<p>Stores page version snapshots. Every time a page is edited, a version is saved so you can restore previous versions.</p>

<h2>Row Level Security (RLS)</h2>
<p>All tables have RLS enabled with policies that enforce role-based access:</p>
<ul>
  <li>Authenticated users can read all data</li>
  <li>Admins can insert, update, and delete</li>
  <li>Editors can update existing records</li>
  <li>Viewers have read-only access</li>
</ul>

<h2>Key Design Decisions</h2>
<p><strong>Why we use @supabase/supabase-js:</strong> We use the standard @supabase/supabase-js client instead of @supabase/ssr because the app runs entirely client-side with no server-side data fetching. This is simpler and more reliable for our use case.</p>

<p><strong>JSONB Components:</strong> Components are stored as JSONB in PostgreSQL, giving us flexibility to add new component types without schema changes.</p>
```

---

## PAGE 3: Troubleshooting Guide

**Page Title:** Troubleshooting Guide
**Icon:** AlertCircle

**Component 1 - Text:**
```html
<h1>Troubleshooting Guide</h1>
<p>This page documents all major issues we encountered during development and how they were resolved.</p>

<h2>Issue 1: Wrong Branch Deployed</h2>
<p><strong>Problem:</strong> Vercel build failed with "Could not find any pages or app directory"</p>
<p><strong>Cause:</strong> Vercel was deploying from main branch, but code was on claude/setup-new-project branch</p>
<p><strong>Solution:</strong> Changed deployment branch in Vercel settings to the correct branch</p>

<h2>Issue 2: SSR Environment Variables</h2>
<p><strong>Problem:</strong> Build failed during server-side rendering</p>
<p><strong>Cause:</strong> Supabase client was being initialized during SSR without environment variables</p>
<p><strong>Solution:</strong> Modified lib/supabase/client.js to check for browser context and return null during SSR. Initialize client in useEffect (client-side only).</p>

<h2>Issue 3: Infinite Loading Spinner (CRITICAL)</h2>
<p><em>This was the most challenging issue to debug and took extensive investigation to resolve.</em></p>
<p><strong>Problem:</strong> After Google sign-in, app showed loading spinner indefinitely</p>

<h3>Symptoms:</h3>
<ul>
  <li>User authenticated successfully</li>
  <li>Profile created in database</li>
  <li>No network requests in browser DevTools</li>
  <li>Queries appeared to hang without timing out</li>
</ul>

<h3>Investigation Steps:</h3>
<ol>
  <li>Verified environment variables were present</li>
  <li>Confirmed user and profile in database</li>
  <li>Checked Network tab - NO Supabase requests being made</li>
  <li>Added extensive debug logging</li>
  <li>Added timeout detection (10s for queries)</li>
  <li>Created diagnostic page (db-test.js)</li>
  <li>Discovered queries hung at "querying pages table"</li>
</ol>

<h3>Root Cause:</h3>
<p>Using @supabase/ssr package instead of @supabase/supabase-js. The SSR package requires special cookie configuration and was causing queries to hang.</p>

<h3>Solution:</h3>
<p>Changed from <code>createBrowserClient</code> from @supabase/ssr to <code>createClient</code> from @supabase/supabase-js in lib/supabase/client.js</p>

<p><strong>Why this worked:</strong> The standard client works correctly for browser-only apps and makes network requests properly without requiring complex cookie configuration.</p>

<h2>Issue 4: Duplicate Auth State Changes</h2>
<p><strong>Problem:</strong> Profile and data loaded multiple times on sign-in</p>
<p><strong>Cause:</strong> Supabase auth listener triggered multiple events (SIGNED_IN, INITIAL_SESSION, duplicates)</p>
<p><strong>Solution:</strong> Added deduplication logic to track last user ID and skip duplicate INITIAL_SESSION events. Only reload on actual SIGNED_IN events.</p>

<h2>Common Issues & Quick Fixes</h2>

<h3>Cannot see "New Page" button</h3>
<p><strong>Solution:</strong> Check your role in Supabase profiles table. Change role to "admin" to see the button.</p>

<h3>Changes not showing after deployment</h3>
<p><strong>Solution:</strong> Hard refresh browser (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac) to clear cache.</p>

<h3>Database queries timing out</h3>
<p><strong>Solution:</strong> Check Supabase dashboard for service status. Verify RLS policies are not blocking queries. Test with db-test page.</p>
```

---

## PAGE 4: Features & Customization

**Page Title:** Features & Customization
**Icon:** Settings

**Component 1 - Text:**
```html
<h1>Features & Customization</h1>

<h2>Core Features</h2>

<h3>1. Page Management</h3>
<ul>
  <li><strong>Create Pages:</strong> Click "+ New Page" button (admin only)</li>
  <li><strong>Edit Pages:</strong> Click edit icon, use drag-and-drop editor</li>
  <li><strong>Delete Pages:</strong> Delete icon in page list (admin only)</li>
  <li><strong>Nested Pages:</strong> Select parent page when creating</li>
</ul>

<h3>2. Component Editor</h3>
<p>Drag and drop components to build pages. Available component types:</p>
<ul>
  <li><strong>Heading:</strong> Add H1-H6 headings</li>
  <li><strong>Text:</strong> Add paragraphs (supports HTML for links)</li>
  <li><strong>List:</strong> Add bullet point lists</li>
  <li><strong>Alert:</strong> Add info boxes</li>
  <li><strong>Code:</strong> Add code blocks</li>
</ul>

<h3>3. Version History</h3>
<ul>
  <li>Click clock icon when editing a page</li>
  <li>View all previous versions</li>
  <li>See who made changes and when</li>
  <li>Restore previous versions</li>
</ul>

<h3>4. Activity Log</h3>
<ul>
  <li>Click Activity icon in sidebar</li>
  <li>View all user actions</li>
  <li>Filter by user or action type</li>
  <li>Audit trail for compliance</li>
</ul>

<h3>5. Search</h3>
<ul>
  <li>Search box in top navigation</li>
  <li>Searches page titles and content</li>
  <li>Real-time filtering</li>
</ul>

<h3>6. Role-Based Access</h3>
<ul>
  <li><strong>Admin:</strong> Full CRUD access</li>
  <li><strong>Editor:</strong> Can edit pages</li>
  <li><strong>Viewer:</strong> Read-only access</li>
</ul>

<h2>Customization Guide</h2>

<h3>Adding New Users</h3>
<ol>
  <li>Have user sign in with Google</li>
  <li>Go to <a href="https://supabase.com/dashboard" target="_blank">Supabase Dashboard</a> → Table Editor → profiles</li>
  <li>Find their row (by email)</li>
  <li>Click Edit and change role to admin, editor, or viewer</li>
  <li>Save changes</li>
</ol>

<h3>Adding Links in Pages</h3>
<p>Text components support HTML, so you can add links like this:</p>
<pre><code>&lt;a href="https://example.com" target="_blank"&gt;Link Text&lt;/a&gt;</code></pre>

<h3>Changing Branding</h3>
<p>To customize the company name, colors, or logo, edit <code>pages/index.js</code> in the code repository:</p>
<ul>
  <li><strong>Company Name:</strong> Search for "Airplai Sports Hub" and replace</li>
  <li><strong>Colors:</strong> Change <code>bg-blue-600</code> and <code>text-blue-600</code> Tailwind classes</li>
  <li><strong>Logo:</strong> Add logo to public/ folder and reference it</li>
</ul>

<h3>Adding New Component Types</h3>
<p>To add new component types (like images, videos, tables):</p>
<ol>
  <li>Add to componentTypes array in pages/index.js</li>
  <li>Add render logic in renderComponent function</li>
  <li>Add edit form in component editor section</li>
</ol>
<p><em>Tip: Use existing components as templates when adding new ones!</em></p>

<h2>Useful SQL Commands</h2>

<h3>View all users:</h3>
<pre><code>SELECT * FROM profiles;</code></pre>

<h3>Make user admin:</h3>
<pre><code>UPDATE profiles SET role = 'admin'
WHERE email = 'user@example.com';</code></pre>

<h3>View recent activity:</h3>
<pre><code>SELECT * FROM activity_logs
ORDER BY created_at DESC
LIMIT 20;</code></pre>

<h3>Count pages:</h3>
<pre><code>SELECT COUNT(*) FROM pages;</code></pre>
```

---

## PAGE 5: Maintenance & Resources

**Page Title:** Maintenance & Resources
**Icon:** Settings

**Component 1 - Text:**
```html
<h1>Maintenance & Resources</h1>

<h2>Regular Maintenance Tasks</h2>

<h3>Weekly Tasks</h3>
<ul>
  <li>Check activity logs for suspicious activity</li>
  <li>Review user roles and access</li>
  <li>Verify all features are working</li>
</ul>

<h3>Monthly Tasks</h3>
<ul>
  <li>Review and archive old pages</li>
  <li>Check database storage usage</li>
  <li>Review version history storage</li>
  <li>Update dependencies if needed</li>
</ul>

<h2>Backup Strategy</h2>
<p><strong>Automatic Backups:</strong> Supabase provides automatic daily backups (retention depends on plan)</p>

<h3>Manual Backup:</h3>
<ol>
  <li>Supabase Dashboard → Database → Backups</li>
  <li>Click "Create Backup"</li>
  <li>Download backup file</li>
</ol>

<h3>Restore from Backup:</h3>
<ol>
  <li>Supabase Dashboard → Database → Backups</li>
  <li>Select backup to restore</li>
  <li>Click "Restore" button</li>
</ol>

<h2>Monitoring</h2>

<h3>Vercel Dashboard:</h3>
<ul>
  <li>Check deployment status</li>
  <li>Monitor build times</li>
  <li>Review error logs</li>
  <li>Check bandwidth usage</li>
</ul>

<h3>Supabase Dashboard:</h3>
<ul>
  <li>Monitor database usage</li>
  <li>Check API request counts</li>
  <li>Review authentication logs</li>
  <li>Monitor database performance</li>
</ul>

<h2>Scaling Considerations</h2>

<h3>Current Limits (Free Tier):</h3>
<ul>
  <li>Supabase: 500MB database, 2GB bandwidth/month</li>
  <li>Vercel: 100GB bandwidth/month</li>
</ul>

<h3>When to Upgrade:</h3>
<ul>
  <li>Database &gt; 400MB → Upgrade Supabase plan</li>
  <li>Traffic &gt; 80GB/month → Upgrade Vercel plan</li>
  <li>&gt; 50 concurrent users → Consider performance optimization</li>
</ul>

<h2>Performance Optimization</h2>
<p>If app becomes slow, consider these optimizations:</p>
<ul>
  <li>Add database indexes on frequently queried columns</li>
  <li>Implement pagination for large datasets</li>
  <li>Add caching with React Query</li>
  <li>Implement service workers for offline support</li>
  <li>Optimize images and assets</li>
</ul>

<h2>Documentation & Resources</h2>

<h3>Official Documentation:</h3>
<ul>
  <li><a href="https://nextjs.org/docs" target="_blank">Next.js Docs</a></li>
  <li><a href="https://supabase.com/docs" target="_blank">Supabase Docs</a></li>
  <li><a href="https://vercel.com/docs" target="_blank">Vercel Docs</a></li>
  <li><a href="https://tailwindcss.com/docs" target="_blank">Tailwind CSS Docs</a></li>
</ul>

<h3>Project Information:</h3>
<ul>
  <li><strong>Repository:</strong> azrasheikh/airplaisports-internalhub</li>
  <li><strong>Branch:</strong> claude/setup-new-project-011CUbwUNecisekqcTrKbmCR</li>
  <li><strong>Live URL:</strong> <a href="https://airplaisports-internalhub.vercel.app/" target="_blank">https://airplaisports-internalhub.vercel.app/</a></li>
  <li><strong>Supabase Project:</strong> airplaisports-internalhub</li>
</ul>

<h2>Success Metrics</h2>
<p><strong>All core features are working and production-ready!</strong></p>

<h3>Completed:</h3>
<ul>
  <li>✓ Next.js project with Supabase integration</li>
  <li>✓ Google OAuth authentication</li>
  <li>✓ Page CRUD operations</li>
  <li>✓ Drag-and-drop editor</li>
  <li>✓ Version history tracking</li>
  <li>✓ Activity logging</li>
  <li>✓ Role-based access control</li>
  <li>✓ Deployed to Vercel</li>
  <li>✓ All technical issues resolved</li>
</ul>

<h2>Contact</h2>
<p><strong>For questions or issues:</strong> azra@airplaisports.com</p>
<p><strong>Last Updated:</strong> October 30, 2025</p>
<p><strong>Version:</strong> 1.0.0 - Production Ready ✓</p>
```

---

## How to Use:

1. **Create a new page** (click "+ New Page")
2. **Add a Text component**
3. **Copy the HTML** for that page from above
4. **Paste** it into the text field
5. **Save** the page
6. Repeat for each of the 5 documentation pages!

The HTML will render nicely with proper headings, lists, links, and code blocks.
