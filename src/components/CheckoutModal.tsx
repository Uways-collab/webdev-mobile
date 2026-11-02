import React, { useState, useEffect } from 'react';
import { X, Lock, ShieldCheck, ArrowRight, AlertCircle, MessageCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { CheckoutFormData, VerificationResult } from '../types';

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: any) => {
        openIframe: () => void;
      };
    };
  }
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: VerificationResult) => void;
}

const WHATSAPP_NUM_1 = "234911043054";
const WHATSAPP_NUM_2 = "2348129595134";

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phone: '',
  });

  const [step, setStep] = useState<'form' | 'processing' | 'verifying' | 'failed' | 'sandbox_confirm'>('form');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeReference, setActiveReference] = useState('');
  const [paystackConfig, setPaystackConfig] = useState<{ hasSecretKey: boolean; publicKey: string }>({
    hasSecretKey: false,
    publicKey: '',
  });

  // Fetch backend paystack config
  useEffect(() => {
    if (isOpen) {
      fetch('/api/paystack/config')
        .then((res) => res.json())
        .then((data) => setPaystackConfig(data))
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setErrorMessage('Please provide a valid phone number.');
      return false;
    }
    return true;
  };

  const handleStartPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) return;

    setStep('processing');

    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          name: formData.fullName.trim(),
          phone: formData.phone.trim(),
          callbackUrl: `${window.location.origin}/?paid=true`,
        }),
      });

      const initData = await res.json();

      if (!res.ok || !initData.success) {
        throw new Error(initData.error || 'Could not initialize payment transaction.');
      }

      const reference = initData.reference;
      setActiveReference(reference);

      // Check if real Paystack public inline is available
      if (paystackConfig.publicKey && window.PaystackPop) {
        const handler = window.PaystackPop.setup({
          key: paystackConfig.publicKey,
          email: formData.email.trim(),
          amount: 700000,
          currency: 'NGN',
          ref: reference,
          metadata: {
            custom_fields: [
              { display_name: 'Full Name', variable_name: 'full_name', value: formData.fullName.trim() },
              { display_name: 'Phone', variable_name: 'phone', value: formData.phone.trim() },
            ],
          },
          callback: function (response: any) {
            verifyPayment(response.reference || reference);
          },
          onClose: function () {
            setStep('form');
            setErrorMessage('Payment window was closed before completion.');
          },
        });
        handler.openIframe();
        return;
      }

      // If server returned an authorization URL (standard hosted redirect checkout)
      if (initData.data?.authorization_url) {
        window.location.href = initData.data.authorization_url;
        return;
      }

      // If server is in sandbox/testing mode
      if (initData.sandbox) {
        setStep('sandbox_confirm');
        return;
      }

      // Otherwise verify directly with reference
      verifyPayment(reference);
    } catch (err: any) {
      setStep('failed');
      setErrorMessage(err.message || 'An error occurred during payment initialization.');
    }
  };

  const verifyPayment = async (ref: string) => {
    setStep('verifying');
    setErrorMessage('');

    try {
      const verifyRes = await fetch(
        `/api/paystack/verify/${encodeURIComponent(ref)}?email=${encodeURIComponent(formData.email)}&name=${encodeURIComponent(formData.fullName)}`
      );
      const verifyData = await verifyRes.json();

      if (verifyRes.ok && verifyData.verified) {
        onSuccess(verifyData);
        onClose();
      } else {
        setStep('failed');
        setErrorMessage(verifyData.error || 'Payment verification failed. Paystack reported incomplete status.');
      }
    } catch (err: any) {
      setStep('failed');
      setErrorMessage('Network error during verification. You can check reference or contact WhatsApp support.');
    }
  };

  // WhatsApp prefilled message
  const prefilledSupportText = `Hello, I paid for the Mobile Vibe Coding Masterclass but couldn't access the course link. My name is ${formData.fullName || '[Your Name]'}. My payment email is ${formData.email || '[Your Email]'}. I will send my payment proof and transaction reference for verification.`;
  const encodedWa = encodeURIComponent(prefilledSupportText);
  const waUrl1 = `https://wa.me/${WHATSAPP_NUM_1}?text=${encodedWa}`;
  const waUrl2 = `https://wa.me/${WHATSAPP_NUM_2}?text=${encodedWa}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-[#0D1220] border border-white/[0.1] rounded-3xl shadow-2xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#3978FF]/20 flex items-center justify-center text-[#5B9BFF]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Enroll in Masterclass</h3>
              <p className="text-xs text-[#A1AEC2]">Secure Paystack Checkout</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#A1AEC2] hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on state */}
        <div className="p-6 sm:p-8">
          
          {/* Form State */}
          {step === 'form' && (
            <form onSubmit={handleStartPayment} className="space-y-5">
              
              {/* Price Banner */}
              <div className="bg-[#121A2B] border border-white/[0.06] p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#A1AEC2]">Total Enrollment Fee:</p>
                  <p className="text-2xl font-black text-white font-mono">₦7,000</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#A1AEC2] line-through font-mono">₦15,000</span>
                  <p className="text-[11px] font-semibold text-[#20D69A]">One-time payment</p>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Input: Full Name */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-white">
                  Full Name <span className="text-[#3978FF]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Adebayo"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-[#121A2B] border border-white/[0.1] rounded-xl text-sm text-white placeholder-[#A1AEC2]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3978FF]"
                />
              </div>

              {/* Input: Email Address */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-white">
                  Email Address <span className="text-[#3978FF]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. samuel@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#121A2B] border border-white/[0.1] rounded-xl text-sm text-white placeholder-[#A1AEC2]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3978FF]"
                />
                <p className="text-[11px] text-[#A1AEC2]">Your transaction receipt will be sent here.</p>
              </div>

              {/* Input: Phone Number */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-white">
                  Phone Number (WhatsApp) <span className="text-[#3978FF]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 08012345678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-[#121A2B] border border-white/[0.1] rounded-xl text-sm text-white placeholder-[#A1AEC2]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3978FF]"
                />
              </div>

              {/* Pay Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-[#3978FF] hover:bg-[#2F65DC] active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-lg shadow-[#3978FF]/25 flex items-center justify-center gap-2"
                >
                  <span>Pay ₦7,000 via Paystack</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Security info */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-[#A1AEC2]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#20D69A]" /> 256-bit encryption
                </span>
                <span aria-hidden="true" className="text-white/20">·</span>
                <span>Paystack PCI-DSS certified</span>
              </div>
            </form>
          )}

          {/* Sandbox Confirmation Mode (When testing before inserting secret key) */}
          {step === 'sandbox_confirm' && (
            <div className="text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-[#5B9BFF]/15 border border-[#5B9BFF]/40 mx-auto flex items-center justify-center text-[#5B9BFF]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white">
                  Paystack Sandbox Ready
                </h4>
                <p className="text-xs sm:text-sm text-[#A1AEC2] leading-relaxed">
                  Transaction reference <span className="font-mono text-white select-all">{activeReference}</span> was generated for {formData.fullName}.
                </p>
                <p className="text-xs text-[#20D69A] bg-[#20D69A]/10 border border-[#20D69A]/20 p-2.5 rounded-xl">
                  To accept live card/bank payments in production, add your <strong>PAYSTACK_SECRET_KEY</strong> in environment settings.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => verifyPayment(activeReference)}
                  className="w-full py-3.5 px-6 bg-[#20D69A] hover:bg-[#1CBE89] text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulate Successful ₦7,000 Verification</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-xs text-[#A1AEC2] hover:text-white"
                >
                  Back to edit details
                </button>
              </div>
            </div>
          )}

          {/* Processing / Initializing State */}
          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-[#3978FF] animate-spin mx-auto" />
              <h4 className="text-base font-bold text-white">Initializing Paystack Gateway...</h4>
              <p className="text-xs text-[#A1AEC2]">Setting up secure transaction for ₦7,000 NGN.</p>
            </div>
          )}

          {/* Verifying State */}
          {step === 'verifying' && (
            <div className="py-12 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-[#20D69A] animate-spin mx-auto" />
              <h4 className="text-base font-bold text-white">Verifying Transaction With Server...</h4>
              <p className="text-xs text-[#A1AEC2]">Confirming payment status and generating your access token.</p>
            </div>
          )}

          {/* Failed / Error State */}
          {step === 'failed' && (
            <div className="text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-500/40 mx-auto flex items-center justify-center text-rose-400">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white">Payment Not Completed</h4>
                <p className="text-xs sm:text-sm text-rose-300 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                  {errorMessage || 'Unable to verify payment with Paystack.'}
                </p>
                {activeReference && (
                  <p className="text-xs text-[#A1AEC2]">
                    Reference: <span className="font-mono text-white select-all">{activeReference}</span>
                  </p>
                )}
              </div>

              {/* Payment Support instructions as requested */}
              <div className="bg-[#121A2B] p-4 rounded-2xl border border-white/[0.06] text-left text-xs space-y-3">
                <p className="font-bold text-white">
                  Paid But Couldn't Access Your Course?
                </p>
                <p className="text-[#A1AEC2]">
                  If your money was debited, don't worry! Chat with our WhatsApp support lines with your transaction reference:
                </p>
                <div className="space-y-2 pt-1">
                  <a
                    href={waUrl1}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 bg-[#20D69A] text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-slate-950" />
                    <span>Chat Support (09110443054)</span>
                  </a>
                  <a
                    href={waUrl2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 bg-[#20D69A] text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-slate-950" />
                    <span>Chat Support (08129595134)</span>
                  </a>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="px-5 py-2.5 bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-white rounded-xl"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs text-[#A1AEC2] hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
