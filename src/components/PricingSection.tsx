import React from 'react';
import { Check, ShieldCheck, Zap, Lock, ArrowRight, Smartphone } from 'lucide-react';

interface PricingSectionProps {
  onOpenCheckout: () => void;
}

const INCLUDED_BENEFITS = [
  "Complete access to Modules 01 through 04",
  "Mobile workspace setup guide for Android & iPhone",
  "AI prompt blueprints and copy-paste templates",
  "Hands-on project tutorials: landing pages & interactive web apps",
  "Step-by-step mobile web deployment instructions",
  "Private Telegram learning community membership",
  "Direct community support for troubleshooting and questions",
  "Lifetime access to all masterclass materials"
];

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenCheckout }) => {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-[#0D1220]/80 border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#3978FF] uppercase">
            Simple, Transparent Pricing
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
            Invest Once in a Skill That Will Serve You for Years.
          </h2>
          <p className="text-base sm:text-lg text-[#A1AEC2]">
            No recurring monthly charges. No hidden platform upsells. One single payment for full, instant access to the masterclass and private community.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-[#121A2B] to-[#0D1220] border border-[#3978FF]/40 rounded-3xl p-8 sm:p-12 shadow-2xl relative">
          
          {/* Card Header */}
          <div className="space-y-3 pb-8 border-b border-white/[0.08]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#5B9BFF]">
                Full Course + Community Pass
              </span>
              <span className="text-xs font-bold px-3 py-1 bg-[#20D69A]/10 text-[#20D69A] border border-[#20D69A]/30 rounded-full">
                Launch Special
              </span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Mobile Vibe Coding Masterclass
            </h3>
            
            <p className="text-sm text-[#A1AEC2]">
              Everything you need to turn your smartphone into a web creation studio.
            </p>

            {/* Price Presentation */}
            <div className="pt-4 flex items-baseline gap-4">
              <span className="text-xl sm:text-2xl text-[#A1AEC2] line-through font-mono">
                ₦15,000
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-6xl font-black text-white tracking-tight font-mono">
                  ₦7,000
                </span>
                <span className="text-xs font-semibold text-[#20D69A] uppercase tracking-wide">
                  Launch Price
                </span>
              </div>
            </div>
          </div>

          {/* Value Checklist */}
          <div className="py-8 space-y-4">
            <p className="text-xs font-mono uppercase tracking-wider text-[#A1AEC2]">
              What Is Included:
            </p>
            <ul className="space-y-3">
              {INCLUDED_BENEFITS.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-[#F8FAFC]">
                  <Check className="w-5 h-5 text-[#20D69A] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Primary Purchase CTA */}
          <div className="pt-4 space-y-4">
            <button
              onClick={onOpenCheckout}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 text-base sm:text-lg font-bold text-white bg-[#3978FF] hover:bg-[#2F65DC] active:scale-[0.99] rounded-xl shadow-xl shadow-[#3978FF]/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B9BFF]"
            >
              <span>GET INSTANT ACCESS FOR ₦7,000</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Supporting Guarantee & Security Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#A1AEC2]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#20D69A]" />
                <span>One-time payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#20D69A]" />
                <span>No monthly course subscription</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#5B9BFF]" />
                <span>Secure payment powered by Paystack</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#20D69A]" />
                <span>Access instructions right after payment</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
