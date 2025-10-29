# Customization Guide

This guide shows you how to customize the Airplai Sports Hub for your organization.

## Quick Customization

### 1. Change Branding

**Update the Logo and Name**

Edit `pages/index.js` and find these sections:

```javascript
// Line ~495 (Login Screen)
<h1 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-400 to-blue-300 bg-clip-text text-transparent mb-2">
  AIRPLAI
</h1>
<p className="text-center text-gray-400 mb-8">Sports Hub - Sign in to continue</p>

// Line ~535 (Sidebar Header)
<h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-blue-300 bg-clip-text text-transparent">
  AIRPLAI
</h1>
<p className="text-xs text-gray-400">Sports Hub</p>
```

Replace `AIRPLAI` with your company name and `Sports Hub` with your tagline.

**Update the Logo Icon**

The Play icon represents the logo. To change it:

```javascript
// Find: <Play size={32} ...
// Replace with any icon from lucide-react, for example:
import { Building2 } from 'lucide-react';
// Then use: <Building2 size={32} ...
```

Browse all available icons: [Lucide Icons](https://lucide.dev/icons/)

### 2. Change Color Scheme

The app uses a pink-to-blue gradient theme. To change colors:

**Option A: Use Different Gradient Colors**

Find and replace throughout `pages/index.js`:
- `from-pink-400 to-blue-300` → Your gradient colors
- `from-pink-500 to-blue-400` → Your darker gradient
- `border-pink-500` → Your accent color
- `text-pink-400` → Your highlight color

**Option B: Use Solid Colors**

Replace gradients with solid colors:
```javascript
// Before:
className="bg-gradient-to-r from-pink-500 to-blue-400"

// After:
className="bg-blue-600"
```

**Option C: Create a Theme System**

Add to `styles/globals.css`:
```css
:root {
  --color-primary: #ec4899; /* pink-500 */
  --color-secondary: #60a5fa; /* blue-400 */
  --color-accent: #f472b6; /* pink-400 */
}

/* Then use in your components */
.btn-primary {
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
}
```

### 3. Change Default Pages

Edit the default pages in `supabase/schema.sql` before running it:

```sql
INSERT INTO public.pages (id, title, parent_id, icon, components) VALUES
  ('home', 'Welcome to Your Company', NULL, 'Home',
   '[{"id": 1, "type": "heading", "content": "Your Custom Welcome", "level": 1}]'::jsonb),
  ('onboarding', 'Onboarding', NULL, 'Users',
   '[{"id": 1, "type": "heading", "content": "New Employee Onboarding", "level": 1}]'::jsonb);
```

### 4. Customize Page Components

**Add New Component Types**

Edit `pages/index.js` and add to `componentTypes`:

```javascript
const componentTypes = [
  // ... existing types ...
  {
    type: 'image',
    label: 'Image',
    icon: Image,
    default: { url: '', alt: 'Image' }
  },
  {
    type: 'video',
    label: 'Video',
    icon: Video,
    default: { url: '' }
  }
];
```

Then add rendering logic in `renderComponent`:

```javascript
case 'image':
  return <img src={c.url} alt={c.alt} className="mb-3 rounded-lg max-w-full" />;
case 'video':
  return (
    <div className="mb-3">
      <video controls className="w-full rounded-lg">
        <source src={c.url} type="video/mp4" />
      </video>
    </div>
  );
```

### 5. Add Custom Icons

Want more icon options for pages?

Edit `pages/index.js`:

```javascript
import { Home, BookOpen, FileText, Users, Settings,
         AlertCircle, Code, List, Rocket, Heart, Star } from 'lucide-react';

const iconOptions = {
  Home, BookOpen, FileText, Users, Settings,
  AlertCircle, Code, List, Rocket, Heart, Star
};
```

Now these icons will appear in the "Create Page" modal!

## Advanced Customization

### 1. Add User Roles

Want more granular permissions? Update the database schema:

```sql
-- In profiles table
role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'contributor', 'viewer'))
```

Then update policies in `supabase/schema.sql` to handle the new role.

### 2. Add Page Categories

Group pages by category:

```sql
-- Add to pages table
ALTER TABLE public.pages ADD COLUMN category TEXT;

-- Update pages with categories
UPDATE public.pages SET category = 'Documentation' WHERE id IN ('getting-started', 'documentation');
```

Then filter navigation by category in your UI.

### 3. Add Comments

Want team members to comment on pages?

```sql
-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id TEXT REFERENCES public.pages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add policies...
```

### 4. Add Page Templates

Create reusable page templates:

```sql
CREATE TABLE IF NOT EXISTS public.templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  components JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default templates
INSERT INTO public.templates (id, name, description, components) VALUES
  ('meeting-notes', 'Meeting Notes', 'Template for meeting notes',
   '[{"type":"heading","content":"Meeting Notes","level":1},
     {"type":"text","content":"Date: "},
     {"type":"heading","content":"Attendees","level":2},
     {"type":"list","items":["Person 1","Person 2"]}]'::jsonb);
```

### 5. Add File Attachments

Allow uploading files to pages using Supabase Storage:

```javascript
// lib/db/storage.js
export async function uploadFile(supabase, file, pageId) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${pageId}/${Math.random()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('page-attachments')
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('page-attachments')
    .getPublicUrl(fileName);

  return publicUrl;
}
```

## Styling Customization

### Dark Mode Toggle

Add a light mode option:

```javascript
// Add state
const [darkMode, setDarkMode] = useState(true);

// Toggle button in sidebar
<button
  onClick={() => setDarkMode(!darkMode)}
  className="p-2 rounded-lg"
>
  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
</button>

// Conditional classes
<div className={darkMode ? 'bg-black' : 'bg-white'}>
```

### Custom Fonts

Add custom fonts in `pages/_document.js`:

```javascript
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

Then update `tailwind.config.js`:

```javascript
theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
  },
},
```

### Responsive Design

The app is already mobile-responsive, but you can adjust breakpoints:

```javascript
// In tailwind.config.js
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
```

## Feature Additions

### 1. Search with Filters

Add advanced search options:

```javascript
const [searchFilters, setSearchFilters] = useState({
  type: 'all', // 'pages', 'content', 'all'
  dateRange: 'all' // 'today', 'week', 'month', 'all'
});
```

### 2. Page Analytics

Track page views:

```sql
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id TEXT REFERENCES public.pages(id),
  user_id UUID REFERENCES public.profiles(id),
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Notifications

Notify users of changes:

```sql
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Export to PDF

Add a PDF export feature using a library like `jspdf`:

```bash
npm install jspdf
```

```javascript
import jsPDF from 'jspdf';

const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text(pages[activePage].title, 10, 10);
  // Add page content...
  doc.save(`${activePage}.pdf`);
};
```

### 5. Keyboard Shortcuts

Add keyboard shortcuts for power users:

```javascript
useEffect(() => {
  const handleKeyPress = (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      // Focus search input
    }
    // Ctrl/Cmd + N for new page
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      setShowNewPageModal(true);
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

## Internationalization (i18n)

Want to support multiple languages?

```bash
npm install next-i18next
```

Create translation files and use the `useTranslation` hook throughout your app.

## Performance Optimization

### 1. Add Loading States

Show skeletons while loading:

```javascript
{loading ? (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
  </div>
) : (
  // Your content
)}
```

### 2. Pagination

For activity logs with many entries:

```javascript
const ITEMS_PER_PAGE = 20;
const [currentPage, setCurrentPage] = useState(1);

// In your query
.range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
```

### 3. Debounce Search

Optimize search performance:

```javascript
import { useEffect, useState } from 'react';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Usage
const debouncedSearch = useDebounce(searchQuery, 300);
```

## Questions?

- Check the [Next.js Docs](https://nextjs.org/docs)
- Check the [Tailwind CSS Docs](https://tailwindcss.com/docs)
- Check the [Supabase Docs](https://supabase.com/docs)
- Check the [Lucide Icons](https://lucide.dev/)

Happy customizing! 🎨
