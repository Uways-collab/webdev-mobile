import React, { useState, useEffect } from 'react';
import { X, Lock, ShieldCheck, ArrowRight, AlertCircle, MessageCircle, RefreshCw } from 'lucide-react';
import { CheckoutFormData, VerificationResult } from '../types';
import { safeFetchJson } from '../lib/apiClient';

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

  const [step, setStep] = useState<'form' | 'processing' | 'verifying' | 'failed'>('form');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeReference, setActiveReference] = useState('');
  const [paystackConfig, setPaystackConfig] = useState<{ hasSecretKey: boolean; publicKey: string }>({
    hasSecretKey: false,
    publicKey: '',
  });

  // Fetch backend paystack config safely
  useEffect(() => {
    if (isOpen) {
      safeFetchJson<{ hasSecretKey: boolean; publicKey: string }>('/api/payments/config')
        .then((res) => {
          if (res.ok && res.data) {
            setPaystackConfig(res.data);
          } else {
            // Fallback check to /api/paystack/config
            safeFetchJson<{ hasSecretKey: boolean; publicKey: string }>('/api/paystack/config')
              .then((fb) => {
                if (fb.ok && fb.data) setPaystackConfig(fb.data);
              })
              .catch(() => {});
          }
        })
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
      const payload = {
        email: formData.email.trim(),
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        callbackUrl: `${window.location.origin}/?paid=true`,
      };

      // Call primary endpoint: /api/payments/initialize
      let response = await safeFetchJson<{
        success: boolean;
        reference: string;
        authorization_url?: string;
        access_code?: string;
        data?: { authorization_url?: string; reference?: string };
        error?: string;
      }>('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // If 404 on /api/payments/initialize, try alias /api/paystack/initialize
      if (!response.ok && response.status === 404) {
        response = await safeFetchJson('/api/paystack/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok || !response.data?.success) {
        const errorDetail = response.error || response.data?.error || 'Could not initialize Paystack transaction.';
        throw new Error(errorDetail);
      }

      const initData = response.data;
      const reference = initData.reference || initData.data?.reference || '';
      setActiveReference(reference);

      const authUrl = initData.authorization_url || initData.data?.authorization_url;

      // 1. If Paystack Inline Popup is available and configured
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
          callback: function (paystackCallbackResponse: any) {
            verifyPayment(paystackCallbackResponse.reference || reference);
          },
          onClose: function () {
            setStep('form');
            setErrorMessage('Payment window was closed before completing checkout.');
          },
        });
        handler.openIframe();
        return;
      }

      // 2. Redirect to real Paystack authorization URL
      if (authUrl) {
        window.location.href = authUrl;
        return;
      }

      // 3. Fallback: verify directly
      if (reference) {
        verifyPayment(reference);
        return;
      }

      throw new Error('No authorization URL or reference returned by payment gateway.');
    } catch (err: any) {
      setStep('failed');
      setErrorMessage(err.message || 'An error occurred during payment initialization.');
    }
  };

  const verifyPayment = async (ref: string) => {
    setStep('verifying');
    setErrorMessage('');

    try {
      let verifyRes = await safeFetchJson<VerificationResult>(
        `/api/payments/verify/${encodeURIComponent(ref)}`
      );

      // Fallback to query param or alias if 404
      if (!verifyRes.ok && verifyRes.status === 404) {
        verifyRes = await safeFetchJson<VerificationResult>(
          `/api/paystack/verify/${encodeURIComponent(ref)}`
        );
      }

      if (verifyRes.ok && verifyRes.data?.verified) {
        onSuccess(verifyRes.data);
        onClose();
      } else {
        setStep('failed');
        setErrorMessage(
          verifyRes.error ||
          verifyRes.data?.error ||
          'Payment verification failed. Paystack reported incomplete status.'
        );
      }
    } catch (err: any) {
      setStep('failed');
      setErrorMessage('Network error during verification. You can check your reference below or contact WhatsApp support.');
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
                  <div className="space-y-1">
                    <p className="font-semibold">Unable to proceed</p>
                    <p>{errorMessage}</p>
                  </div>
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
                <p className="text-[11px] text-[#A1AEC2]">Your transaction receipt and access confirmation will be sent here.</p>
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
                  <ShieldCheck className="w-3.5 h-3.5 text-[#20D69A]" /> 256-bit SSL encryption
                </span>
                <span aria-hidden="true" className="text-white/20">·</span>
                <span>PCI-DSS Level 1 certified</span>
              </div>
            </form>
          )}

          {/* Processing / Initializing State */}
          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-[#3978FF] animate-spin mx-auto" />
              <h4 className="text-base font-bold text-white">Connecting to Paystack Gateway...</h4>
              <p className="text-xs text-[#A1AEC2]">Preparing your secure ₦7,000 checkout session.</p>
            </div>
          )}

          {/* Verifying State */}
          {step === 'verifying' && (
            <div className="py-12 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-[#20D69A] animate-spin mx-auto" />
              <h4 className="text-base font-bold text-white">Verifying Transaction With Paystack...</h4>
              <p className="text-xs text-[#A1AEC2]">Confirming payment confirmation and unlocking your community access.</p>
            </div>
          )}

          {/* Failed / Error State */}
          {step === 'failed' && (
            <div className="text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-500/40 mx-auto flex items-center justify-center text-rose-400">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white">Checkout Notice</h4>
                <div className="text-xs sm:text-sm text-rose-300 bg-rose-500/10 p-3.5 rounded-xl border border-rose-500/20 text-left">
                  <p className="font-semibold text-rose-200 mb-1">Issue encountered:</p>
                  <p>{errorMessage || 'Unable to complete Paystack session.'}</p>
                </div>
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
                  If your account was debited, chat with our WhatsApp support lines with your transaction reference or receipt:
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
