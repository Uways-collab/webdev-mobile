import React from 'react';
import { GraduationCap, UserCheck, Smartphone, Briefcase, Sparkles, Terminal, Palette, ArrowRight } from 'lucide-react';

interface AudienceSectionProps {
  onOpenCheckout: () => void;
}

const AUDIENCE_GROUPS = [
  {
    icon: GraduationCap,
    title: "Students",
    description: "Learn practical, in-demand modern AI skills in your spare time without asking your parents for an expensive computer."
  },
  {
    icon: UserCheck,
    title: "Beginners With Zero Coding Experience",
    description: "You've never written HTML, CSS, or JavaScript in your life. The course guides you using plain English instructions and mobile AI."
  },
  {
    icon: Smartphone,
    title: "People Who Don't Own Laptops",
    description: "Turn the smartphone already in your pocket into a productive web development environment right now."
  },
  {
    icon: Briefcase,
    title: "Entrepreneurs With Business Ideas",
    description: "Build landing pages, capture leads, and test your new business concepts without paying thousands to an agency."
  },
  {
    icon: Sparkles,
    title: "Freelancers",
    description: "Expand the services you offer to local clients by assembling quick websites, forms, and product catalogs on the go."
  },
  {
    icon: Terminal,
    title: "Aspiring Developers",
    description: "Demystify software architecture, UI design, and cloud hosting through rapid AI prototyping."
  },
  {
    icon: Palette,
    title: "Creative Minds",
    description: "Writers, designers, and creators who want to showcase their portfolio and share their work with a live web address."
  }
];

export const AudienceSection: React.FC<AudienceSectionProps> = ({ onOpenCheckout }) => {
  return (
    <section className="py-20 lg:py-28 bg-[#080B14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#20D69A] uppercase">
            Designed for Beginners
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
            If You Have a Smartphone and Ideas, You Can Start Here.
          </h2>
          <p className="text-base sm:text-lg text-[#A1AEC2]">
            You don't need a background in engineering. If you can type a WhatsApp message, you have the fundamental skill needed to start vibe coding with AI.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {AUDIENCE_GROUPS.map((group, idx) => {
            const Icon = group.icon;
            return (
              <div
                key={idx}
                className="bg-[#0D1220] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-xl bg-[#3978FF]/10 border border-[#3978FF]/20 flex items-center justify-center text-[#5B9BFF] group-hover:bg-[#3978FF] group-hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {group.title}
                  </h3>
                  <p className="text-sm text-[#A1AEC2] leading-relaxed">
                    {group.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="max-w-3xl mx-auto text-center space-y-4 pt-4">
          <p className="text-sm sm:text-base text-[#A1AEC2]">
            Ready to build your first website or web application from your phone?
          </p>
          <button
            onClick={onOpenCheckout}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm sm:text-base font-bold text-white bg-[#3978FF] hover:bg-[#2F65DC] rounded-xl transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B9BFF]"
          >
            <span>Get Instant Access — ₦7,000</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
