import React, { useState } from 'react';
import { Smartphone, MessageSquareCode, Layers, Send, Users, ChevronDown, ChevronUp, Check, ArrowRight } from 'lucide-react';
import { ModuleItem } from '../types';

interface CurriculumSectionProps {
  onOpenCheckout: () => void;
}

const MODULES: ModuleItem[] = [
  {
    id: "module-1",
    number: "MODULE 01",
    title: "Your Mobile Development Workspace",
    description: "Learn how to prepare your smartphone and access the tools needed to start building.",
    duration: "4 Core Lessons",
    iconName: "Smartphone",
    topics: [
      "Configuring your mobile browser (Chrome/Safari) for responsive web testing",
      "Essential mobile coding tools & lightweight cloud IDE environments",
      "Setting up mobile-friendly keyboard shortcuts and voice typing for prompts",
      "How to inspect and test mobile layouts directly on your touchscreen"
    ]
  },
  {
    id: "module-2",
    number: "MODULE 02",
    title: "Understanding AI Prompts and Vibe Coding",
    description: "Learn how to communicate your ideas to AI and guide it through building websites and applications.",
    duration: "5 Practical Lessons",
    iconName: "MessageSquareCode",
    topics: [
      "What is 'Vibe Coding' and why natural language is the new programming syntax",
      "The 3-layer mobile prompt framework (Context, Specification, Constraints)",
      "How to avoid AI confusion and instruct AI to fix bugs from your phone",
      "Iterating step-by-step: From rough concept to polished component",
      "Real-world prompt templates you can copy and paste on mobile"
    ]
  },
  {
    id: "module-3",
    number: "MODULE 03",
    title: "Building Real Websites and Web Applications",
    description: "Learn the process of turning ideas into functional digital products using AI-powered tools.",
    duration: "6 Project Lessons",
    iconName: "Layers",
    topics: [
      "Project 1: Creating a high-converting mobile business landing page",
      "Project 2: Building an interactive calculator / quote generator",
      "Project 3: Connecting a WhatsApp ordering and contact capture flow",
      "Structuring navigation, dark mode, and responsive cards on mobile",
      "Troubleshooting visual glitches and refining spacing like a designer"
    ]
  },
  {
    id: "module-4",
    number: "MODULE 04",
    title: "Publishing and Deployment",
    description: "Understand how to take your finished projects online so other people can access them.",
    duration: "4 Step-by-Step Lessons",
    iconName: "Send",
    topics: [
      "Publishing your site to a live, secure HTTPS web address from your phone",
      "Connecting custom domains or using free mobile-friendly subdomains",
      "Sharing your live link on social media, WhatsApp, and portfolios",
      "Updating and maintaining your live website whenever you have new ideas"
    ]
  }
];

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({ onOpenCheckout }) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "module-1": true,
    "module-2": true,
  });

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="curriculum" className="py-20 lg:py-28 bg-[#0D1220]/70 border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#3978FF] uppercase">
            Curriculum Breakdown
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
            Everything You Need to Start Building with AI.
          </h2>
          <p className="text-base sm:text-lg text-[#A1AEC2]">
            Carefully structured for complete beginners. No complex jargon, no laptop prerequisites — just actionable, hands-on modules designed for mobile creation.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="max-w-4xl mx-auto space-y-5 mb-12">
          {MODULES.map((mod) => {
            const isExpanded = expandedModules[mod.id];
            return (
              <div
                key={mod.id}
                className="bg-[#121A2B] border border-white/[0.08] hover:border-white/[0.14] rounded-2xl overflow-hidden transition-all shadow-lg"
              >
                {/* Module Header Button */}
                <button
                  type="button"
                  onClick={() => toggleModule(mod.id)}
                  className="w-full p-6 sm:p-7 flex items-start justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3978FF]"
                  aria-expanded={isExpanded}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-semibold text-[#5B9BFF] tracking-wider">
                        {mod.number}
                      </span>
                      <span className="text-white/20">·</span>
                      <span className="text-xs text-[#A1AEC2]">
                        {mod.duration}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
                      {mod.title}
                    </h3>
                    <p className="text-sm text-[#A1AEC2] leading-relaxed pt-1">
                      {mod.description}
                    </p>
                  </div>

                  <div className="p-2 rounded-lg bg-white/[0.04] text-[#A1AEC2] hover:text-white shrink-0 mt-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Topics */}
                {isExpanded && (
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-2 border-t border-white/[0.04]">
                    <div className="text-xs font-mono text-[#A1AEC2] uppercase tracking-wider mb-3">
                      What's Inside:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {mod.topics.map((topic, tIdx) => (
                        <div key={tIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F8FAFC]">
                          <Check className="w-4 h-4 text-[#20D69A] shrink-0 mt-0.5" />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* BONUS Card */}
          <div className="bg-gradient-to-r from-[#121A2B] via-[#162744] to-[#121A2B] border border-[#3978FF]/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#3978FF]/20 text-[#5B9BFF] border border-[#3978FF]/30 tracking-wide uppercase">
                  EXCLUSIVE BONUS
                </span>
                <span className="text-xs text-[#20D69A] font-medium">Included at No Extra Cost</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                BONUS — Private Telegram Learning Community
              </h3>
              <p className="text-sm text-[#A1AEC2] max-w-xl">
                Get access to the course community for learning support, prompt reviews, troubleshooting assistance, and continuous mobile workflow updates.
              </p>
            </div>

            <button
              onClick={onOpenCheckout}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-[#3978FF] hover:bg-[#2F65DC] rounded-xl whitespace-nowrap shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B9BFF]"
            >
              <span>Enroll for ₦7,000</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
