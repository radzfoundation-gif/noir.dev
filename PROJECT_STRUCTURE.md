# NOIR AI - Complete Project Structure

## 📁 Directory Structure

```
noir-ai/
├── src/
│   ├── components/
│   │   ├── api/
│   │   │   └── APIManager.tsx              # API keys & webhooks UI
│   │   ├── backend/
│   │   │   └── BackendGeneratorPanel.tsx   # Backend generation UI
│   │   ├── comments/
│   │   │   └── CommentThread.tsx           # Comments system UI
│   │   ├── design-system/
│   │   │   └── DesignSystemPicker.tsx      # Design system selector
│   │   ├── mobile/
│   │   │   └── MobileExportModal.tsx       # Mobile export UI
│   │   ├── presence/
│   │   │   └── PresenceComponents.tsx      # User presence & activity
│   │   ├── responsive/
│   │   │   └── ResponsiveTestingPanel.tsx  # Responsive testing UI
│   │   ├── team/
│   │   │   ├── ShareProjectModal.tsx       # Project sharing
│   │   │   ├── TeamSettingsModal.tsx       # Team management
│   │   │   └── TeamSwitcher.tsx            # Team switcher dropdown
│   │   ├── ChatInput.tsx                   # AI chat input
│   │   ├── ComponentGallery.tsx            # Template gallery
│   │   ├── ExportModal.tsx                 # Code export modal
│   │   ├── ToolbarDropdown.tsx             # Reusable dropdown
│   │   ├── VersionHistoryModal.tsx         # Version history
│   │   └── Workbench.tsx                   # Main editor
│   │
│   ├── context/
│   │   └── AuthContext.tsx                 # Authentication context
│   │
│   ├── lib/
│   │   ├── backendGeneratorService.ts      # Backend generation logic
│   │   ├── designSystemService.ts          # Design system integration
│   │   ├── exportService.ts                # Multi-framework export
│   │   ├── mobileExportService.ts          # Mobile export logic
│   │   ├── projectService.ts               # Project CRUD
│   │   ├── publicAPIService.ts             # Public API management
│   │   ├── realtimeCollaborationService.ts # Real-time collaboration
│   │   ├── responsiveTestingService.ts     # Responsive testing logic
│   │   ├── supabase.ts                     # Supabase client
│   │   ├── teamService.ts                  # Team management
│   │   ├── templateService.ts              # Template library
│   │   └── versionHistoryService.ts        # Version history
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx                   # User dashboard
│   │   ├── EditorPage.tsx                  # Main editor page
│   │   ├── LandingPage.tsx                 # Landing page
│   │   ├── Login.tsx                       # Login page
│   │   ├── Pricing.tsx                     # Pricing page
│   │   └── SignUp.tsx                      # Signup page
│   │
│   ├── App.tsx                             # Main app component
│   ├── index.css                           # Global styles
│   └── main.tsx                            # Entry point
│
├── server/
│   └── index.js                            # Express server
│
├── supabase/
│   └── migrations/
│       ├── 20250205_project_versions.sql   # Q1 migration
│       └── 20250205_q2_team_collaboration.sql  # Q2-Q3 migration
│
├── public/                                 # Static assets
├── dist/                                   # Build output
├── FEATURES.md                             # Feature documentation
├── UI_GUIDE.md                             # UI usage guide
├── package.json                            # Dependencies
├── README.md                               # Project readme
└── tsconfig.json                           # TypeScript config
```

---

## 🔧 Services Overview

### Core Services

#### 1. `backendGeneratorService.ts`
**Purpose:** Generate full backend projects

**Key Methods:**
- `generateBackend(project)` - Main generation function
- `generateExpressProject(project)` - Express.js generator
- `generateFastifyProject(project)` - Fastify generator
- `generateNestJSProject(project)` - NestJS generator
- `generateDjangoProject(project)` - Django generator
- `generateLaravelProject(project)` - Laravel generator
- `generateMigration(table, database)` - Generate SQL migrations
- `generateAPIDocs(endpoints)` - Generate OpenAPI documentation

**Supports:**
- 5 backend frameworks
- 5 database types
- Auto CRUD generation
- JWT authentication
- Error handling

---

#### 2. `mobileExportService.ts`
**Purpose:** Convert web designs to mobile apps

**Key Methods:**
- `exportToMobile(htmlContent, config)` - Main export function
- `exportToReactNative(html, config)` - React Native export
- `exportToFlutter(html, config)` - Flutter export
- `exportToiOS(html, config)` - iOS native export
- `exportToAndroid(html, config)` - Android native export
- `getBuildInstructions(platform)` - Get build steps
- `estimateBuildSize(platform)` - Estimate app size

**Supports:**
- React Native (Expo & CLI)
- Flutter
- iOS (SwiftUI)
- Android (Jetpack Compose)

---

#### 3. `publicAPIService.ts`
**Purpose:** Manage public API access

**Key Methods:**
- `createAPIKey(name, permissions)` - Create new API key
- `getAPIKeys()` - List all keys
- `revokeAPIKey(keyId)` - Revoke a key
- `getAPIUsage(keyId, days)` - Get usage analytics
- `createWebhook(url, events)` - Create webhook
- `getWebhooks()` - List webhooks
- `testWebhook(webhookId)` - Test webhook delivery
- `getAPIDocumentation()` - Get API docs
- `getSDKExamples()` - Get SDK code examples

**Features:**
- API key management
- Usage analytics
- Webhook configuration
- Multiple SDK examples

---

#### 4. `teamService.ts`
**Purpose:** Team collaboration management

**Key Methods:**
- `createTeam(name, description)` - Create team
- `getUserTeams()` - Get user's teams
- `inviteMember(teamId, email, role)` - Invite member
- `getTeamMembers(teamId)` - List members
- `updateMemberRole(memberId, role)` - Change role
- `removeMember(memberId)` - Remove member
- `shareProject(projectId, options)` - Share project
- `addComment(projectId, content)` - Add comment
- `getProjectComments(projectId)` - Get comments
- `resolveComment(commentId)` - Resolve comment
- `checkProjectPermission(projectId, userId)` - Check access

**Features:**
- Team management
- Role-based access
- Project sharing
- Comments system
- Activity tracking

---

#### 5. `realtimeCollaborationService.ts`
**Purpose:** Real-time presence and collaboration

**Key Methods:**
- `initializePresence(userId, options)` - Setup presence
- `updateStatus(userId, status)` - Update user status
- `updateCursor(userId, x, y)` - Update cursor position
- `getActiveUsers(options)` - Get online users
- `subscribeToPresence()` - Subscribe to changes
- `broadcastEvent(event)` - Send real-time event
- `resolveConflicts(original, incoming, base)` - Merge conflicts
- `pushToUndoStack(userId, code)` - Add to undo
- `undo(userId)` / `redo(userId)` - Undo/redo

**Features:**
- Live presence indicators
- Cursor tracking
- Conflict resolution
- Per-user undo/redo

---

#### 6. `responsiveTestingService.ts`
**Purpose:** Test responsive design

**Key Methods:**
- `getRecommendedBreakpoints(type)` - Get breakpoints
- `calculateScale(contentW, contentH, containerW, containerH)` - Calculate zoom
- `checkResponsiveIssues(html, width)` - Find responsive issues
- `checkAccessibility(html)` - Run accessibility checks
- `measurePerformance(html)` - Estimate performance
- `generateSafeAreaCSS(device)` - Generate safe area CSS

**Features:**
- 9 breakpoints
- 6 device frames
- Accessibility validation
- Performance metrics
- Grid overlay

---

#### 7. `designSystemService.ts`
**Purpose:** Design system integration

**Key Methods:**
- `getComponentsByLibrary(library)` - Get component list
- `getAllLibraries()` - List all design systems
- `getInstallCommand(library)` - Get npm install command
- `getSetupInstructions(library)` - Get setup code
- `convertToDesignSystem(html, library)` - Convert HTML to components
- `getComponentExample(library, component)` - Get usage example

**Supports:**
- MUI (Material-UI)
- Chakra UI
- Ant Design
- TailwindUI
- Radix UI
- shadcn/ui

---

#### 8. `exportService.ts`
**Purpose:** Multi-framework code export

**Key Methods:**
- `export(code, options)` - Main export function
- `htmlToReact(html, options)` - Convert to React
- `htmlToVue(html, options)` - Convert to Vue
- `htmlToAngular(html, options)` - Convert to Angular
- `htmlToSvelte(html, options)` - Convert to Svelte
- `downloadFiles(result)` - Download generated files

**Supports:**
- HTML, React, Vue, Angular, Svelte
- TypeScript support
- Tailwind CSS toggle

---

#### 9. `templateService.ts`
**Purpose:** Template library management

**Exports:**
- `componentTemplates` - Array of 30+ templates
- `componentCategories` - Category list
- `getTemplatesByCategory(category)` - Filter templates
- `getTemplateById(id)` - Get single template

**Template Structure:**
```typescript
{
  id: string,
  name: string,
  description: string,
  category: string,
  prompt: string,  // Detailed 500+ line prompt
}
```

---

#### 10. `versionHistoryService.ts`
**Purpose:** Version control for projects

**Key Methods:**
- `getVersions(projectId)` - List versions
- `createVersion(projectId, code, note)` - Save version
- `getVersion(versionId)` - Get specific version
- `revertToVersion(versionId)` - Restore version
- `compareVersions(fromId, toId)` - Diff two versions
- `deleteVersion(versionId)` - Delete version
- `autoSaveVersion(projectId, code)` - Auto-save

---

## 🎨 Components Overview

### Q1 Components

#### `ComponentGallery.tsx`
- Template browser
- Category filtering
- Search functionality
- 30+ templates

#### `ExportModal.tsx`
- Multi-framework export
- Framework selector
- Options configuration
- File download

#### `VersionHistoryModal.tsx`
- Version list
- Code preview
- Revert functionality
- Diff viewing

---

### Q2 Components

#### `TeamSwitcher.tsx`
- Team dropdown
- Member count display
- Quick team switch
- Create team button

#### `TeamSettingsModal.tsx`
- Member management
- Role assignment
- Invite system
- Team details

#### `ShareProjectModal.tsx`
- Share by link
- Share by email
- Permission levels
- Password protection

#### `CommentThread.tsx`
- Threaded comments
- Reply system
- Resolve/unresolve
- Real-time updates

#### `ResponsiveTestingPanel.tsx`
- Device selector
- Breakpoint testing
- Orientation toggle
- Accessibility report
- Performance metrics

#### `DesignSystemPicker.tsx`
- Library selector
- Install commands
- Setup instructions
- Component examples

#### `PresenceComponents.tsx`
- Active users list
- Presence indicators
- Activity feed

---

### Q3 Components

#### `BackendGeneratorPanel.tsx`
- Framework selector (5 options)
- Database selector (5 options)
- Feature toggles
- Code preview with tabs
- Copy/download

#### `MobileExportModal.tsx`
- Platform selector (4 options)
- Framework variants
- Feature toggles
- Build instructions
- Size estimation

#### `APIManager.tsx`
- API key management
- Usage analytics
- SDK examples
- Webhook configuration

#### `ToolbarDropdown.tsx`
- Reusable dropdown
- Separator support
- Icon support
- Shortcut display

---

## 🗄️ Database Schema

### Q1 Tables
- `project_versions` - Version history

### Q2 Tables
- `teams` - Team workspaces
- `team_members` - Team membership
- `project_shares` - Project sharing
- `comments` - Comments & annotations
- `comment_reactions` - Comment reactions
- `activities` - Activity feed
- `user_presence` - Real-time presence
- `design_systems` - Design system presets
- `user_design_preferences` - User preferences

### Q3 Tables
- `api_endpoints` - API endpoint definitions
- `database_schemas` - Database schemas
- `database_tables` - Table definitions
- `api_keys` - API key management
- `api_usage_logs` - API usage tracking
- `backend_templates` - Backend code templates
- `mobile_app_exports` - Mobile export tracking
- `webhooks` - Webhook configurations
- `webhook_deliveries` - Webhook delivery logs
- `integrations` - Third-party integrations

---

## 📊 Statistics

### Code Metrics
- **Total Files:** 50+ source files
- **Total Lines:** 15,000+ lines of code
- **Components:** 20+ React components
- **Services:** 10+ business logic services
- **Database Tables:** 20+ tables

### Features
- **Export Formats:** 10 (HTML, React, Vue, Angular, Svelte, Express, Fastify, NestJS, Django, Laravel)
- **Mobile Platforms:** 4 (React Native, Flutter, iOS, Android)
- **Databases:** 5 (PostgreSQL, MySQL, MongoDB, Supabase, SQLite)
- **Design Systems:** 6 (MUI, Chakra, AntD, TailwindUI, Radix, shadcn)
- **Templates:** 30+ pre-designed templates

---

## 🚀 Build Information

### Dependencies
- **React 19** - UI framework
- **Vite 7** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Backend/Database
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Bundle Size
- **JS:** ~924 KB (gzipped: 270 KB)
- **CSS:** ~80 KB (gzipped: 13 KB)
- **Build Time:** ~23 seconds

---

## 📝 Documentation Files

1. **README.md** - Project overview
2. **FEATURES.md** - Complete feature documentation (400+ lines)
3. **UI_GUIDE.md** - User interface guide (350+ lines)
4. **PROJECT_STRUCTURE.md** - This file

---

## 🎯 Next Steps

### Optimization
- [ ] Implement code splitting
- [ ] Add lazy loading for modals
- [ ] Optimize bundle size
- [ ] Add service worker

### Features
- [ ] Add more templates
- [ ] Support more frameworks
- [ ] AI-powered optimizations
- [ ] Plugin system

---

**Built with ❤️ using React + TypeScript + Tailwind CSS**

**Total Development Time:** Q1-Q3 2025

**Status:** Production Ready ✅
