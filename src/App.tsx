/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { TransformationSection } from './components/TransformationSection';
import { CurriculumSection } from './components/CurriculumSection';
import { AudienceSection } from './components/AudienceSection';
import { PricingSection } from './components/PricingSection';
import { PaymentSupportSection } from './components/PaymentSupportSection';
import { FaqSection } from './components/FaqSection';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { CheckoutModal } from './components/CheckoutModal';
import { SuccessView } from './components/SuccessView';
import { VerificationResult } from './types';
import { safeFetchJson } from './lib/apiClient';

export default function App() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState<VerificationResult | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Check URL parameters on mount in case user returned from Paystack hosted checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference') || params.get('trxref');

    if (reference) {
      // Clean query string from browser address bar
      window.history.replaceState({}, document.title, window.location.pathname);

      // Verify on server safely
      safeFetchJson<VerificationResult>(`/api/payments/verify?reference=${encodeURIComponent(reference)}`)
        .then(async (res) => {
          if (res.ok && res.data?.verified) {
            setVerifiedResult(res.data);
            return;
          }

          // Try alias if 404
          if (!res.ok && res.status === 404) {
            const fb = await safeFetchJson<VerificationResult>(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`);
            if (fb.ok && fb.data?.verified) {
              setVerifiedResult(fb.data);
              return;
            }
          }

          const err = res.error || res.data?.error || 'Payment was not verified by Paystack.';
          setVerificationError(err);
        })
        .catch(() => {
          setVerificationError('Error connecting to verification server. Please message WhatsApp support below.');
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#3978FF]/30 selection:text-white">
      {/* Top Notification if returned from unverified redirect */}
      {verificationError && (
        <div className="bg-rose-500/15 border-b border-rose-500/30 px-4 py-3 text-center text-xs sm:text-sm text-rose-300 flex items-center justify-center gap-3">
          <span>{verificationError}</span>
          <button
            onClick={() => setVerificationError(null)}
            className="underline text-white hover:text-rose-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Main Page Sections */}
      <main className="flex-1">
        <Hero onOpenCheckout={() => setIsCheckoutOpen(true)} />
        
        <ProblemSection onOpenCheckout={() => setIsCheckoutOpen(true)} />
        
        <TransformationSection onOpenCheckout={() => setIsCheckoutOpen(true)} />
        
        <div id="learn">
          <CurriculumSection onOpenCheckout={() => setIsCheckoutOpen(true)} />
        </div>

        <AudienceSection onOpenCheckout={() => setIsCheckoutOpen(true)} />
        
        <PricingSection onOpenCheckout={() => setIsCheckoutOpen(true)} />
        
        <PaymentSupportSection 
          onVerifiedSuccess={(result) => setVerifiedResult(result)} 
        />
        
        <FaqSection />
        
        <FinalCta onOpenCheckout={() => setIsCheckoutOpen(true)} />
      </main>

      {/* Footer & Policies */}
      <Footer />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={(result) => setVerifiedResult(result)}
      />

      {/* Success View (Only shown after verified server payment) */}
      {verifiedResult && (
        <SuccessView
          result={verifiedResult}
          onReset={() => setVerifiedResult(null)}
        />
      )}
    </div>
  );
}
