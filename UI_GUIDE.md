# NOIR AI - User Interface Guide

## 🖥️ Main Interface Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Logo] Noir Code    Preview | Code | Integrations | APIs           │
│                                                    [Active Users]   │
│  [Undo] [Redo] [Save] [Tools ▼] [Share ▼] [Upgrade] [Export ▼]      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐  ┌────────────────────────────────┐  ┌───────────┐   │
│  │          │  │                                │  │           │   │
│  │  Team    │  │                                │  │  Comments │   │
│  │ Switcher │  │         PREVIEW AREA           │  │  Thread   │   │
│  │          │  │                                │  │  (Toggle) │   │
│  │  Chat    │  │         [Your Design]          │  │           │   │
│  │  History │  │                                │  │           │   │
│  │          │  │                                │  │           │   │
│  │  Input   │  └────────────────────────────────┘  └───────────┘   │
│  │          │                                                      │
│  └──────────┘                                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Toolbar Buttons Explained

### Primary Actions (Left to Right)

| Button | Icon | What It Does |
|--------|------|--------------|
| **Undo** | ↶ | Undo last change |
| **Redo** | ↷ | Redo last undone change |
| **Save** | 💾 | Save current project |
| **Tools** | 🧰 | Access templates, history, responsive testing, comments |
| **Share** | 👥 | Share project with team or via link |
| **Upgrade** | ⭐ | View pricing plans |
| **Export** | 📤 | Export code, design systems, backend, mobile apps |

---

## 📂 Dropdown Menus

### Tools Dropdown
```
Tools ▼
├── 🎨 Templates          → Browse 30+ pre-designed templates
├── 📚 Version History    → View and revert to previous versions
├── 📱 Responsive Testing → Test on different devices
└── 💬 Show/Hide Comments → Toggle comments panel
```

### Share Dropdown
```
Share ▼
├── 🔗 Share Project      → Generate shareable link
└── ⚙️ Team Settings      → Manage team members (requires team)
```

### Export Dropdown
```
Export ▼
├── 📤 Export Code        → Multi-framework code export
├── 🎨 Design System      → Choose MUI, Chakra, etc.
├── ─────────────────────
├── ⚙️ Backend Generator   → Generate full backend API
├── 📱 Export to Mobile    → React Native, Flutter, etc.
├── ─────────────────────
└── 🔌 API & Webhooks     → Manage API keys and webhooks
```

---

## 🎨 Feature Workflows

### 1. Generate from Template

```
Step 1: Click [Tools ▼] → [Templates]
        ↓
Step 2: Select Category (e.g., "Landing Page")
        ↓
Step 3: Click on Template Card
        ↓
Step 4: Wait for AI Generation
        ↓
Step 5: Preview and Refine in Chat
```

### 2. Export to Multiple Frameworks

```
Step 1: Click [Export ▼] → [Export Code]
        ↓
Step 2: Select Framework
        ├── ⚛️ React
        ├── 🟢 Vue
        ├── 🅰️ Angular
        ├── 🔥 Svelte
        └── 🌐 HTML
        ↓
Step 3: Configure Options
        ├── Component Name
        └── Use Tailwind CSS (toggle)
        ↓
Step 4: Click [Export Code]
        ↓
Step 5: Files Download Automatically
```

### 3. Generate Backend API

```
Step 1: Click [Export ▼] → [Backend Generator]
        ↓
Step 2: Select Framework
        ├── ⚡ Express.js
        ├── 🚀 Fastify
        ├── 🦁 NestJS
        ├── 🐍 Django
        └── 🎨 Laravel
        ↓
Step 3: Select Database
        ├── 🐘 PostgreSQL
        ├── 🐬 MySQL
        ├── 🍃 MongoDB
        └── ⚡ Supabase
        ↓
Step 4: Toggle Features
        ├── ☑️ Authentication (JWT)
        └── ☑️ CRUD Operations
        ↓
Step 5: Click [Generate Backend]
        ↓
Step 6: Preview Files in Tabs
        ├── server.js
        ├── models/
        ├── routes/
        └── config/
        ↓
Step 7: Copy or Download All
```

### 4. Export to Mobile App

```
Step 1: Click [Export ▼] → [Export to Mobile]
        ↓
Step 2: Select Platform
        ├── ⚛️ React Native
        │   ├── 📦 Expo (Recommended)
        │   └── 🔧 React Native CLI
        ├── 🦋 Flutter
        ├── 🍎 iOS Native (SwiftUI)
        └── 🤖 Android Native (Jetpack Compose)
        ↓
Step 3: Toggle Features
        ├── ☑️ Navigation Setup
        └── ☑️ State Management
        ↓
Step 4: Click [Generate Mobile App]
        ↓
Step 5: View Build Instructions
        ↓
Step 6: Follow Step-by-Step Guide
        └── npm install → npx expo start
```

### 5. Team Collaboration

```
Step 1: Create Team
        └── Click Team Switcher → [Create Team]
        
Step 2: Invite Members
        └── [Share ▼] → [Team Settings] → [Invite Member]
        └── Enter email + select role
        
Step 3: Share Project
        └── [Share ▼] → [Share Project]
        └── Select permission level
        
Step 4: Collaborate
        ├── Toggle Comments panel
        ├── Add comments on design
        ├── @mention team members
        └── Resolve when done
```

### 6. API Integration

```
Step 1: Access API Manager
        └── [Export ▼] → [API & Webhooks]
        
Step 2: Create API Key
        └── [Keys] tab → Enter name → [Create Key]
        └── ⚠️ Copy immediately (shown once!)
        
Step 3: View Documentation
        └── [Docs] tab → Copy SDK code
        
Step 4: Setup Webhook (optional)
        └── [Webhooks] tab → Enter URL
        └── Select events to subscribe
        
Step 5: Monitor Usage
        └── View request analytics
        └── Check rate limits
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + S` | Save Project |
| `Escape` | Close Modal/Dropdown |
| `Enter` | Submit Comment/Form |
| `Shift + Enter` | New Line in Comment |

---

## 🎨 Color Coding

### Status Colors
- 🟢 **Green/Lime** - Success, Active, Available
- 🔵 **Blue** - Info, Links, Admin Role
- 🟡 **Yellow** - Warning, Away Status
- 🔴 **Red** - Error, Delete, Failed
- ⚪ **Gray** - Disabled, Secondary Text

### Role Colors
- 👑 **Gold** - Owner
- 🔷 **Blue** - Admin
- 🟢 **Green** - Editor
- ⚪ **Gray** - Viewer

---

## 📱 Responsive Design Testing

### How to Test Different Devices

```
1. Click [Tools ▼] → [Responsive Testing]
   ↓
2. Select Device:
   ├── 📱 iPhone 15 Pro (393×852)
   ├── 📱 Samsung Galaxy S24 (412×915)
   ├── 📟 iPad Pro 11" (834×1194)
   ├── 💻 MacBook Air (1280×832)
   └── 🖥️ Desktop 4K (2560×1440)
   ↓
3. Toggle Orientation (🔄)
   ├── Portrait
   └── Landscape
   ↓
4. Check Accessibility Report
   ├── Alt text validation ✓
   ├── Heading hierarchy ✓
   ├── Color contrast ✓
   └── Keyboard nav ✓
   ↓
5. View Performance Metrics
   ├── Load time: 1.2s
   ├── Requests: 15
   └── Size: 245KB
```

---

## 🔧 Common Tasks Quick Reference

### Task: Switch Between Projects
```
Team Switcher (Sidebar)
├── Click dropdown
├── Select team
└── Or switch to Personal
```

### Task: View Who's Online
```
Active Users (Toolbar)
├── Shows avatar stack
├── Hover to see names
└── Green dot = online
```

### Task: Revert to Old Version
```
Tools ▼ → Version History
├── Click version in list
├── Preview code changes
├── Click [Revert]
└── Confirm revert
```

### Task: Add Password to Share Link
```
Share ▼ → Share Project
├── Select [Link] tab
├── Enable password
├── Enter password
├── Click [Generate Link]
└── Share URL + password
```

### Task: Change Design System
```
Export ▼ → Design System
├── Select library (MUI/Chakra/etc)
├── View install command
├── Copy setup code
└── Apply to project
```

### Task: Test Webhook
```
Export ▼ → API & Webhooks
├── [Webhooks] tab
├── Add webhook URL
├── Select events
├── Click [Test Webhook]
└── View delivery status
```

---

## 💡 Pro Tips

### 🚀 Speed Up Workflow
1. **Use Templates** - Don't start from scratch
2. **Keyboard Shortcuts** - Save time
3. **Comments** - Discuss before coding
4. **Versions** - Save milestones
5. **Export Multiple** - Try different frameworks

### 🎯 Best Practices
1. **Specific Prompts** = Better Results
2. **Test Responsive** - Early and often
3. **Check Accessibility** - Before export
4. **Version Control** - Save frequently
5. **Team Communication** - Use comments

### ⚠️ Important Notes
1. **API Keys** - Copy immediately, shown once!
2. **Share Links** - Can be password protected
3. **Comments** - Can be resolved/unresolved
4. **Backend** - Needs database setup
5. **Mobile** - Requires proper dev environment

---

## 🆘 Need Help?

**Quick Access:**
- 📖 Full Docs: `FEATURES.md`
- 💬 Chat: Bottom left sidebar
- 🐛 Issues: GitHub Issues
- 📧 Email: support@noir.ai

---

**Last Updated:** Q3 2025
**Version:** 2.0.0
