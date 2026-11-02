import React from 'react';
import { Send, CheckCircle2, ShieldCheck, ArrowRight, MessageCircle, Copy, Check } from 'lucide-react';
import { VerificationResult } from '../types';

interface SuccessViewProps {
  result: VerificationResult;
  onReset: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ result, onReset }) => {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const telegramUrl = result.telegramUrl || "https://t.me/+SMTclxHBnv5jYWNk";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(telegramUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-gradient-to-b from-[#121A2B] to-[#0D1220] border border-[#20D69A]/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6 my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Success Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#20D69A]/15 border-2 border-[#20D69A] mx-auto flex items-center justify-center text-[#20D69A] shadow-xl shadow-[#20D69A]/20">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        {/* Mandatory Exact Headline & Copy */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#20D69A]">
            Payment Verified & Confirmed
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
            You're In! Welcome to Mobile Vibe Coding Masterclass. 🎉
          </h2>
          <p className="text-sm sm:text-base text-[#A1AEC2] leading-relaxed max-w-md mx-auto">
            Your payment has been confirmed. You can now join the learning community and access your course instructions.
          </p>
        </div>

        {/* Prominent Telegram Button */}
        <div className="pt-2 pb-2">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-3 py-4 px-8 text-base font-extrabold text-white bg-[#3978FF] hover:bg-[#2F65DC] active:scale-[0.99] rounded-2xl shadow-xl shadow-[#3978FF]/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Send className="w-5 h-5 fill-white" />
            <span>JOIN THE TELEGRAM COMMUNITY</span>
          </a>
        </div>

        {/* Mandatory Reassurance Note */}
        <p className="text-xs sm:text-sm text-[#F8FAFC] font-medium bg-black/40 p-3 rounded-xl border border-white/[0.06]">
          Keep this page or save the Telegram link so you can return to the learning community.
        </p>

        {/* Copy Link Alternative */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="text-xs text-[#5B9BFF] hover:text-white flex items-center gap-1.5 transition-colors py-1 px-3 rounded-lg bg-white/[0.04]"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#20D69A]" />
                <span>Link copied to clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Telegram Invite Link</span>
              </>
            )}
          </button>
        </div>

        {/* Verified Receipt Details */}
        <div className="bg-[#080B14] p-4 rounded-2xl border border-white/[0.06] text-left text-xs space-y-2">
          <div className="text-[11px] font-mono text-[#A1AEC2] uppercase pb-1 border-b border-white/[0.04]">
            Payment Verification Receipt
          </div>
          <div className="flex justify-between">
            <span className="text-[#A1AEC2]">Payment Reference:</span>
            <span className="font-mono text-white select-all">{result.reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A1AEC2]">Amount Verified:</span>
            <span className="font-bold text-[#20D69A]">₦7,000 NGN</span>
          </div>
          {result.customer?.name && (
            <div className="flex justify-between">
              <span className="text-[#A1AEC2]">Student Name:</span>
              <span className="text-white">{result.customer.name}</span>
            </div>
          )}
          {result.customer?.email && (
            <div className="flex justify-between">
              <span className="text-[#A1AEC2]">Student Email:</span>
              <span className="text-white">{result.customer.email}</span>
            </div>
          )}
          {result.isTestMode && (
            <div className="pt-1 text-[10px] text-amber-400 font-mono">
              Mode: Verified in sandbox test mode
            </div>
          )}
        </div>

        {/* Close / Return to landing page button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-[#A1AEC2] hover:text-white transition-colors"
          >
            Close this receipt
          </button>
        </div>

      </div>
    </div>
  );
};
