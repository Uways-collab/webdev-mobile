import React, { useState } from 'react';
import { MessageCircle, Search, AlertCircle, ShieldAlert, CheckCircle2, ArrowRight, Copy, Check } from 'lucide-react';
import { VerificationResult } from '../types';

interface PaymentSupportSectionProps {
  onVerifiedSuccess: (result: VerificationResult) => void;
}

const WHATSAPP_NUM_1 = "234911043054";
const WHATSAPP_NUM_2 = "2348129595134";
const DEFAULT_PREFILLED = "Hello, I paid for the Mobile Vibe Coding Masterclass but couldn't access the course link. My name is [Your Name]. My payment email is [Your Email]. I will send my payment proof and transaction reference for verification.";

export const PaymentSupportSection: React.FC<PaymentSupportSectionProps> = ({ onVerifiedSuccess }) => {
  const [lookupRef, setLookupRef] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  const encodedMessage = encodeURIComponent(DEFAULT_PREFILLED);
  const waUrl1 = `https://wa.me/${WHATSAPP_NUM_1}?text=${encodedMessage}`;
  const waUrl2 = `https://wa.me/${WHATSAPP_NUM_2}?text=${encodedMessage}`;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupRef.trim()) return;

    setLookupLoading(true);
    setLookupError('');

    try {
      const res = await fetch(`/api/paystack/verify/${encodeURIComponent(lookupRef.trim())}`);
      const data = await res.json();

      if (res.ok && data.verified) {
        onVerifiedSuccess(data);
      } else {
        setLookupError(data.error || 'Transaction reference not found or unverified. Please message support below.');
      }
    } catch (err: any) {
      setLookupError('Could not verify reference. Please check your internet or reach out directly on WhatsApp.');
    } finally {
      setLookupLoading(false);
    }
  };

  const copyTemplate = () => {
    navigator.clipboard.writeText(DEFAULT_PREFILLED);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <section id="support" className="py-20 lg:py-28 bg-[#080B14] border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Support Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#5B9BFF] uppercase">
            Customer Support & Assistance
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
            Paid But Couldn't Access Your Course? We're Here to Help.
          </h2>
          <p className="text-base sm:text-lg text-[#A1AEC2]">
            If you have completed payment but didn't receive your course access link, contact us on WhatsApp.
          </p>
        </div>

        {/* Main Support Box */}
        <div className="max-w-4xl mx-auto bg-[#0D1220] border border-white/[0.1] rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
          
          {/* Instructions Box */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Send us the following details on WhatsApp:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#F8FAFC]">
              <div className="flex items-center gap-3 bg-[#121A2B] p-3.5 rounded-xl border border-white/[0.05]">
                <span className="w-6 h-6 rounded-full bg-[#3978FF]/20 text-[#5B9BFF] flex items-center justify-center text-xs font-bold">1</span>
                <span>Your full name</span>
              </div>
              <div className="flex items-center gap-3 bg-[#121A2B] p-3.5 rounded-xl border border-white/[0.05]">
                <span className="w-6 h-6 rounded-full bg-[#3978FF]/20 text-[#5B9BFF] flex items-center justify-center text-xs font-bold">2</span>
                <span>The email address used for payment</span>
              </div>
              <div className="flex items-center gap-3 bg-[#121A2B] p-3.5 rounded-xl border border-white/[0.05]">
                <span className="w-6 h-6 rounded-full bg-[#3978FF]/20 text-[#5B9BFF] flex items-center justify-center text-xs font-bold">3</span>
                <span>Your payment reference or transaction receipt</span>
              </div>
              <div className="flex items-center gap-3 bg-[#121A2B] p-3.5 rounded-xl border border-white/[0.05]">
                <span className="w-6 h-6 rounded-full bg-[#3978FF]/20 text-[#5B9BFF] flex items-center justify-center text-xs font-bold">4</span>
                <span>A screenshot of your payment confirmation</span>
              </div>
            </div>
            
            <p className="text-sm text-[#A1AEC2] leading-relaxed pt-1">
              We will manually verify your payment and help you get access. Please note: payment must be manually verified on Paystack before access is provided.
            </p>
          </div>

          {/* Prefilled message template preview */}
          <div className="p-4 rounded-xl bg-[#121A2B] border border-white/[0.05] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#A1AEC2] uppercase">Prefilled Message Template:</span>
              <button
                type="button"
                onClick={copyTemplate}
                className="text-xs text-[#5B9BFF] hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#20D69A]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy text</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-[#A1AEC2] italic bg-black/30 p-3 rounded-lg border border-white/[0.04]">
              "{DEFAULT_PREFILLED}"
            </p>
          </div>

          {/* Two Prominent WhatsApp Buttons */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Tap Either Line to Chat With Support Now:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={waUrl1}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 py-4 px-6 text-sm font-bold text-slate-950 bg-[#20D69A] hover:bg-[#1CBE89] rounded-xl shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-center"
              >
                <MessageCircle className="w-5 h-5 fill-slate-950" />
                <span>CONTACT SUPPORT — 09110443054</span>
              </a>

              <a
                href={waUrl2}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 py-4 px-6 text-sm font-bold text-slate-950 bg-[#20D69A] hover:bg-[#1CBE89] rounded-xl shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-center"
              >
                <MessageCircle className="w-5 h-5 fill-slate-950" />
                <span>CONTACT SUPPORT — 08129595134</span>
              </a>
            </div>
          </div>

          {/* Instant Reference Lookup (Self-Serve) */}
          <div className="pt-6 border-t border-white/[0.08] space-y-4">
            <div>
              <h4 className="text-base font-bold text-white">
                Already Have Your Paystack Reference?
              </h4>
              <p className="text-xs sm:text-sm text-[#A1AEC2]">
                If your bank debited you or Paystack sent an email receipt with a reference code, enter it below to verify immediately.
              </p>
            </div>

            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#A1AEC2] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={lookupRef}
                  onChange={(e) => setLookupRef(e.target.value)}
                  placeholder="e.g. MVC-17305382-XYZ or Paystack reference"
                  className="w-full pl-10 pr-4 py-3 bg-[#121A2B] border border-white/[0.1] rounded-xl text-sm text-white placeholder-[#A1AEC2]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3978FF]"
                />
              </div>
              <button
                type="submit"
                disabled={lookupLoading || !lookupRef.trim()}
                className="px-6 py-3 bg-[#3978FF] hover:bg-[#2F65DC] disabled:opacity-50 text-sm font-bold text-white rounded-xl transition-all whitespace-nowrap shadow-md"
              >
                {lookupLoading ? 'Checking Paystack...' : 'Verify Reference'}
              </button>
            </form>

            {lookupError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{lookupError}</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
