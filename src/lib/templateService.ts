// Component template library with detailed, comprehensive prompts

export interface ComponentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  prompt: string;
  defaultCode?: string;
}

export const componentCategories = [
  'All',
  'Landing Page',
  'Dashboard',
  'E-commerce',
  'Authentication',
  'Navigation',
  'Cards',
  'Forms',
  'Hero',
  'Pricing',
  'Footer',
];

export const componentTemplates: ComponentTemplate[] = [
  // ============================================
  // LANDING PAGES - Detailed Prompts
  // ============================================
  {
    id: 'lp-saas-1',
    name: 'SaaS Landing Page Pro',
    description: 'High-converting SaaS landing page with complete sections',
    category: 'Landing Page',
    prompt: `Create a premium SaaS landing page with the following detailed specifications:

DESIGN SYSTEM & COLOR PALETTE:
- Primary Color: Use a modern gradient from #6366F1 (Indigo-500) to #8B5CF6 (Violet-500)
- Background: Clean white (#FFFFFF) with subtle gray sections (#F9FAFB)
- Text Colors: Dark gray (#111827) for headings, medium gray (#4B5563) for body, light gray (#9CA3AF) for secondary text
- Accent Color: Emerald green (#10B981) for success states and CTAs
- Border Colors: Light gray (#E5E7EB) for subtle borders

TYPOGRAPHY HIERARCHY:
- Hero Headline: 4xl-6xl (56-72px), font-bold, tracking-tight, leading-tight
- Section Headlines: 3xl (36px), font-bold, tracking-tight
- Subheadings: xl (20px), font-semibold
- Body Text: base (16px), font-normal, leading-relaxed
- Small Text: sm (14px), font-medium

SECTION-BY-SECTION BREAKDOWN:

1. STICKY NAVIGATION HEADER:
   - Logo on left (use placeholder text "YourLogo")
   - Navigation links: Features, Pricing, About, Resources (centered)
   - CTA buttons: "Sign In" (text link) + "Get Started" (solid button)
   - Mobile: Hamburger menu that slides in from right
   - Background: White with subtle shadow on scroll
   - Height: 70px with 16px horizontal padding

2. HERO SECTION (Above the fold):
   - Two-column layout: 60% text, 40% image/visual
   - Badge pill at top: "🚀 Now with AI-powered features" with light indigo background
   - Main Headline: "Build faster with our platform" (use H1 tag, 5xl font size)
   - Subheadline: 2-3 sentences explaining value proposition, max-width 600px
   - Dual CTAs: Primary "Start Free Trial" (indigo button, large) + Secondary "Watch Demo" (outline button with play icon)
   - Trust indicators: "No credit card required" + "14-day free trial" text below CTAs
   - Social proof: 5-star rating + "4.9/5 from 2,000+ reviews" + company logos (use placeholder logos)
   - Hero Image: Abstract 3D illustration or dashboard mockup (use placeholder div with gradient background)
   - Background: Subtle gradient overlay or geometric pattern (very light)
   - Padding: py-24 (96px vertical padding)

3. LOGOS/TRUST SECTION:
   - Heading: "Trusted by industry leaders" (sm text, gray, uppercase, tracking-wide)
   - 6 company logos in grayscale, evenly spaced, hover effect that shows color
   - Background: Light gray (#F9FAFB)
   - Padding: py-12

4. FEATURES GRID SECTION:
   - Section header centered: "Everything you need to succeed" (3xl)
   - Subheading: "Powerful features that help you build better products"
   - 6 feature cards in 3x2 grid layout (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
   - Each feature card:
     * Icon: 48px, rounded-lg background with icon (use Lucide icons)
     * Title: lg font-semibold, dark text
     * Description: 2-3 lines, gray text, leading-relaxed
     * Hover: Subtle lift effect (translateY -4px) with shadow increase
   - Cards have: white background, subtle border, rounded-xl (16px), p-6 padding

5. PRODUCT SHOWCASE SECTION:
   - Two-column alternating layout (Z-pattern)
   - Left side: Large screenshot/mockup with browser chrome (use placeholder)
   - Right side: Text content
     * Eyebrow text: "POWERFUL DASHBOARD" (xs, uppercase, tracking-wider, indigo color)
     * Heading: "Manage everything in one place" (3xl)
     * Bullet points with checkmarks: 4-5 key benefits
     * CTA: "Learn more" text link with arrow
   - Second row: Reverse layout (text left, image right)
   - Background: Alternate between white and light gray

6. TESTIMONIALS SECTION:
   - Section header: "Loved by thousands" (3xl, centered)
   - 3 testimonial cards in row
   - Each card:
     * Quote: Large text (xl), italic, with quotation mark icon
     * 5-star rating component
     * Avatar: 48px circle with name and title
     * Company logo (small)
   - Background: Soft gradient or subtle pattern
   - Cards have: White background, rounded-2xl, shadow-lg

7. STATS SECTION:
   - 4 stat blocks in row
   - Each block: Large number (5xl, bold, indigo color) + Label (sm, gray)
   - Examples: "10M+ Users", "99.9% Uptime", "24/7 Support", "150+ Countries"
   - Background: Indigo gradient (from #6366F1 to #8B5CF6)
   - Text: White

8. PRICING SECTION:
   - Header: "Simple, transparent pricing" (3xl)
   - Toggle: Monthly/Yearly with "Save 20%" badge
   - 3 pricing tiers: Starter, Pro (highlighted/most popular), Enterprise
   - Each tier card:
     * Plan name + icon
     * Price: Large (4xl) + "/month"
     * Original price with strikethrough (if yearly)
     * Feature list with checkmarks (5-8 features)
     * CTA button (Pro tier has "Most Popular" badge above it)
   - Pro tier: Elevated with border-2 border-indigo-500, slight scale up

9. FAQ SECTION:
   - Header: "Frequently asked questions" (3xl)
   - Accordion style: 6-8 questions
   - Expandable with smooth animation
   - Each item: Question (font-medium) + Answer (gray text)
   - Background: Light gray

10. CTA SECTION:
    - Large heading: "Ready to get started?"
    - Subheading: "Join thousands of satisfied customers"
    - Single prominent CTA button: "Start your free trial" (xl button, indigo)
    - Trust badges below: Security icons, money-back guarantee
    - Background: Subtle gradient or pattern
    - Padding: py-20

11. FOOTER:
    - 5 columns: Brand + 4 link columns (Product, Company, Resources, Legal)
    - Brand column: Logo + short description + social icons
    - Each link column: Heading (xs, uppercase, tracking-wider) + 4-5 links
    - Bottom bar: Copyright + Privacy/Terms links
    - Background: Dark gray (#111827)
    - Text: Light gray and white

INTERACTIONS & ANIMATIONS:
- Smooth scroll behavior for anchor links
- Fade-in animations on scroll for each section
- Hover states on all interactive elements
- Mobile menu slide-in animation
- Accordion expand/collapse animation

RESPONSIVE REQUIREMENTS:
- Desktop: Full layouts as described
- Tablet (768px-1024px): 2-column grids, adjusted spacing
- Mobile (<768px): Single column, stacked layouts, hamburger menu

ACCESSIBILITY:
- Proper heading hierarchy (H1 > H2 > H3)
- Alt text for all images
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus visible states
- Sufficient color contrast (WCAG AA)

TECHNICAL REQUIREMENTS:
- Use semantic HTML5 elements
- CSS Grid and Flexbox for layouts
- Tailwind CSS classes for styling
- Mobile-first responsive approach
- Smooth scrolling enabled

Generate a complete, production-ready HTML file with all sections styled with Tailwind CSS classes.`,
  },

  {
    id: 'lp-startup-1',
    name: 'Startup Landing Elite',
    description: 'Premium startup landing page with social proof focus',
    category: 'Landing Page',
    prompt: `Create a premium startup landing page with emphasis on social proof and credibility:

VISUAL DESIGN SYSTEM:
- Color Scheme: Warm, inviting palette
  * Primary: Coral/Orange gradient (#F97316 to #FB923C)
  * Secondary: Deep blue (#1E3A8A) for trust
  * Background: Off-white (#FFFBF7) with warm cream sections (#FFF7ED)
  * Text: Charcoal (#1F2937) and warm gray (#6B7280)
  * Accents: Gold (#F59E0B) for highlights

TYPOGRAPHY:
- Headlines: Playfair Display or serif font feel (use standard sans but with tighter tracking)
- Body: Clean sans-serif, 16-18px
- Hero text: 60-72px, bold, line-height 1.1

COMPLETE PAGE STRUCTURE:

1. NAVIGATION BAR:
   - Fixed position with glassmorphism effect on scroll
   - Logo with subtle animation on hover
   - Menu: About, Features, Pricing, Blog, Contact
   - Right side: Search icon + "Get Started" CTA
   - Height: 80px, px-8

2. HERO SECTION - Split Layout:
   - Left Column (55%):
     * Kicker badge: "🏆 Y Combinator S24" (pill with orange border)
     * H1: "The future of [industry] starts here" (serif-like, 6xl)
     * Subheadline: 3-4 sentences, max-w-lg
     * Email capture form: Input + "Join Waitlist" button inline
     * Trust bar: "Join 10,000+ early adopters" with 5 avatar circles
   - Right Column (45%):
     * Product screenshot or illustration
     * Floating stats card: "98% satisfaction rate" with checkmark
     * Decorative elements: Abstract shapes, gradient blobs
   - Background: Radial gradient from orange-100 center

3. PRESS/TRUST BAR:
   - "Featured in" heading (uppercase, tracking-widest)
   - 6 publication logos: TechCrunch, Forbes, ProductHunt, etc. (placeholder text)
   - Grayscale, opacity 60%, hover: full color opacity
   - Subtle divider lines between logos

4. PROBLEM-SOLUTION SECTION:
   - Two-column layout
   - Left: "The Problem" - 3 pain points with X icons, gray text
   - Right: "Our Solution" - 3 benefits with check icons, orange text
   - Visual connector between columns
   - Background: Subtle texture or pattern

5. FEATURE SHOWCASE - Horizontal Scroll:
   - Header centered: "Built for modern teams"
   - 4 feature blocks with large icons
   - Horizontal scroll on mobile, grid on desktop
   - Each block:
     * Large icon (64px) with gradient background
     * H3 title
     * 2-sentence description
     * "Learn more →" link

6. VIDEO SECTION:
   - Large video thumbnail with play button overlay
   - Caption: "See how it works in 2 minutes"
   - Stats row below: "2:34 duration | 50K+ views"
   - Gradient overlay on thumbnail

7. METRICS/STATS SECTION:
   - Background: Dark blue (#1E3A8A)
   - 4 large animated counters
   - Each: Icon + Number + Label
   - Examples: "$2M+ Raised", "500+ Beta Users", "15 Team Members", "99.9% Uptime"
   - White text, orange accents

8. TESTIMONIAL WALL:
   - Masonry grid layout (3 columns)
   - 6-9 testimonial cards of varying sizes
   - Each card:
     * Quote text (varies by importance)
     * Author photo + Name + Role
     * Company logo (optional)
     * Star rating
   - Mix of short quotes and longer stories
   - Cards have subtle shadows, white bg

9. TEAM SECTION:
   - "Meet the team" header
   - 4 team member cards in row
   - Each: Large photo, name, role, brief bio, social links
   - Hover: Photo zoom effect, social icons appear
   - Background: Light cream

10. NEWSLETTER SECTION:
    - Large, prominent section
    - Split layout: Left has large "Stay Updated" text
    - Right has email input + subscribe button
    - Promise: "No spam, unsubscribe anytime"
    - Background: Gradient orange to coral
    - Input has white bg, large rounded corners

11. FOOTER - Multi-column:
    - Dark footer (#111827)
    - 5 columns: Brand, Product, Company, Resources, Legal
    - Brand column: Logo + tagline + newsletter signup
    - Social icons row
    - Bottom: Copyright + "Made with ❤️ in [City]"

MICRO-INTERACTIONS:
- Hover effects on buttons (scale 1.02, shadow increase)
- Image zoom on hover
- Counter animations when scrolled into view
- Smooth reveal animations for each section
- Parallax subtle effects on hero

ANIMATIONS TO INCLUDE:
- Fade in up on scroll (0.6s ease-out)
- Stagger children animation (0.1s delay each)
- Hover transitions (0.2s ease)
- Page load sequence (navbar → hero → rest)

RESPONSIVE BREAKPOINTS:
- Mobile: Single column, full-width sections, hamburger nav
- Tablet: 2-column where applicable
- Desktop: Full layout as designed

Ensure all images have descriptive alt text and all interactive elements have proper focus states for accessibility.`,
  },

  {
    id: 'lp-app-1',
    name: 'Mobile App Landing Pro',
    description: 'App store optimized landing page for mobile apps',
    category: 'Landing Page',
    prompt: `Create a high-converting mobile app landing page optimized for app store conversions:

DESIGN FOUNDATION:
- Theme: Modern, energetic, trustworthy
- Primary Colors: Electric Blue (#3B82F6) to Cyan (#06B6D4) gradient
- Accent: Bright Purple (#8B5CF6) for highlights
- Background: Pure white with soft blue tints in sections
- Dark sections: Deep navy (#0F172A) for contrast
- Typography: Bold, modern sans-serif throughout

COMPLETE STRUCTURE:

1. SMART HEADER NAVIGATION:
   - Logo on left with subtle glow effect
   - Center: Anchor links (Features, Screenshots, Reviews, Download)
   - Right: App Store + Play Store badges (small)
   - Mobile: Hamburger with slide-out drawer menu
   - Glassmorphism effect when scrolled
   - Height: 72px

2. HERO SECTION - App Showcase:
   - Background: Gradient mesh or abstract pattern (subtle)
   - Two-column: 50/50 split
   - Left Side:
     * Pre-headline badge: "#1 Health App 2024" with trophy icon
     * H1: "Your personal health companion" (5xl, bold)
     * Subheadline: 3 sentences describing core value
     * Dual download buttons: App Store + Google Play (large, official badges)
     * Social proof: "⭐⭐⭐⭐⭐ 4.9 Rating | 1M+ Downloads"
     * QR code placeholder for easy mobile download
   - Right Side:
     * iPhone mockup (16 Pro style) with app screenshot
     * 3 floating notification cards around phone
     * Decorative gradient blobs behind
   - CTA below fold: "Available on iOS and Android"

3. APP STORE BADGES BAR:
   - Full-width light blue background
   - Center: Featured app badges
   - "Editor's Choice" + "Top Health App" + "Best Design 2024"
   - Each badge has icon + text

4. FEATURES GRID - 6 Cards:
   - Header: "Why users love our app" (3xl, centered)
   - 2 rows × 3 columns of feature cards
   - Each card:
     * Large emoji/icon (64px container with gradient bg)
     * Feature name (lg, semibold)
     * Detailed description (3-4 lines)
     * Illustrative micro-animation or icon
   - Cards: White bg, rounded-2xl, shadow-md, hover:shadow-xl
   - Background: Very light blue tint

5. APP SCREENS SHOWCASE:
   - Header: "Take a peek inside"
   - Horizontal scroll gallery of 6 app screens
   - Each screen in phone frame mockup
   - Scroll snap behavior
   - Navigation dots below
   - Screen labels: "Dashboard", "Analytics", "Settings", etc.
   - Background: Dark navy with gradient

6. HOW IT WORKS - 3 Steps:
   - Large numbered steps (01, 02, 03)
   - Each step:
     * Number in circle (gradient bg)
     * Icon
     * Step title (xl)
     * Detailed explanation (4-5 sentences)
   - Connecting line between steps
   - Alternating layout (left, right, left)

7. USER TESTIMONIALS - Carousel:
   - Full-width section
   - Auto-rotating testimonial cards
   - Each card:
     * Large quote text (2xl, italic)
     * 5 stars
     * User photo + name + "Verified User"
     * App store they came from
   - Navigation arrows
   - Pause on hover
   - Background: Subtle gradient

8. STATISTICS BANNER:
   - 4 stats in horizontal row
   - Large numbers with counter animation
   - Examples: "1M+ Active Users", "4.9★ Rating", "50+ Countries", "24/7 Support"
   - Icons above numbers
   - Background: Gradient blue
   - White text

9. FEATURE DEEP-DIVE - Tabs:
   - Header: "Explore features"
   - Tab navigation: Dashboard | Analytics | Reminders | Community
   - Each tab shows:
     * Large feature screenshot
     * Feature description (bullet points)
     * "Try it now" CTA
   - Smooth tab transition animations

10. PRICING/PREMIUM SECTION:
    - "Unlock premium features" header
    - Comparison: Free vs Premium
    - Premium features list with checkmarks
    - Pricing card: "$9.99/month" with yearly discount
    - "Start 7-day free trial" CTA
    - Trust badges: Secure payment, cancel anytime
    - Background: Light purple tint

11. FAQ ACCORDION:
    - 8 common questions about the app
    - Expandable with smooth animation
    - Categories: General, Account, Technical, Billing
    - Background: White

12. FINAL CTA SECTION:
    - Large heading: "Ready to transform your health?"
    - Subheading: "Download now and start your journey"
    - Large app store buttons (centered)
    - QR code for instant download
    - Email capture: "Get tips delivered to your inbox"
    - Background: Gradient blue with pattern overlay

13. COMPREHENSIVE FOOTER:
    - 4 columns: App info, Features, Company, Download
    - App info: Logo, tagline, social icons
    - Features: Feature list with links
    - Company: About, Careers, Press, Contact
    - Download: App Store + Play Store badges (large)
    - Bottom: Legal links, copyright, "Made with ❤️"
    - Background: Dark navy

MICRO-INTERACTIONS & ANIMATIONS:
- Phone mockup: Subtle floating animation
- Buttons: Scale up + shadow on hover
- Cards: Lift effect (translateY -4px) on hover
- Scroll: Smooth reveal with IntersectionObserver
- Testimonials: Fade transition between slides
- Stats: Count up animation when in view

ACCESSIBILITY FEATURES:
- All images have descriptive alt text
- Proper heading hierarchy (H1 → H2 → H3)
- Sufficient color contrast (4.5:1 minimum)
- Keyboard navigation support
- Focus indicators on all interactive elements
- Screen reader friendly markup

RESPONSIVE DESIGN:
- Mobile: Single column, stacked sections, touch-friendly buttons
- Tablet: 2-column grids maintained
- Desktop: Full layout with all visual effects

TECHNICAL NOTES:
- Use CSS Grid and Flexbox for layouts
- Implement smooth scroll behavior
- Include lazy loading for images
- Optimize for fast loading
- All buttons are interactive with proper states

Generate complete HTML with Tailwind CSS classes and inline styles where needed.`,
  },

  {
    id: 'lp-portfolio-1',
    name: 'Creative Portfolio Pro',
    description: 'Stunning portfolio for designers and developers',
    category: 'Landing Page',
    prompt: `Create a stunning, award-worthy creative portfolio landing page:

ART DIRECTION & STYLE:
- Aesthetic: Minimalist, editorial, high-contrast
- Color Palette:
  * Primary: Pure black (#000000) and white (#FFFFFF)
  * Accent: Gold (#D4AF37) for luxury touches
  * Gray scale: Various grays for depth (#1A1A1A to #F5F5F5)
- Typography: Modern grotesque feel, oversized headings, generous whitespace
- Overall feel: High-end, gallery-like, editorial magazine quality

PAGE ARCHITECTURE:

1. FULL-SCREEN HERO:
   - Navigation: Minimal, transparent (logo + menu icon only)
   - Massive typography: "CREATIVE DEVELOPER" or similar (20vw font size, split across lines)
   - Scroll indicator: Subtle arrow bouncing at bottom
   - Background: Black with subtle texture or large grayscale image
   - Text: White with mix-blend-mode: difference for visual interest
   - No CTA buttons - let the typography speak

2. INTRO/ABOUT SECTION:
   - Two-column: Large portrait image (left), text (right)
   - Image: Black and white, high contrast, takes 50% width
   - Text content:
     * Small label: "ABOUT ME" (uppercase, tracking-widest)
     * Large statement: "I craft digital experiences" (3xl)
     * Bio paragraph: 4-5 sentences, elegant serif or light sans
     * Skills list: Horizontal tags with gold border
     * Download CV button: Outline style, gold border
   - Background: White
   - Generous padding: py-32

3. SELECTED WORKS - Portfolio Grid:
   - Section header: "SELECTED WORKS" (large, bold, uppercase)
   - Masonry-style grid: 2 columns, varying heights
   - 6 project cards:
     * Large thumbnail (hover: subtle zoom)
     * Project title (xl, bold)
     * Category tags (small, gray)
     * Year
     * Brief description (optional)
   - Hover effect: Overlay with "View Project" text
   - Lazy load images with fade-in
   - Mix of project types: Web, Mobile, Branding, etc.

4. SERVICES OFFERED:
   - Dark background section (#0A0A0A)
   - 4 service blocks in row
   - Each service:
     * Large number (01, 02, 03, 04) in gold
     * Service name (2xl, white)
     * Detailed description (gray text)
     * Key deliverables list (bullet points)
   - Vertical line connecting all services
   - Staggered layout for visual interest

5. PROCESS SECTION:
   - Header: "MY PROCESS" with gold underline
   - 4 steps shown visually:
     * Discovery & Research
     * Strategy & Planning
     * Design & Development
     * Launch & Support
   - Each step: Icon + Title + Detailed paragraph (4-5 sentences)
   - Connecting timeline visual
   - Alternating alignment (left, right, left, right)

6. CLIENTS/LOGOS:
   - Minimal section: "TRUSTED BY" (small, centered)
   - 6 client logos in grayscale
   - Evenly spaced, minimal
   - No background color change

7. TESTIMONIALS:
   - Single large testimonial (featured)
   - Large quote marks (decorative, gold)
   - Quote text: 2xl, italic, max-width 800px
   * Author: Photo + Name + Company + Role
   - Slider dots for multiple testimonials
   - Navigation arrows (minimal)
   - Background: Very light gray

8. RECOGNITION/AWARDS:
   - Section title: "RECOGNITION"
   - List format (not grid):
     * Award name - Project - Year
     * Each row has hover effect
     * Subtle border bottom
   - Examples: "Awwwards SOTD - Project Name - 2024"
   - Gold accent on hover

9. BLOG/INSIGHTS:
   - Section: "LATEST THOUGHTS"
   - 3 article cards in row
   - Each card:
     * Featured image
     * Category tag (small)
     * Article title (lg, bold)
     * Excerpt (2-3 lines)
     * Read time + Date
   - Clean, minimal cards
   - "View all articles" link

10. CONTACT/CTA SECTION:
    - Large heading: "LET'S WORK TOGETHER"
    - Subheading: "Have a project in mind? Let's talk."
    - Email: Large, bold display (2xl font)
    - Social links: Instagram, Dribbble, LinkedIn, GitHub
    - Contact form:
      * Name, Email, Project Type dropdown
      * Message textarea
      * Submit button (black, large)
    - Location: "Based in [City], available worldwide"
    - Background: White

11. FOOTER:
    - Minimal: Just copyright + back to top
    - Or: Links to Privacy, Terms
    - Background: Black
    - Text: White/gray

DETAILED DESIGN ELEMENTS:

TYPOGRAPHY SPECIFICATIONS:
- Hero: 15-20vw, uppercase, line-height 0.9
- Section headers: 4xl-5xl, uppercase, tracking-tight
- Body: 16-18px, line-height 1.7, max-width 65ch
- Captions/Labels: 12px, uppercase, tracking-widest

SPACING SYSTEM:
- Section padding: py-24 to py-32 (96-128px)
- Component gaps: gap-8 to gap-16
- Container max-width: max-w-7xl (1280px)

IMAGES:
- All images: High quality, black and white or muted tones
- Aspect ratios: Varied for visual interest
- Lazy loading with blur-up effect
- Alt text: Descriptive for accessibility

ANIMATIONS & INTERACTIONS:
- Page load: Staggered text reveal
- Scroll: Parallax on hero image
- Hover: Image zoom (scale 1.05), color shifts
- Smooth transitions: 0.3s-0.5s ease
- Cursor: Custom cursor (optional)

RESPONSIVE ADAPTATIONS:
- Mobile:
  * Hero text smaller but still impactful
  * Single column layouts
  * Hamburger menu
  * Stacked portfolio grid
- Tablet: 2-column maintained where appropriate
- Desktop: Full experience as designed

ACCESSIBILITY CONSIDERATIONS:
- Proper heading hierarchy
- Alt text on all images
- Keyboard navigation
- Focus states visible
- Color contrast compliant
- Reduced motion support

ADVANCED FEATURES:
- Smooth scroll between sections
- Custom scrollbar styling
- Preloader (optional, minimal)
- Page transitions (if multi-page)

Generate complete HTML with sophisticated Tailwind CSS classes and attention to every detail.`,
  },

  // ============================================
  // DASHBOARDS - Detailed Prompts
  // ============================================
  {
    id: 'dash-analytics',
    name: 'Analytics Dashboard Pro',
    description: 'Comprehensive analytics dashboard with real-time data',
    category: 'Dashboard',
    prompt: `Create a comprehensive analytics dashboard with real-time data visualization:

DESIGN SYSTEM:
- Theme: Clean, professional, data-focused
- Color Palette:
  * Primary: Slate Blue (#6366F1)
  * Success: Emerald (#10B981)
  * Warning: Amber (#F59E0B)
  * Danger: Rose (#F43F5E)
  * Background: Slate-50 (#F8FAFC)
  * Card Background: White (#FFFFFF)
  * Text: Slate-900 for headings, Slate-600 for body
- Border Radius: lg (8px) for cards, xl (12px) for buttons
- Shadows: Subtle shadows for elevation (shadow-sm to shadow-lg)

COMPLETE DASHBOARD STRUCTURE:

1. SIDEBAR NAVIGATION:
   - Width: 260px fixed
   - Background: White with border-r
   - Logo area: Brand logo + name at top
   - Navigation sections:
     * Main: Dashboard, Analytics, Reports, Users
     * Data: Real-time, History, Forecasts
     * Settings: Preferences, API Keys, Help
   - Each nav item: Icon + Label, active state with blue left border
   - Collapsible sections with chevron icons
   - User profile card at bottom: Avatar + Name + Role
   - Collapse button to hide sidebar (shows icons only)

2. TOP HEADER BAR:
   - Height: 64px
   - Left: Page title "Analytics Dashboard" + Breadcrumb
   - Center: Global search bar (with cmd+k shortcut hint)
   - Right:
     * Date range picker (Last 7 days, Last 30 days, Custom)
     * Notification bell with badge (3 unread)
     * Theme toggle (light/dark)
     * User avatar dropdown

3. KPI CARDS ROW (4 cards):
   - Card 1: Total Revenue
     * Large number: "$124,500" with +12.5% badge (green)
     * Mini line chart showing trend
     * "vs last month" comparison
   - Card 2: Active Users
     * Number: "8,432" with +5.2% badge
     * Progress bar to goal
     * "Target: 10,000" text
   - Card 3: Conversion Rate
     * Percentage: "3.24%" with -0.4% badge (red)
     * Comparison sparkline
   - Card 4: Avg. Session Duration
     * Time: "4m 32s" with +8.1% badge
     * Icon: Clock
   - All cards: White bg, shadow-sm, rounded-lg, p-6
   - Hover: shadow-md transition

4. MAIN CHARTS SECTION (2-column grid):
   - Left (66%): Revenue Chart
     * Header: "Revenue Overview" + time period selector
     * Large area chart (Revenue vs Expenses)
     * Multiple data series with legend
     * Hover tooltip with detailed data
     * Export button (CSV, PNG)
   - Right (33%): Traffic Sources
     * Header: "Traffic Sources"
     * Donut chart with 5 segments
     * Legend with percentages
     * Click to drill down
   - Both charts: White bg, p-6

5. SECONDARY CHARTS ROW:
   - Left: User Acquisition Funnel
     * Vertical funnel visualization
     * 5 stages: Visitors → Signups → Active → Paid → Retained
     * Conversion rates between stages
     * Drop-off points highlighted
   - Right: Top Pages
     * Bar chart: Page views by URL
     * 10 most visited pages
     * % change indicator

6. DATA TABLES SECTION:
   - Header: "Recent Transactions" with "View All" link
   - Table columns:
     * User (avatar + name + email)
     * Transaction ID (truncated)
     * Date (formatted)
     * Amount (with currency)
     * Status (badge: Completed, Pending, Failed)
     * Actions (3-dot menu)
   - Features:
     * Sortable columns
     * Pagination (10 per page)
     * Search/filter
     * Row hover highlight
     * Sticky header
   - 10 sample rows with realistic data

7. REAL-TIME ACTIVITY FEED:
   - Header: "Live Activity" with green pulse dot
   - Scrollable list:
     * User action + timestamp
     * Event types: Sign up, Purchase, Upgrade, etc.
     * Icons for each event type
   - Auto-refresh indicator
   - "View full log" link

8. GEOGRAPHIC INSIGHTS:
   - World map visualization (simplified)
   - Heat map showing user density
   - Top 5 countries list with flags
   - Toggle: Users vs Revenue

9. QUICK STATS ROW:
   - Bounce Rate: 42.3%
   - Pages/Session: 4.8
   - New vs Returning: 60/40
   - Device split: Mobile 65%, Desktop 30%, Tablet 5%
   - Compact horizontal display

10. BOTTOM WIDGETS:
    - System Status: All systems operational (green badges)
    - API Usage: 14,234/50,000 requests (progress bar)
    - Storage: 45.2 GB used (gauge)
    - Team Activity: Recent edits with avatars

INTERACTIVE FEATURES:
- All charts: Hover for tooltips, click for details
- Date range: Changes update all charts
- Export: Multiple format options
- Real-time: Live updates every 30 seconds
- Responsive: Sidebar collapses on tablet/mobile
- Dark mode: Toggle switches all colors

ACCESSIBILITY:
- Proper table markup with headers
- Chart alternatives: Data tables view
- Keyboard navigation for all interactive elements
- ARIA labels on complex widgets
- Sufficient color contrast

RESPONSIVE BEHAVIOR:
- Desktop: Full sidebar, all columns visible
- Tablet: Collapsible sidebar, 2-column charts
- Mobile: Hidden sidebar (slide-out), single column, simplified charts

Generate complete HTML dashboard with realistic sample data and full Tailwind CSS styling.`,
  },

  {
    id: 'dash-ecommerce',
    name: 'E-commerce Admin Dashboard',
    description: 'Complete e-commerce management dashboard',
    category: 'Dashboard',
    prompt: `Create a comprehensive e-commerce admin dashboard for managing online store:

DESIGN FOUNDATION:
- Theme: Modern, trustworthy, conversion-focused
- Color Palette:
  * Primary: Emerald (#10B981) for success/positive
  * Secondary: Indigo (#6366F1) for actions
  * Warning: Orange (#F97316) for alerts
  * Danger: Red (#EF4444) for critical
  * Background: Gray-50 (#F9FAFB)
  * Card: White (#FFFFFF)
  * Text: Gray-900 (headings), Gray-600 (body)
- Visual Style: Clean, card-based, high information density

COMPLETE DASHBOARD STRUCTURE:

1. COLLAPSIBLE SIDEBAR:
   - Width: 250px (64px collapsed)
   - Sections:
     * Overview (dashboard icon)
     * Orders (shopping bag icon)
     * Products (package icon)
     * Customers (users icon)
     * Analytics (bar chart icon)
     * Marketing (megaphone icon)
     * Discounts (tag icon)
     * Settings (gear icon)
   - Active item: Emerald left border, light emerald bg
   - Collapse button at bottom
   - Store switcher dropdown at top

2. TOP NAVIGATION BAR:
   - Height: 60px
   - Left: Page title + store name dropdown
   - Search: Global product/order search with autocomplete
   - Right side actions:
     * "Add Product" button (primary)
     * Notification center (orders, reviews, alerts)
     * Help dropdown
     * User menu (profile, settings, logout)

3. TODAY'S SNAPSHOT CARDS (4 cards):
   - Total Sales: $12,450 (+8.2% vs yesterday)
     * Sparkline chart
     * "23 orders today"
   - Active Orders: 18 (5 pending, 8 processing, 5 shipped)
     * Status breakdown with mini progress bars
   - New Customers: 47 (+12 vs yesterday)
     * Mini bar chart of hourly signups
   - Revenue Goal: 78% of $16K daily target
     * Circular progress indicator
   - All cards: White bg, shadow-sm, rounded-xl

4. SALES PERFORMANCE CHART:
   - Header: "Sales Overview" + period selector (Today/Week/Month/Year)
   - Large area chart with dual axis
   - Revenue line (emerald)
   - Orders line (indigo)
   - Hover tooltip shows exact values
   - Legend with toggle
   - Export: CSV, PDF buttons
   - Time range: Last 30 days default

5. RECENT ORDERS TABLE:
   - Header: "Recent Orders" + "View All Orders" link
   - Columns:
     * Order ID (clickable, #ORD-001234)
     * Customer (avatar + name + email)
     * Products (item count + preview images)
     * Total (with currency)
     * Status (pill badges: Pending, Processing, Shipped, Delivered, Cancelled)
     * Date (relative: "2 hours ago")
     * Actions (View, Edit, Print)
   - 8 rows of sample data
   - Pagination: 10 per page
   - Filters: Status, Date range, Amount
   - Sortable columns
   - Row hover: Highlight + quick actions

6. TOP PRODUCTS SECTION:
   - Two tabs: Top Selling | Low Stock
   - Top Selling (default):
     * 5 product cards horizontal
     * Image, Name, Price, Units Sold, Revenue
     * "View details" link
   - Low Stock:
     * Alert styling (orange border)
     * Stock count with warning colors
     * Quick restock button

7. CUSTOMER INSIGHTS:
   - New vs Returning pie chart
   - Customer locations map
   - Top 5 customers list:
     * Avatar, Name, Total Spent, Orders, Last Order
   - Customer satisfaction score: 4.8/5

8. MARKETING PERFORMANCE:
   - Campaign cards (3 active):
     * Campaign name
     * Status badge (Active, Scheduled, Ended)
     * Performance metrics: CTR, Conversion, Revenue
     * Progress to goal
     * Edit/Pause buttons
   - Email performance: Open rate, Click rate, Unsubscribe rate

9. INVENTORY ALERTS:
   - Header: "Inventory Alerts" with warning icon
   - List of items:
     * Out of stock (red)
     * Low stock < 10 (orange)
     * Overstock > 100 (blue)
   - Product thumbnail + name + current stock + action buttons

10. ABANDONED CARTS:
    - Count: "24 abandoned carts worth $3,450"
    - Recovery rate: 32%
    - List of top 5 abandoned carts
    * Customer, Cart value, Time ago, Recover button

11. QUICK ACTIONS BAR:
    - Floating bar or sticky section
    - Buttons: Add Product, Create Discount, View Reports, Send Newsletter
    - Icon + label format

12. ANNOUNCEMENTS/NEWS:
    - Company updates
    - New features available
    - Dismissible cards

INTERACTIVE FEATURES:
- Real-time order notifications (toast)
- Drag-and-drop dashboard widgets
- Editable inline for quick changes
- Bulk actions on tables
- Keyboard shortcuts (J for search, N for new)
- Dark mode toggle

DETAILED TABLE FEATURES:
- Multi-select with checkboxes
- Bulk actions dropdown
- Column visibility toggle
- Export options (CSV, Excel, PDF)
- Print-friendly view
- Advanced filters panel
- Save filter presets

ACCESSIBILITY:
- Proper table markup (th, td, scope)
- ARIA labels on icon buttons
- Keyboard navigation (arrow keys in tables)
- Focus management
- Screen reader announcements for updates
- High contrast mode support

RESPONSIVE DESIGN:
- Desktop: Full sidebar, all columns visible
- Tablet: Collapsed sidebar, simplified charts
- Mobile: Drawer sidebar, card-based layouts, simplified tables
- Touch-friendly targets (min 44px)

Generate complete HTML e-commerce dashboard with realistic store data and full functionality.`,
  },

  {
    id: 'dash-crm',
    name: 'CRM Dashboard Pro',
    description: 'Professional customer relationship management dashboard',
    category: 'Dashboard',
    prompt: `Create a professional CRM dashboard for sales teams:

DESIGN SYSTEM:
- Theme: Trustworthy, efficient, professional
- Colors:
  * Primary: Royal Blue (#2563EB)
  * Success: Green (#22C55E)
  * Warning: Amber (#F59E0B)
  * Info: Sky Blue (#0EA5E9)
  * Background: Slate-50 (#F8FAFC)
  * Surface: White
  * Text: Slate-900/700/500
- Style: Card-based, clean lines, professional spacing

COMPLETE CRM STRUCTURE:

1. VERTICAL SIDEBAR:
   - Width: 240px
   - Logo + Company name
   - Main navigation:
     * Dashboard (home icon)
     * Contacts (users icon) - with count badge
     * Companies (building icon)
     * Deals (briefcase icon) - with pipeline value
     * Tasks (check-square icon) - with overdue badge
     * Calendar (calendar icon)
     * Emails (mail icon) - unread count
     * Reports (bar-chart icon)
   - Bottom: Settings, Help, User profile
   - Collapse to icons only

2. TOP ACTION BAR:
   - Global search: "Search contacts, deals, companies..."
   - Quick add dropdown: Contact, Company, Deal, Task
   - Notifications: Calls, emails, tasks due
   - User menu

3. DASHBOARD WIDGETS:

   A. PIPELINE OVERVIEW (full width):
   - Horizontal pipeline stages:
     * New Leads (45) - $0
     * Qualified (28) - $125K
     * Proposal (15) - $280K
     * Negotiation (8) - $150K
     * Closed Won (12) - $420K
   - Visual bar showing distribution
   - Click to filter deals

   B. KPI CARDS (4 cards):
   - Monthly Revenue: $45,200 (vs $38K last month)
   - New Deals: 24 (+6 this week)
   - Win Rate: 32% (up from 28%)
   - Avg Deal Size: $8,500

   C. DEALS FORECAST CHART:
   - Funnel chart showing conversion
   - Weighted pipeline: $750K
   - Expected close by month

4. RECENT ACTIVITY FEED:
   - Real-time updates
   - Activity types:
     * Email sent to [Contact]
     * Call completed with [Contact]
     * Deal moved to [Stage]
     * Task completed
     * Meeting scheduled
   - Each item: Icon + Description + Time + User avatar
   - Filter by type

5. MY TASKS LIST:
   - Header: "Today's Tasks (8)"
   - Filter: All | Overdue | Today | Upcoming
   - Task items:
     * Checkbox to complete
     * Task title
     * Related contact/deal
     * Due time
     * Priority badge (High/Medium/Low)
     * Actions (edit, reschedule, assign)
   - Quick add task input

6. UPCOMING MEETINGS:
   - Calendar view mini
   - List of today's meetings:
     * Time
     * Title
     * Attendees (avatars)
     * Location/video link
     * Join/Edit buttons

7. TOP DEALS SECTION:
   - "Deals Closing This Month"
   - 5 deals listed:
     * Company name + logo
     * Deal value
     * Probability %
     * Expected close date
     * Owner avatar
     * Progress bar

8. CONTACTS REQUIRING ATTENTION:
   - "No contact in 30 days"
   - 5 contacts list:
     * Avatar + Name
     * Last contact date
     * Quick action buttons: Email, Call, Schedule

9. SALES TEAM PERFORMANCE:
   - Leaderboard (if manager view)
   - Team members list:
     * Rank + Avatar + Name
     * Deals closed
     * Revenue
     * Win rate
   - Time period selector

10. EMAIL PERFORMANCE:
    - Emails sent: 156
    - Open rate: 45%
    - Reply rate: 12%
    - Template performance chart

11. QUICK ACTIONS:
    - Floating action button or bar
    - Log Call
    - Send Email
    - Schedule Meeting
    - Create Task

DETAILED DEAL CARD:
- Company name + website
- Contact person + role
- Deal value + currency
- Stage (dropdown to change)
- Probability slider
- Expected close date (calendar picker)
- Assigned to (user dropdown)
- Tags
- Recent activity timeline
- Notes section

CONTACT DETAIL VIEW:
- Header: Avatar + Name + Title + Company
- Contact info: Email, Phone, Address
- Social links
- Engagement history timeline
- Associated deals
- Tasks related to contact
- Notes & Files
- Email history

PIPELINE MANAGEMENT:
- Kanban-style board
- Drag-and-drop deal cards
- 5 stages minimum
- Stage totals
- Filter by owner, date, value
- Sort options

REPORTING WIDGETS:
- Revenue by source (pie chart)
- Deals by stage (bar chart)
- Activity metrics (calls made, emails sent)
- Conversion rates by source

RESPONSIVE:
- Desktop: Full sidebar, all widgets
- Tablet: Collapsed sidebar, simplified charts
- Mobile: Drawer nav, focused views

Generate professional CRM dashboard with realistic sales data.`,
  },

  {
    id: 'dash-project',
    name: 'Project Management Dashboard',
    description: 'Comprehensive project and task management dashboard',
    category: 'Dashboard',
    prompt: `Create a comprehensive project management dashboard for teams:

DESIGN FOUNDATION:
- Theme: Productive, organized, collaborative
- Color Palette:
  * Primary: Violet (#8B5CF6)
  * Secondary: Cyan (#06B6D4)
  * Success: Emerald (#10B981)
  * Warning: Yellow (#FACC15)
  * Danger: Red (#EF4444)
  * Neutral grays for UI
- Style: Card-based, clear visual hierarchy, generous whitespace

COMPLETE PROJECT DASHBOARD:

1. COLLAPSIBLE SIDEBAR:
   - Projects list with folders
   - Navigation:
     * Dashboard
     * My Tasks
     * Projects
     * Team
     * Calendar
     * Reports
     * Files
   - Quick filters: Starred, Recent
   - "Create New Project" button
   - User avatar at bottom

2. HEADER BAR:
   - Project selector dropdown
   - Search: "Search tasks, projects, files..."
   - Global actions:
     * Invite team member
     * Notifications
     * Help
     * User menu

3. PROJECT OVERVIEW SECTION:
   
   A. PROJECT HEADER:
   - Project name + status badge
   - Progress bar (68% complete)
   - Team avatars (5+ members)
   - Due date: "Due in 12 days"
   - Actions: Edit, Share, Archive

   B. KEY METRICS:
   - Tasks: 45/80 completed
   - Overdue: 3 tasks
   - Team velocity: 12 tasks/week
   - Budget: $12K / $15K used

4. KANBAN BOARD (Main View):
   - Columns: Backlog | To Do | In Progress | Review | Done
   - Each column:
     * Header with count
     * Add task button
     * Task cards
   - Task cards show:
     * Title
     * Tags/Labels (color-coded)
     * Assignee avatar
     * Due date
     * Priority indicator
     * Attachment count
     * Comment count
   - Drag-and-drop between columns
   - WIP limits per column

5. TASK CARDS DETAIL:
   - Click to expand modal:
     * Full description
     * Subtasks checklist
     * Assignee + Due date
     * Priority + Labels
     * Attachments
     * Activity log
     * Comments section
     * Time tracking

6. TIMELINE/GANTT VIEW:
   - Switchable view
   - Tasks as bars on timeline
   - Milestones as diamonds
   - Dependencies shown as lines
   - Zoom: Day/Week/Month/Quarter

7. TEAM WORKLOAD:
   - Bar chart: Tasks per team member
   - Shows capacity vs assigned
   - Overload warnings (red bars)
   - Click to see member's tasks

8. UPCOMING DEADLINES:
   - List view of tasks due soon
   - Grouped by: Today, Tomorrow, This Week
   - Each item: Task name + Project + Assignee + Time left

9. RECENT ACTIVITY:
   - Real-time feed:
     * Task completed by [User]
     * Comment added on [Task]
     * File uploaded to [Project]
     * Task assigned to [User]
   - Filter by project or user

10. BURNDOWN CHART:
    - Ideal vs Actual line
    - Shows if project is on track
    - Sprint/iteration view

11. MILESTONES TRACKER:
    - Upcoming milestones:
      * Milestone name
      * Date
      * Tasks completed/total
      * Status indicator
    - Visual timeline

12. FILE REPOSITORY:
    - Recent uploads grid
    - Filter by type (Images, Docs, All)
    - Search files
    - Upload button

DETAILED VIEWS:

TASK CREATION MODAL:
- Title input
- Description (rich text)
- Assignee dropdown
- Due date + time
- Priority (Low/Medium/High/Urgent)
- Labels/Tags (multi-select)
- Attach files
- Create subtasks
- Set reminder

PROJECT SETTINGS:
- General: Name, description, dates
- Team: Members + roles + permissions
- Labels: Custom task labels
- Workflows: Custom columns
- Integrations: Slack, GitHub, etc.
- Archive/Delete

TEAM VIEW:
- Grid of team members
- Each card:
  * Avatar + Name + Role
  * Tasks assigned
  * Current workload
  * Recent activity
  * Contact buttons

CALENDAR VIEW:
- Month/Week/Day views
- Tasks shown as events
- Color-coded by project
- Drag to reschedule
- Click to create task

RESPONSIVE:
- Desktop: Full kanban, sidebar visible
- Tablet: Collapsed sidebar, swipe between columns
- Mobile: List view, simplified cards

Generate complete project management dashboard with sample project data.`,
  },

  // ============================================
  // E-COMMERCE - Detailed Prompts
  // ============================================
  {
    id: 'shop-product-1',
    name: 'Premium Product Detail Page',
    description: 'High-converting product page with rich media',
    category: 'E-commerce',
    prompt: `Create a premium e-commerce product detail page optimized for conversions:

DESIGN SYSTEM:
- Theme: Luxury, trustworthy, premium feel
- Colors:
  * Primary: Deep Navy (#1E293B) for trust
  * Accent: Gold (#D4AF37) for luxury
  * CTA: Emerald (#10B981) for buy actions
  * Background: White with subtle gray sections
  * Text: Charcoal (#1F2937)
- Typography: Elegant serif for headings, clean sans for body

COMPLETE PRODUCT PAGE:

1. STICKY HEADER:
   - Logo + Navigation (Shop, Collections, About)
   - Search bar
   - Icons: Account, Wishlist, Cart (with count)
   - Promo banner: "Free shipping on orders over $100"

2. BREADCRUMB NAVIGATION:
   - Home > Category > Subcategory > Product Name
   - Small text, gray
   - Back link

3. MAIN PRODUCT SECTION (2-column):

   LEFT COLUMN - Product Gallery:
   - Large main image (60% width)
   - Thumbnail strip below (5-6 images)
   - Image zoom on hover
   - 360° view toggle (if applicable)
   - Video play button (if has video)
   - Share buttons: Pinterest, Facebook, Twitter

   RIGHT COLUMN - Product Details:
   
   A. Product Header:
   - Brand name (link)
   - Product title (H1, 2xl)
   - Rating: ★★★★★ (4.8) - 234 reviews
   - Price: $199.99
   * Compare at: $249.99 (strikethrough)
   * Savings badge: "Save $50"
   - SKU: PRD-12345
   - Stock status: "In Stock - Ships within 24 hours"

   B. Short Description:
   - 3-4 sentences highlighting key benefits
   - Bullet points for features

   C. Variants/Options:
   - Color selector: Swatches with names
   - Size selector: Dropdown or buttons
   - Size guide link (opens modal)
   - Fit predictor tool

   D. Quantity Selector:
   - Minus/Plus buttons
   - Input field
   - Max limit indicator

   E. MAIN CTA BUTTONS:
   - "Add to Cart" (large, emerald, full-width)
   - "Buy Now" (secondary, express checkout)
   - "Add to Wishlist" (icon button)

   F. Trust Elements:
   - "Free shipping & returns"
   - "Secure checkout" with lock icon
   - Payment icons: Visa, MC, Amex, PayPal
   - 30-day return policy

   G. Additional Actions:
   - "Add to Registry"
   - "Find in Store"
   - Share buttons

4. PRODUCT TABS SECTION:
   - Tabs: Description | Specifications | Reviews | Shipping
   
   Description Tab:
   - Detailed product description
   - Feature highlights with icons
   - Usage instructions
   - Care/maintenance info
   
   Specifications Tab:
   - Table format
   - Dimensions, weight, materials
   - Technical specs
   
   Reviews Tab:
   - Rating breakdown (5-star distribution)
   - Average by criteria: Quality, Value, Fit
   - Review filters: Most recent, Highest rated, Verified only
   - Individual reviews:
     * Avatar + Name + Date
     * Rating stars
     * Review title
     * Review text
     * Photos (if any)
     * Helpful? Yes/No count
     * Verified purchase badge
   - "Write a Review" button
   - Pagination
   
   Shipping Tab:
   - Delivery options
   - Costs and timeframes
   - International shipping info

5. RECOMMENDED PRODUCTS:
   - "Complete the Look" (complementary items)
   - "You May Also Like" (similar products)
   - Horizontal scroll on mobile
   - Product cards with quick view

6. RECENTLY VIEWED:
   - Horizontal strip
   - 4-6 products

7. CUSTOMER PHOTOS:
   - Grid of user-submitted photos
   - "See it in action"
   - Link to all customer photos

8. SIZE & FIT SECTION:
   - Size chart modal/table
   - Model measurements
   - "True to size" indicator based on reviews
   - Fit calculator

9. STYLING/OUTFIT IDEAS:
   - Curated looks featuring the product
   - "Shop the Look" buttons

10. DETAILED SPECIFICATIONS:
    - Expandable sections:
      * Materials & Care
      * Sustainability info
      * Manufacturing details
      * Warranty

INTERACTIVE ELEMENTS:
- Image gallery: Swipe, zoom, thumbnail click
- Color swatches: Hover shows name, click updates main image
- Size buttons: Hover shows availability
- Add to cart: Loading state, success animation
- Wishlist: Heart animation
- Reviews: Photo lightbox, helpful vote

ACCESSIBILITY:
- Alt text on all images
- ARIA labels on interactive elements
- Keyboard navigation
- Focus indicators
- Screen reader optimized

RESPONSIVE:
- Desktop: 2-column layout
- Tablet: Stacked, gallery above details
- Mobile: 
  * Swipeable image gallery
  * Sticky add-to-cart bar at bottom
  * Collapsible sections

Generate complete product page with realistic product data.`,
  },

  {
    id: 'shop-cart-1',
    name: 'Shopping Cart Page',
    description: 'Full-featured shopping cart with upsells',
    category: 'E-commerce',
    prompt: `Create a comprehensive shopping cart page with conversion optimization:

DESIGN FOUNDATION:
- Theme: Clean, trustworthy, efficient
- Colors:
  * Primary CTA: Emerald (#10B981)
  * Secondary: Gray-700
  * Background: White
  * Borders: Gray-200
  * Savings: Red (#EF4444) for discounts
- Style: Card-based layout, clear visual hierarchy

COMPLETE CART PAGE:

1. PAGE HEADER:
   - Breadcrumb: Home > Shopping Cart
   - Title: "Shopping Cart (3 items)"
   - "Continue Shopping" link

2. MAIN CART LAYOUT (2-column):

   LEFT COLUMN (66%) - Cart Items:

   A. Cart Item Cards (repeatable):
   - Product image (thumbnail)
   - Product details:
     * Product name (link)
     * Variant info: "Color: Blue | Size: M"
     * Unit price
     * In stock status
   - Quantity selector:
     * - / + buttons
     * Input field
     * Update link
   - Item total price
   - Remove button (X icon)
   - Save for later link
   - Each item in its own card with subtle shadow

   B. Empty State (if no items):
   - Empty cart illustration
   - "Your cart is empty" message
   - "Start Shopping" CTA button
   - Recommended products below

   C. Cart Actions:
   - "Clear Cart" link (with confirmation)
   - Promo code input:
     * Text field
     * "Apply" button
     * Success/error messages
   - Saved promo codes dropdown

   RIGHT COLUMN (33%) - Order Summary:

   A. Order Summary Card:
   - Header: "Order Summary"
   - Line items:
     * Subtotal: $299.97
     * Shipping: Calculated at checkout
     * Tax: Calculated at checkout
     * Discount (if applied): -$20.00 (red text)
   - Total: $279.97 (large, bold)
   - Savings highlight: "You save $20.00"

   B. Checkout CTA:
   - "Proceed to Checkout" (large, emerald, full-width)
   - "PayPal Checkout" (secondary button)
   - "Apple Pay" (secondary button)
   - Express checkout icons

   C. Trust Badges:
   - Security: SSL secure, encrypted
   - Payments: Visa, MC, Amex, PayPal icons
   - Guarantees: Free returns, 30-day money back

   D. Shipping Calculator:
   - "Estimate Shipping" dropdown
   - Country, ZIP code inputs
   - Calculate button
   - Shipping options display

   E. Need Help?:
   - Contact info
   - Live chat link
   - FAQ link

3. CROSS-SELL SECTION:
   - "Complete Your Purchase" header
   - 3-4 product recommendations:
     * Small product cards
     * Image, name, price
     * "Add to Cart" quick button
   - "Frequently bought together" bundle
   - Recently viewed items

4. SAVED FOR LATER:
   - Collapsible section
   - Items previously saved
   - "Move to Cart" and "Remove" actions

5. ABANDONED CART RECOVERY:
   - Email capture (if guest)
   - "Save your cart for later"
   - Login prompt to save cart

INTERACTIVE FEATURES:
- Quantity update: Real-time price calculation
- Item removal: Smooth fade out animation
- Promo code: Instant validation
- Shipping calculator: AJAX update
- Cross-sell: Hover effects, quick add
- Save for later: Smooth move animation
- Real-time sync: Cart updates everywhere

ACCESSIBILITY:
- Proper form labels
- Error messages announced
- Focus management on actions
- Keyboard navigation
- High contrast text

RESPONSIVE:
- Desktop: 2-column layout
- Tablet: Narrower columns
- Mobile: Single column, sticky checkout button at bottom

Generate complete cart page with realistic items and pricing.`,
  },

  // ============================================
  // AUTHENTICATION - Detailed Prompts
  // ============================================
  {
    id: 'auth-login-1',
    name: 'Premium Login Page',
    description: 'Secure, user-friendly login experience',
    category: 'Authentication',
    prompt: `Create a premium login page with security and UX best practices:

DESIGN SYSTEM:
- Theme: Trustworthy, secure, modern
- Colors:
  * Primary: Indigo (#6366F1)
  * Success: Emerald (#10B981)
  * Error: Rose (#F43F5E)
  * Background: Gradient from slate-50 to white
  * Card: White with subtle shadow
- Typography: Clean, readable, professional

COMPLETE LOGIN PAGE:

1. SPLIT LAYOUT DESIGN:

   LEFT SIDE (50% - Hidden on mobile):
   - Full-height brand section
   - Large brand logo
   - Tagline: "Welcome back to [Brand]"
   - Value proposition bullets:
     * "Secure & encrypted"
     * "Trusted by 10,000+ users"
     * "24/7 support"
   - Testimonial card:
     * Quote
     * Author photo + name
     * Company
   - Background: Subtle pattern or gradient
   - Brand colors

   RIGHT SIDE (50% - 100% on mobile):

   A. Login Form Container:
   - Centered card (max-width 420px)
   - White background
   - Rounded corners (xl)
   - Shadow (lg)
   - Padding: p-8

   B. Form Header:
   - "Sign in to your account" (H1, 2xl)
   - "Don't have an account? Sign up" (link)

   C. Social Login Buttons:
   - "Continue with Google" (full-width, white, border)
   - "Continue with Apple" (full-width, black)
   - "Continue with Microsoft" (full-width, blue)
   - Icons on left side

   D. Divider:
   - "Or continue with email"
   - Horizontal lines on sides

   E. Form Fields:
   
   Email Field:
   - Label: "Email address"
   - Input: type="email", placeholder="name@company.com"
   - Icon: Mail icon on left
   - Validation: Real-time email format check
   - Error state: Red border + message
   
   Password Field:
   - Label: "Password" + "Forgot password?" link (right aligned)
   - Input: type="password"
   - Toggle: Show/hide password (eye icon)
   - Icon: Lock icon on left
   - Requirements hint: "Min 8 characters"
   - Strength indicator (optional)

   F. Remember Me:
   - Checkbox: "Remember me for 30 days"
   - Right side: "Need help?" link

   G. Submit Button:
   - "Sign In" (full-width, large, indigo)
   - Loading state with spinner
   - Disabled state until valid

   H. Security Badges:
   - SSL secure badge
   - Encrypted connection text
   - Lock icon

   I. Footer Links:
   - Terms of Service
   - Privacy Policy
   - Contact Support
   - © 2024 Brand

2. ERROR STATES:
   - Toast notification for errors
   - Field-level validation
   - "Invalid email or password"
   - "Account locked" with contact info
   - "Too many attempts" with countdown

3. SUCCESS STATES:
   - Redirect animation
   - "Welcome back, [Name]"
   - Progress indicator

4. ACCESSIBILITY FEATURES:
   - ARIA labels on all inputs
   - Error announcements
   - Focus trap in modal (if modal)
   - Skip links
   - High contrast mode support
   - Reduced motion support

5. SECURITY FEATURES:
   - Password visibility toggle
   - Caps lock warning
   - Auto-logout warning
   - 2FA prompt (if enabled)
   - Suspicious activity detection message

6. ALTERNATE VIEWS:
   
   FORGOT PASSWORD FLOW:
   - Email input
   - "Send reset link" button
   - Success message
   - Back to login link
   
   2FA VERIFICATION:
   - Code input (6 digits)
   - Resend code option
   - "Use backup code" link
   - Timer countdown

7. RESPONSIVE:
   - Desktop: Split layout
   - Mobile: Single column, full-width form
   - Touch-friendly inputs (min 44px)

Generate complete login page with all states and interactions.`,
  },

  {
    id: 'auth-signup-1',
    name: 'Multi-Step Registration',
    description: 'User-friendly multi-step signup flow',
    category: 'Authentication',
    prompt: `Create a comprehensive multi-step registration form:

DESIGN SYSTEM:
- Theme: Welcoming, progressive, professional
- Colors:
  * Primary: Violet (#8B5CF6)
  * Progress: Gradient from violet to purple
  * Success: Emerald (#10B981)
  * Background: White with subtle gradient
- Style: Card-based, clear step indicators

COMPLETE SIGNUP FLOW:

1. PAGE LAYOUT:
   - Centered container (max-width 600px)
   - Progress bar at top
   - Step indicators: 1 2 3 4
   - Form card with shadow
   - Help sidebar or bottom links

2. STEP 1: ACCOUNT INFORMATION

   Header:
   - "Create your account" (H1)
   - "Step 1 of 4"
   - Progress: 25%

   Fields:
   
   A. Full Name:
   - Label: "Full name"
   - Placeholder: "John Doe"
   - First + Last name in one row
   - Validation: Required, min 2 chars
   
   B. Email Address:
   - Label: "Work email"
   - Placeholder: "john@company.com"
   - Validation: Email format, not disposable
   - Check availability
   
   C. Password:
   - Label: "Create password"
   - Requirements list (live check):
     * 8+ characters ✓
     * Uppercase letter ✓
     * Number ✓
     * Special character ✓
   - Strength meter: Weak/Medium/Strong
   - Show/hide toggle
   
   D. Confirm Password:
   - Must match password
   - Real-time validation

   Navigation:
   - "Continue" button (primary)
   - "Already have an account? Sign in"

3. STEP 2: COMPANY INFORMATION

   Header:
   - "Tell us about your company"
   - "Step 2 of 4"
   - Progress: 50%

   Fields:
   
   A. Company Name:
   - Label: "Company name"
   - Placeholder: "Acme Inc."
   
   B. Company Size:
   - Label: "Team size"
   - Radio buttons or dropdown:
     * 1-10 employees
     * 11-50 employees
     * 51-200 employees
     * 201-500 employees
     * 500+ employees
   
   C. Industry:
   - Label: "Industry"
   - Dropdown with categories
   
   D. Job Role:
   - Label: "Your role"
   - Dropdown: Owner, Manager, Developer, etc.

   Navigation:
   - "Back" button (secondary)
   - "Continue" button (primary)

4. STEP 3: USE CASE & PREFERENCES

   Header:
   - "How will you use our platform?"
   - "Step 3 of 4"
   - Progress: 75%

   Fields:
   
   A. Primary Use Case:
   - Multiple choice cards (visual):
     * Personal project (icon + description)
     * Team collaboration
     * Client work
     * Enterprise
   - Can select multiple
   
   B. Current Tools:
   - Label: "What tools do you currently use?"
   - Multi-select checkboxes
   - "Other" with text input
   
   C. Goals:
   - Label: "What are your main goals?"
   - Textarea
   - Optional

   Navigation:
   - "Back" button
   - "Continue" button

5. STEP 4: CONFIRMATION

   Header:
   - "Review and confirm"
   - "Step 4 of 4"
   - Progress: 100%

   Summary:
   - Collapsible sections showing all entered data
   - "Edit" links to go back
   
   Terms:
   - Checkbox: "I agree to Terms of Service"
   - Checkbox: "I agree to Privacy Policy"
   - Checkbox: "Send me product updates" (optional)
   - Links to documents open in modal/new tab

   Submit:
   - "Create Account" button (large, prominent)
   - Loading state
   - Success animation

6. POST-SIGNUP:
   - Welcome message
   - "Verify your email" prompt
   - Illustration
   - "Resend email" button
   - "Continue to dashboard" (disabled until verified)

7. VALIDATION & ERROR HANDLING:
   - Real-time field validation
   - Clear error messages
   - Field highlighting
   - Scroll to first error
   - Backend error handling

8. SOCIAL SIGNUP OPTIONS:
   - Google, Apple, Microsoft buttons
   - "Or sign up with email" divider
   - Pre-fill from social data

9. ACCESSIBILITY:
   - Proper form labels
   - Error announcements
   - Keyboard navigation between steps
   - Focus management
   - ARIA live regions

10. RESPONSIVE:
    - Desktop: Side-by-side layouts where applicable
    - Mobile: Stacked, full-width
    - Touch-friendly controls

Generate complete multi-step signup flow with all validation and interactions.`,
  },

  // ============================================
  // NAVIGATION - Detailed Prompts
  // ============================================
  {
    id: 'nav-header-1',
    name: 'Premium Header Navigation',
    description: 'Sticky responsive header with mega menu',
    category: 'Navigation',
    prompt: `Create a premium sticky header navigation with advanced features:

DESIGN SPECIFICATIONS:
- Height: 80px desktop, 64px mobile
- Background: White with blur backdrop when scrolled
- Shadow: Subtle on scroll (shadow-sm)
- Max-width container: 1440px centered

STRUCTURE:

1. LEFT SECTION - Brand:
   - Logo: SVG or text logo (height 32px)
   - Logo hover: Slight scale (1.02)
   - Click: Returns to homepage

2. CENTER SECTION - Navigation:
   - Menu items: Products, Solutions, Pricing, Resources
   - Each item has hover underline animation
   - Active state: Bold text + underline
   - Dropdowns on hover (mega menu style):
     * Products dropdown:
       - 3 columns: By Category, By Use Case, Featured
       - Each with icons, descriptions
       - "View All Products" link at bottom
     * Solutions dropdown:
       - Industry solutions with icons
       - Customer stories section
     * Resources dropdown:
       - Blog, Documentation, Community
       - Webinars & Events
       - Support

3. RIGHT SECTION - Actions:
   - Search icon (opens search modal)
   - "Sign In" text link
   - "Get Started" CTA button (primary color)
   - Mobile: Hamburger menu button

4. MOBILE NAVIGATION:
   - Full-screen overlay menu
   - Slide in from right
   - Close button (X) top right
   - Accordion sections for dropdowns
   - Large touch targets (min 48px)
   - Bottom section: Social links

INTERACTIONS:
- Scroll behavior: Hide on scroll down, show on scroll up
- Dropdown animation: Fade + slight translateY
- Mobile menu: Slide transition (300ms ease)
- Search: Expandable input or modal

ACCESSIBILITY:
- ARIA labels on icon buttons
- Keyboard navigation (Tab, Enter, Escape)
- Focus trap in mobile menu
- Skip to content link

RESPONSIVE BREAKPOINTS:
- Desktop (>1024px): Full horizontal nav
- Tablet (768-1024px): Compact nav, fewer items visible
- Mobile (<768px): Hamburger menu only`,
  },

  // ============================================
  // PRICING - Detailed Prompts
  // ============================================
  {
    id: 'pricing-toggle-1',
    name: 'Premium Pricing Section',
    description: 'Three-tier pricing with toggle and feature comparison',
    category: 'Pricing',
    prompt: `Create a premium pricing section with comparison features:

DESIGN SYSTEM:
- Background: Gradient or subtle pattern
- Card style: White with shadow, rounded-2xl
- Primary color for CTAs: Indigo (#6366F1)
- Popular plan highlight: Border-2 border-indigo-500

STRUCTURE:

1. SECTION HEADER:
   - Label: "PRICING" (small, uppercase, tracking-wide)
   - Headline: "Simple, transparent pricing" (3xl, bold)
   - Subheadline: "Choose the plan that's right for you"

2. BILLING TOGGLE:
   - Monthly / Yearly switch
   - "Save 20%" badge on yearly
   - Smooth animation on toggle

3. PRICING CARDS (3 columns):

   STARTER PLAN:
   - Name: "Starter"
   - Icon: Rocket or star
   - Price: $0/month (or $0/year)
   - Description: "Perfect for individuals"
   - Feature list (5-6 items):
     * 1 user
     * 5 projects
     * Basic analytics
     * Email support
     * 1GB storage
   - CTA: "Get Started Free" (secondary button)
   - Background: Standard white

   PRO PLAN (Popular):
   - Badge: "Most Popular" (above card)
   - Name: "Professional"
   - Icon: Zap or crown
   - Price: $29/month (or $23/month billed yearly)
   - Original price struck through: $35
   - Description: "Best for growing teams"
   - Feature list (8-10 items):
     * Everything in Starter, plus:
     * 10 users
     * Unlimited projects
     * Advanced analytics
     * Priority support
     * 50GB storage
     * Custom domains
     * API access
   - CTA: "Start Free Trial" (primary, large)
   - Background: Slight indigo tint, elevated shadow
   - Scale: Slightly larger (1.02)

   ENTERPRISE PLAN:
   - Name: "Enterprise"
   - Icon: Building
   - Price: "Custom"
   - Description: "For large organizations"
   - Feature list:
     * Everything in Pro, plus:
     * Unlimited users
     * Dedicated support
     * SLA guarantee
     * Custom integrations
     * On-premise option
     * Advanced security
   - CTA: "Contact Sales" (secondary)
   - Background: White

4. COMPARISON TABLE:
   - Collapsible section: "Compare all features"
   - Full feature comparison matrix
   - Checkmarks for included features
   - "Add to Compare" functionality
   - Sticky header on scroll

5. FAQ SECTION:
   - "Frequently Asked Questions"
   - 4-5 common questions about pricing
   - Expandable accordion style
   - Questions like:
     * "Can I change plans anytime?"
     * "What payment methods do you accept?"
     * "Is there a refund policy?"

6. TRUST ELEMENTS:
   - "Trusted by 10,000+ companies"
   - Company logos (small, grayscale)
   - Security badges
   - "Cancel anytime" assurance

INTERACTIONS:
- Card hover: Lift effect (translateY -4px)
- Toggle: Animate price change
- CTA buttons: Scale on hover
- FAQ: Smooth expand/collapse

RESPONSIVE:
- Desktop: 3 cards side by side
- Tablet: 2 cards (Starter+Pro), Enterprise below
- Mobile: Stacked cards, horizontal scroll optional`,
  },

  // ============================================
  // HERO - Detailed Prompts
  // ============================================
  {
    id: 'hero-split-1',
    name: 'Split Hero Section',
    description: 'Two-column hero with text and visual',
    category: 'Hero',
    prompt: `Create a modern split hero section with compelling visuals:

DESIGN SPECIFICATIONS:
- Height: 100vh or min-height 700px
- Background: White or subtle gradient
- Layout: Two columns (60% text, 40% visual)
- Padding: Generous (py-20 to py-32)

LEFT COLUMN - Content:

1. EYEBROW TEXT:
   - Small uppercase text
   - Color: Primary brand color
   - Icon optional (checkmark, star)
   - Example: "✨ NEW FEATURE" or "TRUSTED BY 10,000+"

2. MAIN HEADLINE (H1):
   - Large: 4xl-6xl (48-72px)
   - Font weight: Bold (700)
   - Line height: Tight (1.1-1.2)
   - Max-width: 600px
   - Example: "Build faster with our platform"

3. SUBHEADLINE:
   - Size: xl (20px)
   - Color: Gray-600
   - Max-width: 550px
   - Line height: Relaxed (1.6)
   - 2-3 sentences describing value prop

4. CTA BUTTONS:
   Primary CTA:
   - Text: "Get Started Free"
   - Style: Solid primary color, large
   - Icon: Arrow right
   - Hover: Slight scale, shadow
   
   Secondary CTA:
   - Text: "Watch Demo"
   - Style: Outline or ghost
   - Icon: Play circle
   - Opens video modal

5. TRUST INDICATORS:
   - Star rating: ★★★★★ (4.9/5)
   - Review count: "From 2,000+ reviews"
   - Small avatar stack (5-6 users)
   - Text: "Join 50,000+ happy users"

6. FEATURE BULLETS (optional):
   - 3 short benefits with checkmarks
   - Horizontal or vertical list
   - Small text, gray color

RIGHT COLUMN - Visual:

1. MAIN IMAGE/ILLUSTRATION:
   - Product screenshot, 3D mockup, or illustration
   - Drop shadow for depth
   - Rounded corners (xl)
   - Subtle border

2. FLOATING ELEMENTS:
   - 2-3 decorative cards/elements
   - Positioned absolutely around main image
   - Examples:
     * Stats card: "+150% growth"
     * User card: "New signup from Sarah"
     * Badge: "#1 Rated"
   - Subtle animations (floating)

3. BACKGROUND DECORATIONS:
   - Gradient blobs (subtle)
   - Grid pattern (very light)
   - Abstract shapes

ANIMATIONS:
- Page load: Staggered fade-in
   * Eyebrow → Headline → Subheadline → CTAs → Trust → Image
- Image: Subtle floating animation
- Buttons: Hover scale effect
- Decorative elements: Gentle pulse or float

RESPONSIVE:
- Desktop: Side by side
- Tablet: Stacked, image first or text first
- Mobile: Single column, reduced text size
- Touch: Larger tap targets

ACCESSIBILITY:
- Proper heading hierarchy (H1)
- Alt text on images
- Sufficient color contrast
- Keyboard accessible CTAs`,
  },

  // ============================================
  // CARDS - Detailed Prompts
  // ============================================
  {
    id: 'card-pricing-1',
    name: 'Feature Cards Grid',
    description: 'Grid of feature cards with icons and descriptions',
    category: 'Cards',
    prompt: `Create a grid of feature cards for showcasing product features:

DESIGN SPECIFICATIONS:
- Layout: Grid (3 columns desktop, 2 tablet, 1 mobile)
- Gap: 24-32px
- Container: Max-width 1200px, centered

CARD DESIGN:
- Background: White
- Border: 1px solid gray-200
- Border radius: xl (16px)
- Padding: p-6 or p-8
- Shadow: shadow-sm (increase on hover)
- Hover: translateY(-4px), shadow-md

EACH CARD CONTAINS:

1. ICON CONTAINER:
   - Size: 48px or 56px
   - Background: Light tint of brand color (e.g., bg-indigo-100)
   - Border radius: lg or xl
   - Icon: Lucide icon, 24px, brand color
   - Optional: Gradient background

2. CARD TITLE:
   - Text: Feature name
   - Size: lg (18px) or xl (20px)
   - Weight: Semibold (600)
   - Color: Gray-900
   - Margin top: 16-20px

3. DESCRIPTION:
   - Text: 2-3 sentences
   - Size: Base (16px) or sm (14px)
   - Color: Gray-600
   - Line height: Relaxed (1.6)
   - Margin top: 8-12px

4. LINK (optional):
   - Text: "Learn more →"
   - Color: Brand color
   - Weight: Medium
   - Margin top: 16px
   - Hover: Underline

GRID LAYOUT:
- 6 cards in 2 rows of 3
- Equal heights (flexbox or grid)
- Consistent spacing

EXAMPLE FEATURES:
1. Lightning Fast - "Optimized performance..."
2. Secure by Default - "Enterprise-grade security..."
3. Easy Integration - "Works with your stack..."
4. 24/7 Support - "Always here to help..."
5. Analytics - "Track everything..."
6. Scalable - "Grows with you..."

ANIMATIONS:
- Scroll reveal: Fade in up on viewport enter
- Stagger: 0.1s delay between cards
- Hover: Smooth transition (300ms)

RESPONSIVE:
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column, full width`,
  },

  // ============================================
  // FORMS - Detailed Prompts
  // ============================================
  {
    id: 'form-contact-1',
    name: 'Contact Form with Validation',
    description: 'Professional contact form with validation states',
    category: 'Forms',
    prompt: `Create a professional contact form with validation:

DESIGN SPECIFICATIONS:
- Max-width: 600px
- Background: White or light gray card
- Padding: p-8
- Border radius: xl
- Shadow: shadow-lg

FORM FIELDS:

1. NAME FIELD:
   - Label: "Full Name" (required indicator *)
   - Input: Text
   - Placeholder: "John Doe"
   - Icon: User (optional)
   - Validation: Required, min 2 chars
   - Error: "Please enter your name"

2. EMAIL FIELD:
   - Label: "Email Address" *
   - Input: Email type
   - Placeholder: "john@example.com"
   - Icon: Mail
   - Validation: Required, valid email format
   - Error: "Please enter a valid email"

3. SUBJECT FIELD:
   - Label: "Subject" *
   - Input: Select dropdown
   - Options: General, Support, Sales, Partnership, Other
   - Default: "Select a subject"

4. MESSAGE FIELD:
   - Label: "Message" *
   - Textarea
   - Rows: 5
   - Placeholder: "How can we help you?"
   - Character counter: "0/1000"
   - Validation: Required, min 10 chars, max 1000
   - Error: "Message must be at least 10 characters"

5. CHECKBOX:
   - Label: "I agree to the Privacy Policy"
   - Link to policy
   - Required

6. SUBMIT BUTTON:
   - Text: "Send Message"
   - Style: Primary color, full-width, large
   - States:
     * Default
     * Hover
     * Loading (spinner)
     * Success (checkmark)
   - Disabled until form valid

VALIDATION FEATURES:
- Real-time validation on blur
- Inline error messages below fields
- Error styling: Red border, red text
- Success styling: Green checkmark
- Shake animation on error submit

ACCESSIBILITY:
- Proper label associations (for/id)
- ARIA labels
- Error announcements (aria-live)
- Focus management
- Keyboard navigation

RESPONSIVE:
- Full width on mobile
- Comfortable spacing
- Touch-friendly inputs`,
  },

  // ============================================
  // FOOTER - Detailed Prompts
  // ============================================
  {
    id: 'footer-multi-1',
    name: 'Comprehensive Footer',
    description: 'Multi-column footer with newsletter and social links',
    category: 'Footer',
    prompt: `Create a comprehensive multi-column footer:

DESIGN SPECIFICATIONS:
- Background: Dark (gray-900 or similar)
- Text: White and gray-400
- Padding: py-16
- Container: Max-width 1280px

STRUCTURE:

1. TOP SECTION (4 columns):

   COLUMN 1 - Brand:
   - Logo (white/light version)
   - Tagline: Brief company description (2-3 lines)
   - Social icons: Facebook, Twitter, LinkedIn, Instagram, GitHub
   - Icon style: 24px, gray-400, hover: white

   COLUMN 2 - Product:
   - Header: "Product" (uppercase, tracking-wide)
   - Links: Features, Pricing, Integrations, API, Changelog
   - Style: Gray-400, hover: white

   COLUMN 3 - Company:
   - Header: "Company"
   - Links: About, Blog, Careers, Press, Partners

   COLUMN 4 - Resources:
   - Header: "Resources"
   - Links: Documentation, Help Center, Community, Contact, Status

2. NEWSLETTER SECTION (full width):
   - Background: Slightly lighter than footer (gray-800)
   - Padding: p-8
   - Border radius: xl
   - Content:
     * Headline: "Stay updated"
     * Subtext: "Get the latest news and updates"
     * Email input + Subscribe button
     * Privacy note: "We respect your privacy"

3. BOTTOM BAR:
   - Border top: 1px border-gray-800
   - Padding top: pt-8
   - Flex row: space-between
   - Left: "© 2024 Company. All rights reserved."
   - Right: Links - Privacy Policy, Terms of Service, Cookies

INTERACTIONS:
- Links: Hover color change (gray-400 → white)
- Underline animation on hover (optional)
- Social icons: Scale 1.1 on hover
- Newsletter: Success message on submit

RESPONSIVE:
- Desktop: 4 columns
- Tablet: 2x2 grid
- Mobile: Stacked, single column`,
  },

  // ============================================
  // NEW TEMPLATES - Added via Request
  // ============================================
  {
    id: 'dash-social-1',
    name: 'Social Media Dashboard',
    description: 'All-in-one social media analytics and management',
    category: 'Dashboard',
    prompt: `Create a professional Social Media Analytics Dashboard:

DESIGN SYSTEM:
- Theme: Vibrant, modern, engaging
- Colors:
  * Facebook: #1877F2
  * Instagram: #E4405F
  * Twitter/X: #1DA1F2
  * LinkedIn: #0A66C2
  * Success: #10B981
  * Background: Slate-50
- Style: Clean cards, rich data visualization, active status indicators

STRUCTURE:

1. SIDEBAR:
   - Platform icons (FB, IG, TW, LI)
   - Navigation: Overview, Audience, Content, Schedule, Messages
   - Account switcher

2. KPI OVERVIEW:
   - 4 Cards showing: Total Followers, Engagement Rate, Reach, and Clicks
   - Percentage change indicators with mini trend lines

3. AUDIENCE GROWTH CHART:
   - Multi-line chart comparing growth across all platforms
   - Legend with toggle functionality

4. CONTENT PERFORMANCE TABLE:
   - List of recent posts with: Image preview, Platform icon, Engagement metrics (likes, comments, shares)
   - Status: "Performing well" or "Needs attention"

5. TOP POSTS PREVIEW:
   - Visual grid of the most successful posts (Instagram-style grid)

6. SCHEDULER WIDGET:
   - Mini calendar showing upcoming scheduled posts
   - "Next post in 2 hours" alert

7. DEMOGRAPHICS:
   - Pie charts for Age, Gender, and Top Countries

Generate a complete responsive HTML/Tailwind CSS dashboard.`,
  },
  {
    id: 'shop-marketplace-1',
    name: 'Marketplace Product Page',
    description: 'Modern marketplace listing with seller info and dynamic options',
    category: 'E-commerce',
    prompt: `Create a modern Marketplace Product Listing Page:

DESIGN SYSTEM:
- Theme: Clean, trustworthy, conversion-optimized
- Primary Color: Indigo-600
- Style: Amazon/Etsy hybrid, clear hierarchy, high-quality image focus

STRUCTURE:

1. PRODUCT GALLERY (Left):
   - Large main image + thumbnail strip
   - "Verified Product" badge

2. PRODUCT INFO (Right):
   - Title, Rating (4.9/5), and Category
   - Price: $299.00 + "Free Delivery"
   - Seller Card: Name, Rating, Level (e.g., "Top Rated Seller")

3. SELECTION OPTIONS:
   - Color swatches, Size buttons, and Quantity selector

4. ACTION BUTTONS:
   - "Add to Cart" (solid) and "Buy Now" (outline)
   - "Add to Wishlist" heart icon

5. PRODUCT DESCRIPTION:
   - Key features with icons
   - Detailed specifications table

6. SELLER REVIEWS:
   - Customer photos grid
   - Individual reviews with "Helpful" voting

7. RELATED ITEMS:
   - "Other products from this seller"
   - "Customers also viewed" carousel

Generate a complete production-ready HTML/Tailwind CSS page.`,
  },
];

export const getTemplatesByCategory = (category: string): ComponentTemplate[] => {
  if (category === 'All') return componentTemplates;
  return componentTemplates.filter(t => t.category === category);
};

export const getTemplateById = (id: string): ComponentTemplate | undefined => {
  return componentTemplates.find(t => t.id === id);
};
