# Airplai Sports Hub

A modern, full-featured internal documentation and knowledge hub with real-time collaboration, version control, and role-based permissions.

## Features

- **Real Authentication**: Google OAuth via Supabase (no more demo mode!)
- **Database Persistence**: All pages, activity, and versions stored in Supabase
- **Page Management**: Create, edit, and organize pages with hierarchical structure
- **Component Builder**: Drag-and-drop page editor with multiple component types (headings, text, lists, alerts, code blocks)
- **Full-Text Search**: Search across all pages and content
- **Version History**: Track and restore previous versions of any page
- **Activity Log**: Monitor all user actions and changes in real-time
- **Role-Based Access**: Admin, Editor, and Viewer permissions
- **Responsive Design**: Beautiful gradient UI with dark theme, works on all devices
- **Production Ready**: Fully configured for Vercel deployment

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd airplaisports-internalhub
npm install
```

### 2. Set Up Supabase

Follow the detailed guide in [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md):
- Create a Supabase project
- Run the database schema
- Configure Google OAuth
- Get your credentials

### 3. Configure Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Locally

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) and sign in with Google!

### 5. Deploy to Vercel

Follow the step-by-step guide in [`DEPLOYMENT.md`](DEPLOYMENT.md) to deploy to Vercel (or other platforms).

## Tech Stack

- **Next.js 14**: React framework with Pages Router
- **React 18**: UI library with hooks
- **Supabase**: PostgreSQL database, authentication, and real-time features
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Vercel**: Recommended hosting platform (free tier available)

## Project Structure

```
├── pages/
│   ├── _app.js             # App wrapper
│   ├── _document.js        # HTML document structure
│   ├── index.js            # Main hub application (Supabase-integrated)
│   └── index-demo.js       # Demo version (no Supabase required)
├── lib/
│   ├── supabase/
│   │   └── client.js       # Supabase client initialization
│   └── db/
│       ├── pages.js        # Page database operations
│       ├── activity.js     # Activity log operations
│       └── versions.js     # Version history operations
├── supabase/
│   └── schema.sql          # Database schema and setup
├── styles/
│   └── globals.css         # Global styles and Tailwind imports
├── SUPABASE_SETUP.md       # Supabase setup guide
├── DEPLOYMENT.md           # Deployment guide
├── CUSTOMIZATION.md        # Customization guide
├── .env.local.example      # Environment variables template
├── vercel.json             # Vercel configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── next.config.js          # Next.js configuration
```

## Documentation

- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)**: Complete guide to setting up Supabase, database, and authentication
- **[DEPLOYMENT.md](DEPLOYMENT.md)**: Step-by-step deployment guide for Vercel and other platforms
- **[CUSTOMIZATION.md](CUSTOMIZATION.md)**: How to customize branding, colors, features, and more

## Features in Detail

### Page Editor

Build rich documentation pages with:
- **Headings**: H1, H2, H3 with beautiful gradient styling
- **Text**: Paragraphs for body content
- **Lists**: Bullet point lists with add/remove items
- **Alerts**: Highlighted information boxes with icons
- **Code Blocks**: Syntax-highlighted code snippets
- **Drag & Drop**: Reorder components by dragging

### Role-Based Access Control

Three permission levels:
- **Admin**: Full access - create, edit, delete pages, manage users
- **Editor**: Can edit and create pages, view all content
- **Viewer**: Read-only access to all pages

Set user roles in Supabase → Table Editor → `profiles` table.

### Search

Powerful full-text search:
- Searches page titles and content
- Shows match count for each result
- Instant results as you type

### Version History

Never lose work:
- Every save creates a new version
- View all previous versions with timestamps
- Restore any previous version with one click
- See who made each change

### Activity Log

Track everything:
- User sign-ins and sign-outs
- Page creations and edits
- Version restorations
- Real-time updates across all users

## Customization

Want to make it your own? Check out [`CUSTOMIZATION.md`](CUSTOMIZATION.md) for guides on:
- Changing branding and colors
- Adding new component types
- Customizing the UI
- Adding new features
- Internationalization
- And much more!

## Development

### Demo Mode (No Supabase Required)

Want to try it without setting up Supabase first?

```bash
# Rename index-demo.js to index.js temporarily
mv pages/index.js pages/index-supabase.js
mv pages/index-demo.js pages/index.js
npm run dev
```

This runs with mock authentication and in-memory state (no database).

### Production Mode (With Supabase)

```bash
# Make sure you have .env.local configured
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for detailed instructions.

### Other Platforms

Also works with:
- Netlify
- Railway
- Self-hosted (VPS, Docker)

## Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Environment variables for sensitive data
- ✅ HTTPS enforced in production
- ✅ Google OAuth for authentication
- ✅ No sensitive keys exposed to client

## Performance

- ⚡ Server-side rendering with Next.js
- ⚡ Optimized Tailwind CSS (purged unused styles)
- ⚡ Database queries with indexes
- ⚡ Vercel Edge Network CDN
- ⚡ Automatic code splitting

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Want to contribute? Great! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

Need help?
- Check the [SUPABASE_SETUP.md](SUPABASE_SETUP.md) guide
- Check the [DEPLOYMENT.md](DEPLOYMENT.md) guide
- Check the [CUSTOMIZATION.md](CUSTOMIZATION.md) guide
- Open an issue on GitHub
- Check [Supabase Docs](https://supabase.com/docs)
- Check [Next.js Docs](https://nextjs.org/docs)

## Roadmap

- [ ] Rich text editor (WYSIWYG)
- [ ] Image uploads with Supabase Storage
- [ ] Team collaboration features (real-time editing)
- [ ] Export pages to PDF/Markdown
- [ ] Page templates
- [ ] Comments on pages
- [ ] Notifications system
- [ ] Mobile app
- [ ] API access

---

Built with ❤️ using Next.js and Supabase
