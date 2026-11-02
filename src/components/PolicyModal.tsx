import React from 'react';
import { X } from 'lucide-react';

export type PolicyType = 'privacy' | 'terms' | 'refund' | null;

interface PolicyModalProps {
  type: PolicyType;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#0D1220] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">
            {type === 'privacy' && 'Privacy Policy'}
            {type === 'terms' && 'Terms and Conditions'}
            {type === 'refund' && 'Refund Policy'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#A1AEC2] hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-4 text-sm text-[#A1AEC2] leading-relaxed max-h-[70vh] overflow-y-auto">
          {type === 'privacy' && (
            <>
              <p className="text-white font-medium">Last updated: 2026</p>
              <p>
                Mobile Vibe Coding Masterclass respects your privacy and is committed to protecting your personal data.
              </p>
              <h4 className="text-white font-semibold pt-2">1. Information We Collect</h4>
              <p>
                When you purchase the course, we collect your full name, email address, and phone number. This information is required to initialize your Paystack transaction, deliver your course access details, and provide payment support.
              </p>
              <h4 className="text-white font-semibold pt-2">2. How We Use Your Information</h4>
              <p>
                Your contact information is used strictly to verify your payment, provide Telegram community access, and communicate essential course updates. We never sell, rent, or trade your personal information with third parties.
              </p>
              <h4 className="text-white font-semibold pt-2">3. Payment Security</h4>
              <p>
                Payment processing is handled securely by Paystack. We do not store your credit card or bank card numbers on our servers.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p className="text-white font-medium">Last updated: 2026</p>
              <h4 className="text-white font-semibold pt-2">1. Course Enrollment</h4>
              <p>
                By purchasing the Mobile Vibe Coding Masterclass for ₦7,000 NGN, you receive personal, non-transferable access to the masterclass curriculum and private Telegram learning community.
              </p>
              <h4 className="text-white font-semibold pt-2">2. Intellectual Property</h4>
              <p>
                All lesson materials, prompt templates, guides, and curriculum videos are the intellectual property of Mobile Vibe Coding. Redistribution, resale, or public sharing of private links and course materials is prohibited.
              </p>
              <h4 className="text-white font-semibold pt-2">3. No Guaranteed Financial Outcomes</h4>
              <p>
                The course teaches technical skills and workflows for building digital products using smartphones and AI. We do not guarantee specific employment, client contracts, or financial earnings, as individual outcomes depend on personal execution.
              </p>
            </>
          )}

          {type === 'refund' && (
            <>
              <p className="text-white font-medium">Last updated: 2026</p>
              <h4 className="text-white font-semibold pt-2">Digital Product Refund Policy</h4>
              <p>
                Due to the immediate digital delivery and private access nature of the course materials and Telegram learning community, payments are generally non-refundable once access has been granted and verified.
              </p>
              <h4 className="text-white font-semibold pt-2">Payment Verification Issues</h4>
              <p>
                If you made a payment but were debited multiple times due to a network glitch, contact our WhatsApp support lines with your transaction reference. Verified duplicate charges will be promptly investigated and refunded.
              </p>
              <p>
                Support lines: 09110443054 and 08129595134.
              </p>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-white/[0.08] bg-[#080B14] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white/[0.08] hover:bg-white/[0.14] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
