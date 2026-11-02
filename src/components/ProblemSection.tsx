import React from 'react';
import { Lightbulb, Code, Laptop, Eye, ArrowRight } from 'lucide-react';

interface ProblemSectionProps {
  onOpenCheckout: () => void;
}

const PAIN_POINTS = [
  {
    icon: Lightbulb,
    title: "Unbuilt Ideas",
    description: "You have great website or app ideas for businesses, portfolios, or side ventures, but don't know how to bring them into reality.",
  },
  {
    icon: Code,
    title: "The Coding Barrier",
    description: "You think programming is too difficult, requiring months of syntax memorization, complex frameworks, and tedious debugging.",
  },
  {
    icon: Laptop,
    title: "The Laptop Myth",
    description: "You believe you must save hundreds of thousands of Naira for an expensive MacBook or PC before you can even begin.",
  },
  {
    icon: Eye,
    title: "Sitting on the Sidelines",
    description: "You watch other people launching digital products online every day and wonder why you can't be one of them.",
  },
];

export const ProblemSection: React.FC<ProblemSectionProps> = ({ onOpenCheckout }) => {
  return (
    <section className="py-20 lg:py-28 bg-[#0D1220]/60 border-y border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#3978FF] uppercase">
            The Hidden Barrier
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
            How Many Great Ideas Have You Abandoned Because You Don't Own a Laptop?
          </h2>
          <p className="text-base sm:text-lg text-[#A1AEC2]">
            For years, tech education told people that building software requires $1,000 machines and complex computer science degrees. That era is over.
          </p>
        </div>

        {/* 4 Pain Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PAIN_POINTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#121A2B] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#5B9BFF] group-hover:text-white group-hover:bg-[#3978FF]/20 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#A1AEC2] leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="pt-6 border-t border-white/[0.04] mt-6 text-xs text-[#A1AEC2]/60 font-mono">
                  Pain Point #{idx + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing Statement Card */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-[#121A2B] via-[#162137] to-[#121A2B] border border-[#3978FF]/30 p-8 sm:p-10 text-center space-y-6 shadow-xl">
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug" style={{ textWrap: 'balance' }}>
            The tools have changed. You can now start building with AI using the smartphone already in your hands.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenCheckout}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-[#3978FF] hover:bg-[#2F65DC] rounded-xl transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B9BFF]"
            >
              <span>Start Building on Your Phone — ₦7,000</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
