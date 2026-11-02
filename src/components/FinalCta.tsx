import React from 'react';
import { ArrowRight, Smartphone, CheckCircle } from 'lucide-react';

interface FinalCtaProps {
  onOpenCheckout: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onOpenCheckout }) => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-[#080B14] to-[#0D1220] relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#20D69A]">
          <span>Take Action Today</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto" style={{ textWrap: 'balance' }}>
          Stop Waiting for the Perfect Setup. Start Building With What You Have.
        </h2>

        <p className="text-base sm:text-xl text-[#A1AEC2] max-w-2xl mx-auto leading-relaxed">
          Your smartphone can be more than a device for browsing and social media. Learn how to turn your ideas into websites and web applications using AI.
        </p>

        {/* Primary CTA Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenCheckout}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 text-base sm:text-lg font-extrabold text-white bg-[#3978FF] hover:bg-[#2F65DC] active:scale-[0.99] rounded-2xl shadow-2xl shadow-[#3978FF]/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B9BFF]"
          >
            <span>JOIN MOBILE VIBE CODING MASTERCLASS — ₦7,000</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Reassurance footer */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#A1AEC2]">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#20D69A]" /> One-time payment (₦7,000)
          </span>
          <span aria-hidden="true" className="text-white/20">·</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#20D69A]" /> Instant Telegram community link upon verification
          </span>
          <span aria-hidden="true" className="text-white/20">·</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#20D69A]" /> 2 Dedicated WhatsApp support lines
          </span>
        </div>

      </div>
    </section>
  );
};
