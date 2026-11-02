import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FaqItem } from '../types';

const FAQS: FaqItem[] = [
  {
    question: "Can I really build websites using only my phone?",
    answer: "Yes. The course teaches you how to use AI-powered tools and mobile-friendly workflows to start building websites and web applications from your smartphone."
  },
  {
    question: "Do I need previous programming experience?",
    answer: "No. The course is designed for beginners. You will learn the process step by step."
  },
  {
    question: "Do I need an Android phone or an iPhone?",
    answer: "Both Android and iPhone users can follow the course, provided their devices and browsers support the tools being used."
  },
  {
    question: "Do I need to own a laptop?",
    answer: "No laptop is required to begin following the mobile-focused lessons. Some advanced tasks may be easier on a computer."
  },
  {
    question: "Will I have to pay for AI tools?",
    answer: "Some tools offer free plans, while others may have usage limits or optional paid plans. Any additional costs should be checked before subscribing."
  },
  {
    question: "How do I receive the course link after payment?",
    answer: "After your payment is successfully verified, you will see the Telegram community access button."
  },
  {
    question: "What if I pay but don't receive the link?",
    answer: "Contact us through either WhatsApp support number and send your payment receipt or reference. We will verify your payment and assist you."
  },
  {
    question: "Is this a monthly subscription?",
    answer: "No. It is a one-time payment of ₦7,000 for the course."
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#0D1220]/60 border-t border-white/[0.06] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#3978FF] uppercase">
            Got Questions?
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-[#A1AEC2]">
            Straightforward answers about the course, equipment requirements, and payment verification.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#121A2B] border border-white/[0.08] hover:border-white/[0.14] rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3978FF]"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {faq.question}
                  </span>
                  <div className="p-1.5 rounded-lg bg-white/[0.04] text-[#A1AEC2] hover:text-white shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-sm sm:text-base text-[#A1AEC2] leading-relaxed border-t border-white/[0.04]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
