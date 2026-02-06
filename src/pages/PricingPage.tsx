import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, CreditCard, Loader2, Check, X } from 'lucide-react';
import xenditService, { type XenditPlan } from '../lib/xenditService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: XenditPlan | null;
  userEmail: string;
  userName: string;
}

const PaymentModal = ({ isOpen, onClose, plan, userEmail, userName }: PaymentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !plan) return null;

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await xenditService.createInvoice(plan.id, userEmail, userName);
      if (response.invoiceUrl) {
        window.open(response.invoiceUrl, '_blank', 'width=500,height=700');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#25f46a]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="text-[#25f46a]" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Subscribe to {plan.name}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {plan.description}
          </p>
        </div>

        <div className="bg-slate-100 dark:bg-[#252525] rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">{plan.name}</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              Rp {plan.priceIdr}
              <span className="text-sm font-normal text-slate-500">/{plan.interval.toLowerCase()}</span>
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-lg border border-slate-200 dark:border-white/20 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-lg bg-[#25f46a] text-[#0a0a0a] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#25f46a]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={20} />
                Pay with Xendit
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Check size={14} className="text-[#25f46a]" />
          <span>Secure payment via Xendit</span>
        </div>
      </div>
    </div>
  );
};

export const PricingPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<XenditPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleSubscribe = (plan: XenditPlan) => {
    if (!user) {
      navigate('/register');
      return;
    }
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  return (
    <div className="bg-[#f5f8f6] dark:bg-[#0a0a0a] min-h-screen font-display text-slate-900 dark:text-white transition-colors duration-300 dark">
      <style>{`
        .tech-grid {
          background-image: radial-gradient(circle at 1px 1px, #1a2e20 1px, transparent 0);
          background-size: 40px 40px;
        }
        .pro-glow {
          box-shadow: 0 0 30px rgba(37, 244, 106, 0.25);
        }
      `}</style>
      <div className="relative min-h-screen flex flex-col overflow-x-hidden tech-grid">
        <header className="w-full border-b border-solid border-slate-200 dark:border-white/10 px-6 lg:px-20 py-4 flex items-center justify-between bg-[#f5f8f6]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-3">
            <div className="text-[#25f46a]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Noir Code</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            <Link className="text-sm font-medium hover:text-[#25f46a] transition-colors" to="/how-it-works">How it Works</Link>
            <a className="text-sm font-medium hover:text-[#25f46a] transition-colors" href="#">Features</a>
            <a className="text-sm font-medium hover:text-[#25f46a] transition-colors" href="#">Docs</a>
          </nav>
          <div className="flex gap-3 items-center">
            {user ? (
              <>
                <Link to="/projects" className="flex items-center justify-center size-9 rounded-full bg-white/5 border border-white/10 hover:bg-[#25f46a]/20 hover:border-[#25f46a]/50 hover:text-[#25f46a] text-white/80 transition-all" title="My Projects">
                  <User size={18} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white/80 bg-white/5 border border-white/10 rounded-lg hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-all"
                >
                  Log out
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:flex h-10 px-5 items-center justify-center rounded-lg border border-slate-300 dark:border-white/20 text-sm font-bold hover:bg-white/5 transition-all text-slate-900 dark:text-white">
                  Log in
                </Link>
                <Link to="/register" className="h-10 px-5 items-center justify-center rounded-lg bg-[#25f46a] text-[#0a0a0a] text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-[#25f46a]/20">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center py-16 px-6 lg:px-20">
          <div className="max-w-4xl w-full text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25f46a]/10 border border-[#25f46a]/20 text-[#25f46a] text-xs font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25f46a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25f46a]"></span>
              </span>
              Updated Pricing
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight mb-6 text-slate-900 dark:text-white">
              Build Faster for <span className="text-[#25f46a]">Less</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
              The most powerful screenshot-to-code engine is now even more accessible. Start for free, upgrade as you grow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full items-stretch">
            <div className="flex flex-col gap-8 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#121212] p-8 transition-transform hover:-translate-y-1">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">Free</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tight">$0</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">/month</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Perfect for exploration and hobbyists.</p>
              </div>
              <Link
                to={user ? "/projects" : "/register"}
                className="w-full h-12 rounded-lg border-2 border-slate-200 dark:border-white/20 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-900 dark:text-white flex items-center justify-center"
              >
                Start Coding
              </Link>
              <div className="flex flex-col gap-4">
                <div className="flex gap-3 text-sm items-center">
                  <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                  5 code generations / mo
                </div>
                <div className="flex gap-3 text-sm items-center">
                  <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                  React & Tailwind output
                </div>
                <div className="flex gap-3 text-sm items-center">
                  <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                  Standard speed
                </div>
                <div className="flex gap-3 text-sm items-center">
                  <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                  Community support
                </div>
              </div>
            </div>
            <div className="relative flex flex-col gap-8 rounded-xl border-2 border-[#25f46a] bg-white dark:bg-[#161616] p-8 pro-glow transform md:scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#25f46a] text-[#0a0a0a] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                Most Popular
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tight">Rp 50.000</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">/month</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Our most affordable professional tier.</p>
              </div>
              <button
                onClick={() => handleSubscribe({ id: 'pro', name: 'Pro', price: 50000, currency: 'IDR', interval: 'MONTH', description: 'Unlimited generations, priority AI processing, all frameworks', priceIdr: '50.000' })}
                className="w-full h-12 rounded-lg bg-[#25f46a] text-[#0a0a0a] font-bold hover:brightness-110 transition-all shadow-xl shadow-[#25f46a]/20 flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Go Pro Now
              </button>
              <div className="flex flex-col gap-4">
                <div className="flex gap-3 text-sm items-center font-bold">
                  <span className="material-symbols-outlined text-[#25f46a] text-[20px] font-bold">check_circle</span>
                  Unlimited generations
                </div>
                <div className="flex gap-3 text-sm items-center font-medium">
                  <span className="material-symbols-outlined text-[#25f46a] text-[20px] font-bold">check_circle</span>
                  Priority AI processing
                </div>
                <div className="flex gap-3 text-sm items-center font-medium">
                  <span className="material-symbols-outlined text-[#25f46a] text-[20px] font-bold">check_circle</span>
                  All frameworks (Vue, Svelte, etc.)
                </div>
                <div className="flex gap-3 text-sm items-center font-medium">
                  <span className="material-symbols-outlined text-[#25f46a] text-[20px] font-bold">check_circle</span>
                  Advanced component logic
                </div>
                <div className="flex gap-3 text-sm items-center font-medium">
                  <span className="material-symbols-outlined text-[#25f46a] text-[20px] font-bold">check_circle</span>
                  Early access to beta features
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#121212] p-8 transition-transform hover:-translate-y-1">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">Enterprise</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tight">Rp 500rb</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">/month</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Scale with confidence and team controls.</p>
              </div>
              <button
                onClick={() => handleSubscribe({ id: 'enterprise', name: 'Enterprise', price: 500000, currency: 'IDR', interval: 'MONTH', description: 'Team management, SSO, dedicated account manager', priceIdr: '500.000' })}
                className="w-full h-12 rounded-lg border-2 border-slate-200 dark:border-white/20 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-900 dark:text-white flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Contact Sales
              </button>
              <div className="flex flex-col gap-4">
                <div className="flex gap-3 text-sm items-center">
                  <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                  Team management
                </div>
                <div className="flex gap-3 text-sm items-center">
                  <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                  SSO & SAML
                </div>
                <div className="flex gap-3 text-sm items-center">
                  <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                  Dedicated account manager
                </div>
                <div className="flex gap-3 text-sm items-center">
                  <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                  Custom API limits
                </div>
                <div className="flex gap-3 text-sm items-center">
                  <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                  Enterprise SLA
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-4xl w-full mt-32 mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-center text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl w-full flex flex-col gap-3">
            <details className="group bg-white/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
              <summary className="flex cursor-pointer items-center justify-between p-5 list-none text-slate-900 dark:text-white">
                <span className="font-bold">What's the difference between Free and Pro?</span>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                The Free plan allows for 5 generations per month and is limited to React/Tailwind exports. The Pro plan at just Rp 50.000/month gives you unlimited generations, priority processing, and access to all supported frameworks like Vue and Svelte.
              </div>
            </details>
            <details className="group bg-white/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
              <summary className="flex cursor-pointer items-center justify-between p-5 list-none text-slate-900 dark:text-white">
                <span className="font-bold">How accurate is the code generation?</span>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Our proprietary AI model is trained specifically on UI design patterns. It captures spacing, typography, and component structures with roughly 95% accuracy, requiring only minor functional tweaks.
              </div>
            </details>
            <details className="group bg-white/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
              <summary className="flex cursor-pointer items-center justify-between p-5 list-none text-slate-900 dark:text-white">
                <span className="font-bold">Can I cancel my subscription at any time?</span>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Yes, you can cancel your subscription at any time through your dashboard. You will continue to have access to your plan until the end of your current billing period.
              </div>
            </details>
            <details className="group bg-white/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
              <summary className="flex cursor-pointer items-center justify-between p-5 list-none text-slate-900 dark:text-white">
                <span className="font-bold">Do you offer team discounts?</span>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Absolutely. Teams of 5 or more are eligible for our Enterprise rates which include volume discounts. Contact our sales team for a custom quote.
              </div>
            </details>
          </div>
        </main>
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          plan={selectedPlan}
          userEmail={user?.email || ''}
          userName={user?.user_metadata?.name || ''}
        />
        <footer className="w-full border-t border-slate-200 dark:border-white/10 px-6 lg:px-20 py-12 bg-[#f5f8f6] dark:bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="text-[#25f46a]/50">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-lg font-bold tracking-tight opacity-50 text-slate-900 dark:text-white">Noir Code</h2>
            </div>
            <div className="flex gap-8 text-sm font-medium text-slate-500">
              <a className="hover:text-[#25f46a] transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-[#25f46a] transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-[#25f46a] transition-colors" href="#">Twitter</a>
              <a className="hover:text-[#25f46a] transition-colors" href="#">GitHub</a>
            </div>
            <div className="text-sm text-slate-500 italic">
              Built for Developers.
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-slate-400">
            © 2024 Noir Code Inc. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};
