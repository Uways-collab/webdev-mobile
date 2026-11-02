import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { PolicyModal, PolicyType } from './PolicyModal';

export const Footer: React.FC = () => {
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);

  return (
    <>
      <footer className="bg-[#05080E] border-t border-white/[0.08] text-[#A1AEC2] text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Brand & Course Description */}
            <div className="md:col-span-5 space-y-4">
              <span className="text-lg font-extrabold text-white tracking-tight">
                MOBILE VIBE CODING MASTERCLASS
              </span>
              <p className="text-sm text-[#A1AEC2] leading-relaxed max-w-sm">
                Empowering beginners to build functional websites and digital products directly from their smartphones using modern AI vibe coding workflows.
              </p>
              <div className="pt-2">
                <span className="text-xs text-[#A1AEC2]/70 font-mono">
                  Powered by Paystack · Telegram Community
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <p className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                Course Links
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#hero" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#learn" className="hover:text-white transition-colors">
                    What You'll Learn
                  </a>
                </li>
                <li>
                  <a href="#curriculum" className="hover:text-white transition-colors">
                    Curriculum (Modules 01–04)
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing (₦7,000)
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    Frequently Asked Questions
                  </a>
                </li>
              </ul>
            </div>

            {/* WhatsApp Support & Help */}
            <div className="md:col-span-4 space-y-3">
              <p className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                WhatsApp Support
              </p>
              <p className="text-xs text-[#A1AEC2]">
                Need help with your payment or transaction receipt? Reach out directly:
              </p>
              <div className="space-y-2 pt-1">
                <a
                  href="https://wa.me/234911043054?text=Hello%2C%20I%20have%20an%20inquiry%20regarding%20the%20Mobile%20Vibe%20Coding%20Masterclass"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white hover:text-[#20D69A] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#20D69A]" />
                  <span>Support Line 1: 09110443054</span>
                </a>
                <a
                  href="https://wa.me/2348129595134?text=Hello%2C%20I%20have%20an%20inquiry%20regarding%20the%20Mobile%20Vibe%20Coding%20Masterclass"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white hover:text-[#20D69A] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#20D69A]" />
                  <span>Support Line 2: 08129595134</span>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Bar: Copyright & Policies */}
          <div className="pt-8 mt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A1AEC2]">
            <p>© 2026 Mobile Vibe Coding Masterclass. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => setActivePolicy('privacy')}
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <span aria-hidden="true" className="text-white/20">·</span>
              <button
                type="button"
                onClick={() => setActivePolicy('terms')}
                className="hover:text-white transition-colors"
              >
                Terms and Conditions
              </button>
              <span aria-hidden="true" className="text-white/20">·</span>
              <button
                type="button"
                onClick={() => setActivePolicy('refund')}
                className="hover:text-white transition-colors"
              >
                Refund Policy
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy Modal */}
      <PolicyModal type={activePolicy} onClose={() => setActivePolicy(null)} />
    </>
  );
};
