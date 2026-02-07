import { backendGeneratorService } from './backendGeneratorService';

export type AppType = 'saas' | 'blog' | 'ecommerce' | 'dashboard' | 'portfolio' | 'crm' | 'chat' | 'cms' | 'custom';
export type AppFramework = 'react-vite' | 'nextjs' | 'remix' | 'astro';

export interface AppSpec {
  name: string;
  type: AppType;
  description: string;
  features: string[];
  pages: string[];
  database: 'postgresql' | 'mysql' | 'mongodb' | 'supabase' | 'none';
  auth: boolean;
  ui: 'tailwind' | 'shadcn' | 'material' | 'chakra';
  deployment: 'vercel' | 'netlify' | 'railway' | 'render' | 'none';
}

export interface GeneratedApp {
  frontend: Record<string, string>;
  backend: Record<string, string>;
  config: {
    packageJson: string;
    tailwindConfig?: string;
    tsConfig?: string;
    envExample: string;
    readme: string;
    dockerfile?: string;
  };
  deployment: {
    vercel?: Record<string, string>;
    netlify?: Record<string, string>;
  };
}

class FullstackGeneratorService {
  private appTemplates: Record<AppType, AppSpec> = {
    saas: {
      name: 'SaaS Application',
      type: 'saas',
      description: 'Full-featured SaaS with authentication, dashboard, and billing',
      features: ['Authentication', 'Dashboard', 'User Management', 'Settings', 'Billing', 'API Routes'],
      pages: ['Landing', 'Login', 'Register', 'Dashboard', 'Settings', 'Pricing'],
      database: 'postgresql',
      auth: true,
      ui: 'tailwind',
      deployment: 'vercel'
    },
    blog: {
      name: 'Blog Platform',
      type: 'blog',
      description: 'Content management system with posts, categories, and comments',
      features: ['Posts', 'Categories', 'Comments', 'Search', 'Tags', 'RSS Feed'],
      pages: ['Home', 'Blog', 'Post Detail', 'About', 'Contact', 'Categories'],
      database: 'postgresql',
      auth: false,
      ui: 'tailwind',
      deployment: 'vercel'
    },
    ecommerce: {
      name: 'E-commerce Store',
      type: 'ecommerce',
      description: 'Online store with products, cart, checkout, and payments',
      features: ['Products', 'Cart', 'Checkout', 'Payments', 'Orders', 'Inventory'],
      pages: ['Home', 'Shop', 'Product Detail', 'Cart', 'Checkout', 'Account'],
      database: 'postgresql',
      auth: true,
      ui: 'tailwind',
      deployment: 'vercel'
    },
    dashboard: {
      name: 'Admin Dashboard',
      type: 'dashboard',
      description: 'Analytics dashboard with charts, tables, and reports',
      features: ['Analytics', 'Charts', 'Tables', 'Reports', 'Export', 'Real-time Data'],
      pages: ['Dashboard', 'Analytics', 'Users', 'Settings', 'Reports', 'Activity'],
      database: 'postgresql',
      auth: true,
      ui: 'shadcn',
      deployment: 'vercel'
    },
    portfolio: {
      name: 'Portfolio Website',
      type: 'portfolio',
      description: 'Personal portfolio with projects, skills, and contact',
      features: ['Projects', 'Skills', 'Timeline', 'Contact Form', 'Resume', 'Testimonials'],
      pages: ['Home', 'About', 'Projects', 'Blog', 'Contact', 'Resume'],
      database: 'none',
      auth: false,
      ui: 'tailwind',
      deployment: 'netlify'
    },
    crm: {
      name: 'CRM System',
      type: 'crm',
      description: 'Customer relationship management with contacts, deals, and tasks',
      features: ['Contacts', 'Deals', 'Tasks', 'Notes', 'Pipeline', 'Reports'],
      pages: ['Dashboard', 'Contacts', 'Deals', 'Tasks', 'Calendar', 'Reports'],
      database: 'postgresql',
      auth: true,
      ui: 'shadcn',
      deployment: 'vercel'
    },
    chat: {
      name: 'Chat Application',
      type: 'chat',
      description: 'Real-time messaging with channels, DMs, and notifications',
      features: ['Real-time Chat', 'Channels', 'Direct Messages', 'File Sharing', 'Notifications', 'Online Status'],
      pages: ['Login', 'Chat', 'Channels', 'Direct Messages', 'Settings', 'Profile'],
      database: 'mongodb',
      auth: true,
      ui: 'tailwind',
      deployment: 'railway'
    },
    cms: {
      name: 'Content Management',
      type: 'cms',
      description: 'Headless CMS with content types, media library, and API',
      features: ['Content Types', 'Media Library', 'API', 'Users', 'Roles', 'Versioning'],
      pages: ['Admin', 'Content', 'Media', 'Users', 'Settings', 'API Docs'],
      database: 'postgresql',
      auth: true,
      ui: 'shadcn',
      deployment: 'railway'
    },
    custom: {
      name: 'Custom Application',
      type: 'custom',
      description: 'Build your own custom application',
      features: [],
      pages: [],
      database: 'postgresql',
      auth: true,
      ui: 'tailwind',
      deployment: 'vercel'
    }
  };

  async generateApp(spec: AppSpec): Promise<GeneratedApp> {
    const frontend = this.generateFrontend(spec);
    const backend = spec.database !== 'none' ? this.generateBackend(spec) : {};
    const config = this.generateConfig(spec);
    const deployment = this.generateDeploymentConfig(spec);

    return { frontend, backend, config, deployment };
  }

  private generateFrontend(spec: AppSpec): Record<string, string> {
    const files: Record<string, string> = {};

    switch (spec.ui) {
      case 'shadcn':
        return this.generateShadcnFrontend(spec, files);
      default:
        return this.generateTailwindFrontend(spec, files);
    }
  }

  private generateTailwindFrontend(spec: AppSpec, files: Record<string, string>): Record<string, string> {
    files['index.html'] = this.generateIndexHtml(spec);
    files['src/main.tsx'] = this.generateMainTsx();
    files['src/App.tsx'] = this.generateAppTsx(spec);
    files['src/index.css'] = this.generateTailwindCss();
    files['src/lib/utils.ts'] = this.generateUtils();
    files['tailwind.config.js'] = this.generateTailwindConfig();
    files['postcss.config.js'] = this.generatePostcssConfig();

    spec.pages.forEach(page => {
      files[`src/pages/${page.replace(/\s+/g, '')}.tsx`] = this.generatePage(spec, page);
    });

    if (spec.auth) {
      files['src/context/AuthContext.tsx'] = this.generateAuthContext();
      files['src/pages/LoginPage.tsx'] = this.generateLoginPage();
      files['src/pages/RegisterPage.tsx'] = this.generateRegisterPage();
    }

    if (spec.type === 'dashboard' || spec.type === 'crm') {
      files['src/components/Layout.tsx'] = this.generateDashboardLayout();
      files['src/components/Sidebar.tsx'] = this.generateSidebar();
      files['src/components/Header.tsx'] = this.generateHeader();
    }

    return files;
  }

  private generateShadcnFrontend(spec: AppSpec, files: Record<string, string>): Record<string, string> {
    files['index.html'] = this.generateIndexHtml(spec);
    files['src/main.tsx'] = this.generateMainTsx();
    files['src/App.tsx'] = this.generateAppTsx(spec);
    files['src/index.css'] = this.generateShadcnCss();
    files['src/lib/utils.ts'] = this.generateUtils();
    files['tailwind.config.js'] = this.generateShadcnTailwindConfig();
    files['components.json'] = this.generateComponentsJson();

    return files;
  }

  private generateIndexHtml(spec: AppSpec): string {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${spec.name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  }

  private generateMainTsx(): string {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
  }

  private generateAppTsx(spec: AppSpec): string {
    const imports = spec.pages.map(p =>
      `import ${p.replace(/\s+/g, '')}Page from './pages/${p.replace(/\s+/g, '')}Page';`
    ).join('\n');

    const routes = spec.pages.map(p => {
      const path = p.toLowerCase().replace(/\s+/g, '-');
      return `    <Route path="/${path}" element={<${p.replace(/\s+/g, '')}Page />} />`;
    }).join('\n');

    return `import { BrowserRouter, Routes, Route } from 'react-router-dom';
${imports}
${spec.auth ? "import { AuthProvider } from './context/AuthContext' : '';" : ''}

function App() {
  return (
    <BrowserRouter>
      ${spec.auth ? '<AuthProvider>' : ''}
      <Routes>
        ${routes}
        ${spec.auth ? `
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />` : ''}
      </Routes>
      ${spec.auth ? '</AuthProvider>' : ''}
    </BrowserRouter>
  );
}

export default App;`;
  }

  private generateTailwindCss(): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #6366f1;
  --primary-foreground: #ffffff;
  --secondary: #f1f5f9;
  --secondary-foreground: #0f172a;
  --accent: #f1f5f9;
  --accent-foreground: #0f172a;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --card: #ffffff;
  --card-foreground: #0f172a;
  --border: #e2e8f0;
  --ring: #6366f1;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: #f8fafc;
  color: #0f172a;
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none;
  }

  .btn-primary {
    @apply btn bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
  }

  .btn-secondary {
    @apply btn bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500;
  }

  .btn-outline {
    @apply btn border border-slate-200 bg-transparent hover:bg-slate-100 focus:ring-slate-500;
  }

  .card {
    @apply bg-white rounded-xl border border-slate-200 shadow-sm;
  }

  .input {
    @apply flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50;
  }
}`;
  }

  private generateShadcnCss(): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 239 84% 67%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 239 84% 67%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;
  }

  private generateUtils(): string {
    return `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}`;
  }

  private generateTailwindConfig(): string {
    return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}`;
  }

  private generateShadcnTailwindConfig(): string {
    return `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}`;
  }

  private generateComponentsJson(): string {
    return `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}`;
  }

  private generatePostcssConfig(): string {
    return `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
  }

  private generatePage(spec: AppSpec, page: string): string {
    const pageName = page.replace(/\s+/g, '');
    const pageLower = page.toLowerCase().replace(/\s+/g, '-');

    if (page === 'Landing' || page === 'Home') {
      return `import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ${pageName}Page() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              ${spec.description}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Build better ${spec.type} applications faster with our modern platform.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="btn-primary">
                Get Started Free
              </Link>
              <Link to="/demo" className="btn-outline">
                Watch Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {spec.features.slice(0, 6).map((feature, index) => (
                <div key={index} className="card p-6">
                  <h3 className="text-xl font-semibold mb-2">{feature}</h3>
                  <p className="text-gray-600">
                    Professional {feature.toLowerCase()} functionality built right in.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of developers building amazing applications.
            </p>
            <Link to="/register" className="btn-primary">
              Start Building Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}`;
    }

    if (page === 'Dashboard' || page === 'Admin') {
      return `import Layout from '../components/Layout';

export default function ${pageName}Page() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">${page} Overview</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-sm text-gray-500 uppercase tracking-wide">Total Users</h3>
            <p className="text-3xl font-bold mt-2">1,234</p>
            <span className="text-green-600 text-sm">+12% from last month</span>
          </div>
          <div className="card p-6">
            <h3 className="text-sm text-gray-500 uppercase tracking-wide">Revenue</h3>
            <p className="text-3xl font-bold mt-2">$45,678</p>
            <span className="text-green-600 text-sm">+8% from last month</span>
          </div>
          <div className="card p-6">
            <h3 className="text-sm text-gray-500 uppercase tracking-wide">Orders</h3>
            <p className="text-3xl font-bold mt-2">567</p>
            <span className="text-green-600 text-sm">+23% from last month</span>
          </div>
          <div className="card p-6">
            <h3 className="text-sm text-gray-500 uppercase tracking-wide">Conversion</h3>
            <p className="text-3xl font-bold mt-2">3.2%</p>
            <span className="text-red-600 text-sm">-2% from last month</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">U{i}</span>
                  </div>
                  <div>
                    <p className="font-medium">User {i} performed an action</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}`;
    }

    return `export default function ${pageName}Page() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">{page}</h1>
      <div className="card p-6">
        <p className="text-gray-600">
          ${page} page for ${spec.name}.
        </p>
      </div>
    </div>
  );
}`;
  }

  private generateAuthContext(): string {
    return `import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Login failed');
    const { token, user } = await response.json();
    localStorage.setItem('token', token);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!response.ok) throw new Error('Registration failed');
    const { token, user } = await response.json();
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}`;
  }

  private generateLoginPage(): string {
    return `import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Sign In
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Don't have an account? <Link to="/register" className="text-indigo-600">Sign up</Link>
        </p>
      </div>
    </div>
  );
}`;
  }

  private generateRegisterPage(): string {
    return `import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Create Account
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Already have an account? <Link to="/login" className="text-indigo-600">Sign in</Link>
        </p>
      </div>
    </div>
  );
}`;
  }

  private generateDashboardLayout(): string {
    return `import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}`;
  }

  private generateSidebar(): string {
    return `import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Users', href: '/users' },
  { name: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-indigo-600">NOIR</h1>
      </div>
      <nav className="px-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'block px-4 py-2 rounded-lg mb-1 text-sm font-medium',
              location.pathname === item.href
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}`;
  }

  private generateHeader(): string {
    return `import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <input
          type="search"
          placeholder="Search..."
          className="input w-64"
        />
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <span className="sr-only">Notifications</span>
            🔔
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 text-sm font-medium">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}`;
  }

  private async generateBackend(spec: AppSpec): Promise<Record<string, string>> {
    const backendProject = {
      name: spec.name.toLowerCase().replace(/\s+/g, '-'),
      framework: 'express' as const,
      database: spec.database as 'postgresql' | 'mysql' | 'mongodb' | 'supabase',
      tables: this.generateTablesForApp(spec),
      endpoints: this.generateEndpointsForApp(spec),
      authentication: spec.auth,
      port: 3000
    };

    const result = await backendGeneratorService.generateBackend(backendProject);
    return result.files;
  }

  private generateTablesForApp(spec: AppSpec): any[] {
    const tables: any[] = [];

    if (spec.auth) {
      tables.push({
        id: 'users',
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', primary: true },
          { name: 'email', type: 'string', unique: true, nullable: false },
          { name: 'password', type: 'string', nullable: false },
          { name: 'name', type: 'string' },
          { name: 'role', type: 'string', default: 'user' },
          { name: 'created_at', type: 'timestamp' },
          { name: 'updated_at', type: 'timestamp' }
        ]
      });
    }

    switch (spec.type) {
      case 'blog':
        tables.push(
          {
            id: 'posts',
            name: 'posts',
            columns: [
              { name: 'id', type: 'uuid', primary: true },
              { name: 'title', type: 'string', nullable: false },
              { name: 'slug', type: 'string', unique: true },
              { name: 'content', type: 'text' },
              { name: 'excerpt', type: 'text' },
              { name: 'author_id', type: 'uuid' },
              { name: 'status', type: 'string', default: 'draft' },
              { name: 'published_at', type: 'timestamp' },
              { name: 'created_at', type: 'timestamp' }
            ]
          },
          {
            id: 'categories',
            name: 'categories',
            columns: [
              { name: 'id', type: 'uuid', primary: true },
              { name: 'name', type: 'string', nullable: false },
              { name: 'slug', type: 'string', unique: true }
            ]
          }
        );
        break;
      case 'ecommerce':
        tables.push(
          {
            id: 'products',
            name: 'products',
            columns: [
              { name: 'id', type: 'uuid', primary: true },
              { name: 'name', type: 'string', nullable: false },
              { name: 'description', type: 'text' },
              { name: 'price', type: 'decimal', nullable: false },
              { name: 'image', type: 'string' },
              { name: 'stock', type: 'integer', default: 0 },
              { name: 'category_id', type: 'uuid' },
              { name: 'created_at', type: 'timestamp' }
            ]
          },
          {
            id: 'orders',
            name: 'orders',
            columns: [
              { name: 'id', type: 'uuid', primary: true },
              { name: 'user_id', type: 'uuid', nullable: false },
              { name: 'total', type: 'decimal', nullable: false },
              { name: 'status', type: 'string', default: 'pending' },
              { name: 'shipping_address', type: 'text' },
              { name: 'created_at', type: 'timestamp' }
            ]
          }
        );
        break;
      case 'saas':
        tables.push(
          {
            id: 'subscriptions',
            name: 'subscriptions',
            columns: [
              { name: 'id', type: 'uuid', primary: true },
              { name: 'user_id', type: 'uuid', nullable: false },
              { name: 'plan', type: 'string', nullable: false },
              { name: 'status', type: 'string', default: 'active' },
              { name: 'current_period_end', type: 'timestamp' },
              { name: 'created_at', type: 'timestamp' }
            ]
          },
          {
            id: 'workspaces',
            name: 'workspaces',
            columns: [
              { name: 'id', type: 'uuid', primary: true },
              { name: 'name', type: 'string', nullable: false },
              { name: 'owner_id', type: 'uuid', nullable: false },
              { name: 'created_at', type: 'timestamp' }
            ]
          }
        );
        break;
    }

    return tables;
  }

  private generateEndpointsForApp(spec: AppSpec): any[] {
    const endpoints: any[] = [];

    if (spec.auth) {
      endpoints.push(
        { id: 'auth-register', path: '/api/auth/register', method: 'POST', name: 'Register', authentication: false },
        { id: 'auth-login', path: '/api/auth/login', method: 'POST', name: 'Login', authentication: false },
        { id: 'auth-me', path: '/api/auth/me', method: 'GET', name: 'Get Current User', authentication: true },
        { id: 'auth-logout', path: '/api/auth/logout', method: 'POST', name: 'Logout', authentication: true }
      );
    }

    switch (spec.type) {
      case 'blog':
        endpoints.push(
          { id: 'posts-list', path: '/api/posts', method: 'GET', name: 'List Posts' },
          { id: 'posts-create', path: '/api/posts', method: 'POST', name: 'Create Post', authentication: true },
          { id: 'posts-detail', path: '/api/posts/:id', method: 'GET', name: 'Get Post' },
          { id: 'posts-update', path: '/api/posts/:id', method: 'PUT', name: 'Update Post', authentication: true },
          { id: 'posts-delete', path: '/api/posts/:id', method: 'DELETE', name: 'Delete Post', authentication: true },
          { id: 'categories-list', path: '/api/categories', method: 'GET', name: 'List Categories' }
        );
        break;
      case 'ecommerce':
        endpoints.push(
          { id: 'products-list', path: '/api/products', method: 'GET', name: 'List Products' },
          { id: 'products-create', path: '/api/products', method: 'POST', name: 'Create Product', authentication: true },
          { id: 'products-detail', path: '/api/products/:id', method: 'GET', name: 'Get Product' },
          { id: 'orders-list', path: '/api/orders', method: 'GET', name: 'List Orders', authentication: true },
          { id: 'orders-create', path: '/api/orders', method: 'POST', name: 'Create Order', authentication: true },
          { id: 'orders-detail', path: '/api/orders/:id', method: 'GET', name: 'Get Order', authentication: true }
        );
        break;
      case 'saas':
        endpoints.push(
          { id: 'workspaces-list', path: '/api/workspaces', method: 'GET', name: 'List Workspaces', authentication: true },
          { id: 'workspaces-create', path: '/api/workspaces', method: 'POST', name: 'Create Workspace', authentication: true },
          { id: 'subscriptions-list', path: '/api/subscriptions', method: 'GET', name: 'List Subscriptions', authentication: true },
          { id: 'subscriptions-create', path: '/api/subscriptions', method: 'POST', name: 'Create Subscription', authentication: true }
        );
        break;
    }

    return endpoints;
  }

  private generateConfig(spec: AppSpec): Record<string, any> {
    const packageJson = {
      name: spec.name.toLowerCase().replace(/\s+/g, '-'),
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        lint: 'eslint .',
        preview: 'vite preview',
        ...(spec.database !== 'none' && { server: 'node server/index.js' })
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-router-dom': '^6.20.0',
        ...(spec.auth && { '@supabase/supabase-js': '^2.39.0' })
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        '@vitejs/plugin-react': '^4.2.0',
        autoprefixer: '^10.4.16',
        postcss: '^8.4.32',
        tailwindcss: '^3.4.0',
        typescript: '^5.3.0',
        vite: '^5.0.0',
        ...(spec.ui === 'shadcn' && { 'tailwindcss-animate': '^0.0.1' })
      }
    };

    const envExample = `# Server
PORT=3000
NODE_ENV=development

${spec.database !== 'none' ? `# Database
${spec.database === 'mongodb' ? 'MONGODB_URI=mongodb://localhost:27017/app' : `DB_HOST=localhost
DB_PORT=5432
DB_NAME=${spec.name.toLowerCase().replace(/\s+/g, '_')}
DB_USER=postgres
DB_PASSWORD=your_password`}
` : ''}${spec.auth ? `# Authentication
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d
` : ''}
# API
VITE_API_URL=http://localhost:3000
`;

    const readme = `# ${spec.name}

${spec.description}

## Features

${spec.features.map(f => `- ${f}`).join('\n')}

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

### Build

\`\`\`bash
npm run build
\`\`\`

## Tech Stack

- Frontend: React + Vite + TypeScript + TailwindCSS
${spec.database !== 'none' ? `- Backend: Express + ${spec.database.charAt(0).toUpperCase() + spec.database.slice(1)}` : ''}
- Deployment: ${spec.deployment.charAt(0).toUpperCase() + spec.deployment.slice(1)}
`;

    return {
      packageJson: JSON.stringify(packageJson, null, 2),
      envExample,
      readme,
      dockerfile: spec.database !== 'none' ? this.generateDockerfile(spec) : undefined
    };
  }

  private generateDockerfile(spec: AppSpec): string {
    return `FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
${spec.database !== 'none' ? '' : 'RUN npm run build'}

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
${spec.database !== 'none' ? '' : ''}

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

${spec.database !== 'none' ? `COPY --from=builder /app/server ./server
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package-lock.json .

RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "run", "server"]` : ''}

${spec.database === 'none' ? `EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host"]` : ''}
`;
  }

  private generateDeploymentConfig(spec: AppSpec): Record<string, any> {
    const deployment: Record<string, any> = {};

    if (spec.deployment === 'vercel') {
      deployment.vercel = {
        'vercel.json': JSON.stringify({
          buildCommand: 'npm run build',
          outputDirectory: 'dist',
          framework: 'vite',
          env: ['VITE_API_URL']
        }, null, 2),
        '.vercelignore': `node_modules
dist
.env
*.log
.DS_Store`
      };
    }

    if (spec.deployment === 'netlify') {
      deployment.netlify = {
        'netlify.toml': `[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`
      };
    }

    return deployment;
  }

  async generateFromPrompt(prompt: string): Promise<AppSpec> {
    const response = await fetch('https://api.apifree.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk-pwRrxPfrtYG9j04Es3408CfdN0pp0`
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: `You are an AI app architect. Analyze the user's description and create an app specification.
            
Output JSON format:
{
  "type": "saas|blog|ecommerce|dashboard|portfolio|crm|chat|cms|custom",
  "name": "App Name",
  "description": "Brief description",
  "features": ["feature1", "feature2", ...],
  "pages": ["page1", "page2", ...],
  "database": "postgresql|mysql|mongodb|none",
  "auth": true|false,
  "ui": "tailwind|shadcn",
  "deployment": "vercel|netlify|railway|render|none"
}`
          },
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    return {
      name: content.name || 'My App',
      type: content.type || 'custom',
      description: content.description || '',
      features: content.features || [],
      pages: content.pages || ['Home', 'About'],
      database: content.database || 'postgresql',
      auth: content.auth !== false,
      ui: content.ui || 'tailwind',
      deployment: content.deployment || 'vercel'
    };
  }
}

export const fullstackGeneratorService = new FullstackGeneratorService();
