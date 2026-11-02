import React from 'react';
import { XCircle, CheckCircle, ArrowRight, Zap, Sparkles } from 'lucide-react';

interface TransformationSectionProps {
  onOpenCheckout: () => void;
}

const BEFORE_ITEMS = [
  "Just passively browsing social media on your phone.",
  "Great website and app ideas stuck in your head forever.",
  "Feeling locked out because you have zero coding experience.",
  "Believing a costly laptop is compulsory before you can create.",
];

const AFTER_ITEMS = [
  "Creating real, responsive websites with AI on your phone.",
  "Building functional web applications with forms and logic.",
  "Turning ideas into tangible, shareable digital products.",
  "Publishing live projects online for friends, clients, and users.",
];

export const TransformationSection: React.FC<TransformationSectionProps> = ({ onOpenCheckout }) => {
  return (
    <section className="py-20 lg:py-28 bg-[#080B14] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#20D69A] uppercase">
            The Paradigm Shift
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
            From Smartphone User to AI-Powered Creator.
          </h2>
          <p className="text-base sm:text-lg text-[#A1AEC2]">
            See what changes when you stop using your phone just for consumption and start using it as an AI creation studio.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Before Card */}
          <div className="lg:col-span-5 bg-[#0D1220] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#A1AEC2]">Status Quo</span>
                <h3 className="text-xl font-bold text-white mt-1">BEFORE THE COURSE</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md">
                Passive Consumer
              </span>
            </div>

            <ul className="space-y-4 text-sm sm:text-base text-[#A1AEC2]">
              {BEFORE_ITEMS.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500/80 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-white/[0.04] text-xs text-[#A1AEC2]/70 italic">
              Trapped in tutorials, waiting for the "ideal setup" that never comes.
            </div>
          </div>

          {/* Center Visual / Bridge */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center gap-3 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#3978FF]/20 border border-[#3978FF]/50 flex items-center justify-center text-[#5B9BFF] shadow-lg shadow-[#3978FF]/20">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5B9BFF]">
              Vibe Coding Workflow
            </span>
            <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-[#3978FF]/50 to-transparent" />
          </div>

          {/* After Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#121A2B] to-[#0D1220] border border-[#20D69A]/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#20D69A]">New Reality</span>
                <h3 className="text-xl font-bold text-white mt-1">AFTER THE COURSE</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-[#20D69A]/10 text-[#20D69A] border border-[#20D69A]/30 rounded-md">
                Active Creator
              </span>
            </div>

            <ul className="space-y-4 text-sm sm:text-base text-white">
              {AFTER_ITEMS.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#20D69A] shrink-0 mt-0.5" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-white/[0.04] text-xs text-[#20D69A]/80 font-medium">
              You produce real web assets on your phone whenever inspiration strikes.
            </div>
          </div>

        </div>

        {/* Realistic Mobile Showcase Image Card */}
        <div className="bg-[#0D1220] border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center space-y-6">
              <span className="text-xs font-semibold tracking-wider text-[#3978FF] uppercase">
                Real Digital Products
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Websites and Applications You Can Point to and Say: "I Built This on My Phone."
              </h3>
              <p className="text-sm sm:text-base text-[#A1AEC2] leading-relaxed">
                Whether it's a portfolio to showcase your skills, a booking page for a local service, a product showcase, or an interactive utility app — you will learn the exact practical process to bring it to life without code frustration.
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenCheckout}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-[#3978FF] hover:bg-[#2F65DC] rounded-xl transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B9BFF]"
                >
                  <span>Get the Course for ₦7,000</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="lg:col-span-6 bg-[#080B14] min-h-[280px] lg:min-h-full relative overflow-hidden flex items-center justify-center">
              <img
                src="/src/assets/images/mobile_app_showcase_1793612376885.jpg"
                alt="Smartphone running published modern web app"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover max-h-[380px] lg:max-h-full"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1220] via-transparent to-transparent lg:hidden" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
