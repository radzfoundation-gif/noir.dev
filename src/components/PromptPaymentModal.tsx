import { useState } from 'react';
import { CreditCard, Loader2, Sparkles, X } from 'lucide-react';
import { xenditService } from '../lib/xenditService';

interface PromptPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
  userId: string;
}

export const PromptPaymentModal = ({ isOpen, onClose, userEmail, userName, userId }: PromptPaymentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await xenditService.createPromptInvoice(userEmail, userName, userId);
      if (response.invoiceUrl) {
        // Open Xendit checkout
        window.open(response.invoiceUrl, '_blank', 'width=500,height=700');
        // Close modal after initiating payment
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 font-sans">
      <div className="bg-[#121212] border border-white/10 rounded-2xl max-w-md w-full p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-lime-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-lime-500/30">
            <Sparkles className="text-lime-400" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Unlock More Prompts
          </h3>
          <p className="text-neutral-400">
            You've used your free prompt. Support Noir and get more!
          </p>
        </div>

        <div className="bg-neutral-900 border border-white/5 rounded-xl p-5 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-neutral-300 font-medium">Extra Prompts (2x)</span>
            <span className="text-2xl font-bold text-white">
              Rp 25.000
            </span>
          </div>
          <p className="text-xs text-neutral-500">One-time payment. Prompts never expire.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg p-3 mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-lime-400 text-black font-bold hover:brightness-110 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
