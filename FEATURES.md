# NOIR AI - Complete Feature Documentation

## 📖 Table of Contents

1. [Overview](#overview)
2. [Q1 Features](#q1-features)
3. [Q2 Features](#q2-features)
4. [Q3 Features](#q3-features)
5. [Quick Start Guide](#quick-start-guide)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

NOIR AI is a comprehensive **Design-to-Code Platform** that transforms UI designs into production-ready code across multiple frameworks and platforms.

### Supported Outputs:
- **Frontend**: HTML, React, Vue, Angular, Svelte
- **Backend**: Express.js, Fastify, NestJS, Django, Laravel
- **Mobile**: React Native, Flutter, iOS (SwiftUI), Android (Jetpack Compose)
- **Databases**: PostgreSQL, MySQL, MongoDB, Supabase, SQLite

---

## 📦 Q1 Features

### 1. Multi-Framework Export 🌐

Export your generated code to multiple frontend frameworks.

**Supported Frameworks:**
- **HTML** - Standard HTML/CSS/JS
- **React** - React + TypeScript (.tsx)
- **Vue** - Vue 3 + TypeScript (.vue)
- **Angular** - Angular + TypeScript (.ts)
- **Svelte** - Svelte + TypeScript (.svelte)

**How to Use:**
1. Generate your design
2. Click **Export** button in toolbar
3. Select your preferred framework
4. Configure options:
   - Component name
   - Use Tailwind CSS (toggle)
   - TypeScript support (always enabled)
5. Click **Export Code**
6. Files will download automatically

**Example Output:**
```tsx
// React Export
import React from 'react';

interface GeneratedComponentProps {
  // Add your props here
}

export const GeneratedComponent: React.FC<GeneratedComponentProps> = () => {
  return (
    <>
      {/* Your generated HTML converted to JSX */}
    </>
  );
};
```

---

### 2. Component Gallery 🎨

Access 30+ pre-designed templates organized by category.

**Categories:**
- Landing Page (4 templates)
- Dashboard (4 templates)
- E-commerce (4 templates)
- Authentication (4 templates)
- Navigation (3 templates)
- Cards (4 templates)
- Forms (3 templates)
- Hero (3 templates)
- Pricing (2 templates)
- Footer (3 templates)

**How to Use:**
1. Click **Tools** → **Templates**
2. Browse by category or search
3. Click on template to view details
4. Click **Use Template**
5. AI will auto-generate based on template prompt

**Template Features:**
- Detailed prompts (500+ lines each)
- Specific design instructions
- Responsive requirements
- Accessibility guidelines
- Color schemes & typography

---

### 3. Version History 📚

Track and manage all versions of your project.

**Features:**
- Auto-save every 5 minutes
- Manual save with custom notes
- View code differences
- Revert to any previous version
- Delete old versions

**How to Use:**
1. Click **Tools** → **Version History**
2. View list of saved versions
3. Click on version to preview code
4. Click **Revert** to restore that version
5. Click **Save Current** to manually save

**Version Details:**
- Version number
- Timestamp
- File size
- Note/description
- Code preview

---

## 👥 Q2 Features

### 1. Team Collaboration 🤝

Work together with your team in real-time.

**Team Management:**
- Create multiple teams/workspaces
- Invite members via email
- Role-based access control:
  - **Owner** - Full control
  - **Admin** - Manage members & settings
  - **Editor** - Edit projects
  - **Viewer** - View only + comment

**How to Use:**
1. **Create Team:**
   - Click on Team Switcher (sidebar)
   - Click **Create Team**
   - Enter team name & description

2. **Invite Members:**
   - Go to **Share** → **Team Settings**
   - Click **Invite Member**
   - Enter email & select role
   - Send invitation

3. **Switch Teams:**
   - Click Team Switcher in sidebar
   - Select team from dropdown

---

### 2. Comments & Annotations 💬

Discuss designs with threaded comments.

**Features:**
- Threaded replies
- Resolve/unresolve comments
- Real-time notifications
- @mentions support
- Attach to specific elements

**How to Use:**
1. Click **Tools** → **Show Comments** (or toggle in toolbar)
2. Comments panel opens on right
3. Click **Add Comment**
4. Type your comment and press Enter
5. Reply to existing comments
6. Resolve comments when done

**Keyboard Shortcuts:**
- `Enter` - Submit comment
- `Shift + Enter` - New line
- `Escape` - Cancel

---

### 3. Project Sharing 🔗

Share projects with others via link or email.

**Share Options:**
- **Link Share** - Generate public/private link
- **Email Invite** - Send invitation directly
- **Team Share** - Share with entire team
- **Password Protection** - Secure with password
- **Expiration** - Set expiry date

**Permission Levels:**
- **View** - Can view & comment
- **Edit** - Can make changes
- **Admin** - Full access

**How to Use:**
1. Click **Share** button in toolbar
2. Choose share type:
   - **Link**: Generate shareable URL
   - **Email**: Enter recipient email
3. Set permission level
4. (Optional) Add password protection
5. (Optional) Set expiration
6. Click **Generate Link** or **Send Invite**

---

### 4. Responsive Testing 📱

Test your design across different devices and breakpoints.

**Breakpoints:**
- Mobile S (320px) - iPhone 5/SE
- Mobile M (375px) - iPhone 8
- Mobile L (414px) - iPhone 11 Pro Max
- Tablet (768px) - iPad Mini
- Laptop (1024px) - Small laptop
- Desktop (1280px) - MacBook Air
- Desktop L (1440px) - MacBook Pro
- Desktop XL (1920px) - Full HD
- 4K (2560px) - QHD Display

**Device Frames:**
- iPhone 15 Pro / Pro Max
- Samsung Galaxy S24
- iPad Pro 11"
- MacBook Air
- Generic Desktop

**Accessibility Checks:**
- Alt text validation
- Heading hierarchy
- Form labels
- Color contrast
- Keyboard navigation

**Performance Metrics:**
- Load time estimation
- Total requests
- Page size

**How to Use:**
1. Click **Tools** → **Responsive Testing**
2. Select breakpoint or device
3. Toggle orientation (portrait/landscape)
4. Enable grid overlay if needed
5. View accessibility report
6. Check performance metrics

---

### 5. Design System Integration 🎨

Export code compatible with popular UI libraries.

**Supported Libraries:**
- **Material-UI (MUI)** - Google's Material Design
- **Chakra UI** - Simple, modular components
- **Ant Design** - Enterprise-class UI
- **Tailwind UI** - Tailwind CSS components
- **Radix UI** - Unstyled, accessible primitives
- **shadcn/ui** - Beautifully designed components

**How to Use:**
1. Click **Export** → **Design System**
2. Select your preferred library
3. View installation command
4. Copy setup instructions
5. Apply to your project

**Features:**
- Auto-detect components
- Generate import statements
- Theme configuration
- Component mapping

---

## 🔧 Q3 Features

### 1. Backend Generator ⚙️

Generate complete backend API with database.

**Supported Frameworks:**
- **Express.js** - Fast, unopinionated Node.js framework
- **Fastify** - Fast and low overhead
- **NestJS** - Progressive Node.js framework
- **Django** - Python web framework
- **Laravel** - PHP web framework

**Supported Databases:**
- PostgreSQL
- MySQL
- MongoDB
- Supabase
- SQLite

**Features:**
- Auto-generated CRUD endpoints
- Database models & migrations
- JWT authentication middleware
- Error handling & validation
- Complete folder structure

**How to Use:**
1. Click **Export** → **Backend Generator**
2. Select backend framework
3. Select database
4. Toggle features:
   - Authentication (JWT)
   - CRUD Operations
5. Click **Generate Backend**
6. Preview generated files in tabs
7. Copy individual files or download all

**Generated Files:**
```
project-name-backend/
├── server.js              # Main server file
├── config/
│   └── database.js        # Database configuration
├── models/                # Database models
│   ├── User.js
│   └── Post.js
├── routes/                # API routes
│   ├── users.js
│   └── posts.js
├── middleware/
│   ├── auth.js           # Authentication
│   └── errorHandler.js   # Error handling
├── .env.example          # Environment variables
└── package.json          # Dependencies
```

**Example API Endpoints:**
```javascript
// Auto-generated endpoints
GET    /api/users          # List all users
GET    /api/users/:id      # Get single user
POST   /api/users          # Create user
PUT    /api/users/:id      # Update user
DELETE /api/users/:id      # Delete user

GET    /api/posts          # List all posts
GET    /api/posts/:id      # Get single post
POST   /api/posts          # Create post
// ... etc
```

---

### 2. Mobile App Export 📱

Convert your web design to native mobile apps.

**Supported Platforms:**

#### React Native
- **Expo** - Easiest setup, recommended
- **React Native CLI** - Full native control

#### Flutter
- Single codebase for iOS & Android
- Google's UI toolkit

#### Native iOS
- SwiftUI
- Jetpack Compose for Android

**Features:**
- Convert HTML/CSS to mobile components
- Auto-setup navigation
- State management (Redux/Provider/BLoC)
- API integration boilerplate
- Authentication setup

**How to Use:**
1. Click **Export** → **Export to Mobile**
2. Select platform (React Native/Flutter/iOS/Android)
3. Select framework variant (if applicable)
4. Toggle features:
   - Navigation Setup
   - State Management
5. Click **Generate Mobile App**
6. View estimated app size
7. Follow step-by-step build instructions

**Build Instructions Example:**
```bash
# React Native + Expo
1. npm install
2. npx expo start
3. Scan QR code with Expo Go app

# For production:
npx expo build:android
npx expo build:ios
```

---

### 3. Public API & Webhooks 🔌

Integrate NOIR AI into your workflow programmatically.

**API Key Management:**
- Create multiple API keys
- Set permissions (read/write)
- Rate limiting (100-10,000 req/hour)
- Usage analytics
- Revoke keys anytime

**Available Endpoints:**
```
POST   /v1/generate          # Generate code from design
GET    /v1/projects          # List your projects
GET    /v1/projects/:id      # Get project details
POST   /v1/projects/:id/export  # Export project
GET    /v1/templates         # Get available templates
```

**SDK Support:**
- JavaScript/TypeScript
- Python
- cURL examples

**Webhooks:**
- Get real-time notifications
- Events: project.created, project.updated, generation.completed
- Custom endpoint configuration
- Secure with secret token

**How to Use:**
1. Click **Export** → **API & Webhooks**
2. Go to **Keys** tab
3. Click **Create Key**
4. Name your key & copy immediately (shown only once)
5. Go to **Docs** tab for SDK examples
6. Go to **Webhooks** tab to configure endpoints

**JavaScript SDK Example:**
```javascript
import { NoirAI } from '@noir-ai/sdk';

const noir = new NoirAI({
  apiKey: 'your-api-key'
});

// Generate code
const result = await noir.generate({
  prompt: 'Create a login form with validation',
  framework: 'react',
  designSystem: 'mui'
});

console.log(result.code);
```

**Python SDK Example:**
```python
from noir_ai import NoirAI

noir = NoirAI(api_key='your-api-key')

result = noir.generate(
    prompt='Create a dashboard with charts',
    framework='react',
    design_system='mui'
)

print(result.code)
```

---

## 🚀 Quick Start Guide

### Scenario 1: Landing Page with Backend

**Goal:** Create a SaaS landing page with user authentication backend

**Steps:**
1. **Generate Frontend:**
   - Go to **Templates** → **SaaS Landing Page**
   - Click **Use Template**
   - Wait for generation
   - Preview and refine with chat

2. **Add Backend:**
   - Click **Export** → **Backend Generator**
   - Select **Express.js**
   - Select **PostgreSQL**
   - Enable **Authentication** & **CRUD**
   - Click **Generate**
   - Download backend files

3. **Deploy:**
   - Setup PostgreSQL database
   - Run `npm install` in backend folder
   - Configure `.env` file
   - Run `npm run dev`
   - Deploy frontend to Vercel/Netlify

### Scenario 2: Mobile App from Web Design

**Goal:** Convert web dashboard to React Native app

**Steps:**
1. **Create Web Version:**
   - Generate dashboard design
   - Refine until satisfied

2. **Export to Mobile:**
   - Click **Export** → **Export to Mobile**
   - Select **React Native**
   - Select **Expo** (recommended)
   - Enable **Navigation** & **State Management**
   - Click **Generate Mobile App**

3. **Build & Test:**
   - Follow instructions:
     ```bash
     npm install
     npx expo start
     ```
   - Scan QR code with Expo Go app
   - Test on physical device

### Scenario 3: Team Collaboration

**Goal:** Work with team on e-commerce project

**Steps:**
1. **Setup Team:**
   - Click Team Switcher → **Create Team**
   - Name: "E-commerce Project"
   - Invite team members with roles

2. **Share Project:**
   - Click **Share** button
   - Select **Team Share**
   - Set permission to **Edit**
   - Team members receive access

3. **Collaborate:**
   - Use **Comments** for feedback
   - @mention team members
   - Track changes in **Version History**
   - See who's online (presence indicators)

---

## 💡 Best Practices

### 1. Design Generation
- **Be specific** in prompts
- Use **templates** as starting point
- Iterate with chat for refinements
- Test responsiveness early
- Check accessibility scores

### 2. Export Strategy
- **Frontend first** - Get UI right
- **Backend second** - Add API layer
- **Mobile third** - Expand to apps
- Use **version history** to track iterations

### 3. Team Workflow
- Create **dedicated teams** per project
- Use **viewer role** for stakeholders
- **Comment** on specific elements
- **Resolve** comments when done
- Regular **version saves**

### 4. API Usage
- Create **separate keys** per environment
- Set **appropriate rate limits**
- Use **webhooks** for real-time updates
- Monitor **usage analytics**
- Rotate keys regularly

### 5. Performance
- Optimize **images** before upload
- Use **lazy loading** for large lists
- Enable **caching** in backend
- Monitor **bundle size** (mobile)
- Test on **real devices**

---

## 🔍 Troubleshooting

### Common Issues

**1. Generation Taking Too Long**
- Check prompt complexity
- Simplify design requirements
- Try different AI model
- Break into smaller components

**2. Export Not Working**
- Check browser console for errors
- Ensure code is valid
- Try different export format
- Clear browser cache

**3. Backend Not Connecting to Database**
- Verify `.env` configuration
- Check database is running
- Verify credentials
- Check firewall settings

**4. Mobile Build Failing**
- Update Node.js to latest LTS
- Clear `node_modules` and reinstall
- Check platform-specific requirements
- Review build logs carefully

**5. API Key Not Working**
- Ensure key is copied correctly
- Check permissions (read/write)
- Verify not expired
- Check rate limit usage

### Getting Help

- **Documentation**: This file
- **Community**: GitHub Discussions
- **Support**: support@noir.ai
- **API Status**: status.noir.ai

---

## 📈 Future Roadmap

**Q4 2025 Planned:**
- AI-powered A/B testing
- Advanced analytics dashboard
- Plugin marketplace
- Custom component library
- Enhanced mobile preview

---

## 📝 Changelog

### Q1 2025
- ✅ Multi-framework export
- ✅ Component gallery (30+ templates)
- ✅ Version history

### Q2 2025
- ✅ Team collaboration
- ✅ Comments system
- ✅ Responsive testing
- ✅ Design system integration

### Q3 2025
- ✅ Backend generator (5 frameworks)
- ✅ Mobile export (4 platforms)
- ✅ Public API & webhooks

---

**Built with ❤️ by the NOIR AI Team**

For updates, follow us on Twitter @NoirAI
