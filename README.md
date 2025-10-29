# Airplai Sports Hub

Internal documentation and knowledge hub for Airplai Sports.

## Features

- **Authentication**: Google Sign-In (Demo mode available)
- **Page Management**: Create, edit, and organize pages with hierarchical structure
- **Component Builder**: Drag-and-drop page editor with multiple component types (headings, text, lists, alerts, code blocks)
- **Search**: Full-text search across all pages
- **Version History**: Track and restore previous versions of pages
- **Activity Log**: Monitor all actions and changes
- **Responsive Design**: Beautiful gradient UI with dark theme

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development

Open [http://localhost:3000](http://localhost:3000) to view the application.

The app will start in demo mode. Click "Sign in with Google" to access the hub as an admin user.

## Tech Stack

- **Next.js 14**: React framework for production
- **React 18**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Supabase**: (Ready for integration) Backend and authentication

## Project Structure

```
├── pages/
│   ├── _app.js          # App wrapper
│   ├── _document.js     # HTML document structure
│   └── index.js         # Main hub application
├── styles/
│   └── globals.css      # Global styles and Tailwind imports
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── next.config.js       # Next.js configuration
```

## Features in Detail

### Page Editor

- **Headings**: H1, H2, H3 with gradient styling
- **Text**: Rich text paragraphs
- **Lists**: Bullet point lists with dynamic items
- **Alerts**: Highlighted information boxes
- **Code Blocks**: Syntax-highlighted code snippets

### Role-Based Access

- **Admin**: Full edit and create permissions
- **Editor**: Edit existing pages
- **Viewer**: Read-only access

## Future Enhancements

- [ ] Supabase integration for real authentication
- [ ] Database persistence for pages and activity
- [ ] Rich text editor
- [ ] Image uploads
- [ ] Team collaboration features
- [ ] Export pages to PDF/Markdown
- [ ] Page templates
