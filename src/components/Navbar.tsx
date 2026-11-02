import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenCheckout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCheckout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#080B14]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <a 
          href="#hero" 
          className="text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-[#5B9BFF] transition-colors"
        >
          MOBILE VIBE CODING
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A1AEC2]">
          <a href="#hero" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Home
          </a>
          <a href="#learn" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            What You'll Learn
          </a>
          <a href="#curriculum" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Curriculum
          </a>
          <a href="#pricing" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Pricing
          </a>
          <a href="#faq" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            FAQ
          </a>
        </nav>

        {/* Zone 3: Primary Action CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCheckout}
            className="hidden sm:inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#3978FF] hover:bg-[#2F65DC] active:bg-[#2552B8] rounded-xl transition-all shadow-lg shadow-[#3978FF]/20 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B9BFF]"
          >
            <span>Get the Course — ₦7,000</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#A1AEC2] hover:text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3978FF]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0D1220] px-4 pt-4 pb-6 space-y-3">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#A1AEC2] hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
          >
            Home
          </a>
          <a
            href="#learn"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#A1AEC2] hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
          >
            What You'll Learn
          </a>
          <a
            href="#curriculum"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#A1AEC2] hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
          >
            Curriculum
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#A1AEC2] hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#A1AEC2] hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
          >
            FAQ
          </a>
          <a
            href="#support"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#A1AEC2] hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
          >
            Payment Support
          </a>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCheckout();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-white bg-[#3978FF] hover:bg-[#2F65DC] rounded-xl shadow-md transition-colors"
            >
              <span>Get the Course — ₦7,000</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
